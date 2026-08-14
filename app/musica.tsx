"use client";

import { useEffect, useRef, useState } from "react";

const INICIO = 28;

export default function Musica() {
  const player = useRef<HTMLAudioElement>(null);
  const auto = useRef(true);
  const [mudo, setMudo] = useState(false);

  function tocar(silenciar: boolean) {
    setMudo(silenciar);
    const audio = player.current;
    if (!audio) return;

    audio.muted = silenciar;
    if (!audio.paused) return;

    // rede de segurança: se o #t= não pegou, posiciona antes de soltar o som
    if (audio.currentTime < INICIO) audio.currentTime = INICIO;
    // navegador só libera áudio depois de um gesto: antes disso o play é recusado
    audio.play().catch(() => {});
  }

  // primeiro toque em qualquer lugar da página libera o som
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
    // se ainda não tocou nada, este clique é o gesto que libera o áudio
    tocar(player.current?.paused ? false : !mudo);
  }

  return (
    <>
      <audio
        ref={player}
        // #t= é fragmento de mídia: o próprio browser já carrega posicionado,
        // sem depender do React ter hidratado a tempo de ouvir o loadedmetadata
        src={`/song.mp3#t=${INICIO}`}
        preload="auto"
        onEnded={(evento) => {
          evento.currentTarget.currentTime = INICIO;
          evento.currentTarget.play().catch(() => {});
        }}
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
