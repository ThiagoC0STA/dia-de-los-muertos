"use client";

import { useState } from "react";

type Status = "idle" | "enviando" | "ok" | "erro";

const ROTULO: Record<Status, string> = {
  idle: "Enviar",
  enviando: "Enviando",
  ok: "Enviado",
  erro: "Enviar",
};

function mascaraData(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function mascaraWhatsapp(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function Form() {
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nascimento, setNascimento] = useState("");

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
          nascimento: dados.get("nascimento"),
        }),
      });

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => ({}));
        throw new Error(corpo.error ?? "Não foi possível enviar");
      }

      formulario.reset();
      setWhatsapp("");
      setNascimento("");
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
        inputMode="numeric"
        required
        minLength={14}
        maxLength={16}
        value={whatsapp}
        onChange={(e) => setWhatsapp(mascaraWhatsapp(e.target.value))}
      />
      <input
        name="nascimento"
        placeholder="Data de nascimento"
        aria-label="Data de nascimento (dia/mês/ano)"
        autoComplete="bday"
        inputMode="numeric"
        required
        minLength={10}
        maxLength={10}
        value={nascimento}
        onChange={(e) => setNascimento(mascaraData(e.target.value))}
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
