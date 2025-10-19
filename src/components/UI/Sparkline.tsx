import { createMemo } from 'solid-js';
import type { JSX } from 'solid-js';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
  class?: string;
}

function Sparkline(props: SparklineProps): JSX.Element {
  const width = () => props.width || 100;
  const height = () => props.height || 30;
  const color = () => props.color || '#007AFF';
  const strokeWidth = () => props.strokeWidth || 2;
  
  const pathData = createMemo(() => {
    const data = props.data;
    if (!data || data.length === 0) return '';
    
    const w = width();
    const h = height();
    const padding = 2;
    
    // Find min and max for scaling
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    // Calculate points
    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (w - 2 * padding);
      const y = h - padding - ((value - min) / range) * (h - 2 * padding);
      return { x, y };
    });
    
    // Create path
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // Use smooth curves (quadratic Bezier)
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const current = points[i];
      const midX = (prev.x + current.x) / 2;
      
      path += ` Q ${prev.x} ${prev.y}, ${midX} ${(prev.y + current.y) / 2}`;
      
      if (i === points.length - 1) {
        path += ` Q ${current.x} ${current.y}, ${current.x} ${current.y}`;
      }
    }
    
    return path;
  });
  
  const fillPath = createMemo(() => {
    if (!props.fill) return '';
    const path = pathData();
    if (!path) return '';
    
    const w = width();
    const h = height();
    
    return `${path} L ${w} ${h} L 0 ${h} Z`;
  });

  return (
    <svg
      width={width()}
      height={height()}
      class={props.class}
      style={{
        display: 'block'
      }}
    >
      {props.fill && (
        <path
          d={fillPath()}
          fill={color()}
          fill-opacity="0.2"
          stroke="none"
        />
      )}
      <path
        d={pathData()}
        fill="none"
        stroke={color()}
        stroke-width={strokeWidth()}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default Sparkline;

