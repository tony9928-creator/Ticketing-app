"use client";

import { QRCodeSVG } from "qrcode.react";

/** Dibuja el código del ticket como imagen QR (en SVG, se ve nítido en cualquier pantalla). */
export function TicketQR({ value, apagado = false }: { value: string; apagado?: boolean }) {
  return (
    <div className={`rounded-2xl bg-white p-4 ${apagado ? "opacity-30 grayscale" : ""}`}>
      <QRCodeSVG value={value} size={220} level="M" marginSize={0} className="h-auto w-full" />
    </div>
  );
}
