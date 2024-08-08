import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js";
import { models } from "./models.js"; // Adjust the path as necessary

const MAX_VIEWPORT_WIDTH = 400;
const MAX_VIEWPORT_HEIGHT = 400;

let currentModelIndex = 0;
let scene, camera, renderer, controls, effect, loader;
let model;

init();
loadModel(models[currentModelIndex].url);
updateModelInfo();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 1.5, 8);

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("molcanvas"),
  });

  adjustRendererSize();
  renderer.setClearColor(0xffffff, 1); // Set background color to white
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  effect = new OutlineEffect(renderer, {
    defaultThickness: 0.005,
    defaultColor: [0, 0, 0], // Black color
    defaultAlpha: 1.0,
    defaultKeepAlive: true, // Keeps the outline effect after the original object is removed
  });

  loader = new GLTFLoader();

  // Add a basic light to make the models visible
  const light = new THREE.AmbientLight(0xffffff, 3);
  scene.add(light);

  /*window.addEventListener("resize", onWindowResize);*/
  window.addEventListener("keydown", onDocumentKeyDown);
}

function loadModel(url) {
  if (model) {
    scene.remove(model);
  }

  loader.load(url, (gltf) => {
    model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.flatShading = true;
        child.material.needsUpdate = true;
      }
    });
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    scene.add(model);
  });
}

/*function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}*/

function adjustRendererSize() {
  const width = Math.min(window.innerWidth, MAX_VIEWPORT_WIDTH);
  const height = Math.min(window.innerHeight, MAX_VIEWPORT_HEIGHT);
  renderer.setSize(width, height);
}

function onDocumentKeyDown(event) {
  if (event.key === "ArrowRight") {
    currentModelIndex = (currentModelIndex + 1) % models.length;
    loadModel(models[currentModelIndex].url);
    updateModelInfo();
  } else if (event.key === "ArrowLeft") {
    currentModelIndex = (currentModelIndex - 1 + models.length) % models.length;
    loadModel(models[currentModelIndex].url);
    updateModelInfo();
  }
}

function updateModelInfo() {
  document.getElementById("modelName").textContent =
    models[currentModelIndex].name;
  document.getElementById("modelDescription").innerHTML =
    models[currentModelIndex].description;
}

document.addEventListener("DOMContentLoaded", () => {
  const previousButton = document.querySelector(".control-button.prev");
  const nextButton = document.querySelector(".control-button.next");

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      currentModelIndex =
        (currentModelIndex - 1 + models.length) % models.length;
      loadModel(models[currentModelIndex].url);
      updateModelInfo();
      console.log("Previous button clicked");
    });
  } else {
    console.error("Previous button not found");
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      currentModelIndex = (currentModelIndex + 1) % models.length;
      loadModel(models[currentModelIndex].url);
      updateModelInfo();
      console.log("Next button clicked");
    });
  } else {
    console.error("Next button not found");
  }
});

// Event listener for previous model button click
/*prevButton.addEventListener("click", () => {
  currentModelIndex = (currentModelIndex - 1 + models.length) % models.length;
  loadModel(models[currentModelIndex].url);
  updateModelInfo();
});

// Event listener for next model button click
nextButton.addEventListener("click", () => {
  currentModelIndex = (currentModelIndex + 1) % models.length;
  loadModel(models[currentModelIndex].url);
  updateModelInfo();
});*/

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y += 0.005; // Adjust the speed of rotation as needed
  }
  controls.update();
  effect.render(scene, camera);
}

animate();
