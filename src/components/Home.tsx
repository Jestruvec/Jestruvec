import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useLights, useThree, useMesh, useMeshAnimations } from "@/lib/hooks";
import Piano_1 from "@/assets/songs/Piano_1.mp3";
import { OrbitControls } from "three-stdlib";
import { AnimatedModel } from "@/lib/types/AnimatedModel";
import {
  Bed,
  Chair,
  Desk,
  Door,
  Laptop,
  Man,
  Sofa,
  Tv,
  Husky,
  Dog_Bed,
} from "@/assets/glbs";

export const Home = () => {
  const { getAnimationAction, startAnimation, stopAnimation } =
    useMeshAnimations();
  const { ambientLight, createSpotLight } = useLights();
  const { createPlane, createModel } = useMesh();
  const { scene, clock, createCamera, createRenderer, createOrbitControls } =
    useThree();

  const [hasStarted, setHasStarted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const controlsRef = useRef<OrbitControls>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const ceilingLightRef = useRef<THREE.SpotLight>(null);
  const manRef = useRef<AnimatedModel>(null);
  const huskyRef = useRef<AnimatedModel>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let cameraReady = false;
    rendererRef.current = createRenderer(canvasRef.current);
    cameraRef.current = createCamera();
    controlsRef.current = createOrbitControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    controlsRef.current.enabled = false;
    ceilingLightRef.current = createSpotLight();
    ceilingLightRef.current.position.set(0, 5, 5);
    scene.add(ambientLight, ceilingLightRef.current);

    const animate = () => {
      if (!cameraRef.current || !controlsRef.current) return;

      controlsRef.current.update();
      const delta = clock.getDelta();

      //animacion inicial
      if (hasStarted && !cameraReady) {
        if (cameraRef.current.position.z > 12) {
          cameraRef.current.position.z -= 0.05;
        }
        if (cameraRef.current.position.y > 7) {
          cameraRef.current.position.y -= 0.05;
        }

        if (
          cameraRef.current.position.z <= 12 &&
          cameraRef.current.position.y <= 7
        ) {
          cameraReady = true;
          controlsRef.current.enabled = true;
        }
      } else if (cameraReady) {
        if (huskyRef.current) {
          huskyRef.current.update(delta);
        }
        if (manRef.current) {
          manRef.current.update(delta);

          const targetCameraPos = new THREE.Vector3(
            manRef.current.model.position.x,
            manRef.current.model.position.y + 7,
            manRef.current.model.position.z + 7
          );

          cameraRef.current.position.lerp(targetCameraPos, 0.1); // 0.1 = suavidad
          // cameraRef.current.lookAt(manRef.current.model.position);
        }
      }

      rendererRef.current?.render(scene, cameraRef.current);
    };

    const initRoom = async () => {
      const room = new THREE.Group();

      const floorMaterial = new THREE.MeshLambertMaterial({
        color: "gray",
        flatShading: true,
      });

      const floor = createPlane(10, 10, 1, 1, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.z = 4;

      const frontWall = createPlane(10, 10, 1, 1);
      frontWall.position.set(0, 5, -1);

      const leftWall = createPlane(10, 10, 1, 1);
      leftWall.rotation.y = Math.PI / 2;
      leftWall.position.set(-5, 5, 4);

      const rightWall = createPlane(10, 10, 1, 1);
      rightWall.rotation.y = -Math.PI / 2;
      rightWall.position.set(5, 5, 4);

      const desk = await createModel(Desk);
      desk.model.scale.set(1.25, 1.25, 1.25);
      desk.model.rotation.y = -(Math.PI / 2);

      const laptop = await createModel(Laptop);
      laptop.model.scale.set(0.2, 0.2, 0.2);
      laptop.model.position.y = 1.2;

      const sofa = await createModel(Sofa);
      sofa.model.rotation.y = Math.PI / 2;
      sofa.model.position.set(-4.25, 0, 1);

      const door = await createModel(Door);
      door.model.position.set(4, 0, -0.85);

      const chair = await createModel(Chair);
      chair.model.scale.set(1.25, 1.25, 1.25);
      chair.model.position.set(0, 0.45, 1);
      chair.model.rotation.y = Math.PI;

      const bed = await createModel(Bed);
      bed.model.scale.set(0.3, 0.3, 0.3);
      bed.model.position.set(-3.3, 0.5, 5);
      bed.model.rotation.y = Math.PI / 2;

      const tv = await createModel(Tv);
      tv.model.scale.set(0.75, 0.75, 0.75);
      tv.model.position.set(4.85, 2.5, 5);
      tv.model.rotation.y = -Math.PI / 2;

      const dogBed = await createModel(Dog_Bed);
      dogBed.model.position.set(2.25, 0, 0);
      dogBed.model.rotation.y = -Math.PI / 2;

      room.add(
        frontWall,
        leftWall,
        rightWall,
        floor,
        door.model,
        desk.model,
        laptop.model,
        sofa.model,
        chair.model,
        bed.model,
        tv.model,
        dogBed.model
      );

      scene.add(room);
    };

    const initHusky = async () => {
      huskyRef.current = await createModel(Husky);
      huskyRef.current.model.rotation.y = Math.PI / 2;
      huskyRef.current.model.scale.set(0.3, 0.3, 0.3);
      huskyRef.current.model.position.set(4, 0, 3);

      const eatAction = getAnimationAction(huskyRef.current, "Eating");
      startAnimation(eatAction);

      scene.add(huskyRef.current.model);
    };

    const initMan = async () => {
      manRef.current = await createModel(Man);
      manRef.current.model.scale.set(0.5, 0.5, 0.5);
      manRef.current.model.rotation.y = Math.PI;
      manRef.current.model.position.set(0, 0, 5);

      scene.add(manRef.current.model);
    };

    const validateMovement = (eventKey: string) => {
      if (!manRef.current) return false;

      let isValid = true;

      const { x, z } = manRef.current.model.position;

      switch (eventKey) {
        case "ArrowUp":
          if (z - 0.1 < 0) {
            isValid = false;
          }
          break;
        case "ArrowDown":
          if (z + 0.1 > 8.5) {
            isValid = false;
          }
          break;
        case "ArrowLeft":
          if (x - 0.1 < -4.5) {
            isValid = false;
          }
          break;
        case "ArrowRight":
          if (x + 0.1 > 4.5) {
            isValid = false;
          }
          break;
        default:
          break;
      }

      return isValid;
    };

    const handleManMovement = (event: KeyboardEvent) => {
      const movementIsValid = validateMovement(event.key);

      if (!cameraReady || !manRef.current || !movementIsValid) {
        return;
      }

      const walkAction = getAnimationAction(
        manRef.current,
        "HumanArmature|Man_Walk"
      );

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          manRef.current.model.position.z -= 0.1;
          manRef.current.model.rotation.y = Math.PI;
          if (walkAction) {
            startAnimation(walkAction);
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          manRef.current.model.position.z += 0.1;
          manRef.current.model.rotation.y = 0;
          if (walkAction) {
            startAnimation(walkAction);
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          manRef.current.model.position.x -= 0.1;
          manRef.current.model.rotation.y = -(Math.PI / 2);
          if (walkAction) {
            startAnimation(walkAction);
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          manRef.current.model.position.x += 0.1;
          manRef.current.model.rotation.y = Math.PI / 2;
          if (walkAction) {
            startAnimation(walkAction);
          }
          break;
        default:
          break;
      }
    };

    const handleStopManMovement = () => {
      if (!manRef.current) return;

      const walkAction = getAnimationAction(
        manRef.current,
        "HumanArmature|Man_Walk"
      );

      if (walkAction) {
        stopAnimation(walkAction);
      }
    };

    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };

    initRoom();
    initMan();
    initHusky();

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleManMovement);
    window.addEventListener("keyup", handleStopManMovement);

    rendererRef.current.setAnimationLoop(animate);

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      window.removeEventListener("keydown", () => handleManMovement);
      window.removeEventListener("keyup", () => handleStopManMovement);
      window.removeEventListener("resize", handleResize);
    };
  });

  const play = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => console.log("Audio iniciado"))
        .catch((error) => console.error("Error al reproducir:", error));
    }
  };

  return (
    <>
      {!hasStarted && (
        <div className="fixed top-0 left-0 h-full w-full bg-white opacity-50 flex items-center justify-center flex-col gap-4">
          <span className="font-bold">This site is under construction</span>
          <button
            onClick={play}
            className="border font-bold p-2 rounded-md border-gray-400 color-gray-400 cursor-pointer"
          >
            play
          </button>
        </div>
      )}
      <audio ref={audioRef} src={Piano_1} />
      <canvas ref={canvasRef} />
    </>
  );
};
