// HARRY POTTER AND THE FLIGHT OF FIRE
// By: Shaylene Beaudry and Angela Chen

// Template code from previous projects
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}
 
///////////////////
//     SETUP     //
///////////////////

// ON-SCREEN CONTROL PANEL

var messagePanel = document.createElement("div");
messagePanel.style.position = 'absolute';
messagePanel.style.left ='0px';
messagePanel.style.bottom = window.innerHeight/2+'px';
messagePanel.style.width = "100%";
messagePanel.style.textAlign = "center";
messagePanel.style.fontFamily = "Palatino Linotype";
messagePanel.style.fontSize = "36px";
messagePanel.style.color = "#00FC00";
document.body.appendChild(messagePanel);

var gameOverPanel = document.createElement("div");
messagePanel.appendChild(gameOverPanel);

var instructionsPanel = document.createElement("div");
instructionsPanel.textContent = "Press Spacebar to start playing";
messagePanel.appendChild(instructionsPanel);

var controlPanel = document.createElement("div");
controlPanel.style.position = 'absolute';
controlPanel.style.right = '0px';
controlPanel.style.bottom = '0px';
controlPanel.style.width = window.innerWidth/6;
controlPanel.style.height = window.innerHeight/8;
controlPanel.style.color = "#00FC00";
controlPanel.style.fontFamily = "Palatino Linotype";
document.body.appendChild(controlPanel);

var timeLeftPanel = document.createElement("div");
timeLeftPanel.textContent = "60 seconds left";
controlPanel.appendChild(timeLeftPanel);

var lifeBarPanel = document.createElement("div");
var lifeBarLabel = document.createElement("div");
lifeBarLabel.style.float = "left";
lifeBarLabel.style.padding = "0px 5px 0px 0px";
lifeBarLabel.textContent = "Health:";
var lifeBar = document.createElement("div");
lifeBar.id = "lifeBar";
lifeBarPanel.appendChild(lifeBarLabel);
lifeBarPanel.appendChild(lifeBar);
controlPanel.appendChild(lifeBarPanel);

var fpsPanel = document.createElement("div");
controlPanel.appendChild(fpsPanel);
fpsPanel.style.bottom = '0px';

// RENDERER & SCENE

var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({antialias:true});
canvas.appendChild(renderer.domElement);

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x000000, 1 );
renderer.autoClear = false;

// CAMERAS

// Main Perspective Camera
// field of view angle (change zoom), aspect ratio, near, far
var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1000);
camera.position.set(20,8,-50); // translates camera from object (x,y,z)
camera.lookAt(scene.position);
scene.add(camera);

// Map Orthographic Camera
var mapWidth = window.innerWidth/4, mapHeight = window.innerHeight/4;
var mapCamera = new THREE.OrthographicCamera(-window.innerWidth/4, window.innerWidth/4, // Left, Right
  window.innerHeight/4, -window.innerHeight/4, -250, 500); // Top, Bottom, Near, Far
mapCamera.up = new THREE.Vector3(0,0,-1);
mapCamera.lookAt( new THREE.Vector3(0,-1,0) );
scene.add(mapCamera);

// MOUSE ORBIT CONTROLS OF THE CAMERA

var controls = new THREE.OrbitControls(camera);
// disable use of keys to control camera
controls.noKeys = true;
// zoom restrictions
controls.minDistance = 20;
controls.maxDistance = 50;
// vertical rotation restrictions
controls.minPolarAngle = Math.PI/3;
controls.maxPolarAngle = 2*Math.PI/3;


// ADAPT TO WINDOW RESIZE

function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE

window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE

window.onscroll = function () {
  window.scrollTo(0,0);
}

// ATTACH LIGHT TO CAMERA

// for Lambert material
pointLight = new THREE.PointLight(0xffffff, 0.5);
camera.add(pointLight);
scene.add(camera);

////////////////////////////////////////
//   GLOBAL FUNCTIONS AND VARIABLES   //
////////////////////////////////////////

function rotateOnX(p) {
  var rotateX = new THREE.Matrix4().set(1,       0,        0,        0, 
                                        0, Math.cos(p),-Math.sin(p), 0, 
                                        0, Math.sin(p), Math.cos(p), 0,
                                        0,       0,        0,        1);
  return rotateX
}

function rotateOnY(p) {
  var rotateY = new THREE.Matrix4().set(Math.cos(p), 0, Math.sin(p), 0, 
                                                  0, 1,           0, 0, 
                                       -Math.sin(p), 0, Math.cos(p), 0,
                                                  0, 0,           0, 1);
  return rotateY
}

var onProgress = function(query) {
  if ( query.lengthComputable ) {
    var percentComplete = query.loaded / query.total * 100;
    console.log( Math.round(percentComplete, 2) + '% downloaded' );
  }
};

var onError = function() {
  console.log('Failed to load ' + file);
};

// CLOCK
var clock = new THREE.Clock(true);
var timeLastMovedRings = clock.getElapsedTime();
var timeLastMovedFires = clock.getElapsedTime();

// CONSTANTS

var INRADIUS = 50;
var OUTRADIUS = 150;
var HEIGHT = 60;
var HARRYSTART = (OUTRADIUS - INRADIUS)/2 + INRADIUS
var COLLIDE = (OUTRADIUS - INRADIUS)/2
var MAXHEALTH = 10;
var MAXPOTIONS = 5;
var MAXRINGS = 5;
var MAXFIRES = 10;
var MAXLIGHTS = 4;
var FORCEFIELDRADIUS = 5;

// TEXTURES

var textureLoader = new THREE.TextureLoader();
var inWallTexture = textureLoader.load('textures/inStone.jpg', function() {}, onProgress, onError);
var outWallTexture = textureLoader.load('textures/outStone.jpg', function() {}, onProgress, onError);
var ceilingTexture = textureLoader.load('textures/ceiling.jpg', function() {}, onProgress, onError);
var floorTexture = textureLoader.load('textures/floor.jpg', function() {}, onProgress, onError);
var snitchTexture = textureLoader.load('textures/snitch.jpg', function() {}, onProgress, onError);
var snitchCloudTexture = textureLoader.load('textures/spark.png', function() {}, onProgress, onError);
var fireTexture = textureLoader.load('textures/blue.png', function() {}, onProgress, onError);

// MATERIALS

var defaultMaterial = new THREE.MeshLambertMaterial();
var orbitMaterial = new THREE.MeshBasicMaterial({color: 0xB29600});
var inWallMaterial = new THREE.MeshLambertMaterial({map: inWallTexture, side: THREE.DoubleSide});
var outWallMaterial = new THREE.MeshLambertMaterial({map: outWallTexture, side: THREE.DoubleSide});
var floorMaterial = new THREE.MeshLambertMaterial({map: floorTexture, side: THREE.BackSide});
var ceilingMaterial = new THREE.MeshLambertMaterial({map: ceilingTexture, side: THREE.FrontSide});
var centerMaterial = new THREE.PointsMaterial({color: 0xE5C100, size: 0.3});
var potionMaterial = new THREE.MeshNormalMaterial();
var ringMaterial = new THREE.MeshBasicMaterial({color: 0xF0F000});
var snitchMaterial = new THREE.MeshBasicMaterial({map: snitchTexture});
var snitchCloudMaterial = new THREE.SpriteMaterial({map: snitchCloudTexture});
var mapWallMaterial = new THREE.MeshBasicMaterial({color: 0x0F0F0F});
var lightMaterial = new THREE.SpriteMaterial({map: fireTexture});
var fireMaterial = new THREE.MeshLambertMaterial({color: 0x9B30FF});

// TOON SHADER FOR HARRY MODEL

var lightColor = new THREE.Color(1,1,1); //I_light
var litColor = new THREE.Color(0.5,0.5,0);
var unLitColor = new THREE.Color(1,0,0);
var outlineColor = new THREE.Color(1,0,0);
var lightPosition = new THREE.Vector3(70,100,70); //L
var toneBalance = 0.5;

var toonMaterial = new THREE.ShaderMaterial({
  uniforms: {
     lightColor : {type : 'c', value: lightColor},
     litColor : {type : 'c', value: litColor},
     unLitColor : {type : 'c', value: unLitColor},
     outlineColor : {type : 'c', value: outlineColor},
     lightPosition : {type: 'v3', value: lightPosition},
     toneBalance : {type: 'f', value: toneBalance},
  },
})

var shaderFiles = [
  'glsl/toon.vs.glsl',
  'glsl/toon.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  toonMaterial.vertexShader = shaders['glsl/toon.vs.glsl'];
  toonMaterial.fragmentShader = shaders['glsl/toon.fs.glsl'];
  toonMaterial.needsUpdate = true;
});


//////////////////////////////
//     STATIC MODELLING     //
//////////////////////////////

// START LINE (code from P2)

function buildAxis( src, dst, colorHex, dashed ) {
  var geom = new THREE.Geometry(),
  mat;
  if(dashed) {
    mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
  } else {
    mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
  }
  geom.vertices.push( src.clone() );
  geom.vertices.push( dst.clone() );
  geom.computeLineDistances();
  var axis = new THREE.Line( geom, mat, THREE.LinePieces );
  return axis;
}
startLine = buildAxis(new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -150, 0, 0 ), 0xFF0000, false);
scene.add(startLine);

// ORBIT

var orbitGeometry = new THREE.CylinderGeometry(HARRYSTART, HARRYSTART, 0, 32, 1, true);
var orbit = new THREE.Line(orbitGeometry, orbitMaterial);
scene.add(orbit);

// WALLS

function createWall(radius, material, isInner) {
  var wall = new THREE.Object3D();
  var wallGeometry = new THREE.CylinderGeometry(radius, radius, HEIGHT, 32, 1, true);
  var wallMesh = new THREE.Mesh(wallGeometry, material);
  var torRadius;
  if (isInner) {
    torRadius = INRADIUS-2;
  } else {
    torRadius = OUTRADIUS+2;
  }
  var wallMapGeometry = new THREE.TorusGeometry(torRadius, 2, 32, 32);
  var torusMesh = new THREE.Mesh(wallMapGeometry, mapWallMaterial);
  torusMesh.applyMatrix(rotateOnX(Math.PI/2));
  wall.add(wallMesh);
  wall.add(torusMesh);
  scene.add(wall);
  return wall;
}

var inWall = createWall(INRADIUS,inWallMaterial, true);
var outWall = createWall(OUTRADIUS,outWallMaterial, false);

// CEILING AND FLOOR

function createPlane(material, posOrNeg) {
  var planeGeometry = new THREE.PlaneBufferGeometry(2*OUTRADIUS, 2*OUTRADIUS);
  var plane = new THREE.Mesh(planeGeometry, material);
  var translateMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,posOrNeg * HEIGHT/2, 0,0,1,0, 0,0,0,1);
  var rotateX = rotateOnX(Math.PI / 2);
  var finalMatrix = new THREE.Matrix4().multiplyMatrices(translateMatrix, rotateX);
  plane.applyMatrix(finalMatrix);
  scene.add(plane);
  return plane;
}

var ceiling = createPlane(ceilingMaterial, 1);
var floor = createPlane(floorMaterial, -1);

// CENTERS & SPHERES


function createSphere(radius, material, mesh, fire) {
  var object = new THREE.Object3D();
  if (fire == true) {
    var geometry = new THREE.SphereGeometry(radius,8,2,0,6.3,1.8,4.1);
  } else {
    var geometry = new THREE.SphereGeometry(radius,15,15);
  }
  if (mesh == true) {
    var sphere = new THREE.Mesh(geometry, material);
  } else {
    var sphere = new THREE.Points(geometry, material);
  }
  object.add(sphere);
  scene.add(object);
  return object;
}

var origin = createSphere(3, defaultMaterial);
scene.add(origin);

function placeCenter(radius, material, multiplier, mesh, fire) {
  var center = createSphere(radius, material, mesh, fire);
  origin.add(center);
  var centerRotMatrix = rotateOnY(multiplier * Math.PI/12);
  var translateMatrix = new THREE.Matrix4().set(1,0,0,HARRYSTART, 0,1,0,0, 0,0,1,0, 0,0,0,1);
  var finalMatrix = new THREE.Matrix4().set().multiplyMatrices(centerRotMatrix, translateMatrix);
  center.setMatrix(finalMatrix);
  return center;
}

var harry = createSphere(0.001, potionMaterial);
var center0 = placeCenter(1, centerMaterial, 12);
var center0cam = placeCenter(0.1, centerMaterial, 12.5);
center0.add(harry);
center0cam.add(camera);
var center1 = placeCenter(1, centerMaterial, 11);
var center1cam = placeCenter(0.1, centerMaterial, 11.5);
var center2 = placeCenter(1, centerMaterial, 10);
var center2cam = placeCenter(0.1, centerMaterial, 10.5);
var center3 = placeCenter(1, centerMaterial, 9);
var center3cam = placeCenter(0.1, centerMaterial, 9.5);
var center4 = placeCenter(1, centerMaterial, 8);
var center4cam = placeCenter(0.1, centerMaterial, 8.5);
var snitch = placeCenter(1, snitchMaterial, 7, true);
var snitchcam = placeCenter(0.1, centerMaterial, 7.5);
var harryCurrentCenter = center0;

var lightCenter0 = placeCenter(0.001, defaultMaterial, 0);
var lightCenter1 = placeCenter(0.001, defaultMaterial, 6);
var lightCenter2 = placeCenter(0.001, defaultMaterial, 12);
var lightCenter3 = placeCenter(0.001, defaultMaterial, 18);

function addPointLights() {
  for (var i = 0; i < MAXLIGHTS; i++) {
    var lightCenter = placeCenter(0.001, defaultMaterial, i*6);
    var pointLight = new THREE.PointLight(0xffffff, 0.1);
    lightCenter.add(pointLight);
  }
}

addPointLights();

// LOAD HARRY MODEL (code modified from P3)

var harryobj;

function loadOBJ(file, material, scale, yRot) {
  var loader = new THREE.OBJLoader();
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Object3D) {
        harryobj = child;
        child.material = material;
      }
    });
    var rotationMatrix = rotateOnY(yRot);
    var transformMatrix = new THREE.Matrix4().set(scale,0,0,0, 0,scale,0,-5, 0,0,scale,1, 0,0,0,1);
    var finalMatrix = new THREE.Matrix4().multiplyMatrices(rotationMatrix, transformMatrix);
    object.applyMatrix(finalMatrix);
    harry.add(object);
  }, onProgress, onError);
}

loadOBJ('obj/harry.obj', toonMaterial, .04, -5 * Math.PI/9);

//////////////////////////////////
//     PROCEDURAL MODELLING     //
//////////////////////////////////

// POTIONS
function createPotion() {
  var geometry = new THREE.SphereGeometry(3,8,2,0,6.3,2,4.8);
  var material = new THREE.MeshBasicMaterial();
  var object = new THREE.Mesh(geometry, potionMaterial);
  scene.add(object);
  var sphereRotMatrix = rotateOnY(Math.random() * 24 * Math.PI/6);
  var horizPos = INRADIUS + 3 + Math.random() * (OUTRADIUS - INRADIUS - 6);
  var translateMatrix = new THREE.Matrix4().set(1,0,0,horizPos, 0,1,0,1.5-HEIGHT/2, 0,0,1,0, 0,0,0,1);
  var finalMatrix = new THREE.Matrix4().set().multiplyMatrices(sphereRotMatrix, translateMatrix);
  object.setMatrix(finalMatrix);
  return object;
}

var potions = [];
var potionsAdded = 0;

function addPotion() {
  if (potionsAdded < MAXPOTIONS) {
    potions.push(createPotion());
    potionsAdded += 1;
  }
}

// for ring and fire placement
function randomPlacement() {
  var rotationMatrix = rotateOnY(Math.random() * 24 * Math.PI/12);
  var horizPos = INRADIUS + FORCEFIELDRADIUS + Math.random() * (OUTRADIUS - INRADIUS - 2*FORCEFIELDRADIUS);
  var determineVertDir = Math.random() < 0.5 ? -1 : 1;
  var vertPos = determineVertDir*(Math.random() * (2*FORCEFIELDRADIUS-HEIGHT/2));
  var translateMatrix = new THREE.Matrix4().set(1,0,0,horizPos, 0,1,0,vertPos, 0,0,1,0, 0,0,0,1);
  var finalMatrix = new THREE.Matrix4().set().multiplyMatrices(rotationMatrix, translateMatrix);
  return finalMatrix
}

// RINGS
function createRing(radius, material) {
  var object = new THREE.Object3D();
  var geometry = new THREE.TorusGeometry(radius, radius/4, 16, 16);
  var mesh = new THREE.Mesh(geometry, material);
  object.add(mesh);
  return object;
}

function addRing() {
  var ring = createRing(FORCEFIELDRADIUS, ringMaterial);
  scene.add(ring);
  var matrix = randomPlacement();
  ring.setMatrix(matrix);
  return ring;
}

var rings = [];

function addAllRings() {
  for (var i = 0; i < MAXRINGS; i++) {
    rings.push(addRing());
  }
}

addAllRings();

// FIRE 

function createFire() {
  var fire = createSphere(5, fireMaterial, true, true);
  var matrix = randomPlacement();
  fire.setMatrix(matrix);
  return fire;
}

var fires = [];

function addAllFires() {
  for (var i = 0; i < MAXFIRES; i++) {
    fires.push(createFire());
  }
}

addAllFires();

//////////////////////////////
//     PARTICLE SYSTEMS     //
//////////////////////////////

function createParticles(material, totalParticles, radius) {
  var group = new THREE.Object3D();
  var startPosition = [];
  var randomness = [];
  for(var i = 0; i < totalParticles; i++) {
    var sprite = new THREE.Sprite(material);
    var spread = Math.random() - 0.5;
    sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5); //just math.random puts everything in pos quadrant
    sprite.position.setLength(radius * (Math.random() * 0.1 + 0.9)); // gives sphere more 'bumpiness'
    group.add(sprite);
    startPosition.push(sprite.position.clone());
    randomness.push(Math.random());
  }
  return [group, startPosition, randomness];
}

var snitchAttributes = createParticles(snitchCloudMaterial, 100, 2);
snitch.add(snitchAttributes[0]);

function animateSnitchCloud(attributes) {
  var time = 2 * clock.getElapsedTime(); //speed
  for ( var c = 0; c < attributes[0].children.length; c ++ ) {
    var sprite = attributes[0].children[c];
    var random = attributes[2][c] + 1;
    var motionFactor = Math.sin(random * time) * 0.3 + 0.9;
    sprite.position.x = attributes[1][c].x * motionFactor;
    sprite.position.y = attributes[1][c].y * motionFactor;
    sprite.position.z = attributes[1][c].z * motionFactor;
  }
  attributes[0].rotation.y = time * 1.5;
}

function createLight(multiplier) {
  var lightAttributes = createParticles(lightMaterial, 25, 1);
  scene.add(lightAttributes[0]);
  var lightRotMatrix = rotateOnY(multiplier * Math.PI/2);
  var translateMatrix = new THREE.Matrix4().set(1,0,0,HARRYSTART, 0,1,0,HEIGHT/2 - 3, 0,0,1,0, 0,0,0,1);
  var finalMatrix = new THREE.Matrix4().set().multiplyMatrices(lightRotMatrix, translateMatrix);
  lightAttributes[0].setMatrix(finalMatrix);
  return lightAttributes;
}

 var lights = [];

function addLight() {
  for (var i = 0; i < MAXFIRES; i++) {
    lights.push(createLight(i));
  }
}

addLight();

var timeAtReset = 2 * clock.getElapsedTime();

function explodeLight(attributes) {
  var time = 2 * clock.getElapsedTime(); //speed
  for ( var i = 0; i < attributes[0].children.length; i ++ ) {
    var sprite = attributes[0].children[i];
    var random = attributes[2][i] + 1;
    var motionFactor = random * (time - timeAtReset) * 0.09 + 0.9;
    if (Math.sqrt(Math.pow((sprite.position.x - attributes[1][i].x),2) +
        Math.pow((sprite.position.y - attributes[1][i].y),2) +
        Math.pow((sprite.position.z - attributes[1][i].z),2)) < 2) {
      sprite.position.x = attributes[1][i].x * motionFactor;
      sprite.position.y = attributes[1][i].y * motionFactor;
      sprite.position.z = attributes[1][i].z * motionFactor;
    } else {
      sprite.position.x = attributes[1][i].x;
      sprite.position.y = attributes[1][i].y;
      sprite.position.z = attributes[1][i].z;
      timeAtReset = time;
    }
  }
}

function animateLights() {
  for (var i = 0; i < lights.length; i++) {
    explodeLight(lights[i]);
  }
}

////////////////////////////////
//     GAMEPLAY FUNCTIONS     //
////////////////////////////////

// KEYBOARD CONTROL & INTERACTIVITY

var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var freeze = true;
var STEPSIZE = 1;
    
function onKeyDown(event) {
  if(keyboard.eventMatches(event, "space")) {
    if (freeze) {
      clock.start();
    } else {
      clock.stop();
    }
    freeze = !freeze;
    instructionsPanel.textContent = "";
    if (isGameOver()) {
      restartGame();
    }
  } else if (!freeze) {
    if (keyboard.eventMatches(event, "w")) {
      if (harry.position.y + 6 == ceiling.position.y) {
        // do nothing
      } else {
        var upMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,1, 0,0,1,0, 0,0,0,1);
        harry.applyMatrix(upMatrix);
      }
    }
    else if (keyboard.eventMatches(event, "s")) {
      if (harry.position.y - 9 == floor.position.y) {
        // do nothing
      } else {
        var downMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,-1, 0,0,1,0, 0,0,0,1);
        harry.applyMatrix(downMatrix);
      }
    }
    else if (keyboard.eventMatches(event, "a")) {
      if (harry.position.x + 8 == COLLIDE) {
        // do nothing
      } else {
        var leftMatrix = new THREE.Matrix4().set(1,0,0,1, 0,1,0,0, 0,0,1,0, 0,0,0,1);
        harry.applyMatrix(leftMatrix);
      }
    }
    else if (keyboard.eventMatches(event, "d")) {
      if (harry.position.x - 3 == -COLLIDE) {
        // do nothing
      } else {
        var rightMatrix = new THREE.Matrix4().set(1,0,0,-1, 0,1,0,0, 0,0,1,0, 0,0,0,1);
        harry.applyMatrix(rightMatrix);
      }
    }
  }
}

keyboard.domElement.addEventListener('keydown', onKeyDown );

function updateGame() 
{
  if (!freeze){
    var originRotationMatrix = rotateOnY(-0.008);
    origin.applyMatrix(originRotationMatrix);
    detectRingCollision();
    detectFireCollision();
  }
}

// PICKING FUNCTIONALITY FOR POTIONS

var mouseVector = new THREE.Vector3();
var rayCaster = new THREE.Raycaster();
var intersects, potionToDrink;

window.addEventListener('click', checkIfPotion);

function checkIfPotion(e) {
  if (!freeze) {
    mouseVector.x = 2 * (e.clientX / canvas.clientWidth) - 1;
    mouseVector.y = 1 - 2 * (e.clientY / canvas.clientHeight);
  
    rayCaster.setFromCamera( mouseVector.clone(), camera);
    intersects = rayCaster.intersectObjects(potions, recursive=true);
    if (intersects.length > 0) {
      potionToDrink = intersects[0].object;    
      var toDrinkIndex = potions.indexOf(potionToDrink);
      if (toDrinkIndex > -1) {
        potions.splice(toDrinkIndex, 1);
        drinkPotion(potionToDrink);
      }
    }
  }
}

var currentHealth = MAXHEALTH;

function drinkPotion(potionToDrink) {
  console.log("om nom nom");
  if (currentHealth < MAXHEALTH) {
    currentHealth += 1;
  }
  console.log("current health is " + "X".repeat(currentHealth));
  scene.remove(potionToDrink);
}

// RING COLLISION DETECTION

function detectRingCollision() {
  var harryForceField = new THREE.Sphere(harry.getWorldPosition(), 2*FORCEFIELDRADIUS);
  for (var i = 0; i < rings.length; i++) {
    var ringForceField = new THREE.Sphere(rings[i].getWorldPosition(), FORCEFIELDRADIUS);
    var ringCollision = ringForceField.intersectsSphere(harryForceField);
    if (ringCollision) {
      collideWithRing(rings[i]);
      break;
    }
  };
};

function collideWithRing(ring) {
  console.log("collided with ring!");
  scene.remove(ring);
  rings.splice(rings.indexOf(ring),1);
  incrementCenter();
}

function moveRings() {
  console.log("rings should move positions");
  for (var i = 0; i < rings.length; i++) {
    var matrix = randomPlacement();
    rings[i].setMatrix(matrix);
  }
}


function incrementCenter() {
  switch(true) {
    case (center0 == harryCurrentCenter):
      center1.add(harry);
      center1cam.add(camera);
      harryCurrentCenter = center1;
      break;
    case (center1 == harryCurrentCenter):
      center2.add(harry);
      center2cam.add(camera);
      harryCurrentCenter = center2;
      break;
    case (center2 == harryCurrentCenter):
      center3.add(harry);
      center3cam.add(camera);
      harryCurrentCenter = center3;
      break;
    case (center3 == harryCurrentCenter):
      center4.add(harry);
      center4cam.add(camera);
      harryCurrentCenter = center4;
      break;
    case (center4 == harryCurrentCenter):
      snitch.add(harry);
      snitchcam.add(camera);
      harryCurrentCenter = snitch;
      break;
    default:
      break;
  }
  console.log("harry switched parents");
};


// FIRE COLLISION DETECTION

function detectFireCollision() {
  var harryForceField = new THREE.Sphere(harry.getWorldPosition(), 2*FORCEFIELDRADIUS);
  for (var i = 0; i < fires.length; i++) {
    var fireForceField = new THREE.Sphere(fires[i].getWorldPosition(), FORCEFIELDRADIUS);
    var fireCollision = fireForceField.intersectsSphere(harryForceField);
    if (fireCollision) {
      collideWithFire(fires[i]);
      break;
    }
  };
};

function collideWithFire(fire) {
  console.log("collided with fire!");
  scene.remove(fire);
  fires.splice(fires.indexOf(fire),1);
  currentHealth -= 1;
}

// SNITCH COLLISION DETECTION TO WIN GAME

var harryCaughtSnitch = false;

function detectSnitchCollision() {
  var harryForceField = new THREE.Sphere(harry.getWorldPosition(), 3);
  var snitchForceField = new THREE.Sphere(snitch.getWorldPosition(), 1);
  var snitchCollision = snitchForceField.intersectsSphere(harryForceField);
  if (snitchCollision) {
    harryCaughtSnitch = true;
    console.log("Harry caught the snitch! Woohoo!");
  }
};

////////////////////////////////////////////////
//     GAME CONTROL FUNCTIONS & VARIABLES     //
////////////////////////////////////////////////

var STARTTIME = 60000;
var timeLeft = STARTTIME;
var runningFpsSum = 0;
var fpsCount = 0;
var fps = 60;
var now;
var then = Date.now(); 
var lastUpdated = then;
var delta;
var finalRemark = "";

function restartGame() {
  harryCaughtSnitch = false;
  timeLeft = STARTTIME;
  then = Date.now();
  clock.start();

  currentHealth = MAXHEALTH;
  for (var i = 0; i < rings.length; i++) {
    scene.remove(rings[i]);
  }
  rings = [];
  addAllRings();

  for (var i = 0; i < potions.length; i++) {
    scene.remove(potions[i]);
  }
  potions = [];
  potionsAdded = 0;

  for (var i = 0; i < fires.length; i++) {
    scene.remove(fires[i]);
  }
  fires = [];
  addAllFires();

  center0.add(harry);
  center0cam.add(camera);
  harry.position.set(0,0,0);
  harryCurrentCenter = center0;

  gameOverPanel.textContent = "";
  instructionsPanel.textContent = "";
  controlPanel.style.color = "#00FC00";
}

function isGameOver() {
  // Game is won if:
  //  - Harry catches snitch
  // Game is lost if:
  //  - Time gets to 0
  //  - Harry gets to 0 health
  return (harryCaughtSnitch || (timeLeft < 0) || (currentHealth <= 0));
}

function computeFinalScore() {
  return timeLeft*currentHealth;
}

function updateFPS() {
  now = Date.now();
  fpsCount += 1;
  delta = now - then; // in ms
  runningFpsSum += delta;
  then = now;
  if ((now - lastUpdated) > 500) {
    fps = Math.round(fpsCount/runningFpsSum*1000);
    fpsCount = 0;
    runningFpsSum = 0;
    lastUpdated = now;
  }
  fpsPanel.textContent = fps + " fps";
}

function updateTimeLeft(timeToSubtract) {
  timeLeft -= timeToSubtract;
  timeLeftPanel.textContent = Math.floor(timeLeft/1000) + " seconds left";
}

function updateHealth() {
  lifeBar.textContent = "X".repeat(currentHealth);
}

function updateControlPanel() {
  updateFPS();

  if (!freeze) {
      updateTimeLeft(delta);
  }
  updateHealth();
  if (timeLeft < STARTTIME/4 || currentHealth < MAXHEALTH/4) {
    controlPanel.style.color = "#FC0000";
  } else if (timeLeft < STARTTIME/2 || currentHealth < MAXHEALTH/2) {
    controlPanel.style.color = "#F0F000";
  }

}

//////////////////////////////
//     UPDATE CALL-BACK     //
//////////////////////////////

function update() {

  requestAnimationFrame(update);

  renderer.setViewport(0,0, window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

  renderer.setViewport(0, 10, mapWidth, mapHeight);
  renderer.render(scene, mapCamera);
  
  updateControlPanel();

  if ((!freeze) && (!isGameOver())) {
    animateSnitchCloud(snitchAttributes);
    animateLights();
    updateGame();
    detectSnitchCollision();

    if ((clock.getElapsedTime() % 5) < 0.01) {
      addPotion();
    }

    if ((clock.getElapsedTime() - timeLastMovedRings) > 10) {
      moveRings();
      timeLastMovedRings = clock.getElapsedTime();
    }
  }

  if (isGameOver()) {
    var finalScore = computeFinalScore();
    var finalRemark = "";
    if (harryCaughtSnitch) {
      messagePanel.style.color = "#00FC00";
      finalRemark = "You won the game! Final Score: " + finalScore;
    } else if (timeLeft < 0) {
      messagePanel.style.color = "#FC0000";
      finalRemark = "You ran out of time and lost the game :(";
    } else if (currentHealth <= 0) {
      messagePanel.style.color = "#FC0000";
      finalRemark = "You ran out of health and lost the game :(";
    }

    gameOverPanel.textContent = finalRemark;
    instructionsPanel.textContent = "Press Spacebar to play again";
    freeze = true;
    clock.stop();
  }
}

update();