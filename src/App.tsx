import { Engine, Scene, Skybox } from "react-babylonjs";
import { Vector3, Color3, Color4, CannonJSPlugin } from "@babylonjs/core";

import "@babylonjs/core/Physics/physicsEngineComponent";
import * as CANNON from "cannon";

import MainScene from "./MainScene";
import City from "./City";
import FPV from "./FPV";
import AnimationScenes from "./AnimationScenes";

window.CANNON = CANNON;
const gravityVector = new Vector3(0, -9.81, 0);

function App() {
  return (
    <>
      <Engine antialias adaptToDeviceRatio canvasId="canvas">
        <Scene
          clearColor={Color4.FromColor3(Color3.FromHexString("#f7f6f0"))}
          enablePhysics={[gravityVector, new CannonJSPlugin()]}
        >
          {/* <arcRotateCamera
            name="camera"
            target={cameraTarget}
            alpha={(4 * Math.PI) / 4}
            beta={-0.5 + Math.PI / 1.99}
            radius={cameraRadius}
            angularSensibilityX={5000}
            angularSensibilityY={5000}
            wheelDeltaPercentage={0.01}
            minZ={0.001}
          /> */}

          <hemisphericLight
            name="light1"
            intensity={2}
            direction={Vector3.Up()}
          />

          <pointLight
            name="point"
            position={new Vector3(0, 10, 0)}
            intensity={0.5}
          />

          <Skybox rootUrl={"model/skyboxTextures/skybox"} />

          {/* <MainScene /> */}
          {/* <City /> */}
          {/* <FPV /> */}
          <AnimationScenes />

          {/* <sphere
            name="sphere1"
            diameter={2}
            segments={16}
            position={new Vector3(0, 5, 0)}
          >
            <physicsImpostor
              type={PhysicsImpostor.SphereImpostor}
              _options={{ mass: 1, restitution: 0.9 }}
            />
          </sphere> */}

          {/* <ground
            name="ground1"
            width={10}
            height={10}
            subdivisions={2}
            receiveShadows={true}
            isVisible={true}
          >
            <physicsImpostor
              type={PhysicsImpostor.BoxImpostor}
              _options={{ mass: 0, restitution: 0.9 }}
            />
          </ground> */}
        </Scene>
      </Engine>
    </>
  );
}

export default App;
