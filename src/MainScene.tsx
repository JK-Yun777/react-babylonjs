import { useEffect } from "react";
import {
  SceneLoader,
  Vector3,
  PhysicsImpostor,
  MeshBuilder,
  GlowLayer,
} from "@babylonjs/core";
import { useScene } from "react-babylonjs";
import "@babylonjs/loaders";

function MainScene(): React.ReactElement | null {
  const scene = useScene()!;

  useEffect(() => {
    SceneLoader.ImportMesh(
      "",
      "model/",
      "exhibition.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const house = meshes[0];
        house.scaling.scaleInPlace(0.1);
        house.rotation = new Vector3(0.01, 2.34, 0);

        new GlowLayer("glow", scene);

        const bodyVisible = false;
        const box = MeshBuilder.CreateBox(
          "box1",
          { width: 8, height: 8, depth: 0.0011 },
          scene
        );

        box.position = new Vector3(0, 0.1, 0);
        box.rotation = new Vector3(5.5 + -Math.PI / 4, Math.PI / 2, 0);
        box.isVisible = bodyVisible;

        box.physicsImpostor = new PhysicsImpostor(
          box,
          PhysicsImpostor.BoxImpostor,
          { mass: 0 },
          scene
        );

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
      }
    );
  }, [scene]);

  return null;
}

export default MainScene;
