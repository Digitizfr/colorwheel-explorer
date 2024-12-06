export const calculateWheelDimensions = (canvas: HTMLCanvasElement) => {
  const size = 300;
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;

  return {
    size,
    dpr,
    centerX: size * dpr / 2,
    centerY: size * dpr / 2,
    radius: (size * dpr / 2) - (20 * dpr)
  };
};

export const getColorFromPoint = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  const imageData = ctx.getImageData(x, y, 1, 1).data;
  return `#${imageData[0].toString(16).padStart(2, '0')}${imageData[1].toString(16).padStart(2, '0')}${imageData[2].toString(16).padStart(2, '0')}`;
};

export const polarToCartesian = (angle: number, radius: number, centerX: number, centerY: number) => {
  return {
    x: centerX + radius * Math.cos(angle * Math.PI / 180),
    y: centerY + radius * Math.sin(angle * Math.PI / 180)
  };
};