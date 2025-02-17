export const imageDetailsData = [
  {
    id: "image1",
    src: "/pareja.jpg",
    title: "Imagen 1",
    message:
      "¡Lo lograste, mi amor! 💖 Así como juntaste cada pieza, así encajamos tú y yo: perfectamente. Eres el amor de mi vida.",
    completed: false,
    boardSlots: {},
    pool: [],
    clues: 4,
  },
  {
    id: "image2",
    src: "/pareja4.jpg",
    title: "Imagen 2",
    boardSlots: {},
    pool: [],
    clues: 5,
    completed: false,
    message:
      "Nuestro amor es la pieza perfecta 💑 Cada pedacito de este rompecabezas me recuerda lo bien que estamos juntos. ¡Te amo con todo mi ser!",
  },
  {
    id: "image3",
    src: "/pareja5.jpg",
    pool: [],
    title: "Imagen 3",
    boardSlots: {},
    clues: 5,
    completed: false,
    message:
      "¡Juntos completamos todo! 💕 Sin ti, este rompecabezas estaría incompleto, igual que mi vida sin tu amor. Eres mi persona favorita.",
  },
];

export const puzzleSize = [
  {
    id: "image1",
    cols: 4,
    rows: 4,
  },
  {
    id: "image2",
    cols: 4,
    rows: 5,
  },
  {
    id: "image3",
    cols: 4,
    rows: 5,
  },
].map((puzzle) => ({
  ...puzzle,
  total: puzzle.cols * puzzle.rows,
}));
