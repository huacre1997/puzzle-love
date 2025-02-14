const defaults = {
  spread: 360,
  ticks: 100,
  gravity: 1,
  decay: 0.94,
  startVelocity: 20,
  shapes: ["heart"],
  colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
};

const launchConfetti = (launch: boolean) => {
  const colors = ["#FF69B4", "#FFC0CB", "#FF1493", "#ffffff"]; // Colores románticos

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });

    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (launch) {
      requestAnimationFrame(frame); // Mantiene el efecto activo
    }
  })();
};

const shoot = (x: number, y: number) => {
  const origin = { x: x / window.innerWidth, y: y / window.innerHeight };

  [
    { particleCount: 50, scalar: 2 },
    { particleCount: 25, scalar: 3 },
    { particleCount: 10, scalar: 4 },
  ].forEach(({ particleCount, scalar }) => {
    confetti({
      ...defaults,
      particleCount,
      scalar,
      origin,
    });
  });
};

export { launchConfetti, shoot };
