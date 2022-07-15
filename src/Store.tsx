import { Suspense, useState, useEffect } from "react";
import {
  Vector3,
  GlowLayer,
  ActionManager,
  ExecuteCodeAction,
  CombineAction,
} from "@babylonjs/core";
import { Model, SceneLoaderContextProvider } from "react-babylonjs";
import "@babylonjs/loaders";
import ScaledModelWithProgress from "./ScaledModelWithProgress";

function Store(props: any): React.ReactElement | null {
  const [isZoomed, setIsZoomed] = useState(false);

  const onModelLoadedHandler = (model: any) => {
    const meshA = model.meshes[1];
    meshA.actionManager = new ActionManager(meshA._scene);
    meshA.actionManager
      .registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
          setIsZoomed((isZoomed) => !isZoomed);
        })
      )
      .then(
        new CombineAction(ActionManager.NothingTrigger, [
          new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
            setIsZoomed((isZoomed) => !isZoomed);
          }),
        ])
      );

    const meshB = model.meshes[5];
    meshB.actionManager = new ActionManager(meshB._scene);
    meshB.actionManager
      .registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
          setIsZoomed((isZoomed) => !isZoomed);
        })
      )
      .then(
        new CombineAction(ActionManager.NothingTrigger, [
          new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
            setIsZoomed((isZoomed) => !isZoomed);
          }),
        ])
      );
  };

  const targetPosition = new Vector3(0.5, 0, 0);
  const resetPosition = Vector3.Zero();

  useEffect(() => {
    if (isZoomed) {
      props.target({ position: targetPosition, isZoomed });
    } else {
      props.target({ position: resetPosition, isZoomed });
    }
  }, [isZoomed]);

  return (
    <>
      {/* <ScaledModelWithProgress
        rootUrl="model/"
        sceneFilename="roomWithoutPlane.glb"
        scaleTo={1}
        progressBarColor={Color3.FromInts(255, 165, 0)}
        center={new Vector3(-1.5, -0.03, 1.5)}
        onModelLoaded={onModelLoaded}
      /> */}

      <SceneLoaderContextProvider>
        <Suspense
          fallback={
            <box name="fallback" position={new Vector3(-2.5, -1.5, 0)} />
          }
        >
          <Model
            name="model"
            reportProgress
            rootUrl="model/"
            sceneFilename="storeWithoutPlane.glb"
            scaleToDimension={1}
            position={new Vector3(0.5, 0, 0)}
            onModelLoaded={(e) => onModelLoadedHandler(e)}
          />
        </Suspense>
      </SceneLoaderContextProvider>
    </>
  );
}

export default Store;
