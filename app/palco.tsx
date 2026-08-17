import Form from "./form";
import palco from "./palco.json";

const { W, H, pecas, confete } = palco;
// versão dos arquivos em /rc: sobe quando uma peça muda, senão o navegador reaproveita a antiga
const V = "?v=3";

// bloco central: das velas (esq/dir) e do topo do logo à base do botão, colado no meio da tela
const MIOLO = { x: 690, y: 30, w: 540, h: 905 };

/** valor do design em rem (1rem = 100px do Figma) */
const r = (v: number) => `${(v / 100).toFixed(4)}rem`;
/** posição do design em fração da viewport */
const pc = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

type Peca = { x: number; y: number; w: number; h: number };

/**
 * Ancora a peça no canto mais próximo dela: assim canto e lateral acompanham a
 * borda da tela em vez de flutuar junto de um quadro de proporção fixa.
 */
function ancorar({ x, y, w, h }: Peca): React.CSSProperties {
  const horizontal =
    x + w / 2 < W / 2 ? { left: pc(x, W) } : { right: pc(W - (x + w), W) };
  const vertical =
    y + h / 2 < H / 2 ? { top: pc(y, H) } : { bottom: pc(H - (y + h), H) };
  return { ...horizontal, ...vertical, width: r(w), height: r(h) };
}

/**
 * Espalha o enfeite pela faixa livre ao lado do miolo: fx 0 encosta na borda da
 * tela, fx 1 encosta no miolo. Assim ele nunca cai sobre o formulário.
 */
function faixa(lado: string, fx: number): React.CSSProperties {
  const livre = `((100vw - ${MIOLO.w / 100}rem) / 2)`;
  if (lado === "esq") return { left: `calc(${livre} * ${fx})` };
  if (lado === "dir") return { right: `calc(${livre} * ${fx})` };
  return { left: `calc(${livre} + ${((MIOLO.w * fx) / 100).toFixed(4)}rem)` };
}

/** dentro do miolo as posições continuam fixas, como no Figma */
function noMiolo({ x, y, w, h }: Peca): React.CSSProperties {
  return {
    left: r(x - MIOLO.x),
    top: r(y - MIOLO.y),
    width: r(w),
    height: r(h),
  };
}

const BORDAS = [
  "canto-te",
  "canto-td",
  "canto-be",
  "canto-bd",
  "dj-e",
  "dj-d",
  "lat-e",
  "lat-d",
];
// textos são vetores do Figma; a classe extra encaixa cada um na cascata de entrada
const CENTRO: Array<[string, string, string]> = [
  ["logo", "", ""],
  ["txt-data", "t-data", "10 de Outubro"],
  ["txt-titulo", "t-titulo", "Dia De Los Muertos"],
  ["caveira", "", ""],
  ["vela-e", "", ""],
  ["vela-d", "", ""],
  ["txt-cadastre", "t-prevenda", "Cadastre-se para pré-venda"],
];
const todas = pecas as Record<string, Peca>;

export default function Palco() {
  return (
    <div className="palco">
      {BORDAS.filter((nome) => nome in todas).map((nome) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={nome}
          className={`peca p-${nome}`}
          src={`/rc/${nome}.svg${V}`}
          style={ancorar(todas[nome])}
          alt=""
          aria-hidden="true"
        />
      ))}

      {confete.map((c, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          className={c.grande ? "confete graudo" : "confete"}
          src={`/rc/c-${c.f}.svg${V}`}
          style={{
            ...faixa(c.lado, c.fx),
            top: `${c.y}%`,
            width: r(c.w),
            height: r(c.h),
            animationDuration: `${(2.9 + ((i * 37) % 17) / 10).toFixed(1)}s`,
            animationDelay: `-${(((i * 61) % 53) / 10).toFixed(1)}s`,
          }}
          alt=""
          aria-hidden="true"
        />
      ))}

      <div className="miolo" style={{ width: r(MIOLO.w), height: r(MIOLO.h) }}>
        <h1 className="sr-only">Dia De Los Muertos, 10 de outubro. Cadastre-se para a pré-venda</h1>
        {CENTRO.filter(([nome]) => nome in todas).map(([nome, extra, alt]) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={nome}
            className={`peca p-${nome}${extra ? ` ${extra}` : ""}`}
            src={`/rc/${nome}.svg${V}`}
            style={noMiolo(todas[nome])}
            alt={alt}
            aria-hidden={alt ? undefined : true}
          />
        ))}
        <Form />
      </div>
    </div>
  );
}
