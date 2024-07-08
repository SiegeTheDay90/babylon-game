// import * as BABYLON from "@babylonjs/core/Legacy/legacy";

import { ArcRotateCamera, Color3, FreeCamera, SceneLoader } from "@babylonjs/core";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateSphere, CreateBox, CreateGround } from "@babylonjs/core/Meshes/Builders";
import { Scene } from "@babylonjs/core/scene";

import { GridMaterial } from "@babylonjs/materials/";

// Get the canvas element from the DOM.
const canvas = document.getElementById("babylon-canvas");

// Associate a Babylon Engine to it.
const engine = new Engine(canvas);

// Create our first scene.
var scene = new Scene(engine);

let groundMesh, houseMeshes;

// Load the House and Ground model
SceneLoader.ImportMeshAsync("", "/models/", "both_houses_scene.babylon", scene).then((result) => {
  groundMesh = result.meshes[0]; // 
  
  houseMeshes = result.meshes.slice(1);

  // debugger;

  if(!groundMesh || !houseMeshes.length) return;

  houseMeshes.forEach((house) => {
    house.position.y = 1; // Move the model up a bit
    house.scaling = new Vector3(1.5, 1.5, 1.5);
  });
  groundMesh.position.y = 0.1;
  groundMesh.scaling = new Vector3(5, 1, 5);

  console.log(scene.meshes);

  // importedMesh.scaling = new BABYLON.Vector3(0.75, 0.75, 0.75); // Scale the model down (adjust values)
  // importedMesh.position.y = 2;


  // (Optional) Access materials and textures of the loaded model (refer to Babylon.js documentation for details)
  // importedMesh.material // Access the material of the loaded mesh
}).catch((error) => {
  console.error("Error loading model:", error);
});


// This creates and positions a free camera (non-mesh)
var camera = new ArcRotateCamera("main-camera", 0.25, 1.1, 60, Vector3.Zero(), scene);

// This targets the camera to scene origin
// camera.setTarget(Vector3.Zero());

// This attaches the camera to the canvas
// camera.attachControl(canvas, true);

// This creates a light, aiming 0,-1,0 - to the sky (non-mesh)
var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;


// Ground
var ground = CreateGround("ground", { width: 25, height: 25, subdivisions: 4 }, scene);
var groundMaterial = new GridMaterial("grid", scene);
ground.material = groundMaterial;
groundMaterial.mainColor = new Color3(0.9, 0.9, 0.9);
groundMaterial.lineColor = Color3.Black();
ground.visibility = 1;




// Player 
var cursor = CreateBox("cursor", { size: 1 }, scene);
var cursorMaterial = new GridMaterial("grid", scene);
cursor.position.y = 5;
cursor.material = cursorMaterial;
cursorMaterial.mainColor = Color3.Red();
cursorMaterial.lineColor = Color3.Black();


// Mouse Move Event
canvas.addEventListener("mousemove", (event) => {
  var pickResult = scene.pick(scene.pointerX, scene.pointerY);

  if (pickResult.hit && pickResult.pickedMesh.name === "ground") {
    var pickedPoint = pickResult.pickedPoint; // The point on the mesh that was picked
    pickedPoint.y = 1;
    cursor.position = pickedPoint;
  }
})


// Render every frame
engine.runRenderLoop(() => {
  scene.render();
});