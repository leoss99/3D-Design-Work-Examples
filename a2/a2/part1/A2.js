/*
 * UBC CPSC 314, 2021WT1
 * Assignment 2 Template
 */

// Setup and return the scene and related objects.
// You should look into js/setup.js to see what exactly is done here.
const {
  renderer,
  scene,
  camera,
  worldFrame,
} = setup();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Initialize uniforms
var clock = new THREE.Clock;

const lightOffset = { type: 'v3', value: new THREE.Vector3(0.0, 5.0, 5.0) };

const time = {type: 'float', value: clock.elapsedTime}

// Materials: specifying uniforms and shaders

const armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightOffset: lightOffset,
  }
});

const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    // HINT pass uniforms to sphere shader here
    time:time,
  }
});

const eyeMaterial = new THREE.ShaderMaterial();

const armadilloFrame = new THREE.Object3D();
armadilloFrame.position.set(0, 0, -8);

scene.add(armadilloFrame);

const transformationMatrixR = {type: 'mat4', value: new THREE.Matrix4()};
const transformationMatrixL = {type: 'mat4', value: new THREE.Matrix4()};

// Load shaders.
const shaderFiles = [
  'glsl/armadillo.vs.glsl',
  'glsl/armadillo.fs.glsl',
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl',
  'glsl/eye.vs.glsl',
  'glsl/eye.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];

  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];

  eyeMaterial.vertexShader = shaders['glsl/eye.vs.glsl'];
  eyeMaterial.fragmentShader = shaders['glsl/eye.fs.glsl'];


});

// Load and place the Armadillo geometry.
loadAndPlaceOBJ('obj/armadillo.obj', armadilloMaterial, armadilloFrame, function (armadillo) {
  armadillo.rotation.y = Math.PI;
  armadillo.position.y = 5.3
  armadillo.scale.set(0.1, 0.1, 0.1);
});

// https://threejs.org/docs/#api/en/geometries/SphereGeometry
const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const sphereLight = new THREE.PointLight(0xffffff, 1, 100);
scene.add(sphereLight);
sphereLight.position.set(0, 10, 0);

sphere.position.set(0, 10, 5);


// Eyes (Q1a and Q1b)
// Create the eye ball geometry
const eyeGeometry = new THREE.SphereGeometry(1.0, 32, 32);

// HINT Q1a: Add the eyes on the armadillo here.
const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
rightEye.scale.set(0.5, 0.5, 0.5);
scene.add(rightEye);
rightEye.position.set(armadilloFrame.position.x-0.8, armadilloFrame.position.y+12.2, armadilloFrame.position.z+3.7);

const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.scale.set(0.5, 0.5, 0.5);
scene.add(leftEye);
leftEye.position.set(armadilloFrame.position.x+0.8, armadilloFrame.position.y+12.2, armadilloFrame.position.z+3.7);


// Laser Beams (Q1b Q1c)

// Distance threshold beyond which the armadillo should shoot lasers at the sphere (needed for Q1c).
const LaserDistance = 10.0;

const laserGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1.0);
const laserMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: false });

// HINT Q1b: create the two lasers and apply the appropriate transformations.
//           you can use a Quaternion object for the rotation and a generic Object3D for scaling.
// HINT: Create meshes for the lasers with the above geometry and material
// HINT: What should we use as the parent objects for the laser meshes?

//rightlaser
const rightLaser = new THREE.Mesh(laserGeometry, laserMaterial);

const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI / 2 );
rightLaser.applyQuaternion( quaternion );

rightEye.add(rightLaser);

//leftlaser
const leftLaser = new THREE.Mesh(laserGeometry, laserMaterial);

leftLaser.applyQuaternion( quaternion );

leftEye.add(leftLaser);



// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {

  //HINT: Use keyboard.pressed to check for keyboard input. 
  //Example: keyboard.pressed("A") to check if the A key is pressed.
  if (keyboard.pressed("W"))
      sphere.position.z -= 0.1;
    else if (keyboard.pressed("S"))
      sphere.position.z += 0.1;

    if (keyboard.pressed("A"))
      sphere.position.x -= 0.1;
    else if (keyboard.pressed("D"))
      sphere.position.x += 0.1;

    if (keyboard.pressed("Q"))
      sphere.position.y += 0.1;
    else if (keyboard.pressed("E"))
      sphere.position.y -= 0.1;

  // The following tells three.js that some uniforms might have changed.
  armadilloMaterial.needsUpdate = true;
  sphereMaterial.needsUpdate = true;
  eyeMaterial.needsUpdate = true;

  // Distance to orb
  // HINT Q1b and Q1c: set/update the position (for static and tracking lasers) and scale (laser length) needed for tracking here.
  
  // HINT: three.js Positions have a distanceTo function which gives you the distance between two points.

  // HINT: three.js Meshes have a visible property which you can use to hide or show the lasers.
  
}



// Setup update callback
function update() {
  checkKeyboard();

  time.value += 1/60;//Assumes 60 frames per second

  // HINT: Use one of the lookAt functions available in three.js to make the eyes look at the orb.
  rightEye.lookAt(sphere.position);
  leftEye.lookAt(sphere.position);

  const length = sphere.position.distanceTo(rightEye.position);
  rightLaser.position.set( 0,
                           0,
                           length);

rightLaser.scale.set(1,2*length,1);
if(length>LaserDistance){rightLaser.visible = false;}
else rightLaser.visible = true;

const length1 = sphere.position.distanceTo(leftEye.position);
leftLaser.position.set( 0,
                        0,
                        length1);

leftLaser.scale.set(1,2*length1,1);
if(length1>LaserDistance){leftLaser.visible = false;}
else leftLaser.visible = true;


  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

// Start the animation loop.
update();
