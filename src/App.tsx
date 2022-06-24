import { Engine, Scene, Skybox } from "react-babylonjs";
import { Vector3, PhysicsImpostor, CannonJSPlugin } from "@babylonjs/core";
import "@babylonjs/core/Physics/physicsEngineComponent";
import * as CANNON from "cannon";
import MainScene from "./MainScene";
import Character from "./Character";

window.CANNON = CANNON;
const gravityVector = new Vector3(0, -9.81, 0);

function App() {
  return (
    <>
      <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
        <Scene enablePhysics={[gravityVector, new CannonJSPlugin()]}>
          <arcRotateCamera
            name="camera1"
            target={Vector3.Zero()}
            alpha={(3 * Math.PI) / 4}
            beta={Math.PI / 2.5}
            radius={10}
            angularSensibilityX={4000}
            angularSensibilityY={4000}
            minZ={0.001}
          />
          <hemisphericLight
            name="light1"
            intensity={0.9}
            direction={Vector3.Up()}
          />
          <Character />
          <MainScene />
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
          <Skybox rootUrl={"model/skyboxTextures/skybox"} />
        </Scene>
      </Engine>
    </>
  );
}

export default App;
