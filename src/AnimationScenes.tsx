import { Suspense, useState, useEffect } from "react";
import {
  Vector3,
  Color3,
  GlowLayer,
  ActionManager,
  ExecuteCodeAction,
  CombineAction,
  ArcRotateCamera,
} from "@babylonjs/core";
import {
  Camera,
  Model,
  SceneLoaderContextProvider,
  useScene,
} from "react-babylonjs";
import "@babylonjs/loaders";

import { moveToTargetAnim, returnToDefaultAnim } from "./utils";

const initCameraTargetVector = Vector3.Zero();
const initCameraRadius = 5.5;

function AnimationScenes(): React.ReactElement | null {
  const [isZoomed, setIsZoomed] = useState(false);
  const [target, setTarget] = useState("");

  const scene = useScene()!;

  const camera2 = new ArcRotateCamera(
    "camera2",
    (4 * Math.PI) / 4,
    -0.5 + Math.PI / 1.99,
    initCameraRadius,
    initCameraTargetVector
  )!;

  scene.activeCameras!.push(camera2);
  camera2.attachControl(true);

  const onModelLoadedHandler = (model: any) => {
    let meshA;
    let meshB;

    if (model.rootMesh.name === "room") {
      meshA = model.meshes[1];
      meshB = model.meshes[2];
    }

    if (model.rootMesh.name === "store") {
      meshA = model.meshes[1];
      meshB = model.meshes[5];
    }

    if (model.rootMesh.name === "miniCity") {
      meshA = model.meshes[1];
      meshB = model.meshes[4];
    }

    if (model.rootMesh.name === "house") {
      meshA = model.meshes[0];
      meshB = model.meshes[1];
    }

    meshA.actionManager = new ActionManager(meshA._scene);
    meshA.actionManager
      .registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
          setIsZoomed((isZoomed) => !isZoomed);
          setTarget(model.rootMesh.name);
        })
      )
      .then(
        new CombineAction(ActionManager.NothingTrigger, [
          new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
            setIsZoomed((isZoomed) => !isZoomed);
            setTarget(model.rootMesh.name);
          }),
        ])
      );

    meshB.actionManager = new ActionManager(meshA._scene);
    meshB.actionManager
      .registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
          setIsZoomed((isZoomed) => !isZoomed);
          setTarget(model.rootMesh.name);
        })
      )
      .then(
        new CombineAction(ActionManager.NothingTrigger, [
          new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
            setIsZoomed((isZoomed) => !isZoomed);
            setTarget(model.rootMesh.name);
          }),
        ])
      );
  };

  useEffect(() => {
    if (isZoomed) {
      const result = moveToTargetAnim(camera2, scene, target);

      if (result) {
        const { radius, cameraTarget } = result;
        camera2.radius = radius;
        camera2.setTarget(cameraTarget);
      }
    } else {
      returnToDefaultAnim(camera2, scene, target);
    }
  }, [isZoomed, target, camera2, scene]);

  return (
    <>
      <SceneLoaderContextProvider>
        <Suspense
          fallback={
            <box name="fallback" position={new Vector3(-2.5, -1.5, 0)} />
          }
        >
          <Model
            name="room"
            reportProgress
            rootUrl="model/"
            sceneFilename="roomWithoutPlane.glb"
            scaleToDimension={1}
            position={new Vector3(-1.5, -0.03, 1.5)}
            onModelLoaded={(e) => onModelLoadedHandler(e)}
          />

          <Model
            name="store"
            reportProgress
            rootUrl="model/"
            sceneFilename="storeWithoutPlane.glb"
            scaleToDimension={1}
            position={new Vector3(0.5, 0, 0)}
            onModelLoaded={(e) => onModelLoadedHandler(e)}
          />

          <Model
            name="miniCity"
            reportProgress
            rootUrl="model/"
            sceneFilename="miniCity.glb"
            scaleToDimension={1}
            position={new Vector3(0, 0.2, 3)}
            onModelLoaded={(e) => onModelLoadedHandler(e)}
          />

          <Model
            name="house"
            reportProgress
            rootUrl="model/"
            sceneFilename="house.glb"
            scaleToDimension={1}
            position={new Vector3(0, 0, -2)}
            onModelLoaded={(e) => onModelLoadedHandler(e)}
          />
        </Suspense>
      </SceneLoaderContextProvider>
    </>
  );
}

export default AnimationScenes;
