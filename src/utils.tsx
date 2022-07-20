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

const frameRate = 20;
let currentRadius: number;
let currentTarget: Vector3;

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
    frame: 1 * frameRate,
    value: radius - 3,
  });

  zoomIn.setKeys(zoomIn_keys);
  currentRadius = radius - 3;

  //camera move forward
  const movein = new Animation(
    "moveIn",
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
    value: new Vector3(-1.5, -0.03, 1.5),
  });

  // for Store Model
  const movein_store_keys = [];

  movein_store_keys.push({
    frame: 0,
    value: Vector3.Zero(),
  });

  movein_store_keys.push({
    frame: 1 * frameRate,
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
    value: new Vector3(0, 0, -2),
  });

  switch (targetName) {
    case "room":
      movein.setKeys(movein_room_keys);
      currentTarget = new Vector3(-1.5, -0.03, 1.5);
      return [movein, zoomIn];

    case "store":
      movein.setKeys(movein_store_keys);
      currentTarget = new Vector3(0.5, 0, 0);
      return [movein, zoomIn];

    case "miniCity":
      movein.setKeys(movein_miniCity_keys);
      currentTarget = new Vector3(0, 0.2, 3);
      return [movein, zoomIn];

    case "house":
      movein.setKeys(movein_house_keys);
      currentTarget = new Vector3(0, 0, -2);
      return [movein, zoomIn];
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
    value: currentRadius,
  });

  zoomOut_keys.push({
    frame: 1 * frameRate,
    value: currentRadius + 3,
  });

  zoomOut.setKeys(zoomOut_keys);

  const alpha = new Animation(
    "alpha",
    "alpha",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const alpha_keys = [];

  alpha_keys.push({
    frame: 0,
    value: 3.141592653589793,
  });

  alpha.setKeys(alpha_keys);

  const roomAlpha = new Animation(
    "roomAlpha",
    "alpha",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const roomAlpha_keys = [];

  roomAlpha_keys.push({
    frame: 0,
    value: 3.2,
  });

  roomAlpha_keys.push({
    frame: 1 * frameRate,
    value: 3.141592653589793,
  });

  roomAlpha.setKeys(roomAlpha_keys);

  const beta = new Animation(
    "beta",
    "beta",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const beta_keys = [];

  beta_keys.push({
    frame: 0,
    value: 1.078689775673263,
  });

  beta.setKeys(beta_keys);

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
    value: currentTarget,
  });

  moveOut_room_keys.push({
    frame: 1 * frameRate,
    value: Vector3.Zero(),
  });

  // for Store Model
  const moveOut_store_keys = [];

  moveOut_store_keys.push({
    frame: 0,
    value: currentTarget,
  });

  moveOut_store_keys.push({
    frame: 1 * frameRate,
    value: Vector3.Zero(),
  });

  // for MiniCity Model
  const moveOut_miniCity_keys = [];

  moveOut_miniCity_keys.push({
    frame: 0,
    value: currentTarget,
  });

  moveOut_miniCity_keys.push({
    frame: 1 * frameRate,
    value: Vector3.Zero(),
  });

  // for House Model
  const moveOut_house_keys = [];

  moveOut_house_keys.push({
    frame: 0,
    value: currentTarget,
  });

  moveOut_house_keys.push({
    frame: 1 * frameRate,
    value: Vector3.Zero(),
  });

  switch (targetName) {
    case "room":
      moveOut.setKeys(moveOut_room_keys);
      return [moveOut, zoomOut, roomAlpha, beta];

    case "store":
      moveOut.setKeys(moveOut_store_keys);
      return [moveOut, zoomOut];

    case "miniCity":
      moveOut.setKeys(moveOut_miniCity_keys);
      return [moveOut, zoomOut, alpha, beta];

    case "house":
      moveOut.setKeys(moveOut_house_keys);
      return [moveOut, zoomOut, alpha, beta];
  }
}

export function moveToTargetAnim(camera: any, scene: any, targetName: string) {
  const animations: any = getTargetAnimations(
    camera.radius,
    camera.target,
    targetName
  );

  if (animations) {
    scene.beginDirectAnimation(camera, animations, 0, 25 * frameRate, true);
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

  if (animations) {
    scene.beginDirectAnimation(camera, animations, 0, 25 * frameRate, true);
  }
}
