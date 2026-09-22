"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";

export default function QRCode({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function descargar() {
    const canvas = ref.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "codigo-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={ref} className="p-4 bg-white border rounded-xl">
        <QRCodeCanvas value={url} size={220} level="H" includeMargin />
      </div>
      <p className="text-xs text-gray-500 break-all text-center">{url}</p>
      <button
        onClick={descargar}
        className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium"
      >
        Descargar QR para imprimir
      </button>
    </div>
  );
}
