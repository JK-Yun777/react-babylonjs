import {
  MeshBuilder,
  Color3,
  StandardMaterial,
  VideoTexture,
  Axis,
  Space,
  ActionManager,
  ExecuteCodeAction,
  Vector3,
  Texture,
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

  const TV = MeshBuilder.CreatePlane(
    "plane",
    { width: 0.2, height: 0.125 },
    scene
  );
  TV.position = new Vector3(-0.17, 0.243, -0.045);
  TV.rotation = new Vector3(-0.02, -0.8, (2 * Math.PI) / 2);

  const videoMat = new StandardMaterial("videoMat", scene);
  const videoTexture = new VideoTexture("video", video, scene, true, true);
  videoMat.backFaceCulling = false;
  videoMat.diffuseTexture = videoTexture;
  videoMat.emissiveColor = Color3.Black();

  const thumbMat = new StandardMaterial("thumbMat", scene);
  const thumbnailTex = new Texture("model/thumbnail.jpg", scene);
  thumbMat.backFaceCulling = false;
  thumbMat.diffuseTexture = thumbnailTex;
  thumbMat.emissiveColor = Color3.Black();

  TV.material = thumbMat;

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(videoUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      TV.actionManager = new ActionManager(scene);
      TV.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, function (event) {
          if (event) {
            TV.material = videoMat;
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
