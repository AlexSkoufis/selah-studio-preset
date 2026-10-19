/** An anchor the flow line passes through. `x` is 0..1 across the page width. */
export default function Knot({ x, className = '' }: { x: number; className?: string }) {
  return <span className={`knot ${className}`} data-knot-x={x} aria-hidden="true" />;
}
