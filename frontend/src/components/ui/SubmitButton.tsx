"use client";

import { useFormStatus } from "react-dom";

const VARIANTES = {
  primary: "bg-accent text-white hover:bg-accent-strong",
  dark: "bg-ink text-paper hover:bg-ink/85",
  ghost: "border border-line bg-card text-ink hover:bg-line/40",
} as const;

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Texto mientras el formulario se está enviando. */
  pendingText?: string;
  variant?: keyof typeof VARIANTES;
}

/**
 * Botón de envío que se desactiva solo mientras el formulario se procesa.
 * useFormStatus lee el estado del <form> que lo contiene (por eso es un componente aparte).
 */
export function SubmitButton({ children, pendingText, variant = "primary", className = "", disabled, ...rest }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTES[variant]} ${className}`}
      {...rest}
    >
      {pending && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      )}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
