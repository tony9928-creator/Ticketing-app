/** Isotipo: una entrada con su troquel. SVG en línea para no depender de archivos. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M4 9a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v3.2a3.8 3.8 0 0 0 0 7.6V23a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-3.2a3.8 3.8 0 0 0 0-7.6Z"
        fill="var(--color-accent)"
      />
      <path d="M20 8.5v15" stroke="var(--color-paper)" strokeWidth="1.6" strokeDasharray="2 2.2" />
      <path d="m10.2 13.2 1.1 2.2 2.4.35-1.75 1.7.42 2.4-2.17-1.14-2.16 1.14.41-2.4-1.75-1.7 2.42-.35Z" fill="var(--color-paper)" />
    </svg>
  );
}
