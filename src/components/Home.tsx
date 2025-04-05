import { useEffect, useRef } from "react";
import { useThree, useAnimal, useLights } from "@/lib/hooks";
import { OrbitControls } from "three-stdlib";
import * as THREE from "three";

const ANIMAL_MODELS = [
  "Alpaca.glb",
  "Bull.glb",
  "Cow.glb",
  "Deer.glb",
  "Donkey.glb",
  "Fox.glb",
  "Horse.glb",
  "Husky.glb",
  "Shiba-Inu.glb",
  "Stag.glb",
  "White-Horse.glb",
  "Wolf.glb",
].map((model) => `/glb_models/${model}`);

export const Home = () => {
  const { createAnimal } = useAnimal();
  const { ambientLight, createDirLight } = useLights();
  const { scene, createRenderer, createCamera } = useThree();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number>(0);
  const playerRef = useRef<{
    model: THREE.Group;
    update: (delta: number) => void;
  }>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const handleResize = () => {
    if (!rendererRef.current || !cameraRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Actualizar renderizador
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Actualizar cámara
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
  };

  useEffect(() => {
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;

    const init = async () => {
      if (!canvasRef.current) return;

      renderer = createRenderer(canvasRef.current);
      rendererRef.current = renderer;

      const camera = createCamera();
      cameraRef.current = camera;

      handleResize();

      const player = await createAnimal(ANIMAL_MODELS[9]);
      playerRef.current = player;

      const dirLight = createDirLight(player.model);

      scene.add(player.model);
      scene.add(ambientLight);
      player.model.add(dirLight);
      player.model.add(camera);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 5, 0);
      controls.update();

      const animate = () => {
        const delta = clockRef.current.getDelta();

        // Actualizar animaciones del jugador si existe
        if (playerRef.current) {
          playerRef.current.update(delta);
        }

        controls.update();
        renderer.render(scene, camera);
        requestRef.current = requestAnimationFrame(animate);
      };

      window.addEventListener("resize", handleResize);

      requestRef.current = requestAnimationFrame(animate);
    };

    init();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      window.removeEventListener("resize", handleResize);

      renderer?.dispose();
      controls?.dispose();

      while (scene.children.length > 0) {
        const child = scene.children[0];
        if (child instanceof THREE.Group) {
          child.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              obj.geometry?.dispose();
              if (Array.isArray(obj.material)) {
                obj.material.forEach((m) => m.dispose());
              } else {
                obj.material?.dispose();
              }
            }
          });
        }
        scene.remove(child);
      }
    };
  }, [
    createCamera,
    createRenderer,
    createAnimal,
    createDirLight,
    scene,
    ambientLight,
  ]);

  return <canvas ref={canvasRef} />;
};
