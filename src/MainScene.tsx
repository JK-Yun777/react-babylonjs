import { useEffect } from "react";
import {
  SceneLoader,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  VideoTexture,
  ActionManager,
  ExecuteCodeAction,
} from "@babylonjs/core";
import { useScene, Html, useEngine } from "react-babylonjs";
import "@babylonjs/loaders";
import Hls from "hls.js";

import { CustomLoadingScreen } from "./utils";

function MainScene(): React.ReactElement | null {
  const scene = useScene()!;
  const engine = useEngine()!;

  useEffect(() => {
    const loadingScreen = new CustomLoadingScreen();
    engine.loadingScreen = loadingScreen;
    engine.displayLoadingUI();

    SceneLoader.ImportMesh(
      "",
      "model/",
      "exhibition2.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        scene.executeWhenReady(() => {
          engine.hideLoadingUI();
          const house = meshes[0];
          house.scaling.scaleInPlace(0.1);
          house.rotation = new Vector3(0.01, 2.34, 0);

          // creactVideo
          const videoUrl =
            "https://suwon-cdn.ezpmp.co.kr/Content/Lantour/KR/01_trip1920.m3u8";

          const parent = document.querySelector("#html");
          const video = document.createElement("video");
          video.setAttribute("src", videoUrl);
          video.muted = true;
          parent?.appendChild(video);

          const TV = MeshBuilder.CreatePlane(
            "plane",
            { width: 0.2, height: 0.127 },
            scene
          );
          TV.position = new Vector3(-0.155, 0.244, -0.04);
          TV.rotation = new Vector3(-0.02, -0.8, (2 * Math.PI) / 2);
          const videoMat = new StandardMaterial("videoMat", scene);
          const videoTexture = new VideoTexture(
            "video",
            video,
            scene,
            true,
            true
          );
          videoMat.backFaceCulling = true;
          videoMat.diffuseTexture = videoTexture;
          TV.material = videoMat;

          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
              TV.actionManager = new ActionManager(scene);
              TV.actionManager.registerAction(
                new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                  event
                ) {
                  if (event) {
                    videoMat.backFaceCulling = false;
                    if (video.paused) {
                      video.play();
                      video.muted = false;
                    } else {
                      video.pause();
                    }
                  }
                })
              );
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoUrl;

            video.addEventListener("loadedmetadata", function () {
              TV.actionManager = new ActionManager(scene);
              TV.actionManager.registerAction(
                new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                  event
                ) {
                  if (event) {
                    if (video.paused) {
                      video.play();
                      video.muted = false;
                    } else {
                      video.pause();
                    }
                  }
                })
              );
            });
          }

          // new GlowLayer("glow", scene);

          // const bodyVisible = false;
          // const box = MeshBuilder.CreateBox(
          //   "box1",
          //   { width: 8, height: 8, depth: 0.0011 },
          //   scene
          // );

          // box.position = new Vector3(0, 0.1, 0);
          // box.rotation = new Vector3(5.5 + -Math.PI / 4, Math.PI / 2, 0);
          // box.isVisible = bodyVisible;

          // box.physicsImpostor = new PhysicsImpostor(
          //   box,
          //   PhysicsImpostor.BoxImpostor,
          //   { mass: 0 },
          //   scene
          // );

          // const anim = scene.getAnimationGroupByName(
          //   "VRayLight004|Take 001|BaseLayer"
          // );
          // anim.start(true, 1.0, anim.from, anim.to, false);
          // console.log(anim);

          // let house = scene.getMeshByName("__root__");
          // console.log("meshes is>>>", meshes);
          // console.log("model is>>>", house);

          // model.rotate(Axis.Y, Math.PI / 2, Space.WORLD);
          // scene.createDefaultEnvironment({
          //   createSkybox: false,
          //   createGround: false,
          // });
          // scene.createDefaultCameraOrLight(true, true, true);
        });
      }
    );
  }, [scene, engine]);

  return (
    <>
      <arcRotateCamera
        name="camera"
        target={new Vector3(0, 0.2, 0)}
        alpha={(3.13 * Math.PI) / 4}
        beta={Math.PI / 1.99}
        radius={1.2}
        angularSensibilityX={5000}
        angularSensibilityY={5000}
        wheelDeltaPercentage={0.01}
        minZ={0.001}
      />
      <pointLight name="omni" position={new Vector3(0, -1, 0)} />/
      <Html name="html" id="html"></Html>
    </>
  );
}

export default MainScene;
