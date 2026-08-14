const LIMITE_POR_JANELA = 5;
const JANELA_MS = 60_000;

// ponytail: rate limit em memória, por instância. Trocar por KV/Upstash se escalar.
const acessos = new Map<string, number[]>();

function excedeuLimite(ip: string): boolean {
  const agora = Date.now();
  const recentes = (acessos.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  recentes.push(agora);
  acessos.set(ip, recentes);
  return recentes.length > LIMITE_POR_JANELA;
}

function erro(mensagem: string, status: number): Response {
  return Response.json({ error: mensagem }, { status });
}

export async function POST(request: Request): Promise<Response> {
  const webhook = process.env.SHEET_WEBHOOK_URL;
  if (!webhook) {
    return erro("Cadastro indisponível no momento", 503);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (excedeuLimite(ip)) {
    return erro("Muitas tentativas, aguarde um minuto", 429);
  }

  const corpo = await request.json().catch(() => null);
  const nome = String(corpo?.nome ?? "")
    .trim()
    .slice(0, 120);
  const whatsapp = String(corpo?.whatsapp ?? "")
    .trim()
    .slice(0, 20);
  const digitos = whatsapp.replace(/\D/g, "");

  if (nome.length < 2) {
    return erro("Informe seu nome completo", 400);
  }
  if (digitos.length < 10 || digitos.length > 13) {
    return erro("Informe um WhatsApp válido com DDD", 400);
  }

  try {
    const resposta = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: new Date().toISOString(),
        nome,
        whatsapp,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!resposta.ok) {
      return erro("Não foi possível registrar, tente de novo", 502);
    }
  } catch {
    return erro("Não foi possível registrar, tente de novo", 502);
  }

  return Response.json({ ok: true });
}
