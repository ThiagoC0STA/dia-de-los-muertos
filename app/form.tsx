"use client";

import { useState } from "react";

type Status = "idle" | "enviando" | "ok" | "erro";

const ROTULO: Record<Status, string> = {
  idle: "Enviar",
  enviando: "Enviando",
  ok: "Enviado",
  erro: "Enviar",
};

export default function Form() {
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState("");

  async function enviar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formulario = event.currentTarget;
    const dados = new FormData(formulario);
    setStatus("enviando");
    setErro("");

    try {
      const resposta = await fetch("/api/inscrever", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: dados.get("nome"),
          whatsapp: dados.get("whatsapp"),
        }),
      });

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => ({}));
        throw new Error(corpo.error ?? "Não foi possível enviar");
      }

      formulario.reset();
      setStatus("ok");
    } catch (error: unknown) {
      setErro(
        error instanceof Error ? error.message : "Não foi possível enviar",
      );
      setStatus("erro");
    }
  }

  return (
    <form className="form" onSubmit={enviar}>
      <input
        name="nome"
        placeholder="Nome completo"
        aria-label="Nome completo"
        autoComplete="name"
        required
        maxLength={120}
      />
      <input
        name="whatsapp"
        placeholder="WhatsApp"
        aria-label="WhatsApp"
        autoComplete="tel"
        inputMode="tel"
        required
        maxLength={20}
      />
      <button type="submit" disabled={status === "enviando"}>
        {ROTULO[status]}
      </button>
      {status === "ok" && <p className="msg">Cadastro confirmado</p>}
      {status === "erro" && (
        <p className="msg" role="alert">
          {erro}
        </p>
      )}
    </form>
  );
}
