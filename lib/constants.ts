// Игровые константы в стиле Burger King
export const GAME_CONFIG = {
  WIDTH: 1024,
  HEIGHT: 768,
  GRAVITY: 800,
  BACKGROUND_COLOR: "#D32F2F", // Фирменный красный BK
} as const;

export const PLAYER_CONFIG = {
  SPEED: 200,
  JUMP_POWER: 600,
  MAX_HEALTH: 3,
  SIZE: { width: 32, height: 48 },
} as const;

export const ENEMY_TYPES = {
  BURGER: {
    speed: 50,
    health: 1,
    points: 100,
    size: { width: 32, height: 32 },
  },
  FRIES: {
    speed: 80,
    health: 1,
    points: 150,
    size: { width: 24, height: 40 },
  },
  SODA: {
    speed: 30,
    health: 2,
    points: 200,
    size: { width: 28, height: 44 },
  },
} as const;

export const POWER_UPS = {
  CROWN: {
    points: 500,
    effect: "invincibility",
    duration: 5000,
  },
  WHOPPER: {
    points: 1000,
    effect: "extra_life",
    duration: 0,
  },
  ONION_RINGS: {
    points: 300,
    effect: "speed_boost",
    duration: 3000,
  },
} as const;

export const COLORS = {
  BK_RED: "#D32F2F",
  BK_YELLOW: "#FFC107",
  BK_BROWN: "#5D4037",
  BK_ORANGE: "#FF9800",
  WHITE: "#FFFFFF",
  BLACK: "#000000",
} as const;

export const ANIMATIONS = {
  PLAYER: {
    IDLE: "player_idle",
    WALK: "player_walk",
    JUMP: "player_jump",
    DAMAGE: "player_damage",
  },
  ENEMIES: {
    BURGER_WALK: "burger_walk",
    FRIES_WALK: "fries_walk",
    SODA_WALK: "soda_walk",
  },
  POWER_UPS: {
    CROWN_SPIN: "crown_spin",
    WHOPPER_GLOW: "whopper_glow",
    RINGS_BOUNCE: "rings_bounce",
  },
} as const;

export const SOUNDS = {
  JUMP: "jump_sound",
  COLLECT: "collect_sound",
  DAMAGE: "damage_sound",
  VICTORY: "victory_new_sound",
  BACKGROUND: "bg_music",
  ENEMY_DEFEAT: "enemy_defeat",
} as const;

export const SCENES = {
  BOOT: "BootScene",
  PRELOAD: "PreloadScene",
  MENU: "MenuScene",
  GAME: "GameScene",
  PAUSE: "PauseScene",
  GAME_OVER: "GameOverScene",
  VICTORY: "VictoryScene",
  MOBILE_CONTROLS: "MobileControlsScene",
} as const;

export const PHYSICS = {
  WORLD_BOUNDS: {
    x: 0,
    y: 0,
    width: 3200, // Ширина уровня
    height: 768,
  },
  COLLISION_CATEGORIES: {
    PLAYER: 0x0001,
    ENEMY: 0x0002,
    PLATFORM: 0x0004,
    POWER_UP: 0x0008,
    PROJECTILE: 0x0010,
  },
} as const;
