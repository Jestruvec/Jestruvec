import { useEffect, useRef } from "react";
import { useLights, useThree, useThreeGeometry } from "@/lib/hooks";
import * as THREE from "three";

export const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    const renderer = createRenderer(canvasRef.current);
    const camera = createCamera();
    const controls = createOrbitControls(camera, renderer.domElement);
    const ceilingLight = createSpotLight();
    scene.add(ceilingLight);

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

      const desk = await createModel("/glbs/Desk.glb");
      desk.model.scale.set(1.25, 1.25, 1.25);
      desk.model.rotation.y = -(Math.PI / 2);

      const laptop = await createModel("/glbs/Laptop.glb");
      laptop.model.scale.set(0.2, 0.2, 0.2);
      laptop.model.position.y = 1.2;

      const sofa = await createModel("/glbs/Sofa.glb");
      sofa.model.rotation.y = Math.PI / 2;
      sofa.model.position.set(-4.25, 0, 1);

      const door = await createModel("/glbs/Door.glb");
      door.model.position.set(4, 0, -0.85);

      const chair = await createModel("/glbs/Chair.glb");
      chair.model.scale.set(1.25, 1.25, 1.25);
      chair.model.position.set(0, 0.45, 1);
      chair.model.rotation.y = Math.PI;

      const bed = await createModel("/glbs/Bed.glb");
      bed.model.scale.set(0.3, 0.3, 0.3);
      bed.model.position.set(-3.3, 0.5, 5);
      bed.model.rotation.y = Math.PI / 2;

      const tv = await createModel("/glbs/Tv.glb");
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
      man = await createModel("/glbs/Man.glb");
      man.model.scale.set(0.5, 0.5, 0.5);
      man.model.rotation.y = Math.PI;
      man.model.position.set(0, 0, 5);
      man.model.add(camera);

      scene.add(man.model);
    };

    initRoom();
    initMan();

    scene.add(ambientLight);

    function animate() {
      controls.update();
      const delta = clock.getDelta();

      if (man) {
        man.mixer.update(delta);
      }

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    return () => {
      if (renderer) {
        renderer.dispose();
      }
    };
  });

  return <canvas ref={canvasRef} />;
};
