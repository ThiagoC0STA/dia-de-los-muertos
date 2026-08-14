import Form from "./form";
import Musica from "./musica";
import Palco from "./palco";

export default function Home() {
  return (
    <>
      <Musica />
      <div className="noise" aria-hidden="true" />

      {/* Landing Page Web - Figma 4187:5543 (1920x971), recomposto por âncora */}
      <Palco />

      {/* Landing Page Mobile - Figma 4187:5749 (1080x2347) */}
      <div className="frame mob">
        <object
          className="bg"
          data="/bg-mobile.svg?v=15"
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
