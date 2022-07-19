import {
  Scene,
  Vector3,
  DeviceSourceManager,
  DeviceType,
  Matrix,
  UniversalCamera,
  ArcRotateCamera,
  Animation,
  ActionManager,
  ExecuteCodeAction,
  CombineAction,
} from "@babylonjs/core";

import * as GUI from "@babylonjs/gui";

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
  const camera = new UniversalCamera("camera1", position, scene);
  camera.setTarget(target);
  camera.rotation = rotation;
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

export const initializeMouseInput = function (
  scene: Scene,
  camera: any,
  canvas: any
) {
  // MOUSE CONFIG
  const currentPosition = { x: 0, y: 0, z: 0 };
  let clicked = false;
  let wheeled = false;

  canvas.addEventListener("wheel", function (evt: any) {
    if (evt) {
      wheeled = false;
    }
    scene.beforeRender = () => {
      let transformMatrix = Matrix.Zero();
      let localDirection = Vector3.Zero();
      let transformedDirection = Vector3.Zero();
      let isMoving = false;
      currentPosition.z = evt.wheelDeltaY;

      if (evt.wheelDeltaY > 0 && !wheeled) {
        localDirection.z = 0.3;
        isMoving = true;
      }

      if (evt.wheelDeltaY < 0 && !wheeled) {
        localDirection.z = -0.3;
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
        wheeled = true;
      }
    };
  });

  canvas.addEventListener("pointerdown", function (evt: any) {
    currentPosition.x = evt.clientX;
    currentPosition.y = evt.clientY;
    clicked = true;
  });

  canvas.addEventListener("pointermove", function (evt: any) {
    if (!clicked) {
      return;
    }

    const dx = evt.clientX - currentPosition.x;
    const dy = evt.clientY - currentPosition.y;

    const angleX = dy * 0.001;
    const angleY = dx * 0.001;

    camera.rotation.y -= angleY;
    camera.rotation.x -= angleX;

    currentPosition.x = evt.clientX;
    currentPosition.y = evt.clientY;
  });

  canvas.addEventListener("pointerup", function (evt: any) {
    clicked = false;
  });
};

export const initializeKeyboardInput = function (scene: Scene, camera: any) {
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
        }
      });
    }

    // Move forward if 2 fingers are pressed against screen
    else if (!scene.beforeRender && device.deviceType === DeviceType.Touch) {
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
        }
      };
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

interface ResultType {
  animations: any;
  cameraSetting: any;
}

const frameRate = 20;

function getTargetAnimations(
  radius: number,
  target: Vector3,
  targetName: string
) {
  // camera zoom in animation
  const zoomIn = new Animation(
    "zoomIn",
    "radius",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const zoomIn_keys = [];

  zoomIn_keys.push({
    frame: 0,
    value: radius,
  });

  zoomIn_keys.push({
    frame: 2 * frameRate,
    value: radius - 2,
  });

  zoomIn_keys.push({
    frame: 3 * frameRate,
    value: radius - 3,
  });

  zoomIn.setKeys(zoomIn_keys);

  //camera move forward
  const movein = new Animation(
    "movein",
    "target",
    frameRate,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  // for Room Model
  const movein_room_keys = [];

  movein_room_keys.push({
    frame: 0,
    value: Vector3.Zero(),
  });

  movein_room_keys.push({
    frame: 1 * frameRate,
    value: new Vector3(-0.5, 0, 0.5),
  });

  movein_room_keys.push({
    frame: 2 * frameRate,
    value: new Vector3(-1, 0, 1),
  });

  movein_room_keys.push({
    frame: 3 * frameRate,
    value: new Vector3(-1.5, 0, 1.5),
  });

  // for Store Model
  const movein_store_keys = [];

  movein_store_keys.push({
    frame: 0,
    value: Vector3.Zero(),
  });

  movein_store_keys.push({
    frame: 1 * frameRate,
    value: new Vector3(0.1, 0, 0),
  });

  movein_store_keys.push({
    frame: 2 * frameRate,
    value: new Vector3(0.3, 0, 0),
  });

  movein_store_keys.push({
    frame: 3 * frameRate,
    value: new Vector3(0.5, 0, 0),
  });

  // for MiniCity Model
  const movein_miniCity_keys = [];

  movein_miniCity_keys.push({
    frame: 0,
    value: Vector3.Zero(),
  });

  movein_miniCity_keys.push({
    frame: 1 * frameRate,
    value: new Vector3(0, 0.1, 1),
  });

  movein_miniCity_keys.push({
    frame: 2 * frameRate,
    value: new Vector3(0, 0.2, 2),
  });

  movein_miniCity_keys.push({
    frame: 3 * frameRate,
    value: new Vector3(0, 0.2, 3),
  });

  // for House Model
  const movein_house_keys = [];

  movein_house_keys.push({
    frame: 0,
    value: Vector3.Zero(),
  });

  movein_house_keys.push({
    frame: 1 * frameRate,
    value: new Vector3(0, 0, -1),
  });

  movein_house_keys.push({
    frame: 2 * frameRate,
    value: new Vector3(0, 0, -1.5),
  });

  movein_house_keys.push({
    frame: 3 * frameRate,
    value: new Vector3(0, 0, -2),
  });

  switch (targetName) {
    case "room":
      movein.setKeys(movein_room_keys);
      return {
        animations: [movein, zoomIn],
        cameraSetting: { radius: 2.5, cameraTarget: new Vector3(-1.5, 0, 1.5) },
      };

    case "store":
      movein.setKeys(movein_store_keys);
      return {
        animations: [movein, zoomIn],
        cameraSetting: { radius: 2.5, cameraTarget: new Vector3(0.5, 0, 0) },
      };

    case "miniCity":
      movein.setKeys(movein_miniCity_keys);
      return {
        animations: [movein, zoomIn],
        cameraSetting: { radius: 2.5, cameraTarget: new Vector3(0, 0.2, 3) },
      };

    case "house":
      movein.setKeys(movein_house_keys);
      return {
        animations: [movein, zoomIn],
        cameraSetting: { radius: 2.5, cameraTarget: new Vector3(0, 0, -2) },
      };
  }
}

function getReturnAnimations(
  radius: number,
  target: Vector3,
  targetName: string
) {
  // camera zoom out animation
  const zoomOut = new Animation(
    "zoomOut",
    "radius",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const zoomOut_keys = [];

  zoomOut_keys.push({
    frame: 0,
    value: 2.5,
  });

  zoomOut_keys.push({
    frame: 2 * frameRate,
    value: 3.5,
  });

  zoomOut_keys.push({
    frame: 3 * frameRate,
    value: 5.5,
  });

  zoomOut.setKeys(zoomOut_keys);

  //camera move forward
  const moveOut = new Animation(
    "moveOut",
    "target",
    frameRate,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  // for Room Model

  const moveOut_room_keys = [];

  moveOut_room_keys.push({
    frame: 0,
    value: new Vector3(-1.5, 0, 1.5),
  });

  moveOut_room_keys.push({
    frame: 1 * frameRate,
    value: new Vector3(-1, 0, 1),
  });

  moveOut_room_keys.push({
    frame: 2 * frameRate,
    value: new Vector3(-0.5, 0, 0.5),
  });

  moveOut_room_keys.push({
    frame: 3 * frameRate,
    value: Vector3.Zero(),
  });

  // for Store Model
  const moveOut_store_keys = [];

  moveOut_store_keys.push({
    frame: 0,
    value: new Vector3(0.5, 0, 0),
  });

  moveOut_store_keys.push({
    frame: 1 * frameRate,
    value: new Vector3(0.3, 0, 0),
  });

  moveOut_store_keys.push({
    frame: 2 * frameRate,
    value: new Vector3(0.1, 0, 0),
  });

  moveOut_store_keys.push({
    frame: 3 * frameRate,
    value: Vector3.Zero(),
  });

  // for MiniCity Model
  const moveOut_miniCity_keys = [];

  moveOut_miniCity_keys.push({
    frame: 0,
    value: new Vector3(0, 0.2, 3),
  });

  moveOut_miniCity_keys.push({
    frame: 1 * frameRate,
    value: new Vector3(0, 0.2, 2),
  });

  moveOut_miniCity_keys.push({
    frame: 2 * frameRate,
    value: new Vector3(0, 0.1, 1),
  });

  moveOut_miniCity_keys.push({
    frame: 3 * frameRate,
    value: Vector3.Zero(),
  });

  // for House Model
  const moveOut_house_keys = [];

  moveOut_house_keys.push({
    frame: 0,
    value: new Vector3(0, 0, -2),
  });

  moveOut_house_keys.push({
    frame: 5 * frameRate,
    value: new Vector3(0, 0, -1.5),
  });

  moveOut_house_keys.push({
    frame: 9 * frameRate,
    value: new Vector3(0, 0, -1),
  });

  moveOut_house_keys.push({
    frame: 10 * frameRate,
    value: Vector3.Zero(),
  });

  switch (targetName) {
    case "room":
      moveOut.setKeys(moveOut_room_keys);
      return [moveOut, zoomOut];

    case "store":
      moveOut.setKeys(moveOut_store_keys);
      return [moveOut, zoomOut];

    case "miniCity":
      moveOut.setKeys(moveOut_miniCity_keys);
      return [moveOut, zoomOut];

    case "house":
      moveOut.setKeys(moveOut_house_keys);
      return [moveOut, zoomOut];
  }
}

export function moveToTargetAnim(camera: any, scene: any, targetName: string) {
  const result: any = getTargetAnimations(
    camera.radius,
    camera.target,
    targetName
  );

  if (result) {
    const { animations, cameraSetting } = result;
    scene.beginDirectAnimation(camera, animations, 0, 25 * frameRate, true);

    return cameraSetting;
  }
}

export function returnToDefaultAnim(
  camera: any,
  scene: any,
  targetName: string
) {
  const animations = getReturnAnimations(
    camera.radius,
    camera.target,
    targetName
  );
  scene.beginDirectAnimation(camera, animations, 0, 25 * frameRate, true);
}
