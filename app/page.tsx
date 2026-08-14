import Form from "./form";
import Musica from "./musica";

export default function Home() {
  return (
    <>
      <Musica />

      {/* Landing Page Web - Figma 4187:5543 (1920x971) */}
      <div className="frame web">
        {/* object e não img: o Chrome só roda as animações do SVG se ele for um documento */}
        <object className="bg" data="/bg-web.svg" type="image/svg+xml" aria-hidden="true" />
        <h1 className="t t-data script">Dia 1O de Out</h1>
        <p className="t t-titulo script">Dia De Los Muertos</p>
        <p className="t t-prevenda script">Pré-venda</p>
        <Form />
        <div className="noise" aria-hidden="true" />
      </div>

      {/* Landing Page Mobile - Figma 4187:5749 (1080x2347) */}
      <div className="frame mob">
        <object
          className="bg"
          data="/bg-mobile.svg"
          type="image/svg+xml"
          aria-hidden="true"
        />
        <h1 className="t t-data script">Dia 1O de Out</h1>
        <p className="t t-titulo script">Dia De Los Muertos</p>
        <p className="t t-prevenda script">Pré-venda</p>
        <Form />
        <p className="t t-chamada slab">
          Cadastre-se para pré-venda e{"\n"}
          garanta seu ingresso antecipado{"\n"}
          com condição promocional
        </p>
      </div>
    </>
  );
}
