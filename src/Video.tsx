import {
  MeshBuilder,
  Color3,
  StandardMaterial,
  VideoTexture,
  Axis,
  Space,
  ActionManager,
  ExecuteCodeAction,
} from "@babylonjs/core";
import { useScene, Html } from "react-babylonjs";
import "@babylonjs/loaders";
import Hls from "hls.js";

function Video(): React.ReactElement | null {
  const scene: any = useScene();

  const videoUrl =
    "https://suwon-cdn.ezpmp.co.kr/Content/Lantour/KR/01_trip1920.m3u8";

  const parent = document.querySelector("#html");
  const video = document.createElement("video");
  video.setAttribute("src", videoUrl);
  video.muted = true;
  parent?.appendChild(video);

  const TV = MeshBuilder.CreatePlane("plane", { width: 1.7, height: 1 }, scene);
  TV.rotate(Axis.Z, Math.PI, Space.WORLD);

  const videoMat = new StandardMaterial("videoMat", scene);
  const videoTexture = new VideoTexture("video", video, scene, true, true);

  videoMat.backFaceCulling = false;
  videoMat.diffuseTexture = videoTexture;
  videoMat.emissiveColor = Color3.Black();
  TV.material = videoMat;

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(videoUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      TV.actionManager = new ActionManager(scene);
      TV.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, function (event) {
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
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = videoUrl;

    video.addEventListener("loadedmetadata", function () {
      TV.actionManager = new ActionManager(scene);
      TV.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, function (event) {
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

  return (
    <>
      <Html name="html" id="html"></Html>
    </>
  );
}

export default Video;
