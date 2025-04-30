/// <reference types="vite/client" />

declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.gltf" {
  const src: string;
  export default src;
}

declare module "three/examples/jsm/utils/SkeletonUtils" {
  import * as THREE from "three";
  export function clone(source: THREE.Object3D): THREE.Object3D;
}

declare module "three/examples/jsm/loaders/GLTFLoader" {
  import * as THREE from "three";

  export class GLTFLoader extends THREE.Loader {
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }

  export interface GLTF {
    scene: THREE.Group;
    scenes: THREE.Group[];
    cameras: THREE.Camera[];
    animations: THREE.AnimationClip[];
    asset: Record<string, any>;
    parser: any;
    userData: Record<string, any>;
  }
}
