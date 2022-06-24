import { useEffect } from "react";
import {
  SceneLoader,
  Vector3,
  MeshBuilder,
  PhysicsImpostor,
} from "@babylonjs/core";
import { useScene } from "react-babylonjs";
import "@babylonjs/loaders";

function Character(): any {
  const scene: any = useScene();

  // const camera1 = new ArcRotateCamera(
  //   "camera1",
  //   Math.PI / 2.2,
  //   Math.PI / 2.5,
  //   40,
  //   new Vector3(0, -5, 0),
  //   scene
  // );
  // scene.activeCamera = camera1;
  // scene.activeCamera.attachControl();
  // camera1.lowerRadiusLimit = 2;
  // camera1.upperRadiusLimit = 100;
  // camera1.wheelDeltaPercentage = 0.09;

  // camera1.checkCollisions = true;

  // const inputMap = {};
  // scene.actionManager = new ActionManager(scene);
  // scene.actionManager.registerAction(
  //   new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
  //     inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
  //   })
  // );
  // scene.actionManager.registerAction(
  //   new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
  //     inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
  //   })
  // );

  useEffect(() => {
    SceneLoader.ImportMesh(
      "",
      "model/",
      "HVGirl.glb",
      scene,
      function (newMeshes, particleSystems, skeletons, animationGroups) {
        const avatar = newMeshes[0];
        avatar.scaling.scaleInPlace(0.03);

        const authoredStartPosition = new Vector3(-1.5, 0, 0);
        const authoredCenterMassOffset = new Vector3(0, 0, 0);

        avatar.position = authoredCenterMassOffset;

        const bodyVisible = false;
        const box = MeshBuilder.CreateBox(
          "box1",
          { width: 2, height: 2, depth: 1 },
          scene
        );

        box.position.y = 1;
        box.isVisible = bodyVisible;
        avatar.addChild(box);

        box.physicsImpostor = new PhysicsImpostor(
          box,
          PhysicsImpostor.BoxImpostor,
          { mass: 0 },
          scene
        );

        avatar.physicsImpostor = new PhysicsImpostor(
          avatar,
          PhysicsImpostor.NoImpostor,
          { mass: 1 },
          scene
        );

        avatar.position = authoredStartPosition;

        // // Add animations
        // const heroSpeed = 0.08;
        // const heroSpeedBackwards = 0.01;
        // const heroRotationSpeed = 0.1;

        // let animating = true;

        // const walkAnim = scene.getAnimationGroupByName("Walking");
        // const walkBackAnim = scene.getAnimationGroupByName("WalkingBack");
        // const idleAnim = scene.getAnimationGroupByName("Idle");
        // const sambaAnim = scene.getAnimationGroupByName("Samba");

        // //Rendering loop (executed for everyframe)
        // scene.onBeforeRenderObservable.add(() => {
        //   let keydown = false;
        //   //Manage the movements of the character (e.g. position, direction)
        //   if (inputMap["w"]) {
        //     hero.moveWithCollisions(hero.forward.scaleInPlace(heroSpeed));
        //     keydown = true;
        //   }
        //   if (inputMap["s"]) {
        //     hero.moveWithCollisions(
        //       hero.forward.scaleInPlace(-heroSpeedBackwards)
        //     );
        //     keydown = true;
        //   }
        //   if (inputMap["a"]) {
        //     hero.rotate(BABYLON.Vector3.Up(), -heroRotationSpeed);
        //     keydown = true;
        //   }
        //   if (inputMap["d"]) {
        //     hero.rotate(BABYLON.Vector3.Up(), heroRotationSpeed);
        //     keydown = true;
        //   }
        //   if (inputMap["b"]) {
        //     keydown = true;
        //   }

        //   //Manage animations to be played
        //   if (keydown) {
        //     if (!animating) {
        //       animating = true;
        //       if (inputMap["s"]) {
        //         //Walk backwards
        //         walkBackAnim.start(
        //           true,
        //           1.0,
        //           walkBackAnim.from,
        //           walkBackAnim.to,
        //           false
        //         );
        //       } else if (inputMap["b"]) {
        //         //Samba!
        //         sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
        //       } else {
        //         //Walk
        //         walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
        //       }
        //     }
        //   } else {
        //     if (animating) {
        //       //Default animation is idle when no key is down
        //       idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);

        //       //Stop all animations besides Idle Anim when no key is down
        //       sambaAnim.stop();
        //       walkAnim.stop();
        //       walkBackAnim.stop();

        //       //Ensure animation are played only once per rendering loop
        //       animating = false;
        //     }
        //   }
        // });
      }
    );
  }, [scene]);

  return null;
}

export default Character;
