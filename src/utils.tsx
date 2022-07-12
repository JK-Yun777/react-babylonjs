import {
  Scene,
  Vector3,
  DeviceSourceManager,
  DeviceType,
  Matrix,
  PointerInput,
  UniversalCamera,
  ArcRotateCamera,
} from "@babylonjs/core";

import * as GUI from "@babylonjs/gui";

// interface InputMapType {
//   [index: string]: boolean;
// }

interface CameraType {
  scene: Scene;
  position: Vector3;
  target: Vector3;
  rotation: Vector3;
}

interface ArcCameraType extends CameraType {
  alpha: number;
  beta: number;
  radius: number;
}

export const createUniversalCamera = ({
  scene,
  position,
  target,
  rotation,
}: CameraType) => {
  const camera = new UniversalCamera(
    "camera1",
    // new Vector3(2, 0.5, -25),
    position,
    scene
  );
  camera.setTarget(target);
  camera.rotation = rotation;
  // camera.setTarget(new Vector3(1, 0, -10));
  // camera.rotation = new Vector3(0, 0, 0);
  return camera;
};

export const createArcRotateCamera = ({
  scene,
  position,
  target,
  rotation,
  alpha,
  beta,
  radius,
}: ArcCameraType) => {
  const camera = new ArcRotateCamera(
    "camera1",
    alpha,
    beta,
    radius,
    position,
    scene
  );
  camera.setTarget(target!);
  camera.rotation = rotation;

  return camera;
};

export const initializeInput = function (scene: Scene, camera: any) {
  const DSM = new DeviceSourceManager(scene.getEngine());

  DSM.onDeviceConnectedObservable.add((device) => {
    // KEYBOARD CONFIG
    if (device.deviceType === DeviceType.Keyboard) {
      scene.onBeforeRenderObservable.add(() => {
        let transformMatrix = Matrix.Zero();
        let localDirection = Vector3.Zero();
        let transformedDirection = Vector3.Zero();
        let isMoving = false;

        // WSAD keys
        if (device.getInput(87) === 1) {
          localDirection.z = 0.05;
          isMoving = true;
        }
        if (device.getInput(83) === 1) {
          localDirection.z = -0.05;
          isMoving = true;
        }
        if (device.getInput(65) === 1) {
          localDirection.x = -0.05;
          isMoving = true;
        }
        if (device.getInput(68) === 1) {
          localDirection.x = 0.05;
          isMoving = true;
        }

        // Arrow keys (Left, Right, Up, Down)
        if (device.getInput(37) === 1) {
          camera.rotation.y -= 0.01;
        }
        if (device.getInput(39) === 1) {
          camera.rotation.y += 0.01;
        }
        if (device.getInput(38) === 1) {
          camera.rotation.x -= 0.01;
        }
        if (device.getInput(40) === 1) {
          camera.rotation.x += 0.01;
        }

        if (isMoving) {
          camera.getViewMatrix().invertToRef(transformMatrix);
          Vector3.TransformNormalToRef(
            localDirection,
            transformMatrix,
            transformedDirection
          );
          camera.position.addInPlace(transformedDirection);
          // pipCamera.position.addInPlace(transformedDirection);
        }
      });
    }
    // POINTER CONFIG
    else if (
      device.deviceType === DeviceType.Mouse ||
      device.deviceType === DeviceType.Touch
    ) {
      device.onInputChangedObservable.add((deviceData: any) => {
        if (
          deviceData.inputIndex === PointerInput.Horizontal &&
          device.getInput(PointerInput.LeftClick) === 1
        ) {
          camera.rotation.y +=
            (deviceData.currentState - deviceData.previousState) * 0.005;
        }

        if (
          deviceData.inputIndex === PointerInput.Vertical &&
          device.getInput(PointerInput.LeftClick) === 1
        ) {
          camera.rotation.x +=
            (deviceData.currentState - deviceData.previousState) * 0.005;
        }
      });

      // Move forward if 2 fingers are pressed against screen
      if (!scene.beforeRender && device.deviceType === DeviceType.Touch) {
        scene.beforeRender = () => {
          let transformMatrix = Matrix.Zero();
          let localDirection = Vector3.Zero();
          let transformedDirection = Vector3.Zero();
          let isMoving = false;

          if (DSM.getDeviceSources(DeviceType.Touch).length === 2) {
            localDirection.z = 0.1;
            isMoving = true;
          }

          if (isMoving) {
            camera.getViewMatrix().invertToRef(transformMatrix);

            Vector3.TransformNormalToRef(
              localDirection,
              transformMatrix,
              transformedDirection
            );
            camera.position.addInPlace(transformedDirection);
            // pipCamera.position.addInPlace(transformedDirection);
          }
        };
      }
    }
  });

  return DSM;
};

let fullscreenGUI: any;

function loadingScreen(text: string) {
  let loadingContainer = new GUI.Container()!;
  let loadingText = new GUI.TextBlock()!;

  if (!fullscreenGUI) {
    fullscreenGUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  }

  if (text === "startLoading") {
    loadingContainer.zIndex = 1000;

    loadingText.text = "Loading...";
    loadingText.left = 0.5;
    loadingText.top = -100;
    loadingText.fontSize = 32;
    loadingText.color = "Skyblue";

    // background
    // let loadingBackground = new GUI.Rectangle();
    // loadingBackground.width = 10;
    // loadingBackground.height = 10;
    // loadingBackground.background = "Skyblue";
    // loadingContainer.addControl(loadingBackground);

    fullscreenGUI.addControl(loadingContainer);
    loadingContainer.addControl(loadingText);
  } else if (text === "endLoading") {
    fullscreenGUI.dispose();
    loadingContainer.dispose();
    loadingText.dispose();
  }
}

interface ILoadingScreen {
  displayLoadingUI: () => void;
  hideLoadingUI: () => void;
  loadingUIBackgroundColor: string;
  loadingUIText: string;
}

export class CustomLoadingScreen implements ILoadingScreen {
  public loadingUIBackgroundColor!: string;
  public loadingUIText!: string;

  public displayLoadingUI() {
    loadingScreen("startLoading");
  }

  public hideLoadingUI() {
    loadingScreen("endLoading");
  }
}
