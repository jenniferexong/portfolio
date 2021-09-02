import * as THREE from "three";
import CreateTrack from "./track.js";

const CreateTrain = (gltf, meshName, actionName) => {
  const mesh_ = gltf.scene.children.find((child) => child.name === meshName);
  if (mesh_ == undefined) {
    console.log("train mesh not found:", meshName);
  }

  // train animation
  let action_;
  const mixer_ = new THREE.AnimationMixer(gltf.scene);
  {
    const clips = gltf.animations;
    const trainClip = THREE.AnimationClip.findByName(clips, actionName);
    if (trainClip == undefined) {
      console.log("train action not found:", actionName);
    }
    action_ = mixer_.clipAction(trainClip);
  }
  // starting stop
  const track_ = CreateTrack();
  let targetStop_ = "aboutMe";
  let route_ = {
    remainingDist: 0,
    direction: 0,
  };

  // init to stationary
  action_.timeScale = 0;
  action_.time = track_.getStationLoc("aboutMe");
  // start animation
  action_.play();
  let speed_ = 0;
  const maxSpeed_ = 1.3;

  return {
    mesh: mesh_,
    action: action_,
    track: track_,

    position: () => {
      return mesh_.position;
    },

    setTargetStop: (stopName) => {
      console.log("next stop:", stopName);
      // deselect previous button
      document.getElementById(targetStop_).classList.remove("selected");

      // select target stop buttonf:w
      targetStop_ = stopName;
      document.getElementById(targetStop_).classList.add("selected");

      // get route to next stop
      route_ = track_.calculateRoute(
        action_.time,
        track_.getStationLoc(targetStop_)
      );
      // todo add acceleration
      speed_ = route_.direction * maxSpeed_;
    },

    update: (delta) => {
      action_.timeScale = speed_;
      if (mixer_) mixer_.update(delta);

      // check for overshooting stop
      route_.remainingDist -= Math.abs(delta * speed_);

      if (route_.remainingDist < 0) {
        action_.time = track_.getStationLoc(targetStop_);
        speed_ = 0;
      }
    },
  };
};

export default CreateTrain;
