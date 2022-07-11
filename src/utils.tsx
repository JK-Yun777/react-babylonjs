import {
  ActionManager,
  ExecuteCodeAction,
  Scene,
  Vector3,
  DeviceSourceManager,
  DeviceType,
  Matrix,
  PointerInput,
} from "@babylonjs/core";

import * as GUI from "@babylonjs/gui";

interface InputMapType {
  [index: string]: boolean;
}

export function createInputMap(scene: Scene) {
  const inputMap: InputMapType = {};
  scene.actionManager = new ActionManager(scene);
  scene.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
    })
  );
  scene.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
    })
  );

  return inputMap;
}

export const controller = (targetObj: any, scene: Scene) => {
  const inputMap = createInputMap(scene);
  scene.onBeforeRenderObservable.add(function () {
    if (targetObj) {
      if (inputMap["w"] || inputMap["ArrowUp"]) {
        console.log(targetObj.frontVector);
        // targetObj.moveWithCollisions(
        //   targetObj.frontVector.multiplyByFloats(
        //     targetObj.speed,
        //     targetObj.speed,
        //     targetObj.speed
        //   )
        // );
      }
      if (inputMap["a"] || inputMap["ArrowLeft"]) {
        targetObj.rotation.y -= 0.01;
        targetObj.frontVector = new Vector3(
          Math.sin(targetObj.rotation.y),
          0,
          Math.cos(targetObj.rotation.y)
        );
      }
      if (inputMap["s"] || inputMap["ArrowDown"]) {
        console.log(targetObj.frontVector);
        // targetObj.moveWithCollisions(
        //   targetObj.frontVector.multiplyByFloats(
        //     -targetObj.speed,
        //     -targetObj.speed,
        //     -targetObj.speed
        //   )
        // );
      }
      if (inputMap["d"] || inputMap["ArrowRight"]) {
        targetObj.rotation.y += 0.01;
        targetObj.frontVector = new Vector3(
          Math.sin(targetObj.rotation.y),
          0,
          Math.cos(targetObj.rotation.y)
        );
      }
    }
  });
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

function loadingScreen(scene: any, text: string) {
  let loadingContainer = new GUI.Container();
  let loadingBackground = new GUI.Rectangle();
  let loadingText = new GUI.TextBlock();

  if (text === "loadStart") {
    if (!fullscreenGUI) {
      fullscreenGUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    }

    loadingContainer.zIndex = 1000;

    // loadingBackground.width = 10;
    // loadingBackground.height = 10;
    // loadingBackground.background = "Skyblue";

    loadingText.text = "Loading...";
    loadingText.left = 0.5;
    loadingText.top = -100;
    loadingText.fontSize = 32;
    loadingText.color = "Black";

    fullscreenGUI.addControl(loadingContainer);
    // loadingContainer.addControl(loadingBackground);
    loadingContainer.addControl(loadingText);
  }

  if (text === "Loaded") {
    fullscreenGUI.dispose();
    loadingContainer.dispose();
    loadingBackground.dispose();
    loadingText.dispose();
  }
}

interface ILoadingScreen {
  displayLoadingUI: () => void;

  hideLoadingUI: () => void;

  loadingUIBackgroundColor: string;
  loadingUIText: string;
  scene?: Scene;
}

export class CustomLoadingScreen implements ILoadingScreen {
  public loadingUIBackgroundColor!: string;
  constructor(public loadingUIText: string, public scene: Scene) {}
  public displayLoadingUI() {
    loadingScreen(this.scene, this.loadingUIText);
  }

  public hideLoadingUI() {
    loadingScreen(this.scene, "Loaded");
  }
}
