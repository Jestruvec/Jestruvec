import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";

export const useThreeGeometry = () => {
  const defaultMaterial = new THREE.MeshLambertMaterial({
    color: "white",
    flatShading: true,
  });

  const createBox = (
    x: number,
    y: number,
    z: number,
    material: THREE.MeshLambertMaterial = defaultMaterial
  ) => {
    return new THREE.Mesh(new THREE.BoxGeometry(x, y, z), material);
  };

  const createRoundedBox = (
    x: number,
    y: number,
    z: number,
    segments: number,
    radius: number,
    material: THREE.MeshLambertMaterial
  ) => {
    const geometry = new RoundedBoxGeometry(x, y, z, segments, radius);
    return new THREE.Mesh(geometry, material);
  };

  const createCilinder = (
    radioTop: number,
    radioBottom: number,
    height: number,
    radialSegments: number,
    material: THREE.MeshLambertMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.CylinderGeometry(radioTop, radioBottom, height, radialSegments),
      material
    );
  };

  const createSphere = (
    radius: number,
    widthSegments: number,
    heightSegments: number,
    material: THREE.MeshLambertMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, widthSegments, heightSegments),
      material
    );
  };

  const createPlane = (
    width: number,
    height: number,
    widthSegments: number,
    heightSegments: number,
    material: THREE.MeshLambertMaterial = defaultMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(width, height, widthSegments, heightSegments),
      material
    );
  };

  const createTorus = (
    radius: number,
    tube: number,
    radialSegments: number,
    tubularSegments: number,
    material: THREE.MeshLambertMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments),
      material
    );
  };

  const createRing = (
    innerRadius: number,
    outerRadius: number,
    thetaSegments: number,
    material: THREE.MeshLambertMaterial
  ) => {
    return new THREE.Mesh(
      new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments),
      material
    );
  };

  return {
    createBox,
    createRoundedBox,
    createCilinder,
    createSphere,
    createPlane,
    createTorus,
    createRing,
  };
};
