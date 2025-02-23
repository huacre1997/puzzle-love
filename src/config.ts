export const appConfig: {
  language: "es" | "en";
  theme: "tulips" | "sunflowers" | "roses" | "lilies";
} = {
  language: (import.meta.env.VITE_LANGUAGE as "es" | "en") || "es", // Limitar a "es" o "en"
  theme:
    (import.meta.env.VITE_THEME as
      | "tulips"
      | "sunflowers"
      | "roses"
      | "lilies") || "roses", // Limitar a los temas válidos
};

console.log(appConfig);
