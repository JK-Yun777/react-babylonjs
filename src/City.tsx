import { useEffect, useMemo, useState } from "react";
import {
  SceneLoader,
  Vector3,
  GlowLayer,
  Color3,
  ArcRotateCamera,
} from "@babylonjs/core";
import { useScene } from "react-babylonjs";
import "@babylonjs/loaders";
import Loader from "./Loader";

function City(): React.ReactElement | null {
  const scene = useScene()!;

  const [isLoad, setIsLoad] = useState(0);
  const [isProgressed, setISProgressed] = useState(false);
  const totalContext = 9606868;
  // const totalContext = 3542812;

  // const createCamera = () => {
  //   const camera = new ArcRotateCamera(
  //     "camera1",
  //     2.4,
  //     (2.1 * Math.PI) / 4,
  //     Math.PI / 1.9,
  //     new Vector3(1.2, 0.22, 0),
  //     scene
  //   );
  //   camera.attachControl();
  //   camera.wheelDeltaPercentage = 0.01;

  //   return camera;
  // };

  // const camera = useMemo(createCamera, [scene]);

  useEffect(() => {
    SceneLoader.ImportMesh(
      "",
      "model/",
      "extendedCity.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const miniCity = meshes[0];
        miniCity.scaling.scaleInPlace(0.1);
        miniCity.position = new Vector3(0.1, 0.1, 0.1);
        miniCity.rotation = new Vector3(0, -1.8, 0);

        const glow = new GlowLayer("glow", scene);
        glow.intensity = 0.3;

        // scene.activeCameras!.push(camera);
      },
      function (evt) {
        // console.log(evt);
        if (evt.loaded === totalContext) {
          setISProgressed(true);
        }
        setIsLoad(evt.loaded);
      }
    );
  }, [scene, isProgressed]);

  return (
    <>
      <arcRotateCamera
        name="camera2"
        target={new Vector3(1.2, 0.22, 0)}
        alpha={(2.1 * Math.PI) / 4}
        beta={Math.PI / 1.99}
        radius={2.4}
        angularSensibilityX={5000}
        angularSensibilityY={5000}
        wheelDeltaPercentage={0.01}
        minZ={0.001}
      />
      {!isProgressed ? (
        <Loader
          position={new Vector3(1.3, 0.3, 0)}
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

export default City;
