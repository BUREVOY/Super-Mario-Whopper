import Phaser from "phaser";

export interface GameConfig {
  width: number;
  height: number;
  backgroundColor: string;
}

export interface PlayerConfig {
  x: number;
  y: number;
  speed: number;
  jumpPower: number;
  health: number;
}

export interface EnemyConfig {
  x: number;
  y: number;
  speed: number;
  type: "burger" | "fries" | "soda";
  health: number;
}

export interface PowerUpConfig {
  x: number;
  y: number;
  type: "crown" | "whopper" | "onion_rings";
  points: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  background: string;
  platforms: PlatformConfig[];
  enemies: EnemyConfig[];
  powerUps: PowerUpConfig[];
  goal: { x: number; y: number };
}

export interface PlatformConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "ground" | "platform" | "moving";
}

export interface GameState {
  score: number;
  lives: number;
  level: number;
  time: number;
  isPaused: boolean;
}

export interface Controls {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
  pause: Phaser.Input.Keyboard.Key;
  leftAlt?: Phaser.Input.Keyboard.Key;
  rightAlt?: Phaser.Input.Keyboard.Key;
  upAlt?: Phaser.Input.Keyboard.Key;
  downAlt?: Phaser.Input.Keyboard.Key;
}

export interface SoundConfig {
  jump: string;
  collect: string;
  damage: string;
  victory: string;
  background: string;
}

export interface AnimationConfig {
  key: string;
  frames: string[];
  frameRate: number;
  repeat: number;
}
