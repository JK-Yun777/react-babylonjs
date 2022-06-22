import { SceneLoader } from "@babylonjs/core";
import { useScene } from "react-babylonjs";
import "@babylonjs/loaders";

function House(): null {
  const scene: any = useScene();
  console.log(scene);
  const aa = SceneLoader.Append(
    "model/",
    "old_town_block.obj",
    scene,
    function (meshes) {
      // let model = scene.getMeshByName("__root__");
      console.log("meshes is>>>", meshes);
      // console.log("model is>>>", model);

      // model.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.WORLD);
      scene.createDefaultEnvironment({
        createSkybox: false,
        createGround: false,
      });
      scene.createDefaultCameraOrLight(true, true, true);
    }
  );
  console.log("Return scene load value", aa);
  return null;
}

export default House;
