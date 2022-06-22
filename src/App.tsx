import { Engine, Scene } from "react-babylonjs";
import { Vector3 } from "@babylonjs/core";
import House from "./House";

function App() {
  return (
    <>
      <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
        <Scene>
          <arcRotateCamera
            name="camera1"
            target={Vector3.Zero()}
            alpha={(3 * Math.PI) / 4}
            beta={Math.PI / 4}
            radius={2}
          />
          <hemisphericLight
            name="light1"
            intensity={0.7}
            direction={Vector3.Up()}
          />
          <House />
        </Scene>
      </Engine>
    </>
  );
}

export default App;
