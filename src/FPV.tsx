import { useEffect } from "react";
import { SceneLoader, Vector3, GlowLayer } from "@babylonjs/core";
import { useCanvas, useEngine, useScene } from "react-babylonjs";
import "@babylonjs/loaders";

import {
  initializeKeyboardInput,
  CustomLoadingScreen,
  createUniversalCamera,
  initializeMouseInput,
} from "./utils";

function FPV(): React.ReactElement | null {
  const scene = useScene()!;
  const engine = useEngine()!;
  const canvas = useCanvas();

  const cameraOptions = {
    scene,
    position: new Vector3(2, 0.5, -25),
    target: new Vector3(1, 0, -10),
    rotation: new Vector3(0, 0, 0),
  };

  const camera = createUniversalCamera(cameraOptions);

  useEffect(() => {
    const loadingScreen = new CustomLoadingScreen();
    engine.loadingScreen = loadingScreen;
    engine.displayLoadingUI();

    SceneLoader.Append(
      "model/",
      "extendedCity.glb",
      scene,
      function (scene: any) {
        scene.executeWhenReady(function (newMeshes: any) {
          engine.hideLoadingUI();

          const glow = new GlowLayer("glow", scene);
          glow.intensity = 0.3;

          scene.activeCameras!.push(camera);

          initializeKeyboardInput(scene, camera);
          initializeMouseInput(scene, camera, canvas);
        });
      },
      null,
      null,
      ".glb"
    );
  }, [scene, engine, camera, canvas]);

  return null;
}

export default FPV;
