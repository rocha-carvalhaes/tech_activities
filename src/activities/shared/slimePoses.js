// Poses do slime. Cada pose define o "squash & stretch" (sx, sy), a altura dos
// olhos e o formato da boca/olhos. O Slime.jsx ancora a deformação na base, então
// o slime "estica" pra cima ao subir e "achata" no chão ao pousar.
export const POSES = {
  idle: { sx: 1.0, sy: 1.0, eyeY: -0.12, blink: false, mouth: 'smile' },
  stretch: { sx: 0.84, sy: 1.18, eyeY: -0.2, blink: false, mouth: 'smile' },
  fall: { sx: 1.14, sy: 0.9, eyeY: -0.04, blink: false, mouth: 'o' },
  squash: { sx: 1.34, sy: 0.7, eyeY: 0.04, blink: false, mouth: 'smile' },
  blink: { sx: 1.0, sy: 1.0, eyeY: -0.12, blink: true, mouth: 'smile' },
};

// Escolhe a pose a partir do estado físico do slime.
export function poseFromState({ vy, justBounced, blinking }) {
  if (justBounced) return 'squash';
  if (vy < -0.5) return 'stretch';
  if (vy > 0.5) return 'fall';
  if (blinking) return 'blink';
  return 'idle';
}

export default POSES;
