import React, { useRef, useContext, useEffect } from "react";
import {
  useScene,
  SceneLoaderContext,
  useSceneLoader,
  LoaderStatus,
  useCamera,
} from "react-babylonjs";

import {
  MeshBuilder,
  Nullable,
  Mesh,
  Vector3,
  Matrix,
  Color3,
  StandardMaterial,
  TransformNode,
  ArcRotateCamera,
  Scene,
} from "@babylonjs/core";

interface SceneLoaderFallbackType {
  position: Vector3;
  width: number;
  height?: number;
  depth?: number;
  barColor: Color3;
}

export const SceneLoaderFallback: React.FC<SceneLoaderFallbackType> = ({
  position,
  width,
  height,
  depth,
  barColor,
}) => {
  const boxRef = useRef<Nullable<Mesh>>(null);
  const context = useContext(SceneLoaderContext);
  const scene = useScene();
  console.log("fallbackLoaded");
  useEffect(() => {
    const node = new TransformNode("fallback-parent", scene);
    node.position = position;

    const meshHeight = height ?? 1;
    const meshDepth = depth ?? 0.1;

    const progressBox = MeshBuilder.CreateBox(
      "fallback-progress",
      {
        width,
        height: meshHeight,
        depth: meshDepth,
      },
      scene
    );
    progressBox.parent = node;
    progressBox.position = new Vector3(width / 2, 0, 0);
    progressBox.setPivotMatrix(Matrix.Translation(-width, 0, 0));
    progressBox.setPreTransformMatrix(Matrix.Translation(-width / 2, 0, 0));

    const boxMat = new StandardMaterial("fallback-mat", scene!);
    boxMat.diffuseColor = barColor;
    boxMat.specularColor = Color3.Black();
    progressBox.material = boxMat;

    boxRef.current = progressBox;

    const backDepth = Math.min(depth ?? 0.1, 0.1);
    const backBox = MeshBuilder.CreateBox(
      "fallback-back",
      {
        width,
        height: meshHeight,
        depth: backDepth,
      },
      scene
    );
    backBox.parent = node;
    backBox.position = new Vector3(0, 0, meshDepth / -2 + backDepth / -2);

    return () => {
      progressBox.dispose();
      backBox.dispose();
      node.dispose();
      boxRef.current = null;
    };
  }, [position, width, height, depth, barColor, scene]);

  useEffect(() => {
    if (boxRef.current) {
      const progressEvent = context?.lastProgress;

      if (progressEvent) {
        const progressPercent =
          progressEvent.lengthComputable === true
            ? progressEvent.loaded / progressEvent.total
            : 0;
        boxRef.current.scaling = new Vector3(progressPercent, 1, 1);
      } else {
        boxRef.current.scaling = new Vector3(0, 1, 1);
      }
    }
  }, [boxRef, context?.lastProgress]);

  return null;
};

type SceneLoaderModelProps = {
  position: Vector3;
};

export function SceneLoaderModels({ position }: SceneLoaderModelProps) {
  console.log("sceneLoaded?????>>");
  const rootUrl = "model/";
  /*const loadedModel = */ useSceneLoader(rootUrl, "house.glb", undefined, {
    reportProgress: true,
    scaleToDimension: 2,
    onModelLoaded: (loadedModel) => {
      console.log("loadedModel>>", loadedModel);
      if (loadedModel.status === LoaderStatus.Loaded) {
        console.log("Model Loaded:", position, loadedModel);
        loadedModel.rootMesh!.position = position;
      } else {
        console.log("Model not loaded", loadedModel);
      }
    },
  });

  return null;
}

type CameraPosition = {
  radius: number;
};

export const MyCamera: React.FC<CameraPosition> = ({ radius }) => {
  const camera = useCamera<ArcRotateCamera>((scene: Scene) => {
    console.log("creating camera...");
    return new ArcRotateCamera(
      "camera1",
      Math.PI / 2,
      Math.PI * 0.45,
      radius,
      Vector3.Zero(),
      scene
    );
  });

  if (camera) {
    camera.radius = radius;
  }
  return null;
};
