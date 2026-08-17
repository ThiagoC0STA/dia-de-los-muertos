import Musica from "./musica";
import Palco from "./palco";
import PalcoMob from "./palco-mob";

export default function Home() {
  return (
    <>
      <Musica />
      <div className="noise" aria-hidden="true" />

      {/* Landing Page Web - Figma 4187:5543 (1920x971), recomposto por âncora */}
      <Palco />

      {/* Landing Page Mobile - Figma 4187:5749 (1080x2347), recomposto por âncora */}
      <PalcoMob />
    </>
  );
}
