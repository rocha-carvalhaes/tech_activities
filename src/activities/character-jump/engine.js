// Simulação do jogo (doodle-jump). Estado mutável encapsulado: o GameScene cria
// uma instância, chama step() a cada frame e desenha lendo os campos públicos.
// Sem dependência de React/DOM — fácil de ler e de testar isoladamente.
import {
  SCENE_WIDTH,
  SCENE_HEIGHT,
  GRAVITY,
  MAX_FALL_SPEED,
  CAMERA_ANCHOR,
  PLATFORM_WIDTH,
  PLATFORM_HEIGHT,
  PLATFORM_GAP,
  PLATFORM_GAP_JITTER,
  slimeRadius,
} from './constants';

const ANCHOR_Y = SCENE_HEIGHT * CAMERA_ANCHOR;
const EDGE = 8;
const START_Y = SCENE_HEIGHT - 90;

let nextId = 1;

export class GameEngine {
  constructor(attrs) {
    this.reset(attrs);
  }

  reset(attrs) {
    this.radius = slimeRadius(attrs.size);
    this.jumpV = attrs.jump; // velocidade do salto = atributo `jump`
    this.speed = attrs.speed; // velocidade horizontal = atributo `speed`

    this.slime = { x: SCENE_WIDTH / 2, y: START_Y, vx: 0, vy: 0 };
    this.cameraOffset = 0; // screenY = worldY - cameraOffset
    this.minY = START_Y; // ponto mais alto alcançado (menor y = mais alto)
    this.score = 0;
    this.over = false;
    this.squashFrames = 0;
    this.blinkTimer = 60 + Math.floor(Math.random() * 120);
    this.blinking = false;

    // Plataforma inicial logo abaixo do slime + preenchimento para cima.
    this.platforms = [
      this._mkPlatform(SCENE_WIDTH / 2 - PLATFORM_WIDTH / 2, START_Y + this.radius + 6),
    ];
    let topY = this.platforms[0].y;
    while (topY > -PLATFORM_GAP) {
      topY -= this._gap();
      this.platforms.push(this._mkPlatform(this._randX(), topY));
    }
  }

  _gap() {
    return PLATFORM_GAP + (Math.random() * 2 - 1) * PLATFORM_GAP_JITTER;
  }

  _randX() {
    return EDGE + Math.random() * (SCENE_WIDTH - PLATFORM_WIDTH - EDGE * 2);
  }

  _mkPlatform(x, y) {
    return { id: nextId++, x, y };
  }

  screenYOf(worldY) {
    return worldY - this.cameraOffset;
  }

  get justBounced() {
    return this.squashFrames > 0;
  }

  // Avança um frame. input = { left: bool, right: bool }.
  step(input) {
    if (this.over) return;
    const s = this.slime;

    // Movimento horizontal (atributo speed) com wrap nas bordas.
    s.vx = (input.right ? this.speed : 0) - (input.left ? this.speed : 0);
    s.x += s.vx;
    if (s.x < 0) s.x += SCENE_WIDTH;
    else if (s.x > SCENE_WIDTH) s.x -= SCENE_WIDTH;

    // Gravidade.
    const prevBottom = s.y + this.radius;
    s.vy += GRAVITY;
    if (s.vy > MAX_FALL_SPEED) s.vy = MAX_FALL_SPEED;
    s.y += s.vy;

    // Colisão com plataforma só ao cair (vindo de cima).
    if (s.vy > 0) {
      const bottom = s.y + this.radius;
      for (const p of this.platforms) {
        const within =
          s.x > p.x - this.radius * 0.5 &&
          s.x < p.x + PLATFORM_WIDTH + this.radius * 0.5;
        if (within && prevBottom <= p.y && bottom >= p.y) {
          s.y = p.y - this.radius;
          s.vy = -this.jumpV; // salta (altura proporcional a `jump`)
          this.squashFrames = 8;
          break;
        }
      }
    }

    // Câmera só sobe (segue o slime quando ele passa da âncora).
    if (s.y - this.cameraOffset < ANCHOR_Y) this.cameraOffset = s.y - ANCHOR_Y;

    // Pontuação = altura escalada.
    if (s.y < this.minY) {
      this.minY = s.y;
      const sc = Math.floor((START_Y - this.minY) / 20);
      if (sc > this.score) this.score = sc;
    }

    this._managePlatforms();

    // Game over: caiu abaixo da tela.
    if (s.y - this.cameraOffset > SCENE_HEIGHT + this.radius * 2) this.over = true;

    if (this.squashFrames > 0) this.squashFrames--;
    this._blink();
  }

  _managePlatforms() {
    const bottomLimit = this.cameraOffset + SCENE_HEIGHT + 40;
    this.platforms = this.platforms.filter((p) => p.y < bottomLimit);

    let topY = this.platforms.length
      ? Math.min(...this.platforms.map((p) => p.y))
      : this.cameraOffset;
    const topLimit = this.cameraOffset - PLATFORM_GAP;
    while (topY > topLimit) {
      topY -= this._gap();
      this.platforms.push(this._mkPlatform(this._randX(), topY));
    }
  }

  _blink() {
    this.blinkTimer--;
    if (this.blinkTimer <= 0) {
      this.blinking = !this.blinking;
      this.blinkTimer = this.blinking ? 6 : 80 + Math.floor(Math.random() * 160);
    }
  }
}

export default GameEngine;
