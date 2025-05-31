import * as Phaser from "phaser";
import { SCENES, COLORS } from "../../constants";

export class MobileControlsScene extends Phaser.Scene {
  private leftButton!: Phaser.GameObjects.Graphics;
  private rightButton!: Phaser.GameObjects.Graphics;
  private jumpButton!: Phaser.GameObjects.Graphics;
  private pauseButton!: Phaser.GameObjects.Graphics;
  private joystickBase!: Phaser.GameObjects.Graphics;
  private joystickThumb!: Phaser.GameObjects.Graphics;

  private isJoystickActive = false;
  private joystickStartX = 0;
  private joystickStartY = 0;

  constructor() {
    super({ key: SCENES.MOBILE_CONTROLS });
  }

  create(): void {
    // Показываем мобильное управление только на мобильных устройствах
    if (!this.isMobileDevice()) {
      return;
    }

    console.log("🎮 MobileControlsScene: Создание мобильного управления...");

    this.createJoystick();
    this.createJumpButton();
    this.createPauseButton();

    // Настройка входных данных
    this.setupInputHandlers();

    console.log("✅ MobileControlsScene: Мобильное управление создано");
  }

  private isMobileDevice(): boolean {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || "ontouchstart" in window
    );
  }

  private createJoystick(): void {
    const { width, height } = this.cameras.main;

    // Адаптивные размеры в зависимости от ориентации
    const isPortrait = height > width;
    const baseSize = isPortrait ? 120 : 100; // Больше в портретной ориентации
    const margin = isPortrait ? 30 : 20;

    // Позиционирование джойстика
    const joystickX = margin + baseSize / 2;
    const joystickY = height - margin - baseSize / 2;

    // База джойстика
    this.joystickBase = this.add.graphics();
    this.joystickBase.fillStyle(
      parseInt(COLORS.BK_BROWN.replace("#", ""), 16),
      0.6
    );
    this.joystickBase.fillCircle(0, 0, baseSize / 2);
    this.joystickBase.lineStyle(
      4,
      parseInt(COLORS.WHITE.replace("#", ""), 16),
      0.8
    );
    this.joystickBase.strokeCircle(0, 0, baseSize / 2);
    this.joystickBase.setPosition(joystickX, joystickY);
    this.joystickBase.setScrollFactor(0);

    // Ручка джойстика
    const thumbSize = baseSize * 0.4;
    this.joystickThumb = this.add.graphics();
    this.joystickThumb.fillStyle(
      parseInt(COLORS.BK_RED.replace("#", ""), 16),
      0.9
    );
    this.joystickThumb.fillCircle(0, 0, thumbSize / 2);
    this.joystickThumb.lineStyle(
      3,
      parseInt(COLORS.WHITE.replace("#", ""), 16),
      1
    );
    this.joystickThumb.strokeCircle(0, 0, thumbSize / 2);
    this.joystickThumb.setPosition(joystickX, joystickY);
    this.joystickThumb.setScrollFactor(0);

    // Делаем интерактивными
    this.joystickBase.setInteractive(
      new Phaser.Geom.Circle(0, 0, baseSize / 2),
      Phaser.Geom.Circle.Contains
    );
  }

  private createJumpButton(): void {
    const { width, height } = this.cameras.main;

    // Адаптивные размеры и позиционирование
    const isPortrait = height > width;
    const buttonSize = isPortrait ? 100 : 80; // Больше в портретной ориентации
    const margin = isPortrait ? 30 : 20;

    // Позиционирование кнопки прыжка
    const buttonX = width - buttonSize / 2 - margin;
    const buttonY = height - buttonSize / 2 - margin;

    this.jumpButton = this.add.graphics();
    this.jumpButton.fillStyle(
      parseInt(COLORS.BK_RED.replace("#", ""), 16),
      0.8
    );
    this.jumpButton.fillCircle(0, 0, buttonSize / 2);
    this.jumpButton.lineStyle(
      4,
      parseInt(COLORS.WHITE.replace("#", ""), 16),
      1
    );
    this.jumpButton.strokeCircle(0, 0, buttonSize / 2);
    this.jumpButton.setPosition(buttonX, buttonY);
    this.jumpButton.setScrollFactor(0);

    // Стрелка вверх
    const arrowSize = buttonSize * 0.3;
    const arrow = this.add.graphics();
    arrow.lineStyle(6, parseInt(COLORS.WHITE.replace("#", ""), 16), 1);
    arrow.beginPath();
    arrow.moveTo(-arrowSize / 2, arrowSize / 4);
    arrow.lineTo(0, -arrowSize / 2);
    arrow.lineTo(arrowSize / 2, arrowSize / 4);
    arrow.strokePath();
    arrow.setPosition(buttonX, buttonY);
    arrow.setScrollFactor(0);

    this.jumpButton.setInteractive(
      new Phaser.Geom.Circle(0, 0, buttonSize / 2),
      Phaser.Geom.Circle.Contains
    );
  }

  private createPauseButton(): void {
    const { width } = this.cameras.main;

    // Адаптивные размеры
    const isPortrait = this.cameras.main.height > width;
    const buttonSize = isPortrait ? 60 : 50;
    const margin = isPortrait ? 30 : 20;

    // Позиционирование кнопки паузы
    const buttonX = width - margin - buttonSize / 2;
    const buttonY = margin + buttonSize / 2;

    this.pauseButton = this.add.graphics();
    this.pauseButton.fillStyle(
      parseInt(COLORS.BK_BROWN.replace("#", ""), 16),
      0.8
    );
    this.pauseButton.fillRoundedRect(
      -buttonSize / 2,
      -buttonSize / 2,
      buttonSize,
      buttonSize,
      10
    );
    this.pauseButton.lineStyle(
      3,
      parseInt(COLORS.WHITE.replace("#", ""), 16),
      1
    );
    this.pauseButton.strokeRoundedRect(
      -buttonSize / 2,
      -buttonSize / 2,
      buttonSize,
      buttonSize,
      10
    );

    // Символ паузы (две вертикальные линии)
    const lineWidth = buttonSize * 0.1;
    const lineHeight = buttonSize * 0.4;
    const spacing = buttonSize * 0.15;

    this.pauseButton.fillStyle(parseInt(COLORS.WHITE.replace("#", ""), 16), 1);
    this.pauseButton.fillRect(
      -spacing - lineWidth / 2,
      -lineHeight / 2,
      lineWidth,
      lineHeight
    );
    this.pauseButton.fillRect(
      spacing - lineWidth / 2,
      -lineHeight / 2,
      lineWidth,
      lineHeight
    );

    this.pauseButton.setPosition(buttonX, buttonY);
    this.pauseButton.setScrollFactor(0);

    this.pauseButton.setInteractive(
      new Phaser.Geom.Rectangle(
        -buttonSize / 2,
        -buttonSize / 2,
        buttonSize,
        buttonSize
      ),
      Phaser.Geom.Rectangle.Contains
    );
  }

  private setupInputHandlers(): void {
    // Обработчики джойстика
    this.joystickBase.on("pointerdown", this.onJoystickDown, this);
    this.input.on("pointermove", this.onJoystickMove, this);
    this.input.on("pointerup", this.onJoystickUp, this);

    // Обработчики кнопки прыжка
    this.jumpButton.on("pointerdown", () => {
      this.jumpButton.setAlpha(0.6);
      this.sendMobileControl("jump", true);
    });
    this.jumpButton.on("pointerup", () => {
      this.jumpButton.setAlpha(1);
      this.sendMobileControl("jump", false);
    });
    this.jumpButton.on("pointerout", () => {
      this.jumpButton.setAlpha(1);
      this.sendMobileControl("jump", false);
    });

    // Обработчики кнопки паузы
    this.pauseButton.on("pointerdown", () => {
      this.pauseButton.setAlpha(0.6);
      this.sendMobileControl("pause", true);
    });
    this.pauseButton.on("pointerup", () => {
      this.pauseButton.setAlpha(1);
    });
  }

  private onJoystickDown(): void {
    this.isJoystickActive = true;
    this.joystickStartX = this.joystickBase.x;
    this.joystickStartY = this.joystickBase.y;
    this.joystickBase.setAlpha(0.8);
  }

  private onJoystickMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isJoystickActive) return;

    const distance = Phaser.Math.Distance.Between(
      this.joystickStartX,
      this.joystickStartY,
      pointer.x,
      pointer.y
    );

    const maxDistance = 50;
    const angle = Phaser.Math.Angle.Between(
      this.joystickStartX,
      this.joystickStartY,
      pointer.x,
      pointer.y
    );

    if (distance < maxDistance) {
      this.joystickThumb.setPosition(pointer.x, pointer.y);
    } else {
      this.joystickThumb.setPosition(
        this.joystickStartX + Math.cos(angle) * maxDistance,
        this.joystickStartY + Math.sin(angle) * maxDistance
      );
    }

    // Определяем направление движения
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    const horizontalInput = Math.cos(angle) * normalizedDistance;

    if (horizontalInput < -0.3) {
      this.sendMobileControl("left", true);
      this.sendMobileControl("right", false);
    } else if (horizontalInput > 0.3) {
      this.sendMobileControl("right", true);
      this.sendMobileControl("left", false);
    } else {
      this.sendMobileControl("left", false);
      this.sendMobileControl("right", false);
    }
  }

  private onJoystickUp(): void {
    if (!this.isJoystickActive) return;

    this.isJoystickActive = false;
    this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y);
    this.joystickBase.setAlpha(1);

    // Остановка движения
    this.sendMobileControl("left", false);
    this.sendMobileControl("right", false);
  }

  private sendMobileControl(action: string, pressed: boolean): void {
    this.scene.get(SCENES.GAME)?.events.emit("mobileControl", {
      action,
      pressed,
    });
  }

  // Обновление размеров при изменении ориентации
  public resize(width: number, height: number): void {
    if (!this.isMobileDevice()) return;

    console.log(
      `🔄 MobileControlsScene: Адаптация к размеру ${width}x${height}`
    );

    // Адаптивные размеры в зависимости от ориентации
    const isPortrait = height > width;
    const buttonSize = isPortrait ? 100 : 80;
    const joystickSize = isPortrait ? 120 : 100;
    const margin = isPortrait ? 30 : 20;

    // Кнопка прыжка
    this.jumpButton.setPosition(
      width - buttonSize / 2 - margin,
      height - buttonSize / 2 - margin
    );

    // Кнопка паузы
    const pauseButtonSize = isPortrait ? 60 : 50;
    this.pauseButton.setPosition(
      width - margin - pauseButtonSize / 2,
      margin + pauseButtonSize / 2
    );

    // Джойстик
    this.joystickBase.setPosition(
      margin + joystickSize / 2,
      height - margin - joystickSize / 2
    );
    this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y);

    console.log(
      `✅ MobileControlsScene: Адаптация завершена (${
        isPortrait ? "портрет" : "пейзаж"
      })`
    );
  }
}
