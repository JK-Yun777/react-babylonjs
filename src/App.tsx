import { useState } from "react";
import { Engine, Scene, Skybox } from "react-babylonjs";
import { Vector3, Color3, Color4, CannonJSPlugin } from "@babylonjs/core";

import "@babylonjs/core/Physics/physicsEngineComponent";
import * as CANNON from "cannon";

import MainScene from "./MainScene";
import Character from "./Character";
import Video from "./Video";
import Loader from "./Loader";

window.CANNON = CANNON;
const gravityVector = new Vector3(0, -9.81, 0);
const sceneLoaderPosition = new Vector3(0, 1.5, 0);

function App() {
  const [isLoad, setIsLoad] = useState(false);
  console.log("Loaded!!!!", isLoad);

  return (
    <Engine
      antialias
      adaptToDeviceRatio
      canvasId="babylonJS"
      renderOptions={{
        whenVisibleOnly: true,
      }}
    >
      <Scene
        clearColor={Color4.FromColor3(Color3.FromHexString("#f7f6f0"))}
        enablePhysics={[gravityVector, new CannonJSPlugin()]}
        onReadyObservable={() => setIsLoad(true)}
      >
        <arcRotateCamera
          name="camera1"
          target={Vector3.Zero()}
          alpha={(3 * Math.PI) / 4}
          beta={Math.PI / 2.2}
          radius={1.4}
          angularSensibilityX={5000}
          angularSensibilityY={5000}
          wheelDeltaPercentage={0.01}
          minZ={0.001}
        />

        {isLoad ? (
          <>
            <hemisphericLight
              name="light1"
              intensity={2}
              direction={Vector3.Up()}
            />
            <pointLight name="omni" position={new Vector3(0, -1, 0)} />
            <Skybox rootUrl={"model/skyboxTextures/skybox"} />
            <MainScene />
            <Video />
            {/* <Character /> */}
          </>
        ) : (
          <>
            <Loader
              position={sceneLoaderPosition}
              width={2}
              height={0.5}
              depth={0.2}
              barColor={Color3.FromHexString("#3CACAE")}
            />
          </>
        )}

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
  );
}

export default App;
