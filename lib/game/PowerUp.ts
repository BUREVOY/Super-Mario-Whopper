import * as Phaser from "phaser";
import { COLORS } from "../constants";

export interface PowerUpData {
  x: number;
  y: number;
  type: "crown" | "onion_rings" | "whopper";
  points: number;
}

export interface PowerUpEffect {
  type: "speed" | "invincibility" | "jump" | "health";
  duration: number;
  value?: number;
}

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  private powerUpType: PowerUpData["type"];
  private points: number;
  private collected: boolean = false;
  private effect: PowerUpEffect;

  constructor(scene: Phaser.Scene, data: PowerUpData) {
    // Выбираем правильную текстуру с fallback для production
    const textureKey = PowerUp.getTextureKey(scene, data.type);
    super(scene, data.x, data.y, textureKey);

    this.powerUpType = data.type;
    this.points = data.points;
    this.effect = this.getEffectByType(data.type);

    // Добавление в сцену
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Настройка физики с правильными размерами
    this.setCollideWorldBounds(true);
    this.setBounce(0.3);

    // Устанавливаем размеры коллизий в зависимости от типа бонуса (увеличено в 2 раза)
    switch (this.powerUpType) {
      case "crown":
        this.setSize(56, 56); // Увеличено с 28x28 до 56x56
        this.setOffset(4, 4); // Увеличено смещение
        break;
      case "whopper":
        this.setSize(72, 72); // Увеличено с 36x36 до 72x72
        this.setOffset(4, 4); // Увеличено смещение
        break;
      case "onion_rings":
        this.setSize(64, 64); // Увеличено с 32x32 до 64x64
        this.setOffset(4, 4); // Увеличено смещение
        break;
      default:
        this.setSize(64, 64); // Увеличено с 32x32 до 64x64
        this.setOffset(4, 4); // Увеличено смещение
    }

    this.setScale(0.8);

    // Анимация мерцания
    this.createFloatingAnimation();
    this.setTint(this.getColorByType(data.type));
  }

  // Статический метод для получения правильного ключа текстуры
  private static getTextureKey(
    scene: Phaser.Scene,
    type: PowerUpData["type"]
  ): string {
    const primaryKey = type;
    const fallbackKey = `${type}_placeholder`;

    // Проверяем существование основной текстуры
    if (scene.textures.exists(primaryKey)) {
      console.log(`✅ PowerUp: Используем основную текстуру ${primaryKey}`);
      return primaryKey;
    }

    // Проверяем fallback текстуру
    if (scene.textures.exists(fallbackKey)) {
      console.log(`⚠️ PowerUp: Используем fallback текстуру ${fallbackKey}`);
      return fallbackKey;
    }

    // Создаем экстренную текстуру если ничего нет
    console.warn(`❌ PowerUp: Создаем экстренную текстуру для ${type}`);
    PowerUp.createEmergencyTexture(scene, type);
    return `${type}_emergency`;
  }

  // Создание экстренной текстуры если основная и fallback не найдены
  private static createEmergencyTexture(
    scene: Phaser.Scene,
    type: PowerUpData["type"]
  ): void {
    const graphics = scene.add.graphics();

    let color: number;
    let size: number;

    switch (type) {
      case "crown":
        color = 0xffd700; // Золотой
        size = 64;
        break;
      case "whopper":
        color = parseInt(COLORS.BK_RED.replace("#", ""), 16);
        size = 80;
        break;
      case "onion_rings":
        color = parseInt(COLORS.BK_YELLOW.replace("#", ""), 16);
        size = 72;
        break;
      default:
        color = parseInt(COLORS.WHITE.replace("#", ""), 16);
        size = 64;
    }

    graphics.fillStyle(color);
    graphics.fillRect(0, 0, size, size);
    graphics.generateTexture(`${type}_emergency`, size, size);
    graphics.destroy();
  }

  private getEffectByType(type: PowerUpData["type"]): PowerUpEffect {
    switch (type) {
      case "crown":
        return { type: "invincibility", duration: 3000 };
      case "onion_rings":
        return { type: "speed", duration: 5000, value: 1.5 };
      case "whopper":
        return { type: "health", duration: 0, value: 1 };
      default:
        return { type: "speed", duration: 2000, value: 1.2 };
    }
  }

  private getColorByType(type: PowerUpData["type"]): number {
    switch (type) {
      case "crown":
        return parseInt(COLORS.BK_YELLOW.replace("#", ""), 16);
      case "onion_rings":
        return parseInt(COLORS.BK_BROWN.replace("#", ""), 16);
      case "whopper":
        return parseInt(COLORS.BK_RED.replace("#", ""), 16);
      default:
        return parseInt(COLORS.WHITE.replace("#", ""), 16);
    }
  }

  private createFloatingAnimation(): void {
    // Плавающая анимация
    this.scene.tweens.add({
      targets: this,
      y: this.y - 10,
      duration: 1500,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // Мерцание
    this.scene.tweens.add({
      targets: this,
      alpha: 0.7,
      duration: 800,
      ease: "Power2",
      yoyo: true,
      repeat: -1,
    });
  }

  public collect(): void {
    if (this.collected) return;

    this.collected = true;
    console.log(
      `🍔 PowerUp: Собран бонус ${this.powerUpType}, очки: +${this.points}`
    );

    // Эффект сбора
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 300,
      ease: "Power2",
      onComplete: () => {
        this.destroy();
      },
    });

    // Показать очки
    this.showPointsText();
  }

  private showPointsText(): void {
    const pointsText = this.scene.add.text(
      this.x,
      this.y - 30,
      `+${this.points}`,
      {
        fontSize: "20px",
        color: COLORS.BK_YELLOW,
        fontFamily: "Arial Black",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
      }
    );

    this.scene.tweens.add({
      targets: pointsText,
      y: pointsText.y - 50,
      alpha: 0,
      duration: 1000,
      ease: "Power2",
      onComplete: () => {
        pointsText.destroy();
      },
    });
  }

  public getPoints(): number {
    return this.points;
  }

  public getEffect(): PowerUpEffect {
    return this.effect;
  }

  public isAlreadyCollected(): boolean {
    return this.collected;
  }

  public getType(): PowerUpData["type"] {
    return this.powerUpType;
  }
}
