import * as Phaser from "phaser";
import { SCENES, COLORS } from "../../constants";

export class MobileControlsScene extends Phaser.Scene {
  private leftButton!: Phaser.GameObjects.Graphics;
  private rightButton!: Phaser.GameObjects.Graphics;
  private jumpButton!: Phaser.GameObjects.Graphics;
  private pauseButton!: Phaser.GameObjects.Graphics;

  // Добавляем ссылки на текстовые иконки
  private jumpIcon!: Phaser.GameObjects.Text;
  private pauseIcon!: Phaser.GameObjects.Text;

  private leftPressed: boolean = false;
  private rightPressed: boolean = false;
  private jumpPressed: boolean = false;

  // Виртуальный джойстик
  private joystickBase!: Phaser.GameObjects.Graphics;
  private joystickThumb!: Phaser.GameObjects.Graphics;
  private joystickActive: boolean = false;
  private joystickDirection: { x: number; y: number } = { x: 0, y: 0 };

  // Флаг инициализации для предотвращения ранних вызовов resize
  private isInitialized: boolean = false;

  constructor() {
    super({ key: SCENES.MOBILE_CONTROLS });
    console.log("🎮 MobileControlsScene: Конструктор вызван");
  }

  create(): void {
    console.log("🎮 MobileControlsScene.create: Начало создания сцены");

    // Проверяем, является ли устройство мобильным
    if (!this.isMobileDevice()) {
      console.log(
        "🎮 MobileControlsScene.create: Не мобильное устройство, выход"
      );
      return; // Не создаем элементы управления на десктопе
    }

    this.createVirtualButtons();
    this.createVirtualJoystick();
    this.setupTouchEvents();

    // Финальная проверка что все объекты созданы
    if (
      this.jumpButton &&
      this.pauseButton &&
      this.joystickBase &&
      this.joystickThumb &&
      this.jumpIcon &&
      this.pauseIcon
    ) {
      // Устанавливаем флаг инициализации
      this.isInitialized = true;
      console.log("🎮 MobileControlsScene: Инициализация завершена успешно");

      // Отправляем событие что сцена готова
      this.events.emit("mobileControlsReady");
    } else {
      console.error("🎮 MobileControlsScene: Не все объекты были созданы!");
    }
  }

  private isMobileDevice(): boolean {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || "ontouchstart" in window;

    console.log("🎮 MobileControlsScene.isMobileDevice:", isMobile);
    return isMobile;
  }

  private createVirtualButtons(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const buttonSize = 80;
    const margin = 20;

    // Кнопка прыжка (справа)
    this.jumpButton = this.add.graphics();
    this.jumpButton.fillStyle(
      parseInt(COLORS.BK_RED.replace("#", ""), 16),
      0.7
    );
    this.jumpButton.fillCircle(0, 0, buttonSize / 2);
    this.jumpButton.lineStyle(4, parseInt(COLORS.WHITE.replace("#", ""), 16));
    this.jumpButton.strokeCircle(0, 0, buttonSize / 2);
    this.jumpButton.setPosition(
      width - buttonSize / 2 - margin,
      height - buttonSize / 2 - margin
    );
    this.jumpButton.setScrollFactor(0);
    this.jumpButton.setDepth(1000);

    // Иконка прыжка
    this.jumpIcon = this.add.text(this.jumpButton.x, this.jumpButton.y, "↑", {
      fontSize: "32px",
      color: COLORS.WHITE,
      fontFamily: "Arial Bold",
    });
    this.jumpIcon.setOrigin(0.5);
    this.jumpIcon.setScrollFactor(0);
    this.jumpIcon.setDepth(1001);

    // Кнопка паузы (правый верхний угол)
    this.pauseButton = this.add.graphics();
    this.pauseButton.fillStyle(
      parseInt(COLORS.BK_BROWN.replace("#", ""), 16),
      0.7
    );
    this.pauseButton.fillCircle(0, 0, 30);
    this.pauseButton.lineStyle(3, parseInt(COLORS.WHITE.replace("#", ""), 16));
    this.pauseButton.strokeCircle(0, 0, 30);
    this.pauseButton.setPosition(width - 50, 50);
    this.pauseButton.setScrollFactor(0);
    this.pauseButton.setDepth(1000);

    // Иконка паузы
    this.pauseIcon = this.add.text(
      this.pauseButton.x,
      this.pauseButton.y,
      "⏸",
      {
        fontSize: "20px",
        color: COLORS.WHITE,
        fontFamily: "Arial Bold",
      }
    );
    this.pauseIcon.setOrigin(0.5);
    this.pauseIcon.setScrollFactor(0);
    this.pauseIcon.setDepth(1001);

    // Делаем кнопки интерактивными
    this.jumpButton.setInteractive(
      new Phaser.Geom.Circle(0, 0, buttonSize / 2),
      Phaser.Geom.Circle.Contains
    );

    this.pauseButton.setInteractive(
      new Phaser.Geom.Circle(0, 0, 30),
      Phaser.Geom.Circle.Contains
    );
  }

  private createVirtualJoystick(): void {
    const margin = 20;
    const baseSize = 100;
    const thumbSize = 40;

    // База джойстика
    this.joystickBase = this.add.graphics();
    this.joystickBase.fillStyle(
      parseInt(COLORS.BK_BROWN.replace("#", ""), 16),
      0.5
    );
    this.joystickBase.fillCircle(0, 0, baseSize / 2);
    this.joystickBase.lineStyle(
      4,
      parseInt(COLORS.WHITE.replace("#", ""), 16),
      0.8
    );
    this.joystickBase.strokeCircle(0, 0, baseSize / 2);
    this.joystickBase.setPosition(
      margin + baseSize / 2,
      this.cameras.main.height - margin - baseSize / 2
    );
    this.joystickBase.setScrollFactor(0);
    this.joystickBase.setDepth(1000);

    // Ручка джойстика
    this.joystickThumb = this.add.graphics();
    this.joystickThumb.fillStyle(
      parseInt(COLORS.BK_YELLOW.replace("#", ""), 16),
      0.9
    );
    this.joystickThumb.fillCircle(0, 0, thumbSize / 2);
    this.joystickThumb.lineStyle(
      3,
      parseInt(COLORS.WHITE.replace("#", ""), 16)
    );
    this.joystickThumb.strokeCircle(0, 0, thumbSize / 2);
    this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y);
    this.joystickThumb.setScrollFactor(0);
    this.joystickThumb.setDepth(1001);

    // Делаем джойстик интерактивным
    this.joystickBase.setInteractive(
      new Phaser.Geom.Circle(0, 0, baseSize / 2),
      Phaser.Geom.Circle.Contains
    );
  }

  private setupTouchEvents(): void {
    // События для кнопки прыжка
    this.jumpButton.on("pointerdown", () => {
      this.jumpPressed = true;
      this.jumpButton.setAlpha(0.8);
      this.emitControlEvent("jump", true);
    });

    this.jumpButton.on("pointerup", () => {
      this.jumpPressed = false;
      this.jumpButton.setAlpha(1);
      this.emitControlEvent("jump", false);
    });

    this.jumpButton.on("pointerout", () => {
      this.jumpPressed = false;
      this.jumpButton.setAlpha(1);
      this.emitControlEvent("jump", false);
    });

    // События для кнопки паузы
    this.pauseButton.on("pointerdown", () => {
      this.pauseButton.setAlpha(0.8);
      this.emitControlEvent("pause", true);
    });

    this.pauseButton.on("pointerup", () => {
      this.pauseButton.setAlpha(1);
    });

    // События для джойстика
    this.joystickBase.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.joystickActive = true;
      this.updateJoystick(pointer);
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.joystickActive) {
        this.updateJoystick(pointer);
      }
    });

    this.input.on("pointerup", () => {
      if (this.joystickActive) {
        this.joystickActive = false;
        this.resetJoystick();
      }
    });
  }

  private updateJoystick(pointer: Phaser.Input.Pointer): void {
    const baseX = this.joystickBase.x;
    const baseY = this.joystickBase.y;
    const maxDistance = 40; // Максимальное расстояние от центра

    // Вычисляем расстояние от центра джойстика
    const distance = Phaser.Math.Distance.Between(
      baseX,
      baseY,
      pointer.x,
      pointer.y
    );

    let thumbX = pointer.x;
    let thumbY = pointer.y;

    // Ограничиваем движение ручки джойстика
    if (distance > maxDistance) {
      const angle = Phaser.Math.Angle.Between(
        baseX,
        baseY,
        pointer.x,
        pointer.y
      );
      thumbX = baseX + Math.cos(angle) * maxDistance;
      thumbY = baseY + Math.sin(angle) * maxDistance;
    }

    // Обновляем позицию ручки
    this.joystickThumb.setPosition(thumbX, thumbY);

    // Вычисляем направление (-1 до 1)
    this.joystickDirection.x = (thumbX - baseX) / maxDistance;
    this.joystickDirection.y = (thumbY - baseY) / maxDistance;

    // Определяем направление движения
    const threshold = 0.3;
    this.leftPressed = this.joystickDirection.x < -threshold;
    this.rightPressed = this.joystickDirection.x > threshold;

    // Отправляем события управления
    this.emitControlEvent("left", this.leftPressed);
    this.emitControlEvent("right", this.rightPressed);
  }

  private resetJoystick(): void {
    // Возвращаем ручку в центр
    this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y);
    this.joystickDirection = { x: 0, y: 0 };

    // Сбрасываем состояние кнопок
    this.leftPressed = false;
    this.rightPressed = false;

    // Отправляем события сброса
    this.emitControlEvent("left", false);
    this.emitControlEvent("right", false);
  }

  private emitControlEvent(action: string, pressed: boolean): void {
    // Отправляем события в игровую сцену
    this.scene.get(SCENES.GAME)?.events.emit("mobileControl", {
      action,
      pressed,
      direction: this.joystickDirection,
    });
  }

  // Публичные методы для получения состояния управления
  public getControlState() {
    return {
      left: this.leftPressed,
      right: this.rightPressed,
      jump: this.jumpPressed,
      direction: this.joystickDirection,
    };
  }

  public isJoystickActive(): boolean {
    return this.joystickActive;
  }

  // Обновление размеров при изменении ориентации
  public resize(width: number, height: number): void {
    console.log("🎮 MobileControlsScene.resize: Начало вызова", {
      width,
      height,
    });

    if (!this.isMobileDevice()) {
      console.log(
        "🎮 MobileControlsScene.resize: Не мобильное устройство, выход"
      );
      return;
    }

    // Проверяем, что сцена полностью инициализирована
    if (!this.isInitialized) {
      console.warn(
        "🎮 MobileControlsScene: Попытка resize до завершения инициализации"
      );
      return;
    }

    // Детальная проверка каждого объекта
    console.log("🎮 MobileControlsScene.resize: Проверка объектов:");
    console.log("  - jumpButton:", !!this.jumpButton);
    console.log("  - pauseButton:", !!this.pauseButton);
    console.log("  - joystickBase:", !!this.joystickBase);
    console.log("  - joystickThumb:", !!this.joystickThumb);
    console.log("  - jumpIcon:", !!this.jumpIcon);
    console.log("  - pauseIcon:", !!this.pauseIcon);

    // Проверяем, что все объекты созданы перед обновлением позиций
    if (
      !this.jumpButton ||
      !this.pauseButton ||
      !this.joystickBase ||
      !this.joystickThumb ||
      !this.jumpIcon ||
      !this.pauseIcon
    ) {
      console.warn(
        "🎮 MobileControlsScene: Объекты управления не полностью инициализированы"
      );
      return;
    }

    try {
      console.log("🎮 MobileControlsScene.resize: Начинаем обновление позиций");

      // Обновляем позиции элементов управления
      const buttonSize = 80;
      const margin = 20;

      // Кнопка прыжка
      console.log("🎮 Обновляем позицию jumpButton");
      this.jumpButton.setPosition(
        width - buttonSize / 2 - margin,
        height - buttonSize / 2 - margin
      );
      console.log("🎮 jumpButton обновлен");

      // Кнопка паузы
      console.log("🎮 Обновляем позицию pauseButton");
      this.pauseButton.setPosition(width - 50, 50);
      console.log("🎮 pauseButton обновлен");

      // Джойстик
      const baseSize = 100;
      console.log("🎮 Обновляем позицию joystickBase");
      this.joystickBase.setPosition(
        margin + baseSize / 2,
        height - margin - baseSize / 2
      );
      console.log("🎮 joystickBase обновлен");

      console.log("🎮 Обновляем позицию joystickThumb");
      this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y);
      console.log("🎮 joystickThumb обновлен");

      // Обновляем позиции текстовых иконок
      console.log("🎮 Обновляем позицию jumpIcon");
      this.jumpIcon.setPosition(this.jumpButton.x, this.jumpButton.y);
      console.log("🎮 jumpIcon обновлен");

      console.log("🎮 Обновляем позицию pauseIcon");
      this.pauseIcon.setPosition(this.pauseButton.x, this.pauseButton.y);
      console.log("🎮 pauseIcon обновлен");

      console.log(
        `🎮 MobileControlsScene: Размеры обновлены до ${width}x${height}`
      );
    } catch (error) {
      console.error(
        "🎮 MobileControlsScene: Ошибка при обновлении размеров:",
        error
      );
      console.error("🎮 Стек ошибки:", (error as Error).stack);
    }
  }
}
