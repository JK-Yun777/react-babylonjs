import { SceneLoader, Vector3, PhysicsImpostor } from "@babylonjs/core";
import { useScene } from "react-babylonjs";
import "@babylonjs/loaders";

function MainScene(): any {
  const scene: any = useScene();

  SceneLoader.ImportMesh("", "model/", "house.glb", scene, function (meshes) {
    const house = meshes[0];

    // let house = scene.getMeshByName("__root__");
    // console.log("meshes is>>>", meshes);
    // console.log("model is>>>", house);

    // house.rotate(Axis.Y, Math.PI / 2, Space.WORLD);
    // scene.createDefaultEnvironment({
    //   createSkybox: false,
    //   createGround: false,
    // });
    // scene.createDefaultCameraOrLight(true, true, true);
  });

  return (
    <>
      <box
        name="box1"
        width={8}
        height={8}
        depth={0.001}
        position={new Vector3(0, 0.1, 0)}
        rotation={new Vector3(5.5 + -Math.PI / 4, Math.PI / 2, 0)}
        isVisible={false}
      >
        <physicsImpostor
          type={PhysicsImpostor.BoxImpostor}
          _options={{ mass: 0, restitution: 0.9 }}
        />
      </box>
    </>
  );
}

export default MainScene;
