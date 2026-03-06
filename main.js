// main.js
import * as THREE from "three";
import { MindARThree } from "mindar-image-three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const mindarThree = new MindARThree({
  container: document.body,
  imageTargetSrc: "./targets.mind",
});

const { renderer, scene, camera } = mindarThree;

// Luz
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
scene.add(light);

// Cargar logo 3D
const loader = new GLTFLoader();
loader.load("./stadio.glb", (gltf) => {
  const logo = gltf.scene;
  logo.scale.set(0.1, 0.1, 0.1); // ajusta el tamaño

  // Anclarlo al image target (tarjeta)
  const anchor = mindarThree.addAnchor(0);
  anchor.group.add(logo);

  // Mostrar menú cuando se detecta la tarjeta
  anchor.onTargetFound = () => {
    document.getElementById("menu").classList.add("visible");
    // Animación de aparición
    let scale = 0;
    const grow = setInterval(() => {
      scale = Math.min(scale + 0.01, 0.1);
      logo.scale.set(scale, scale, scale);
      if (scale >= 0.1) clearInterval(grow);
    }, 16);
  };

  // Ocultar menú cuando pierde la tarjeta
  anchor.onTargetLost = () => {
    document.getElementById("menu").classList.remove("visible");
  };
});

// Rotación continua del logo en AR
const animate = () => {
  requestAnimationFrame(animate);
  scene.traverse((obj) => {
    if (obj.isMesh) obj.rotation.y += 0.01;
  });
  renderer.render(scene, camera);
};

mindarThree.start().then(() => animate());
