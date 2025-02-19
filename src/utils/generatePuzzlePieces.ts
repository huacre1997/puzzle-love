// src/utils/generatePuzzlePieces.ts
import { PuzzlePiece } from "../types";

// Función para generar las piezas del rompecabezas con un número dinámico de columnas y filas.
export const generatePuzzlePieces = (
  img: HTMLImageElement,
  cols: number = 5, // Número de columnas por defecto (antes era rows)
  rows: number = 3 // Número de filas por defecto (antes era cols)
): PuzzlePiece[] => {
  const aspectRatio = cols / rows; // Relación de aspecto correcta
  let cropWidth = img.width;
  let cropHeight = img.height;

  // Ajustamos el ancho y alto según la relación de aspecto
  if (img.width / img.height > aspectRatio) {
    cropWidth = img.height * aspectRatio; // Ajustamos el ancho para mantener la relación
  } else {
    cropHeight = img.width / aspectRatio; // Ajustamos el alto para mantener la relación
  }

  // Calcular la posición de recorte (centrado en la imagen)
  const cropX = (img.width - cropWidth) / 2;
  const cropY = (img.height - cropHeight) / 2;

  // Calculamos el tamaño de cada pieza basado en columnas y filas
  const pieceWidth = cropWidth / cols;
  const pieceHeight = cropHeight / rows;

  const pieces: PuzzlePiece[] = [];
  const canvas = document.createElement("canvas");
  canvas.width = pieceWidth;
  canvas.height = pieceHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) return pieces; // Si el contexto no está disponible, regresamos el arreglo vacío.

  // Cortamos la imagen en piezas
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sx = cropX + col * pieceWidth; // Coordenada X de recorte
      const sy = cropY + row * pieceHeight; // Coordenada Y de recorte
      ctx.clearRect(0, 0, pieceWidth, pieceHeight); // Limpiar el canvas antes de dibujar

      // Dibujamos la parte de la imagen que corresponde a la pieza actual
      ctx.drawImage(
        img,
        sx,
        sy,
        pieceWidth,
        pieceHeight,
        0,
        0,
        pieceWidth,
        pieceHeight
      );

      // Convertimos la pieza a un formato de imagen en base64 (dataURL)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.3); // 0.7 = 70% calidad

      // Creamos una pieza con un ID único y los datos de la imagen
      const id = row * cols + col;
      pieces.push({ id, imageData: dataUrl, correctSlot: false });
    }
  }

  return pieces; // Retornamos todas las piezas generadas.
};
