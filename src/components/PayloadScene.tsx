import React from "react";
import { ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, Mesh, Color3, StandardMaterial, Texture } from "@babylonjs/core";
import { Curve3 } from "@babylonjs/core";
import { Scene, KeyboardEventTypes } from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";
import {AdvancedDynamicTexture, TextBlock} from "@babylonjs/gui"
import BabylonScene from "./BabylonScene"; // uses above component in same directory
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
//import "./App.css";

const onSceneReady = (scene: Scene): void => {
  // This creates and positions a free camera (non-mesh)
  const camera = new ArcRotateCamera("RotatingCamera", -Math.PI / 2, Math.PI / 4, 5000, Vector3.Zero(), scene);
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.wheelPrecision = 0.1;
  camera.maxZ = 20000;
  camera.upperRadiusLimit = 10000;
  camera.lowerRadiusLimit = 25;

  // Creates the bird's eye view camera 
  const fixedCamera = new ArcRotateCamera("TopView", -Math.PI / 2, 0, 5600, Vector3.Zero(), scene);
  fixedCamera.wheelPrecision = 0.1;
  
  // Targets the camera to a particular position. In this case the scene origin
  fixedCamera.setTarget(Vector3.Zero());

  // Remove all inputs for the camera, we don't want to handle any.
  fixedCamera.inputs.clear();
  fixedCamera.inputs.addMouseWheel();

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  scene.activeCamera = camera;

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 1;
  light.specular = new Color3(0.0);


  // press c to change the camera
  scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case KeyboardEventTypes.KEYDOWN:
        switch (kbInfo.event.key) {
          case 'c':
            const previous = scene.activeCamera === camera ? camera : fixedCamera;
            scene.activeCamera = scene.activeCamera === camera ? fixedCamera : camera;
            scene.activeCamera.restoreState();
            previous.detachControl(canvas);
            scene.activeCamera.attachControl(canvas, true);
            break;
        }
        break;
    }
  });
  const floor_height = 10;
  var x_in, z_in;
  buildGridLines(5000, 250, scene);
  buildTerrain(5000, scene);
  buildLabels(5000, 250, scene);

  //inputs from grid estimation of dead reckoning program
  x_in = 375;
  z_in = 875;

  // //estimated true curve
  // buildCubicBezierCurve(Vector3.Zero(),new Vector3(-100, 4700, 170),new Vector3(250, 100, 555),new Vector3(x_in, 0, z_in), 60, scene, new Color3(0,1,0));
  // buildCubicBezierCurve(Vector3.Zero(),new Vector3(-200, 4500, 51),new Vector3(300, 500, 400),new Vector3(-750, 0, 591), 60, scene, new Color3(1,0,1));
  // //calculated curve + dead reckoned curve
  // buildLandingPoint(new Vector3(x_in, floor_height, z_in), scene, new Color3(0,1,0));
  // buildLandingPoint(new Vector3(-875, floor_height, 625), scene, new Color3(1,0,1));

  buildLaunchRail(Vector3.Zero(), scene);
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene): void => {
  /*if (box !== undefined) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }*/
};

const buildGridLines = (size: number, delta: number, scene: Scene): void => {
  const groundMaterial = new GridMaterial("groundMaterial", scene);
	groundMaterial.majorUnitFrequency = delta;
	groundMaterial.minorUnitVisibility = 0.5;
	groundMaterial.gridRatio = delta;
	groundMaterial.backFaceCulling = false;
	groundMaterial.mainColor = new Color3(1, 1, 1);
	groundMaterial.lineColor = new Color3(1.0, 1.0, 1.0);
	groundMaterial.opacity = 0.98;

	const ground = MeshBuilder.CreateGround("ground", { width: size, height: size }, scene);
	ground.material = groundMaterial;
  ground.position.y = 10;
};

const buildTerrain = (size: number, scene: Scene) => {
  const groundMaterial = new StandardMaterial('terrainMaterial', scene);
  //texture for FAR field
  // groundMaterial.diffuseTexture = new Texture("assets/FARSCrop.png", scene);
  //texture for MDARS field
  groundMaterial.diffuseTexture = new Texture("assets/MDARSCrop.png", scene);

  const ground = MeshBuilder.CreateGround("terrain", { width: size, height: size }, scene);
  ground.material = groundMaterial;
};

const buildCubicBezierCurve = (origin: Vector3, c1: Vector3, c2: Vector3, 
                               end: Vector3, numPoints: number, scene: Scene, color: Color3) => {
  // CURVE3 : Bezier Cubic Curve
  const cubicBezierVectors = Curve3.CreateCubicBezier(origin, c1, c2, end, numPoints);
    
  const cubicBezierCurve = Mesh.CreateLines("cbezier", cubicBezierVectors.getPoints(), scene);
  cubicBezierCurve.color = color;
};

const buildLandingPoint = (location: Vector3, scene: Scene, color: Color3) => {
  /*const marker = Mesh.CreateLines('landing', [location.add(new Vector3(-125, 0, -125)),
                                              location.add(new Vector3(125, 0, 125)),
                                              location.add(new Vector3(-125, 0, 125)),
                                              location.add(new Vector3(125, 0, -125))],
                                              scene);*/
  const marker = MeshBuilder.CreateGround('landing', { width: 250, height: 250 }, scene);

  // //mapping in order to have 1-1 coordinate input
  // if(location._x == 1){
  //   location.set(location._x*125, location._y, location._z);
  // }
  // if(location._z == 1){
  //   location.set(location._x, location._y, location._z*125);
  // }
  // else{
  //   location.set((location._x*250)+125, location._y, (location._z*250)+125);
  // }

  marker.position = location;
  const groundMaterial = new StandardMaterial('landingMaterial', scene);
  groundMaterial.diffuseColor = color;
  groundMaterial.alpha = 0.5;
  marker.material = groundMaterial;
}

const buildLaunchRail = (location: Vector3, scene:Scene) => {
  const launchRail = Mesh.CreateSphere("launchRail", 16, 50, scene);
  launchRail.position = location;
  const launchRailMaterial = new StandardMaterial('launchRailMaterial', scene);
  launchRailMaterial.diffuseColor = new Color3(0,.2,1);
  launchRail.material = launchRailMaterial;

//  label launch rail
  // const plane = MeshBuilder.CreateGround('launch', { width: 500, height: 500 }, scene);
  // plane.position.x = -2600;
  // plane.position.y = 100;
  // //plane.parent = launchRail;
  // //plane.position.y = 50;
  // //plane.position.x = 5;
  // //plane.position.z = 5;
  // //plane.rotate
  // const texture = AdvancedDynamicTexture.CreateForMesh(plane);
  // const label = new TextBlock();
  // label.text = "A";
  // label.fontSize = 400;
  // label.color = "red";
  // texture.addControl(label);
}

const buildLabels = (size: number, delta: number, scene: Scene) => {
  var charCode = 65;
  var count = 1;
  for (var start = (size / 2); start > -(size / 2); start -= delta) {
    const plane = MeshBuilder.CreateGround(`label${start}`, { width: 250, height: 250 }, scene);
    plane.position.x = -2625;
    plane.position.z = start - (delta / 2);
    const texture = AdvancedDynamicTexture.CreateForMesh(plane);
    const label = new TextBlock();
    label.text = String.fromCharCode(charCode++);
    label.fontSize = 600;
    label.color = "white";
    texture.addControl(label);

    const plane2 = MeshBuilder.CreateGround(`label${start}-${count}`, { width: 250, height: 250 }, scene);
    plane2.position.x = (-start + (delta / 2));
    plane2.position.z = 2625;
    const texture2 = AdvancedDynamicTexture.CreateForMesh(plane2);
    const label2 = new TextBlock();
    label2.text = (count++).toString();
    label2.fontSize = 600;
    label2.color = "white";
    texture2.addControl(label2);
  }
  // const plane = MeshBuilder.CreateGround('launch', { width: 500, height: 500 }, scene);
  // plane.position.x = -2600;
  // plane.position.y = 100;
  // //plane.parent = launchRail;
  // //plane.position.y = 50;
  // //plane.position.x = 5;
  // //plane.position.z = 5;
  // //plane.rotate
  // const texture = AdvancedDynamicTexture.CreateForMesh(plane);
  // const label = new TextBlock();
  // label.text = "A";
  // label.fontSize = 400;
  // label.color = "red";
  // texture.addControl(label);
};


const PayloadScene = () => (
    <BabylonScene antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
);

export default PayloadScene;