import { useEffect, useRef, useState } from "react";
import { useLights, useThree, useThreeGeometry } from "@/lib/hooks";
import * as THREE from "three";
import { Bed, Chair, Desk, Door, Laptop, Man, Sofa, Tv } from "@/assets/glbs";
import Piano_1 from "@/assets/songs/Piano_1.mp3";
import { OrbitControls } from "three-stdlib";

export const Home = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const controlsRef = useRef<OrbitControls>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const {
    scene,
    clock,
    createCamera,
    createRenderer,
    createOrbitControls,
    createModel,
  } = useThree();
  const { ambientLight, createSpotLight } = useLights();
  const { createPlane } = useThreeGeometry();

  useEffect(() => {
    if (!canvasRef.current) return;

    rendererRef.current = createRenderer(canvasRef.current);
    cameraRef.current = createCamera();
    controlsRef.current = createOrbitControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    controlsRef.current.enabled = false;
    const ceilingLight = createSpotLight();

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
        tv.model
      );

      scene.add(room);
    };

    let man: {
      model: THREE.Group;
      animations: THREE.AnimationClip[];
      mixer: THREE.AnimationMixer;
      update: (delta: number) => void;
    };

    const initMan = async () => {
      man = await createModel(Man);
      man.model.scale.set(0.5, 0.5, 0.5);
      man.model.rotation.y = Math.PI;
      man.model.position.set(0, 0, 5);

      const walkClip = man.animations.find(
        (clip) => clip.name === "HumanArmature|Man_Walk"
      );
      const walkAction = walkClip ? man.mixer.clipAction(walkClip) : null;

      window.addEventListener("keydown", (event) => {
        if (!cameraReady || !walkAction) return;

        // Evita reiniciar la animación si ya está corriendo
        if (!walkAction.isRunning()) {
          walkAction.reset().play();
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          man.model.position.z -= 0.1;
          man.model.rotation.y = Math.PI;
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          man.model.position.z += 0.1;
          man.model.rotation.y = 0;
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          man.model.position.x -= 0.1;
          man.model.rotation.y = -(Math.PI / 2);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          man.model.position.x += 0.1;
          man.model.rotation.y = Math.PI / 2;
        }
      });

      window.addEventListener("keyup", () => {
        if (!cameraReady || !walkAction) return;
        walkAction.stop();
      });

      scene.add(man.model);
    };

    initRoom();
    initMan();

    ceilingLight.position.set(0, 5, 5);
    scene.add(ambientLight, ceilingLight);

    let cameraReady = false;

    function animate() {
      if (!cameraRef.current || !controlsRef.current) return;

      controlsRef.current.update();
      const delta = clock.getDelta();

      //animacion inicial
      if (hasStarted && !cameraReady) {
        if (cameraRef.current.position.z > 12) {
          cameraRef.current.position.z -= 0.1;
        }
        if (cameraRef.current.position.y > 7) {
          cameraRef.current.position.y -= 0.1;
        }

        if (
          cameraRef.current.position.z <= 12 &&
          cameraRef.current.position.y <= 7
        ) {
          cameraReady = true;
          controlsRef.current.enabled = true;
        }
      } else {
        if (man) {
          man.update(delta);

          const targetCameraPos = new THREE.Vector3(
            man.model.position.x,
            man.model.position.y + 7,
            man.model.position.z + 7
          );

          cameraRef.current.position.lerp(targetCameraPos, 0.1); // 0.1 = suavidad
          cameraRef.current.lookAt(man.model.position);
        }
      }

      rendererRef.current?.render(scene, cameraRef.current);
    }

    rendererRef.current.setAnimationLoop(animate);

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      window.removeEventListener("keydown", () => {});
    };
  });

  const handleClick = () => {
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
          <span>Este sitio se encuentra en construccion</span>
          <button
            onClick={handleClick}
            className="border p-2 rounded-md border-gray-400 color-gray-400 cursor-pointer"
          >
            Iniciar
          </button>
        </div>
      )}
      <audio ref={audioRef} src={Piano_1} />
      <canvas ref={canvasRef} onClick={handleClick} />
    </>
  );
};
