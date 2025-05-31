import * as Phaser from "phaser";
import { ENEMY_TYPES, ANIMATIONS, SOUNDS } from "../constants";
import { EnemyConfig } from "@/types/game";
import { COLORS } from "@/lib/constants";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private enemyType: "burger" | "fries" | "soda";
  private health: number;
  private speed: number;
  private points: number;
  private direction: number = 1; // 1 для движения вправо, -1 для движения влево
  private patrolDistance: number = 100;
  private startX: number;

  constructor(scene: Phaser.Scene, config: EnemyConfig) {
    super(scene, config.x, config.y, config.type);

    this.enemyType = config.type;
    this.startX = config.x;

    // Настройка параметров в зависимости от типа
    const typeConfig =
      ENEMY_TYPES[config.type.toUpperCase() as keyof typeof ENEMY_TYPES];
    this.health = typeConfig.health;
    this.speed = typeConfig.speed;
    this.points = typeConfig.points;

    // Добавляем спрайт в сцену и физику
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Настройка физики с правильными размерами коллизий
    this.setCollideWorldBounds(true);
    this.setBounce(0.1);

    // Устанавливаем размеры коллизий в зависимости от типа врага (увеличено в 2 раза)
    switch (this.enemyType) {
      case "burger":
        this.setSize(64, 64); // Увеличено с 32x32 до 64x64
        this.setOffset(8, 8); // Увеличено смещение
        break;
      case "fries":
        this.setSize(48, 80); // Увеличено с 24x40 до 48x80
        this.setOffset(8, 8); // Увеличено смещение
        break;
      case "soda":
        this.setSize(56, 88); // Увеличено с 28x44 до 56x88
        this.setOffset(8, 8); // Увеличено смещение
        break;
      default:
        this.setSize(64, 64); // Увеличено с 32x32 до 64x64
        this.setOffset(8, 8); // Увеличено смещение
    }

    this.setGravityY(300);

    // Создание анимаций
    this.createAnimations();

    // Запуск анимации ходьбы
    this.playWalkAnimation();
  }

  private createAnimations(): void {
    const anims = this.scene.anims;
    const animKey = this.getWalkAnimationKey();

    if (!anims.exists(animKey)) {
      // Создаем простую анимацию из одного кадра
      anims.create({
        key: animKey,
        frames: [{ key: this.enemyType, frame: 0 }],
        frameRate: 8,
        repeat: -1,
      });
    }
  }

  private getWalkAnimationKey(): string {
    switch (this.enemyType) {
      case "burger":
        return ANIMATIONS.ENEMIES.BURGER_WALK;
      case "fries":
        return ANIMATIONS.ENEMIES.FRIES_WALK;
      case "soda":
        return ANIMATIONS.ENEMIES.SODA_WALK;
      default:
        return ANIMATIONS.ENEMIES.BURGER_WALK;
    }
  }

  private playWalkAnimation(): void {
    this.play(this.getWalkAnimationKey());
  }

  public update(): void {
    this.patrol();
    this.updateDirection();
  }

  private patrol(): void {
    // Простое патрулирование
    this.setVelocityX(this.speed * this.direction);

    // Проверка границ патрулирования
    if (this.x > this.startX + this.patrolDistance) {
      this.direction = -1;
    } else if (this.x < this.startX - this.patrolDistance) {
      this.direction = 1;
    }
  }

  private updateDirection(): void {
    // Поворот спрайта в зависимости от направления движения
    this.setFlipX(this.direction < 0);
  }

  public takeDamage(): void {
    this.health--;

    if (this.health <= 0) {
      this.die();
    } else {
      // Эффект получения урона
      this.setTint(0xff0000);
      this.scene.time.delayedCall(200, () => {
        this.clearTint();
      });
    }
  }

  public die(): void {
    // Звук поражения врага
    if (this.scene.cache.audio.exists(SOUNDS.ENEMY_DEFEAT)) {
      this.scene.sound.play(SOUNDS.ENEMY_DEFEAT, { volume: 0.4 });
    }

    // Эффект исчезновения
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 300,
      onComplete: () => {
        this.destroy();
      },
    });

    // Создание эффекта очков
    this.createScoreEffect();
  }

  private createScoreEffect(): void {
    const scoreText = this.scene.add.text(
      this.x,
      this.y - 20,
      `+${this.points}`,
      {
        fontSize: "16px",
        color: "#FFD700",
        fontStyle: "bold",
      }
    );

    this.scene.tweens.add({
      targets: scoreText,
      y: scoreText.y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        scoreText.destroy();
      },
    });
  }

  public getPoints(): number {
    return this.points;
  }

  public getEnemyType(): string {
    return this.enemyType;
  }

  // Метод для столкновения с игроком
  public onPlayerCollision(): void {
    // Враг может быть побежден прыжком сверху
    // Логика обрабатывается в основной игровой сцене
  }

  // Метод для изменения поведения врага
  public setPatrolDistance(distance: number): void {
    this.patrolDistance = distance;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  // Специальные способности для разных типов врагов
  public activateSpecialAbility(): void {
    switch (this.enemyType) {
      case "burger":
        this.burgerSpecial();
        break;
      case "fries":
        this.friesSpecial();
        break;
      case "soda":
        this.sodaSpecial();
        break;
    }
  }

  private burgerSpecial(): void {
    // Бургер может временно увеличить скорость
    const originalSpeed = this.speed;
    this.speed *= 1.5;
    this.setTint(0xff8800);

    this.scene.time.delayedCall(2000, () => {
      this.speed = originalSpeed;
      this.clearTint();
    });
  }

  private friesSpecial(): void {
    // Картошка может прыгать
    if (this.body!.touching.down) {
      this.setVelocityY(-200);
    }
  }

  private sodaSpecial(): void {
    // Газировка может создавать пузыри (препятствия)
    this.createBubble();
  }

  private createBubble(): void {
    const bubble = this.scene.add.circle(
      this.x,
      this.y - 30,
      10,
      0x87ceeb,
      0.7
    );

    this.scene.tweens.add({
      targets: bubble,
      y: bubble.y - 100,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 2000,
      onComplete: () => {
        bubble.destroy();
      },
    });
  }
}
