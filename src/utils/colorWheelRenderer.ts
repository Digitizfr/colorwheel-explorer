export const renderColorWheel = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  selectedPoint: { x: number, y: number } | null,
  harmonyPoints: Array<{ x: number, y: number }>,
  dpr: number
) => {
  // Fond blanc
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, centerX * 2, centerY * 2);

  // Dessiner la roue chromatique
  for (let angle = 0; angle < 360; angle += 1) {
    const startAngle = (angle - 0.5) * Math.PI / 180;
    const endAngle = (angle + 1.5) * Math.PI / 180;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);

    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // Contour
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Points de sélection
  if (selectedPoint) {
    ctx.beginPath();
    ctx.arc(selectedPoint.x * dpr, selectedPoint.y * dpr, 8 * dpr, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2 * dpr;
    ctx.stroke();
  }

  // Points d'harmonie
  harmonyPoints.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x * dpr, point.y * dpr, 6 * dpr, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1.5 * dpr;
    ctx.stroke();
  });
};