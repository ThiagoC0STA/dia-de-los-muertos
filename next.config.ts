import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // tira a bolinha preta do canto durante o dev, que atrapalha conferir o layout
  devIndicators: false,
};

export default nextConfig;
