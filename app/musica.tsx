"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO = "CEi5COj_QyA";
const INICIO = 28;

export default function Musica() {
  const player = useRef<HTMLIFrameElement>(null);
  const auto = useRef(true);
  const [mudo, setMudo] = useState(false);

  function tocar(silenciar: boolean) {
    for (const func of ["playVideo", silenciar ? "mute" : "unMute"]) {
      player.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args: [] }),
        "https://www.youtube.com",
      );
    }
    setMudo(silenciar);
  }

  // navegador só libera áudio depois de um gesto: o primeiro toque na página liga o som
  useEffect(() => {
    function ligar(evento: PointerEvent) {
      const alvo = evento.target as HTMLElement;
      if (!auto.current || alvo.closest(".som")) return;
      auto.current = false;
      tocar(false);
    }

    document.addEventListener("pointerdown", ligar);
    return () => document.removeEventListener("pointerdown", ligar);
  }, []);

  function alternar() {
    auto.current = false;
    tocar(!mudo);
  }

  return (
    <>
      <iframe
        ref={player}
        className="player"
        title="Música de fundo"
        aria-hidden="true"
        tabIndex={-1}
        allow="autoplay"
        onLoad={() => tocar(false)}
        src={`https://www.youtube.com/embed/${VIDEO}?autoplay=1&mute=1&controls=0&loop=1&playlist=${VIDEO}&start=${INICIO}&enablejsapi=1&playsinline=1`}
      />
      <button
        type="button"
        className="som slab"
        onClick={alternar}
        aria-label={mudo ? "Ligar som" : "Desligar som"}
      >
        {mudo ? "♪ off" : "♪ on"}
      </button>
    </>
  );
}
