import { useEffect, useState } from "react";
import {
  SceneLoader,
  Vector3,
  PhysicsImpostor,
  MeshBuilder,
  GlowLayer,
  StandardMaterial,
  VideoTexture,
  ActionManager,
  ExecuteCodeAction,
  Color3,
} from "@babylonjs/core";
import { useScene, Html } from "react-babylonjs";
import "@babylonjs/loaders";
import Hls from "hls.js";
import Loader from "./Loader";

function Room(): React.ReactElement | null {
  const scene = useScene()!;
  const [isLoad, setIsLoad] = useState(0);
  const [isProgressed, setISProgressed] = useState(false);
  const totalContext = 2687024;
  // const totalContext = 3542812;

  useEffect(() => {
    SceneLoader.ImportMesh(
      "",
      "model/",
      "roomWithoutPlane.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const room = meshes[0];
        room.scaling.scaleInPlace(0.1);
        room.position = new Vector3(-1.8, 0, 1);
        room.rotation = new Vector3(0, -0.8, 0);

        const glow = new GlowLayer("glow", scene);
        glow.intensity = 0.3;

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
      },
      function (evt) {
        console.log(evt);
        if (evt.loaded === totalContext) {
          setISProgressed(true);
        }

        setIsLoad(evt.loaded);
      }
    );
  }, [scene, isProgressed]);

  return (
    <>
      {!isProgressed ? (
        <Loader
          position={new Vector3(0, 0, 0)}
          width={0.6}
          height={0.1}
          depth={0.1}
          barColor={Color3.FromHexString("#ff0000")}
          totalContext={totalContext}
          isProgressed={isProgressed}
          loaded={isLoad}
        />
      ) : null}
    </>
  );
}

export default Room;
