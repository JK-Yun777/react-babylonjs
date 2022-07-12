import { useEffect, useRef } from "react";
import { Engine, Scene, Skybox, useScene } from "react-babylonjs";
import {
  Vector3,
  Color3,
  Color4,
  CannonJSPlugin,
  MeshBuilder,
  StandardMaterial,
  TransformNode,
  Nullable,
  Mesh,
} from "@babylonjs/core";

import "@babylonjs/core/Physics/physicsEngineComponent";
import * as CANNON from "cannon";

import MainScene from "./MainScene";
import Character from "./Character";
import Loader from "./Loader";

import Video from "./Video";
import City from "./City";
import Room from "./Room";
import FPV from "./FPV";

window.CANNON = CANNON;
const gravityVector = new Vector3(0, -9.81, 0);

function App() {
  return (
    <>
      <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
        <Scene
          clearColor={Color4.FromColor3(Color3.FromHexString("#f7f6f0"))}
          enablePhysics={[gravityVector, new CannonJSPlugin()]}
        >
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
          <MainScene />
          {/* <City /> */}
          {/* <FPV /> */}

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
