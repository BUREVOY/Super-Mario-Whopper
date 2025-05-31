import * as Phaser from "phaser";
import { PLAYER_CONFIG, ANIMATIONS, SOUNDS, SCENES } from "../constants";
import { Controls } from "../../types/game";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private controls!: Controls;
  private health: number;
  private isInvincible: boolean = false;
  private invincibilityTimer?: Phaser.Time.TimerEvent;
  private speedBoost: number = 1;
  private speedBoostTimer?: Phaser.Time.TimerEvent;

  // Мобильное управление
  private mobileControls = {
    left: false,
    right: false,
    jump: false,
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");

    // Добавляем спрайт в сцену и физику
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Настройка физики - устанавливаем правильный размер коллизии (увеличено в 2 раза)
    this.setBounce(0.1);
    this.setSize(48, 80); // Увеличено с 24x40 до 48x80
    this.setOffset(8, 16); // Увеличено смещение с 4x8 до 8x16

    // Инициализация параметров
    this.health = PLAYER_CONFIG.MAX_HEALTH;

    // Настройка управления
    this.setupControls();
    this.setupMobileControls();

    // Создание анимаций
    this.createAnimations();

    // Запуск анимации покоя
    this.play(ANIMATIONS.PLAYER.IDLE);
  }

  private setupControls(): void {
    const keyboard = this.scene.input.keyboard;
    this.controls = {
      left: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      up: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      space: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      pause: keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };

    // Добавляем поддержку WASD
    this.controls.leftAlt = keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.controls.rightAlt = keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.controls.upAlt = keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.controls.downAlt = keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  }

  private setupMobileControls(): void {
    // Слушаем события мобильного управления
    this.scene.events.on("mobileControl", (data: any) => {
      switch (data.action) {
        case "left":
          this.mobileControls.left = data.pressed;
          break;
        case "right":
          this.mobileControls.right = data.pressed;
          break;
        case "jump":
          this.mobileControls.jump = data.pressed;
          break;
        case "pause":
          if (data.pressed) {
            this.scene.scene.pause();
            this.scene.scene.launch(SCENES.PAUSE);
          }
          break;
      }
    });
  }

  private createAnimations(): void {
    const anims = this.scene.anims;

    // Анимация покоя
    if (!anims.exists(ANIMATIONS.PLAYER.IDLE)) {
      anims.create({
        key: ANIMATIONS.PLAYER.IDLE,
        frames: [{ key: "player", frame: 0 }],
        frameRate: 1,
        repeat: -1,
      });
    }

    // Анимация ходьбы - используем тот же спрайт что и для покоя
    if (!anims.exists(ANIMATIONS.PLAYER.WALK)) {
      anims.create({
        key: ANIMATIONS.PLAYER.WALK,
        frames: [{ key: "player", frame: 0 }],
        frameRate: 8,
        repeat: -1,
      });
    }

    // Анимация прыжка - используем тот же спрайт что и для покоя
    if (!anims.exists(ANIMATIONS.PLAYER.JUMP)) {
      anims.create({
        key: ANIMATIONS.PLAYER.JUMP,
        frames: [{ key: "player", frame: 0 }],
        frameRate: 1,
        repeat: 0,
      });
    }

    // Анимация получения урона - используем тот же спрайт что и для покоя
    if (!anims.exists(ANIMATIONS.PLAYER.DAMAGE)) {
      anims.create({
        key: ANIMATIONS.PLAYER.DAMAGE,
        frames: [{ key: "player", frame: 0 }],
        frameRate: 10,
        repeat: 2,
      });
    }
  }

  public update(): void {
    this.handleMovement();
    this.handleAnimations();
  }

  private handleMovement(): void {
    const speed = PLAYER_CONFIG.SPEED * this.speedBoost;

    // Проверяем как клавиатуру, так и мобильное управление
    const leftPressed =
      this.controls.left.isDown ||
      this.controls.leftAlt?.isDown ||
      this.mobileControls.left;

    const rightPressed =
      this.controls.right.isDown ||
      this.controls.rightAlt?.isDown ||
      this.mobileControls.right;

    const jumpPressed =
      this.controls.up.isDown ||
      this.controls.upAlt?.isDown ||
      this.controls.space.isDown ||
      this.mobileControls.jump;

    // Горизонтальное движение
    if (leftPressed) {
      this.setVelocityX(-speed);
      this.setFlipX(true);
    } else if (rightPressed) {
      this.setVelocityX(speed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // Прыжок
    if (jumpPressed && this.body!.touching.down) {
      this.jump();
    }
  }

  private handleAnimations(): void {
    const isMoving = Math.abs(this.body!.velocity.x) > 0;
    const isOnGround = this.body!.touching.down;

    if (!isOnGround) {
      // В воздухе - анимация прыжка
      if (this.anims.currentAnim?.key !== ANIMATIONS.PLAYER.JUMP) {
        this.play(ANIMATIONS.PLAYER.JUMP);
      }
    } else if (isMoving) {
      // На земле и движется - анимация ходьбы
      if (this.anims.currentAnim?.key !== ANIMATIONS.PLAYER.WALK) {
        this.play(ANIMATIONS.PLAYER.WALK);
      }
    } else {
      // На земле и не движется - анимация покоя
      if (this.anims.currentAnim?.key !== ANIMATIONS.PLAYER.IDLE) {
        this.play(ANIMATIONS.PLAYER.IDLE);
      }
    }
  }

  private jump(): void {
    this.setVelocityY(-PLAYER_CONFIG.JUMP_POWER);

    // Проверяем, существует ли звук перед воспроизведением
    if (this.scene.cache.audio.exists(SOUNDS.JUMP)) {
      this.scene.sound.play(SOUNDS.JUMP, { volume: 0.3 });
    }
  }

  public takeDamage(): void {
    if (this.isInvincible) return;

    this.health--;

    // Проверяем, существует ли звук перед воспроизведением
    if (this.scene.cache.audio.exists(SOUNDS.DAMAGE)) {
      this.scene.sound.play(SOUNDS.DAMAGE, { volume: 0.5 });
    }

    if (this.health <= 0) {
      this.die();
    } else {
      this.makeInvincible();
      this.play(ANIMATIONS.PLAYER.DAMAGE);
    }
  }

  private makeInvincible(): void {
    this.isInvincible = true;
    this.setAlpha(0.5);

    // Мигание эффект
    this.scene.tweens.add({
      targets: this,
      alpha: { from: 0.5, to: 1 },
      duration: 200,
      repeat: 10,
      yoyo: true,
      onComplete: () => {
        this.isInvincible = false;
        this.setAlpha(1);
      },
    });
  }

  public activatePowerUp(type: string): void {
    switch (type) {
      case "invincibility":
        this.activateInvincibility();
        break;
      case "health":
        this.health = Math.min(this.health + 1, PLAYER_CONFIG.MAX_HEALTH);
        break;
      case "speed":
        this.activateSpeedBoost();
        break;
      case "extra_life":
        this.health = Math.min(this.health + 1, PLAYER_CONFIG.MAX_HEALTH);
        break;
      case "speed_boost":
        this.activateSpeedBoost();
        break;
    }
  }

  private activateInvincibility(): void {
    this.isInvincible = true;
    this.setTint(0xffff00); // Желтый оттенок

    if (this.invincibilityTimer) {
      this.invincibilityTimer.destroy();
    }

    this.invincibilityTimer = this.scene.time.delayedCall(5000, () => {
      this.isInvincible = false;
      this.clearTint();
    });
  }

  private activateSpeedBoost(): void {
    this.speedBoost = 1.5;
    this.setTint(0x00ff00); // Зеленый оттенок

    if (this.speedBoostTimer) {
      this.speedBoostTimer.destroy();
    }

    this.speedBoostTimer = this.scene.time.delayedCall(3000, () => {
      this.speedBoost = 1;
      this.clearTint();
    });
  }

  private die(): void {
    this.setVelocity(0, 0);
    this.setTint(0xff0000); // Красный оттенок

    // Анимация смерти
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      y: this.y + 50,
      duration: 1000,
      onComplete: () => {
        this.scene.scene.start(SCENES.GAME_OVER);
      },
    });
  }

  // Геттеры
  public getHealth(): number {
    return this.health;
  }

  public getIsInvincible(): boolean {
    return this.isInvincible;
  }

  public reset(x: number, y: number): void {
    this.setPosition(x, y);
    this.setVelocity(0, 0);
    this.health = PLAYER_CONFIG.MAX_HEALTH;
    this.isInvincible = false;
    this.speedBoost = 1;
    this.setAlpha(1);
    this.clearTint();
    this.play(ANIMATIONS.PLAYER.IDLE);

    // Очистка таймеров
    if (this.invincibilityTimer) {
      this.invincibilityTimer.destroy();
      this.invincibilityTimer = undefined;
    }
    if (this.speedBoostTimer) {
      this.speedBoostTimer.destroy();
      this.speedBoostTimer = undefined;
    }
  }
}
