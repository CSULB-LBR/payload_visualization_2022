import React from "react";
import { ArcRotateCamera, UniversalCamera, Vector3, HemisphericLight, MeshBuilder, Mesh, Color3, StandardMaterial, Texture, Material } from "@babylonjs/core";
import { Curve3 } from "@babylonjs/core";
import { Scene, KeyboardEventTypes } from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";
import BabylonScene from "./BabylonScene"; // uses above component in same directory
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
//import "./App.css";

let box: Mesh;

const onSceneReady = (scene: Scene): void => {
  // This creates and positions a free camera (non-mesh)
  const camera = new ArcRotateCamera("RotatingCamera", Math.PI / 4, Math.PI / 4, 5000, Vector3.Zero(), scene);
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.wheelPrecision = 0.1;
  camera.maxZ = 20000;
  camera.upperRadiusLimit = 10000;
  camera.lowerRadiusLimit = 25;

  // Parameters : name, position, scene
  const fixedCamera = new UniversalCamera("TopView", new Vector3(0, 5000, 0), scene);
  
  // Targets the camera to a particular position. In this case the scene origin
  fixedCamera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  scene.activeCamera = camera;

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;
  light.specular = new Color3(0.0);

  // Our built-in 'box' shape.
  // box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // Move the box upward 1/2 its height
  // box.position.y = 1;

  // Our built-in 'ground' shape.
  // MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

  scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case KeyboardEventTypes.KEYDOWN:
        switch (kbInfo.event.key) {
          case 'c':
            scene.activeCamera = scene.activeCamera === camera ? fixedCamera : camera;
            scene.activeCamera.restoreState();
            break;
        }
        break;
    }
  });

  buildGridLines(5000, 250, scene);
  buildTerrain(5000, scene);
  buildCubicBezierCurve(Vector3.Zero(),
  new Vector3(300, 800, 400),
  new Vector3(600, 800, 600),
  new Vector3(625, 0, 625), 60, scene);
  buildLandingPoint(new Vector3(625, 10, 625), scene);
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
  groundMaterial.diffuseTexture = new Texture("assets/terrain.jpg", scene);

  const ground = MeshBuilder.CreateGround("terrain", { width: size, height: size }, scene);
  ground.material = groundMaterial;
};

const buildCubicBezierCurve = (origin: Vector3, c1: Vector3, c2: Vector3, 
                               end: Vector3, numPoints: number, scene: Scene) => {
  // CURVE3 : Bezier Cubic Curve
  const cubicBezierVectors = Curve3.CreateCubicBezier(origin, c1, c2, end, numPoints);
    
  const cubicBezierCurve = Mesh.CreateLines("cbezier", cubicBezierVectors.getPoints(), scene);
  cubicBezierCurve.color = new Color3(0, 1, 0);
};

const buildLandingPoint = (location: Vector3, scene: Scene) => {
  /*const marker = Mesh.CreateLines('landing', [location.add(new Vector3(-125, 0, -125)),
                                              location.add(new Vector3(125, 0, 125)),
                                              location.add(new Vector3(-125, 0, 125)),
                                              location.add(new Vector3(125, 0, -125))],
                                              scene);*/
  const marker = MeshBuilder.CreateGround('landing', { width: 250, height: 250 }, scene);
  marker.position = location;
  const groundMaterial = new StandardMaterial('landingMaterial', scene);
  groundMaterial.diffuseColor = new Color3(1, 0, 0);
  groundMaterial.alpha = 0.5;
  marker.material = groundMaterial;
}

const PayloadScene = () => (
    <BabylonScene antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
);

export default PayloadScene;