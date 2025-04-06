import { useRef } from "react";

export const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return <canvas ref={canvasRef} />;
};
