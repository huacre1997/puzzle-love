import {
  EventType,
  type ISourceOptions,
  type Particle,
} from "@tsparticles/engine";

const options: ISourceOptions = {
  key: "sunflowerFireworks",
  name: "Sunflower Fireworks",

  emitters: {
    direction: "top",
    life: {
      count: 0,
      duration: 0.1,
      delay: 0.1,
    },
    rate: {
      delay: 0.15,
      quantity: 1,
    },
    size: {
      width: 100,
      height: 0,
    },
    position: {
      y: 100,
      x: 50, // Center horizontally
    },
  },
  particles: {
    color: {
      value: ["#FFD700", "#FFA500", "#FF8C00", "#8B4513"], // Yellow, orange, and brown for sunflower colors
    },
    number: {
      value: 1,
    },
    destroy: {
      bounds: {
        top: 20,
      },
      mode: "split",
      split: {
        count: 1,
        factor: {
          value: 0.333333,
        },
        rate: {
          value: 120,
        },
        particles: {
          stroke: {
            width: 0,
          },
          color: {
            value: ["#FFD700", "#FFA500", "#FF8C00", "#8B4513"], // Consistent sunflower colors
          },
          number: {
            value: 0,
          },
          collisions: {
            enable: false,
          },
          destroy: {
            bounds: {
              top: 0,
            },
          },
          opacity: {
            value: {
              min: 0.1,
              max: 1,
            },
            animation: {
              enable: true,
              speed: 0.7,
              sync: false,
              startValue: "max",
              destroy: "min",
            },
          },
          effect: {
            type: "trail",
            options: {
              trail: {
                length: {
                  min: 5,
                  max: 10,
                },
              },
            },
          },
          shape: {
            type: "heart", // Use hearts for simplicity (or use a custom sunflower shape if available)
          },
          size: {
            value: 5, // Slightly larger particles
            animation: {
              enable: true,
              speed: 2,
              sync: false,
              startValue: "min",
              destroy: "max",
            },
          },
          life: {
            count: 1,
            duration: {
              value: {
                min: 1,
                max: 3,
              },
            },
          },
          move: {
            enable: true,
            gravity: {
              enable: true,
              acceleration: 9.81,
              inverse: false,
            },
            decay: 0.1,
            speed: {
              min: 10,
              max: 25,
            },
            direction: "outside",
            outModes: "destroy",
          },
        },
      },
    },
    life: {
      count: 1,
    },
    effect: {
      type: "trail",
      options: {
        trail: {
          length: {
            min: 10,
            max: 30,
          },
          minWidth: 1,
          maxWidth: 1,
        },
      },
    },
    shape: {
      type: "heart", // Use hearts for simplicity (or use a custom sunflower shape if available)
    },
    size: {
      value: 3, // Smaller main particle size
    },
    move: {
      enable: true,
      gravity: {
        acceleration: 15,
        enable: true,
        inverse: true,
        maxSpeed: 100,
      },
      speed: {
        min: 10,
        max: 20,
      },
      outModes: {
        default: "destroy",
        top: "none",
      },
    },
  },
  sounds: {
    enable: true,
    events: [
      {
        event: EventType.particleRemoved,
        filter: (args: { data: { particle: Particle } }) =>
          args.data.particle.options.move.gravity.inverse,
        audio: [
          "https://particles.js.org/audio/explosion0.mp3",
          "https://particles.js.org/audio/explosion1.mp3",
          "https://particles.js.org/audio/explosion2.mp3",
        ],
      },
    ],
    volume: 10,
  },
};

export default options;
