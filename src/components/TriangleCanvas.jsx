import React from 'react';
import {
  getCentroid,
  getVertexLabelPos,
  getAngleArcPath,
  getAngleLabelPos,
  getRightAnglePath,
  getEdgeTicks,
  getEdgeLabelPos,
  transformPoints
} from '../utils/geometry';

export default function TriangleCanvas({
  triangle,
  title,
  subtitle,
  colorScheme = 'blue', // 'blue' for triangle A, 'emerald' for triangle B
  isSuperposed = false,
  targetTriangle = null, // if superposing over another triangle
  superposeProgress = 0, // 0 to 1
  highlightElement = null, // { type: 'edge'|'angle'|'vertex', index: number }
  className = '',
}) {
  // Base canonical points in a 280x250 coordinate space
  const basePoints = [
    { x: 120, y: 45 },   // Vertex 0 (Top / Peak)
    { x: 45, y: 195 },   // Vertex 1 (Bottom Left)
    { x: 235, y: 195 },  // Vertex 2 (Bottom Right)
  ];

  const rotation = triangle.rotation || 0;
  const flipX = triangle.flipX || false;

  // Center of the canvas
  const center = { x: 140, y: 135 };

  // Calculate transformed points for this triangle
  const points = transformPoints(basePoints, rotation, flipX, false, center);
  const centroid = getCentroid(points[0], points[1], points[2]);

  // Color schemes
  const colors = {
    blue: {
      fill: 'fill-indigo-50/60',
      stroke: 'stroke-indigo-600',
      vertexFill: 'fill-indigo-600',
      vertexText: 'fill-indigo-950 font-bold',
      tickStroke: 'stroke-indigo-600',
      arcStroke: 'stroke-indigo-600',
      arcFill: 'fill-indigo-100/50',
      textFill: 'fill-indigo-700 font-semibold',
      badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    },
    emerald: {
      fill: 'fill-emerald-50/60',
      stroke: 'stroke-emerald-600',
      vertexFill: 'fill-emerald-600',
      vertexText: 'fill-emerald-950 font-bold',
      tickStroke: 'stroke-emerald-600',
      arcStroke: 'stroke-emerald-600',
      arcFill: 'fill-emerald-100/50',
      textFill: 'fill-emerald-700 font-semibold',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    },
    amber: {
      fill: 'fill-amber-50/60',
      stroke: 'stroke-amber-600',
      vertexFill: 'fill-amber-600',
      vertexText: 'fill-amber-950 font-bold',
      tickStroke: 'stroke-amber-600',
      arcStroke: 'stroke-amber-600',
      arcFill: 'fill-amber-100/50',
      textFill: 'fill-amber-700 font-semibold',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
    }
  }[colorScheme] || colors.blue;

  // If superposing, calculate animated intermediate points towards basePoints
  let renderPoints = points;
  if (isSuperposed && superposeProgress > 0) {
    renderPoints = points.map((p, idx) => {
      const target = basePoints[idx];
      return {
        x: p.x + (target.x - p.x) * superposeProgress,
        y: p.y + (target.y - p.y) * superposeProgress,
      };
    });
  }

  const renderCentroid = getCentroid(renderPoints[0], renderPoints[1], renderPoints[2]);

  // SVG path for the triangle polygon
  const trianglePath = `M ${renderPoints[0].x} ${renderPoints[0].y} L ${renderPoints[1].x} ${renderPoints[1].y} L ${renderPoints[2].x} ${renderPoints[2].y} Z`;

  return (
    <div className={`flex flex-col items-center bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden transition-all ${className}`}>
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${colors.badgeBg}`}>
            △{triangle.name}
          </span>
          {title && <span className="text-sm font-semibold text-slate-700">{title}</span>}
        </div>
        {rotation !== 0 && (
          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {rotation}° 회전됨
          </span>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[280/240] max-w-[280px]">
        <svg
          viewBox="0 0 280 240"
          className="w-full h-full select-none overflow-visible"
        >
          {/* Subtle grid background */}
          <defs>
            <pattern id={`grid-${triangle.name}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="280" height="240" fill={`url(#grid-${triangle.name})`} rx="12" />

          {/* Triangle Main Body */}
          <path
            d={trianglePath}
            className={`${colors.fill} ${colors.stroke} transition-all duration-300`}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Angle Markers */}
          {triangle.angles && triangle.angles.map((ang, idx) => {
            const vIdx = ang.vertex;
            const p1Idx = (vIdx + 1) % 3;
            const p2Idx = (vIdx + 2) % 3;

            const v = renderPoints[vIdx];
            const p1 = renderPoints[p1Idx];
            const p2 = renderPoints[p2Idx];

            const arcPath1 = getAngleArcPath(v, p1, p2, 26);
            const labelPos = getAngleLabelPos(v, p1, p2, 38);

            return (
              <g key={`angle-${idx}`}>
                {/* Arc 1 */}
                <path
                  d={arcPath1}
                  className={`${colors.arcFill} ${colors.arcStroke}`}
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Arc 2 if double arc */}
                {ang.marker === 'arc2' && (
                  <path
                    d={getAngleArcPath(v, p1, p2, 32)}
                    className={`${colors.arcStroke}`}
                    fill="none"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                )}

                {/* Dot marker */}
                {ang.marker === 'dot' && (
                  <circle
                    cx={labelPos.x}
                    cy={labelPos.y}
                    r="4"
                    className="fill-indigo-600"
                  />
                )}

                {/* Cross marker */}
                {ang.marker === 'cross' && (
                  <g className="stroke-indigo-600" strokeWidth="2">
                    <line x1={labelPos.x - 4} y1={labelPos.y - 4} x2={labelPos.x + 4} y2={labelPos.y + 4} />
                    <line x1={labelPos.x + 4} y1={labelPos.y - 4} x2={labelPos.x - 4} y2={labelPos.y + 4} />
                  </g>
                )}

                {/* Angle Degree Text */}
                {ang.text && (
                  <g>
                    <rect
                      x={labelPos.x - 14}
                      y={labelPos.y - 10}
                      width="28"
                      height="20"
                      rx="4"
                      fill="white"
                      fillOpacity="0.9"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y + 4}
                      textAnchor="middle"
                      className="text-[12px] font-bold fill-slate-800"
                    >
                      {ang.text}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Edge Markers (ticks & length labels) */}
          {triangle.edges && triangle.edges.map((edge, idx) => {
            const p1 = renderPoints[edge.from];
            const p2 = renderPoints[edge.to];
            const ticks = edge.ticks ? getEdgeTicks(p1, p2, edge.ticks, renderCentroid) : [];
            const labelPos = edge.text ? getEdgeLabelPos(p1, p2, renderCentroid, 18) : null;

            return (
              <g key={`edge-${idx}`}>
                {/* Tick marks */}
                {ticks.map((t, tIdx) => (
                  <line
                    key={tIdx}
                    x1={t.x1}
                    y1={t.y1}
                    x2={t.x2}
                    y2={t.y2}
                    className={colors.tickStroke}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                ))}

                {/* Length text badge */}
                {labelPos && edge.text && (
                  <g>
                    <rect
                      x={labelPos.x - 18}
                      y={labelPos.y - 11}
                      width="36"
                      height="22"
                      rx="5"
                      fill="white"
                      fillOpacity="0.95"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y + 4}
                      textAnchor="middle"
                      className="text-[12px] font-bold fill-indigo-900"
                    >
                      {edge.text}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Vertices & Vertex Labels */}
          {triangle.vertices.map((vDef, idx) => {
            const pt = renderPoints[idx];
            const labelPos = getVertexLabelPos(pt, renderCentroid, 20);

            return (
              <g key={`vertex-${idx}`}>
                {/* Vertex dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  className={`${colors.vertexFill} stroke-white`}
                  strokeWidth="2"
                />
                {/* Vertex Letter Label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y + 4}
                  textAnchor="middle"
                  className={`text-[15px] ${colors.vertexText}`}
                >
                  {vDef.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {subtitle && (
        <div className="mt-2 text-xs text-slate-500 text-center font-medium">
          {subtitle}
        </div>
      )}
    </div>
  );
}
