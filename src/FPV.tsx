import { useEffect, useMemo } from "react";
import {
  SceneLoader,
  Vector3,
  GlowLayer,
  UniversalCamera,
} from "@babylonjs/core";
import { useEngine, useScene } from "react-babylonjs";
import "@babylonjs/loaders";

import { initializeInput, CustomLoadingScreen } from "./utils";

function FPV(): React.ReactElement | null {
  const scene = useScene()!;
  const engine = useEngine()!;

  const loadingScreen = new CustomLoadingScreen("loadStart", scene);
  engine.loadingScreen = loadingScreen;
  engine.displayLoadingUI();

  const createCamera = () => {
    const camera = new UniversalCamera(
      "camera1",
      new Vector3(2, 0.5, -25),
      scene
    );
    camera.setTarget(new Vector3(1, 0, -10));
    camera.rotation = new Vector3(0, 0, 0);
    return camera;
  };

  const camera = useMemo(createCamera, [scene]);

  useEffect(() => {
    SceneLoader.Append(
      "model/",
      "extendedCity.glb",
      scene,
      function (scene: any) {
        scene.executeWhenReady(() => {
          engine.hideLoadingUI();
          const glow = new GlowLayer("glow", scene);
          glow.intensity = 0.3;

          // const pipCamera = new FreeCamera(
          //   "pipCamera",
          //   new Vector3(2, 1, 3),
          //   scene
          // );
          // pipCamera.setTarget(Vector3.Zero());
          // const ar = engine!.getAspectRatio(camera);
          // const pipW = ar < 1 ? 0.3 : 0.3 * (1 / ar);
          // const pipH = ar < 1 ? 0.3 * ar : 0.3;
          // const pipX = 1 - pipW;
          // const pipY = 1 - pipH;

          // camera.viewport = new Viewport(0, 0, 1, 1);
          // pipCamera.viewport = new Viewport(pipX, pipY, pipW, pipH);

          // camera.layerMask = 0x30000000;
          // pipCamera.layerMask = 0x10000000;

          scene.activeCameras!.push(camera);
          // scene.activeCameras!.push(pipCamera);

          // scene.meshes.forEach((mesh) => {
          //   mesh.scaling = new Vector3(3, 3, 3);
          //   mesh.layerMask = 0x10000000;
          // });

          initializeInput(scene, camera);
        });
      },
      null,
      null,
      ".glb"
    );
  }, [scene, camera, engine]);

  return null;
}

export default FPV;
