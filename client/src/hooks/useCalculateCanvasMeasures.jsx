function useCalculateCanvasMeasures() {
  const maxWidth = window.innerWidth - 350;
  const maxHeight = window.innerHeight - 120;
  const aspectRatio = maxWidth / maxHeight;
  let width, height;
  if (aspectRatio > 1) {
    // Landscape mode
    width = maxHeight * aspectRatio;
    height = maxHeight;
  } else {
    // Portrait mode
    width = maxWidth;
    height = maxWidth / aspectRatio;
  }
  return { width, height };
}

export { useCalculateCanvasMeasures };
