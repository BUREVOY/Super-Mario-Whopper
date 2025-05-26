import Phaser from "phaser";
import { Player } from "../Player";
import { Enemy } from "../Enemy";
import { PowerUp } from "../PowerUp";
import { GAME_CONFIG, SCENES, COLORS, SOUNDS } from "../../constants";
import { GameState, LevelConfig } from "../../../types/game";

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.Physics.Arcade.Group;
  private powerUps!: Phaser.Physics.Arcade.Group;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;

  // UI элементы
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;

  // Состояние игры
  private gameState: GameState = {
    score: 0,
    lives: 3,
    level: 1,
    time: 300, // 5 минут
    isPaused: false,
  };

  private gameTimer!: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: SCENES.GAME });
  }

  create(): void {
    // Отладочная информация о текстурах
    console.log("🎮 GameScene: Проверка текстур:");
    const requiredTextures = [
      "player",
      "burger",
      "fries",
      "soda",
      "crown",
      "whopper",
      "onion_rings",
      "ground",
      "platform",
      "bk_restaurant",
    ];
    requiredTextures.forEach((key) => {
      if (this.textures.exists(key)) {
        console.log(`✅ ${key} доступен`);
      } else {
        console.log(`❌ ${key} НЕ доступен`);
      }
    });

    // Настройка границ физического мира
    this.physics.world.setBounds(0, 0, 3200, GAME_CONFIG.HEIGHT);

    this.createBackground();
    this.createPlatforms();
    this.createPlayer();
    this.createEnemies();
    this.createPowerUps();
    this.createFinishLine();
    this.createUI();
    this.setupPhysics();
    this.setupCamera();
    this.setupGameTimer();
    this.setupInputs();
  }

  private createBackground(): void {
    // Фон из картинки ресторана с повторением по горизонтали

    // Проверяем, есть ли картинка ресторана
    if (this.textures.exists("bk_restaurant")) {
      // Получаем размеры картинки
      const bgTexture = this.textures.get("bk_restaurant");
      const bgWidth = bgTexture?.source?.[0]?.width || 1024;
      const bgHeight = bgTexture?.source?.[0]?.height || 768;

      // Вычисляем масштаб для покрытия всей высоты экрана
      const scale = GAME_CONFIG.HEIGHT / bgHeight;
      const scaledWidth = bgWidth * scale;

      // Создаем повторяющиеся изображения ресторана
      const numCopies = Math.ceil(3200 / scaledWidth) + 1;

      for (let i = 0; i < numCopies; i++) {
        const bg = this.add.image(i * scaledWidth, 0, "bk_restaurant");
        bg.setOrigin(0, 0);
        bg.setScale(scale);
        bg.setScrollFactor(0.3); // Легкий параллакс эффект

        // Включаем сглаживание для лучшего качества
        if (bg.texture && bg.texture.source[0]) {
          const source = bg.texture.source[0] as any;
          if (source.image) {
            source.image.style.imageRendering = "auto";
          }
        }
      }
    } else {
      // Fallback - простой коричневый фон если картинки нет
      const bg = this.add.rectangle(0, 0, 4000, 1000, 0x8b4513);
      bg.setOrigin(0, 0);
      bg.setScrollFactor(0);
    }
  }

  private createPlatforms(): void {
    this.platforms = this.physics.add.staticGroup();

    // Получаем размеры текстуры земли с fallback
    const groundTexture = this.textures.get("ground");
    const groundWidth = groundTexture?.source?.[0]?.width || 64;
    const groundHeight = groundTexture?.source?.[0]?.height || 32;

    // Основная земля - создаем непрерывную линию
    for (let x = 0; x < 3200; x += groundWidth) {
      const ground = this.platforms.create(
        x + groundWidth / 2, // Центрируем по X
        GAME_CONFIG.HEIGHT - groundHeight / 2, // Центрируем по Y
        "ground"
      );
      ground.setScale(1).refreshBody();
    }

    // Платформы уровня
    this.createLevelPlatforms();
  }

  private createLevelPlatforms(): void {
    // Получаем размеры текстуры платформы с fallback
    const platformTexture = this.textures.get("platform");
    const platformWidth = platformTexture?.source?.[0]?.width || 64;
    const platformHeight = platformTexture?.source?.[0]?.height || 32;

    // Платформы в стиле ресторана BK
    const platformData = [
      { x: 200, y: 600, width: 128, height: 32 },
      { x: 400, y: 500, width: 96, height: 32 },
      { x: 650, y: 400, width: 128, height: 32 },
      { x: 900, y: 350, width: 96, height: 32 },
      { x: 1200, y: 450, width: 160, height: 32 },
      { x: 1500, y: 300, width: 128, height: 32 },
      { x: 1800, y: 400, width: 96, height: 32 },
      { x: 2100, y: 250, width: 128, height: 32 },
      { x: 2400, y: 350, width: 160, height: 32 },
      { x: 2700, y: 200, width: 128, height: 32 },
    ];

    platformData.forEach((data) => {
      // Создаем платформу с правильным позиционированием
      const platform = this.platforms.create(data.x, data.y, "platform");

      // Масштабируем платформу под нужный размер
      const scaleX = data.width / platformWidth;
      const scaleY = data.height / platformHeight;
      platform.setScale(scaleX, scaleY).refreshBody();

      // Убираем тинт, так как теперь используем реальные текстуры
      // platform.setTint(COLORS.BK_BROWN);
    });
  }

  private createPlayer(): void {
    // Получаем высоту текстуры земли для правильного позиционирования с fallback
    const groundTexture = this.textures.get("ground");
    const groundHeight = groundTexture?.source?.[0]?.height || 32;

    // Спавним игрока на земле
    const spawnY = GAME_CONFIG.HEIGHT - groundHeight - 50; // 50px над землей

    this.player = new Player(this, 100, spawnY);

    // Настройка камеры для следования за игроком
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 3200, GAME_CONFIG.HEIGHT);
  }

  private createEnemies(): void {
    this.enemies = this.physics.add.group();

    // Получаем высоту текстуры земли с fallback
    const groundTexture = this.textures.get("ground");
    const groundHeight = groundTexture?.source?.[0]?.height || 32;
    const groundY = GAME_CONFIG.HEIGHT - groundHeight - 60; // 30px над землей

    // Конфигурация врагов на земле
    const enemyConfigs = [
      { x: 300, y: groundY, type: "burger" as const, speed: 50, health: 1 },
      { x: 800, y: groundY, type: "fries" as const, speed: 80, health: 1 },
      { x: 1300, y: groundY, type: "soda" as const, speed: 30, health: 2 },
      { x: 1700, y: groundY, type: "burger" as const, speed: 50, health: 1 },
      { x: 2200, y: groundY, type: "fries" as const, speed: 80, health: 1 },
      { x: 2800, y: groundY, type: "soda" as const, speed: 30, health: 2 },
    ];

    enemyConfigs.forEach((config) => {
      const enemy = new Enemy(this, config);
      this.enemies.add(enemy);
    });
  }

  private createPowerUps(): void {
    this.powerUps = this.physics.add.group();

    // Получаем высоту текстуры земли с fallback
    const groundTexture = this.textures.get("ground");
    const groundHeight = groundTexture?.source?.[0]?.height || 32;
    const groundY = GAME_CONFIG.HEIGHT - groundHeight - 50; // 50px над землей

    // Бонусы в стиле Burger King
    const powerUpData = [
      { x: 250, y: groundY, type: "crown" as const, points: 500 },
      { x: 450, y: 450, type: "onion_rings" as const, points: 300 }, // На платформе
      { x: 700, y: 350, type: "whopper" as const, points: 1000 }, // На платформе
      { x: 950, y: 300, type: "crown" as const, points: 500 }, // На платформе
      { x: 1250, y: 400, type: "onion_rings" as const, points: 300 }, // На платформе
      { x: 1550, y: 250, type: "whopper" as const, points: 1000 }, // На платформе
      { x: 1850, y: 350, type: "crown" as const, points: 500 }, // На платформе
      { x: 2150, y: 200, type: "onion_rings" as const, points: 300 }, // На платформе
      { x: 2450, y: 300, type: "whopper" as const, points: 1000 }, // На платформе
      { x: 2750, y: 150, type: "crown" as const, points: 500 }, // На платформе
    ];

    powerUpData.forEach((data) => {
      const powerUp = new PowerUp(this, data);
      this.powerUps.add(powerUp);
    });
  }

  private createFinishLine(): void {
    // Создаем линию финиша в конце уровня
    const finishX = 3000;

    // Основная линия финиша
    const finishLine = this.add.rectangle(
      finishX,
      0,
      10,
      GAME_CONFIG.HEIGHT,
      0xffffff
    );
    finishLine.setOrigin(0, 0);
    finishLine.setAlpha(0.8);

    // Флаг финиша
    const flag = this.add.rectangle(
      finishX - 30,
      50,
      40,
      30,
      parseInt(COLORS.BK_YELLOW.replace("#", ""), 16)
    );
    flag.setOrigin(0, 0);

    // Текст финиша
    const finishText = this.add.text(finishX - 50, 100, "ФИНИШ", {
      fontSize: "20px",
      color: COLORS.WHITE,
      fontFamily: "Arial Black",
      stroke: COLORS.BLACK,
      strokeThickness: 2,
    });
    finishText.setOrigin(0, 0);
  }

  private createUI(): void {
    // Создание UI элементов
    const uiStyle = {
      fontSize: "24px",
      color: COLORS.WHITE,
      fontFamily: "Arial Black",
      stroke: COLORS.BLACK,
      strokeThickness: 2,
    };

    this.scoreText = this.add.text(
      20,
      20,
      `Очки: ${this.gameState.score}`,
      uiStyle
    );
    this.scoreText.setScrollFactor(0);

    this.livesText = this.add.text(
      20,
      60,
      `Жизни: ${this.gameState.lives}`,
      uiStyle
    );
    this.livesText.setScrollFactor(0);

    this.timeText = this.add.text(
      20,
      100,
      `Время: ${this.gameState.time}`,
      uiStyle
    );
    this.timeText.setScrollFactor(0);

    this.levelText = this.add.text(
      GAME_CONFIG.WIDTH - 200,
      20,
      `Уровень: ${this.gameState.level}`,
      uiStyle
    );
    this.levelText.setScrollFactor(0);

    // Создание индикатора здоровья
    this.createHealthBar();
  }

  private createHealthBar(): void {
    const healthBarBg = this.add.rectangle(
      GAME_CONFIG.WIDTH - 150,
      60,
      120,
      20,
      0x000000
    );
    healthBarBg.setScrollFactor(0);
    healthBarBg.setStrokeStyle(2, 0xffffff);

    // Здоровье будет обновляться в update()
  }

  private setupPhysics(): void {
    // Настройка коллизий
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.powerUps, this.platforms);

    // Столкновения игрока с врагами
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerEnemyCollision,
      undefined,
      this
    );

    // Сбор бонусов
    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.handlePowerUpCollection,
      undefined,
      this
    );
  }

  private setupCamera(): void {
    // Настройка камеры
    this.cameras.main.setBounds(0, 0, 3200, GAME_CONFIG.HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(200, 100);
  }

  private setupGameTimer(): void {
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateGameTime,
      callbackScope: this,
      loop: true,
    });
  }

  private setupInputs(): void {
    // Настройка дополнительных клавиш
    const pauseKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.P
    );
    pauseKey.on("down", this.togglePause, this);

    const restartKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.R
    );
    restartKey.on("down", this.restartLevel, this);
  }

  private handlePlayerEnemyCollision(player: any, enemy: any): void {
    const playerSprite = player as Player;
    const enemySprite = enemy as Enemy;

    // Проверка, прыгает ли игрок на врага сверху
    if (
      playerSprite.body &&
      playerSprite.body.velocity.y > 0 && // Игрок падает вниз
      playerSprite.y < enemySprite.y - 5 && // Игрок выше врага (уменьшено с 10 до 5)
      Math.abs(playerSprite.x - enemySprite.x) < 40 // Игрок достаточно близко по горизонтали
    ) {
      // Игрок побеждает врага
      this.addScore(enemySprite.getPoints());
      enemySprite.die();
      playerSprite.setVelocityY(-300); // Отскок после убийства врага
    } else if (!playerSprite.getIsInvincible()) {
      // Игрок получает урон
      playerSprite.takeDamage();
      this.updateLives();
    }
  }

  private handlePowerUpCollection(player: any, powerUp: any): void {
    const powerUpSprite = powerUp as PowerUp;

    if (powerUpSprite.isAlreadyCollected()) return;

    // Добавление очков
    this.addScore(powerUpSprite.getPoints());

    // Активация эффекта - передаем тип эффекта как строку
    const effect = powerUpSprite.getEffect();
    (player as Player).activatePowerUp(effect.type);

    // Сбор бонуса
    powerUpSprite.collect();
  }

  private addScore(points: number): void {
    this.gameState.score += points;
    this.scoreText.setText(`Очки: ${this.gameState.score}`);
  }

  private updateLives(): void {
    this.gameState.lives = this.player.getHealth();
    this.livesText.setText(`Жизни: ${this.gameState.lives}`);

    if (this.gameState.lives <= 0) {
      this.gameOver();
    }
  }

  private updateGameTime(): void {
    if (this.gameState.isPaused) return;

    this.gameState.time--;
    this.timeText.setText(`Время: ${this.gameState.time}`);

    if (this.gameState.time <= 0) {
      this.gameOver();
    }
  }

  private togglePause(): void {
    this.gameState.isPaused = !this.gameState.isPaused;

    if (this.gameState.isPaused) {
      this.physics.pause();
      this.scene.pause();
      this.scene.launch(SCENES.PAUSE);
    } else {
      this.physics.resume();
      this.scene.resume();
      this.scene.stop(SCENES.PAUSE);
    }
  }

  private restartLevel(): void {
    this.scene.restart();
  }

  private gameOver(): void {
    this.physics.pause();

    // Проверяем, существует ли звук перед воспроизведением
    if (this.cache.audio.exists(SOUNDS.DAMAGE)) {
      this.sound.play(SOUNDS.DAMAGE, { volume: 0.8 });
    }

    // Переход к экрану Game Over
    this.time.delayedCall(1000, () => {
      this.scene.start(SCENES.GAME_OVER, {
        score: this.gameState.score,
        level: this.gameState.level,
      });
    });
  }

  private checkLevelComplete(): void {
    // Проверка завершения уровня (игрок достиг конца)
    if (this.player.x >= 3000) {
      this.levelComplete();
    }
  }

  private levelComplete(): void {
    this.physics.pause();

    // Проверяем, существует ли звук перед воспроизведением
    if (this.cache.audio.exists(SOUNDS.VICTORY)) {
      this.sound.play(SOUNDS.VICTORY, { volume: 0.8 });
    }

    // Бонус за оставшееся время
    const timeBonus = this.gameState.time * 10;
    this.addScore(timeBonus);

    // Переход к следующему уровню или экрану победы
    this.time.delayedCall(2000, () => {
      this.scene.start(SCENES.VICTORY, {
        score: this.gameState.score,
        level: this.gameState.level,
        timeBonus: timeBonus,
      });
    });
  }

  update(): void {
    if (this.gameState.isPaused) return;

    // Обновление игрока
    this.player.update();

    // Проверка падения игрока ниже уровня
    if (this.player.y > GAME_CONFIG.HEIGHT + 100) {
      this.player.takeDamage();
      this.player.setPosition(100, 600); // Возвращаем игрока на начальную позицию
    }

    // Обновление врагов
    this.enemies.children.entries.forEach((enemy) => {
      (enemy as Enemy).update();
    });

    // Проверка завершения уровня
    this.checkLevelComplete();

    // Обновление индикатора здоровья
    this.updateHealthBar();
  }

  private updateHealthBar(): void {
    // Удаление старого индикатора здоровья
    const oldHealthBar = this.children.getByName("healthBar");
    if (oldHealthBar) {
      oldHealthBar.destroy();
    }

    // Создание нового индикатора
    const health = this.player.getHealth();
    const maxHealth = 3;
    const healthWidth = (health / maxHealth) * 116;

    const healthBar = this.add.rectangle(
      GAME_CONFIG.WIDTH - 148,
      60,
      healthWidth,
      16,
      health > 1 ? 0x00ff00 : 0xff0000
    );
    healthBar.setScrollFactor(0);
    healthBar.setName("healthBar");
  }
}
