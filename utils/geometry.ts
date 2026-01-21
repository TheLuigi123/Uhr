import { Point } from '../types';

export const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): Point => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

export const describeArc = (
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string => {
  // Handle case where endAngle < startAngle (crossing 12 o'clock)
  let adjustedEndAngle = endAngle;
  if (adjustedEndAngle < startAngle) {
    adjustedEndAngle += 360;
  }
  
  // If it's a full circle
  if (adjustedEndAngle - startAngle >= 360) {
      adjustedEndAngle = startAngle + 359.99;
  }

  const startOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, adjustedEndAngle);

  const startInner = polarToCartesian(x, y, innerRadius, adjustedEndAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = adjustedEndAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M', startOuter.x, startOuter.y,
    'A', outerRadius, outerRadius, 0, largeArcFlag, 1, endOuter.x, endOuter.y,
    'L', startInner.x, startInner.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 0, endInner.x, endInner.y,
    'Z',
  ].join(' ');

  return d;
};

// Convert minutes (0-60) to degrees (0-360)
export const minutesToDegrees = (minutes: number): number => {
  return minutes * 6;
};