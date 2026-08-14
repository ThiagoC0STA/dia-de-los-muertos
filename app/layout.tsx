import type { Metadata } from "next";
import { Felipa, Epunda_Slab } from "next/font/google";
import "./globals.css";

const felipa = Felipa({
  variable: "--font-felipa",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const epundaSlab = Epunda_Slab({
  variable: "--font-epunda",
  weight: "600",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dia De Los Muertos | 10 de Outubro",
  description:
    "Cadastre-se para a pré-venda e garanta seu ingresso antecipado com condição promocional.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${felipa.variable} ${epundaSlab.variable}`}>
      <body>{children}</body>
    </html>
  );
}
