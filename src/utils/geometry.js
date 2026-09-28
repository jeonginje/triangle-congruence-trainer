// Geometric helper functions for drawing textbook-perfect triangles in SVG

/**
 * Normalizes a vector (vx, vy)
 */
export function normalize(vx, vy) {
  const len = Math.hypot(vx, vy);
  if (len === 0) return { x: 0, y: 0 };
  return { x: vx / len, y: vy / len };
}

/**
 * Calculates the centroid of 3 points
 */
export function getCentroid(p1, p2, p3) {
  return {
    x: (p1.x + p2.x + p3.x) / 3,
    y: (p1.y + p2.y + p3.y) / 3,
  };
}

/**
 * Computes offset vertex label position pushed outward from centroid
 */
export function getVertexLabelPos(vertex, centroid, distance = 22) {
  const dir = normalize(vertex.x - centroid.x, vertex.y - centroid.y);
  return {
    x: vertex.x + dir.x * distance,
    y: vertex.y + dir.y * distance,
  };
}

/**
 * Generates SVG path for an angle arc at vertex V between rays toward P1 and P2
 */
export function getAngleArcPath(v, p1, p2, radius = 26) {
  const angle1 = Math.atan2(p1.y - v.y, p1.x - v.x);
  const angle2 = Math.atan2(p2.y - v.y, p2.x - v.x);

  // Compute interior angle sweep (must be <= Math.PI)
  let diff = angle2 - angle1;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  while (diff > Math.PI) diff -= 2 * Math.PI;

  const startAngle = angle1;
  const endAngle = angle1 + diff;

  const startX = v.x + radius * Math.cos(startAngle);
  const startY = v.y + radius * Math.sin(startAngle);
  const endX = v.x + radius * Math.cos(endAngle);
  const endY = v.y + radius * Math.sin(endAngle);

  const sweepFlag = diff > 0 ? 1 : 0;
  const largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
}

/**
 * Position for angle label text (placed along the angle bisector)
 */
export function getAngleLabelPos(v, p1, p2, distance = 38) {
  const angle1 = Math.atan2(p1.y - v.y, p1.x - v.x);
  let diff = Math.atan2(p2.y - v.y, p2.x - v.x) - angle1;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  while (diff > Math.PI) diff -= 2 * Math.PI;

  const midAngle = angle1 + diff / 2;
  return {
    x: v.x + distance * Math.cos(midAngle),
    y: v.y + distance * Math.sin(midAngle),
  };
}

/**
 * SVG path for right angle square marker
 */
export function getRightAnglePath(v, p1, p2, size = 16) {
  const dir1 = normalize(p1.x - v.x, p1.y - v.y);
  const dir2 = normalize(p2.x - v.x, p2.y - v.y);

  const pt1 = { x: v.x + dir1.x * size, y: v.y + dir1.y * size };
  const pt2 = { x: pt1.x + dir2.x * size, y: pt1.y + dir2.y * size };
  const pt3 = { x: v.x + dir2.x * size, y: v.y + dir2.y * size };

  return `M ${pt1.x} ${pt1.y} L ${pt2.x} ${pt2.y} L ${pt3.x} ${pt3.y}`;
}

/**
 * Computes tick marks perpendicular to an edge
 */
export function getEdgeTicks(p1, p2, count = 1, centroid = null) {
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;

  const edgeLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  if (edgeLen === 0) return [];

  // Unit tangent
  const tx = (p2.x - p1.x) / edgeLen;
  const ty = (p2.y - p1.y) / edgeLen;

  // Unit normal
  const nx = -ty;
  const ny = tx;

  const tickHalfLen = 7;
  const spacing = 5;

  const ticks = [];
  const startOffset = -((count - 1) * spacing) / 2;

  for (let i = 0; i < count; i++) {
    const offset = startOffset + i * spacing;
    const cx = midX + tx * offset;
    const cy = midY + ty * offset;
    ticks.push({
      x1: cx - nx * tickHalfLen,
      y1: cy - ny * tickHalfLen,
      x2: cx + nx * tickHalfLen,
      y2: cy + ny * tickHalfLen,
    });
  }
  return ticks;
}

/**
 * Position for edge label text (outward from centroid)
 */
export function getEdgeLabelPos(p1, p2, centroid, distance = 16) {
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;

  if (!centroid) {
    return { x: midX, y: midY - distance };
  }

  // Normal pointing outward from centroid
  let nx = -(p2.y - p1.y);
  let ny = p2.x - p1.x;
  const len = Math.hypot(nx, ny);
  if (len > 0) {
    nx /= len;
    ny /= len;
  }

  // Check if (mid + N) is farther from centroid than (mid - N)
  const d1 = Math.hypot(midX + nx - centroid.x, midY + ny - centroid.y);
  const d2 = Math.hypot(midX - nx - centroid.x, midY - ny - centroid.y);

  if (d2 > d1) {
    nx = -nx;
    ny = -ny;
  }

  return {
    x: midX + nx * distance,
    y: midY + ny * distance,
  };
}

/**
 * Transforms points by rotation around a center and optional scale/reflection
 */
export function transformPoints(points, angleDeg, flipX = false, flipY = false, center = { x: 150, y: 130 }) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return points.map(p => {
    let dx = p.x - center.x;
    let dy = p.y - center.y;

    if (flipX) dx = -dx;
    if (flipY) dy = -dy;

    const rx = dx * cos - dy * sin;
    const ry = dx * sin + dy * cos;

    return {
      x: center.x + rx,
      y: center.y + ry,
    };
  });
}
