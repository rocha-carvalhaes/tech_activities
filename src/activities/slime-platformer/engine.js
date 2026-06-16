// Simulação do plataformer lateral. Estado mutável encapsulado, mesmo padrão da
// GameEngine do jogo 1. Colisão AABB resolvida POR EIXO contra chão + caixas.
import {
  CELL,
  VIEW_W,
  VIEW_H,
  FLOOR_TOP_Y,
  GRAVITY,
  MAX_FALL,
  START_COL,
  cellLeft,
  cellTopY,
  levelWorldWidth,
  levelWorldTopY,
} from './constants';

function overlaps(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function cellBox(col, row) {
  const left = cellLeft(col);
  const top = cellTopY(row);
  return { left, top, right: left + CELL, bottom: top + CELL };
}

export class PlatformerEngine {
  constructor(values) {
    this.reset(values);
  }

  reset(values) {
    this.side = values.size * CELL;
    this.jumpImpulse = values.jump; // velocidade do pulo = atributo `jump`
    this.speed = values.speed;

    this.boxes = (values.boxes || []).map((b) => cellBox(b.col, b.row));
    this.goalBox = cellBox(values.goal.col, values.goal.row);
    this.worldWidth = levelWorldWidth(values);

    // Slime começa à esquerda, sobre o chão. (x,y) = canto superior-esquerdo.
    this.slime = {
      x: cellLeft(START_COL),
      y: FLOOR_TOP_Y - this.side,
      vx: 0,
      vy: 0,
      grounded: true,
    };

    this.worldTopY = levelWorldTopY(values);
    this.cameraX = 0;
    this.cameraY = 0;
    this.won = false;
    this.jumpWasHeld = false;
    this.squashFrames = 0;
    this.blinkTimer = 60 + Math.floor(Math.random() * 120);
    this.blinking = false;

    this._updateCamera();
  }

  slimeBox() {
    const s = this.slime;
    return { left: s.x, top: s.y, right: s.x + this.side, bottom: s.y + this.side };
  }

  screenXOf(worldX) {
    return worldX - this.cameraX;
  }

  get justBounced() {
    return this.squashFrames > 0;
  }

  step(input) {
    if (this.won) return;
    const s = this.slime;

    // Pulo (edge-triggered): só ao apertar e estando no chão.
    const jumpPressed = !!input.up;
    if (jumpPressed && !this.jumpWasHeld && s.grounded) {
      s.vy = -this.jumpImpulse;
      s.grounded = false;
    }
    this.jumpWasHeld = jumpPressed;

    // Horizontal.
    s.vx = (input.right ? this.speed : 0) - (input.left ? this.speed : 0);
    s.x += s.vx;
    this._resolveX();
    if (s.x < 0) s.x = 0;
    if (s.x + this.side > this.worldWidth) s.x = this.worldWidth - this.side;

    // Vertical (gravidade + colisão).
    s.vy += GRAVITY;
    if (s.vy > MAX_FALL) s.vy = MAX_FALL;
    const impactVy = s.vy;
    s.grounded = false;
    s.y += s.vy;
    this._resolveY(impactVy);

    // Chão sólido contínuo.
    if (s.y + this.side > FLOOR_TOP_Y) {
      s.y = FLOOR_TOP_Y - this.side;
      if (s.vy > 4) this.squashFrames = 6;
      s.vy = 0;
      s.grounded = true;
    }

    this._updateCamera();

    if (overlaps(this.slimeBox(), this.goalBox)) this.won = true;

    if (this.squashFrames > 0) this.squashFrames--;
    this._blink();
  }

  _resolveX() {
    const s = this.slime;
    for (const box of this.boxes) {
      const b = this.slimeBox();
      if (!overlaps(b, box)) continue;
      if (s.vx > 0) s.x = box.left - this.side;
      else if (s.vx < 0) s.x = box.right;
      s.vx = 0;
    }
  }

  _resolveY(impactVy) {
    const s = this.slime;
    for (const box of this.boxes) {
      const b = this.slimeBox();
      if (!overlaps(b, box)) continue;
      if (s.vy > 0) {
        // caindo: pousa no topo da caixa
        s.y = box.top - this.side;
        if (impactVy > 4) this.squashFrames = 6;
        s.vy = 0;
        s.grounded = true;
      } else if (s.vy < 0) {
        // subindo: bate a cabeça (bonk)
        s.y = box.bottom;
        s.vy = 0;
      }
    }
  }

  _updateCamera() {
    const s = this.slime;
    const targetX = s.x + this.side / 2 - VIEW_W * 0.4;
    const maxCamX = Math.max(0, this.worldWidth - VIEW_W);
    this.cameraX = Math.min(maxCamX, Math.max(0, targetX));

    const targetY = s.y + this.side / 2 - VIEW_H * 0.5;
    this.cameraY = Math.min(0, Math.max(this.worldTopY, targetY));
  }

  _blink() {
    this.blinkTimer--;
    if (this.blinkTimer <= 0) {
      this.blinking = !this.blinking;
      this.blinkTimer = this.blinking ? 6 : 80 + Math.floor(Math.random() * 160);
    }
  }
}

export default PlatformerEngine;
