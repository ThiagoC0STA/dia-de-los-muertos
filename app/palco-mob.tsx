import Form from "./form";
import mob from "./palco-mob.json";

const { cantos, bandas } = mob;

/** valor do design em rem (1rem = 100px do Figma mobile) */
const r = (v: number) => `${(v / 100).toFixed(4)}rem`;

type Peca = { nome: string; x: number; y: number; w: number; h: number; classe: string };

function Pecas({ pecas }: { pecas: Peca[] }) {
  return (
    <>
      {pecas.map((p, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={p.nome}
          className={p.classe}
          src={`/rc/${p.nome}.svg`}
          style={{
            left: r(p.x),
            top: r(p.y),
            width: r(p.w),
            height: r(p.h),
            ...(p.classe === "confete"
              ? {
                  animationDuration: `${(2.9 + ((i * 37) % 17) / 10).toFixed(1)}s`,
                  animationDelay: `-${(((i * 61) % 53) / 10).toFixed(1)}s`,
                }
              : {}),
          }}
          alt=""
          aria-hidden="true"
        />
      ))}
    </>
  );
}

/**
 * Mobile recomposto: os 4 cantos grudam nos cantos da tela e o conteúdo vive
 * numa coluna de bandas. Os vãos entre bandas são flexíveis (proporcionais ao
 * Figma), então a página cabe inteira em qualquer altura de celular sem rolar.
 */
export default function PalcoMob() {
  return (
    <div className="pm mob">
      <div className="pm-in">
        {(["te", "td", "be", "bd"] as const).map((k) => {
          const c = cantos[k];
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={k}
              className={`canto canto-${k}`}
              src={`/rc/m-canto-${k}.svg`}
              style={{ width: r(c.w), height: r(c.h) }}
              alt=""
              aria-hidden="true"
            />
          );
        })}

        <div className="col">
          {bandas.map((b, i) => (
            <div key={b.nome} className="grupo" style={{ display: "contents" }}>
              <div className={`banda b-${b.nome}`} style={{ height: r(b.h) }}>
                <Pecas pecas={b.pecas as Peca[]} />
                {b.nome === "textos" && (
                  <>
                    <h1 className="t t-data script">Dia 1O de Out</h1>
                    <p className="t t-titulo script">Dia De Los Muertos</p>
                  </>
                )}
                {b.nome === "prevenda" && <p className="t t-prevenda script">Pré-venda</p>}
                {b.nome === "form" && <Form />}
                {b.nome === "chamada" && (
                  <p className="t t-chamada slab">
                    Cadastre-se para pré-venda e{"\n"}
                    garanta seu ingresso antecipado{"\n"}
                    com condição promocional
                  </p>
                )}
              </div>
              {i < bandas.length - 1 && (
                <div className="vao" style={{ flexGrow: b.vao ?? 0 }} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
