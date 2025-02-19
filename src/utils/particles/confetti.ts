const defaults = {
  spread: 45,
  ticks: 11,
  gravity: 0.5,
  decay: 0.94,
  startVelocity: 8,
  shapes: ["heart"],
  colors: ["#FFDD44", "#FFD700", "#FFC107", "#FFB300", "#FFA000"],
};

const launchConfetti = (launch: boolean) => {
  const colors = ["#FFCC00", "#FFD700", "##ffa500", "#6B8E23"];

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
    { particleCount: 40, scalar: 2 },
    { particleCount: 20, scalar: 3 },
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
