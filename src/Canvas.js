import "./Canvas.css";
import React from "react";
import { Scene } from "./Scene.js";

export class Canvas extends React.Component {
  componentDidMount() {
    var scene = new Scene(
      document.getElementById("canvas").offsetWidth,
      document.getElementById("canvas").offsetHeight
    );
    this.mount.appendChild(scene.element);
    scene.render();
  }

  render() {
    return <div id="canvas" ref={(ref) => (this.mount = ref)} />;
  }
}
