import React, { useRef, useEffect } from "react";
import { useScene } from "react-babylonjs";

import {
  MeshBuilder,
  Nullable,
  Mesh,
  Vector3,
  Matrix,
  Color3,
  StandardMaterial,
  TransformNode,
} from "@babylonjs/core";

interface LoaderType {
  position: Vector3;
  width: number;
  height?: number;
  depth?: number;
  barColor: Color3;
  totalContext?: number;
  isProgressed?: boolean;
  loaded?: number;
}

function Loader({
  position,
  width,
  height,
  depth,
  barColor,
  totalContext,
  isProgressed,
  loaded,
}: LoaderType): React.ReactElement | null {
  const boxRef = useRef<Nullable<Mesh>>(null);
  const scene = useScene();
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

    if (isProgressed) backBox.isVisible = false;

    return () => {
      progressBox.dispose();
      backBox.dispose();
      node.dispose();
      boxRef.current = null;
    };
  }, [position, width, height, depth, barColor, isProgressed, scene]);

  useEffect(() => {
    if (boxRef.current) {
      const progressEvent = totalContext;

      if (progressEvent) {
        const progressPercent =
          isProgressed === false ? loaded! / progressEvent : 0;

        boxRef.current.scaling = new Vector3(progressPercent, 1, 1);
      } else {
        boxRef.current.scaling = new Vector3(0, 1, 1);
      }
    }
  }, [boxRef, totalContext, loaded, isProgressed]);

  return null;
}
export default Loader;
