// Start var-----------------------------------------------------------------------------
var effect, progress;

var model;

var pointData;

var boundingBox, boundingBoxMaxX, boundingBoxMaxY, boundingBoxMaxZ;
var boundingBoxMinX, boundingBoxMinY, boundingBoxMinZ;

var particle, particles, particleSystem, numberOfParticles, line, lineGeometry;

var measuringLine;

var multiMode, wireframe, anaglyph, parallax;

var axisScene, axisContainer, axisCamera, axisRenderer, axisHelper;

var pointLight, ambientLight;

var container, stats;
var camera, controls, scene, projector, renderer;
var objects = [], models = [], papers = [], selectionPlane;

var gui, params = {

    bumpScale: 20,
    bumpMap: true,
    wireframe: false,
    measure: false,
    measureValue: 'No measurment tracked',
    particleColor: "#ffffff",
    particleSize: 10,
    crossSection: false,
    nearPlane: 1,
    rotateSpeed: 1.0,
    zoomSpeed: 1.2,
    panSpeed: 0.3,
    top: function () { toTop(); },
    bottom: function () { toBottom(); },
    left: function () { toLeft(); },
    right: function () { toRight(); },
    front: function () { toFront(); },
    back: function () { toBack(); }
};

var mouse = new THREE.Vector2()
var offset = new THREE.Vector3()
var INTERSECTED, SELECTED;

var CANVAS_WIDTH = 150;
var CANVAS_HEIGHT = 150;
var CAM_DISTANCE = 10;

var windowHeight = document.getElementById("canvas").clientHeight;
var windowWidth = document.getElementById("canvas").clientWidth;


init();
animate();
// End var-----------------------------------------------------------------------------


// Start Viewer Core---------------------------------------------------------------------
function init() {

    container = document.getElementById('canvas');
    axisContainer = document.getElementById('inset');

    camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, 10000);
    camera.useQuaternion == true
    camera.position.set(0, 0, 500);
    camera.rotation.set(0, 0, 0);

    controls = new THREE.TrackballControls(camera, container);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.dynamicDampingFactor = 0.3;


    scene = new THREE.Scene();

    ambientLight = new THREE.AmbientLight(0x444444);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(0xffffff, 1.5, 1000);
    pointLight.color.setHSL(0.05, 1, 0.95);
    pointLight.position.set(0, 0, 600);

    scene.add(pointLight);

    pointLight2 = new THREE.PointLight(0xffffff, 1.5, 1000);
    pointLight2.color.setHSL(0.05, 1, 0.95);
    pointLight2.position.set(0, 0, -600);

    scene.add(pointLight2);

    pointLight3 = new THREE.PointLight(0xffffff, 1.5, 1000);
    pointLight3.color.setHSL(0.05, 1, 0.95);
    pointLight3.position.set(600, 0, 0);

    scene.add(pointLight3);

    pointLight4 = new THREE.PointLight(0xffffff, 1.5, 1000);
    pointLight4.color.setHSL(0.05, 1, 0.95);
    pointLight4.position.set(-600, 0, 0);

    scene.add(pointLight4);

    pointLight5 = new THREE.PointLight(0xffffff, 1.5, 1000);
    pointLight5.color.setHSL(0.05, 1, 0.95);
    pointLight5.position.set(0, 600, 0);

    scene.add(pointLight5);

    pointLight6 = new THREE.PointLight(0xffffff, 1.5, 1000);
    pointLight6.color.setHSL(0.05, 1, 0.95);
    pointLight6.position.set(0, -600, 0);

    scene.add(pointLight6);

    /// Scene
    axisScene = new THREE.Scene();

    // Camera
    axisCamera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
    axisCamera.up = camera.up; // important!
    axisScene.add(axisCamera);

    // Axes
    axisHelper = new THREE.AxisHelper(5);
    axisScene.add(axisHelper);

    loadModel();

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);

    setUpGUI();

    progress = document.querySelector('.percent');
    document.getElementById('filesNewModel').addEventListener('change', handleNewModelSelect, false);
    document.getElementById('filesTexture').addEventListener('change', handleTextureSelect, false);
    document.getElementById('filesAddModel').addEventListener('change', handleAddModelSelect, false);
    window.addEventListener('resize', onWindowResize, false);

    showPageInstructions();

    lineGeometry, particles = new THREE.Geometry();
    numberOfParticles = boundingBoxMaxX = boundingBoxMaxY = boundingBoxMaxZ = boundingBoxMinX = boundingBoxMinY = boundingBoxMinZ = 0;
    multiMode = wireframe = anaglyph = parallax = measuringLine = false;
}

//

//

function loadModel() {

    var loader = new THREE.OBJLoader();
    loader.addEventListener('load', function (event) {

        var object = event.content;
        var geometry = object.children[0].geometry;
        var mapHeight = THREE.ImageUtils.loadTexture("mtl/Skull-Web.BMP");

        mapHeight.anisotropy = 4;
        mapHeight.repeat.set(0.998, 0.998);
        mapHeight.offset.set(0.001, 0.001)
        mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
        mapHeight.format = THREE.RGBFormat;

        var material = new THREE.MeshPhongMaterial({ shininess: 10, bumpMap: mapHeight, map: mapHeight, bumpScale: 20 });
        material.side = THREE.DoubleSide;
        mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);
        objects.push(mesh);
        addModelInfo("Skull", mesh.geometry.faces.length, mesh.geometry.vertices.length, 7.24)

    });

    var loader2 = new THREE.OBJLoader();
    loader2.addEventListener('load', function (event) {

        var object = event.content;
        var geometry = object.children[0].geometry;
        var mapHeight = THREE.ImageUtils.loadTexture("mtl/Jaw-Web.BMP");

        mapHeight.anisotropy = 4;
        mapHeight.repeat.set(0.998, 0.998);
        mapHeight.offset.set(0.001, 0.001)
        mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
        mapHeight.format = THREE.RGBFormat;

        var material = new THREE.MeshPhongMaterial({ shininess: 10, bumpMap: mapHeight, map: mapHeight, bumpScale: 20 });
        material.side = THREE.DoubleSide;
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        objects.push(mesh);
        addModelInfo("Jaw", mesh.geometry.faces.length, mesh.geometry.vertices.length, 1.41)

    });

    loader.load('obj/Skull-Web.OBJ');
    loader2.load('obj/Jaw-web.OBJ');

    selectionPlane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 100, 100), new THREE.MeshBasicMaterial({ color: 0xffff00, opacity: 0.25, transparent: true, wireframe: true }));
    selectionPlane.visible = false;
    scene.add(selectionPlane);

    projector = new THREE.Projector();
    setUpRenderers();
}

//

function setUpRenderers() {

    if (Detector.webgl) {

        renderer = new THREE.WebGLRenderer({ antialias: true });
        axisRenderer = new THREE.WebGLRenderer({ antialias: true });

    }
    else {

        renderer = new THREE.CanvasRenderer();
        axisRenderer = new THREE.CanvasRenderer();

    }

    renderer.sortObjects = false;
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFShadowMap;

    container.appendChild(renderer.domElement);

    axisRenderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    axisContainer.appendChild(axisRenderer.domElement);

    if (anaglyph == true || parallax == true) {

        effect = new THREE.AnaglyphEffect(renderer);
        effect.setSize(windowWidth, windowHeight);

    }
}

//

function setUpGUI() {

    gui = new dat.GUI({ width: 250 });

    gui.add(params, 'wireframe', false).name("Wireframe").onChange(function () {

        if (params.wireframe == true) {

            for (var i = 0; i < objects.length; i++) {

                objects[i].material.wireframe = true;

            }
        }
        else if (params.wireframe == false) {

            for (var i = 0; i < objects.length; i++) {

                objects[i].material.wireframe = false;

            }
        }
    });

    var folderMeasuringTools = gui.addFolder('Measuring Tools');
    folderMeasuringTools.add(params, 'measure', false).name("Measure").onChange(function () {

        if (params.measure == true) {

            showMeasurementInstructions();

        }

        if (params.measure == false) {

            for (var i = 0; i < scene.children.length - 1; ++i) {

                if (scene.children[i] instanceof THREE.ParticleSystem) {

                    scene.remove(scene.children[i]);

                }
            }
            scene.remove(line);
            numberOfParticles = 0;
            particles = new THREE.Geometry();
        }
    });

    folderMeasuringTools.add(params, 'measureValue').name("Measured Value").listen();
    folderMeasuringTools.addColor(params, 'particleColor').name("Particle Color");
    folderMeasuringTools.add(params, 'particleSize', 1, 20).name("Particle Size");

    var folderCrossSection = gui.addFolder('Cross Section');
    folderCrossSection.add(params, 'crossSection', false).name("Cross Section").onChange(function () {

        getBoundingBox();

        if (params.crossSection == true) {

            showCrossSectionInstructions();

        }
        else if (params.crossSection == false) {

            camera.near = 1;
            camera.updateProjectionMatrix();

        }
    });

    folderCrossSection.add(params, 'nearPlane', 1, 100).name("Section Depth").onChange(function () {

        if (params.crossSection == true) {

            var boxDepth = boundingBoxMaxZ - boundingBoxMinZ + camera.position.z;
            camera.near = params.nearPlane * boxDepth / 100;
            camera.updateProjectionMatrix();
        }
    });

    var folderTextureEffects = gui.addFolder('Texture Effects');
    folderTextureEffects.add(params, 'bumpMap', false).name("Bump Map").onChange(function () {

        if (params.bumpMap == true) {

            for (var i = 0; i < objects.length; i++) {

                objects[i].material.bumpScale = 20;

            }
        }
        else if (params.bumpMap == false) {

            for (var i = 0; i < objects.length; i++) {

                objects[i].material.bumpScale = 0;

            }
        }
    });

    folderTextureEffects.add(params, 'bumpScale', 1, 50).name("Bump Scale").onChange(function () {

        if (params.bumpMap == true) {

            for (var i = 0; i < objects.length; i++) {

                objects[i].material.bumpScale = params.bumpScale;

            }
        }
    });

    var folderSensitivity = gui.addFolder('Sensitivity');
    folderSensitivity.add(params, 'rotateSpeed', 0.1, 5).name("Rotate Speed").onChange(function () {

        controls.rotateSpeed = params.rotateSpeed;

    });

    folderSensitivity.add(params, 'zoomSpeed', 0.1, 5).name("Zoom Speed").onChange(function () {

        controls.zoomSpeed = params.zoomSpeed;

    });

    folderSensitivity.add(params, 'panSpeed', 0.1, 2).name("Pan Speed").onChange(function () {

        controls.panSpeed = params.panSpeed;

    });

    var folderSnapToView = gui.addFolder('Snap To View');
    folderSnapToView.add(params, 'top').name("Top");
    folderSnapToView.add(params, 'bottom').name("Bottom");
    folderSnapToView.add(params, 'left').name("Left");
    folderSnapToView.add(params, 'right').name("Right");
    folderSnapToView.add(params, 'front').name("Front");
    folderSnapToView.add(params, 'back').name("Back");
}

//

function animate() {

    requestAnimationFrame(animate);
    render();
    stats.update();
}

//

function render() {

    camera.lookAt(scene.position);
    axisCamera.lookAt(axisScene.position);
    controls.update();

    axisCamera.position.set(camera.position.x, camera.position.y, camera.position.z);
    axisCamera.position.sub(controls.target);
    axisCamera.position.setLength(CAM_DISTANCE);

    renderer.render(scene, camera);
    axisRenderer.render(axisScene, axisCamera);

    if (anaglyph == true || parallax == true) {

        effect.render(scene, camera);
    }
}

// End Viewer Core---------------------------------------------------------------------

// Start Model Info---------------------------------------------------------------------

function addModelInfo(modelName, modelFaceCount, modelVerticeCount, modelFileSize) {

    $(document).ready(function () {

        $('ul#modelInfo').append('<li>' + modelName + '<hr>' + '<div id="listedInfo">' +
        '<div>FaceCount: ' + numberWithCommas(modelFaceCount) + '</div>' +
        '<div>Vertices Count: ' + numberWithCommas(modelVerticeCount) + '</div>' +
        '<div>File size: ' + modelFileSize + 'MB</div></div>' + '</li>');
    });
}

//

function removeModelInfo() {

    $(document).ready(function () {

        $('ul#modelInfo').empty();

    });
}

//

function numberWithCommas(x) {

    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}

//

function byteToMB(numberOfBytes) {

    var megaByte = numberOfBytes / 1048576;
    return megaByte.toPrecision(4);

}

// End Model Info---------------------------------------------------------------------

// Start Event Listeners---------------------------------------------------------------
function onWindowResize() {

    windowHeight = document.getElementById("canvas").clientHeight;
    windowWidth = document.getElementById("canvas").clientWidth;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(windowWidth, windowHeight);

    if (anaglyph == true || parallax == true) {

        effect.setSize(windowWidth, windowHeight);

    }

}

//

function onDocumentMouseMove(event) {

    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    projector.unprojectVector(vector, camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    if (SELECTED) {

        var intersects = raycaster.intersectObject(selectionPlane);
        SELECTED.position.copy(intersects[0].point.sub(offset));
        return;

    }

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].object) {

            INTERSECTED = intersects[0].object;

            selectionPlane.position.copy(INTERSECTED.position);
            selectionPlane.lookAt(camera.position);

        }

        container.style.cursor = 'pointer';

    } else {

        INTERSECTED = null;
        container.style.cursor = 'auto';

    }

}

//

function onDocumentMouseDown(event) {

    event.preventDefault();

    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    projector.unprojectVector(vector, camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {

        if (params.measure == true) {

            controls.enabled = false;

            SELECTED = intersects[0].object;

            var intersects = raycaster.intersectObject(SELECTED);

            var pX = intersects[0].point.x,
            pY = intersects[0].point.y,
            pZ = intersects[0].point.z,
            particle = new THREE.Vector3(pX, pY, pZ);

            particles.vertices.push(particle);
            numberOfParticles++;

            if (numberOfParticles == 2) {

                particleSystem = new THREE.ParticleSystem(particles, new THREE.ParticleBasicMaterial({ color: params.particleColor, size: params.particleSize }));
                scene.add(particleSystem);


                var x1 = particles.vertices[0].x;
                var y1 = particles.vertices[0].y;
                var z1 = particles.vertices[0].z;

                var x2 = particles.vertices[1].x;
                var y2 = particles.vertices[1].y;
                var z2 = particles.vertices[1].z;

                var xd = x2 - x1;
                var yd = y2 - y1;
                var zd = z2 - z1;

                var pointDistance = Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2) + Math.pow(zd, 2));
                pointDistance = pointDistance.toPrecision(5);

                params.measureValue = pointDistance.toString() + " Units";

                var material = new THREE.LineBasicMaterial({

                    color: params.particleColor

                });

                var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(x1, y1, z1));
                geometry.vertices.push(new THREE.Vector3(x2, y2, z2));

                line = new THREE.Line(geometry, material);
                scene.add(line);
            }
        }

        controls.enabled = false;

        SELECTED = intersects[0].object;

        var intersects = raycaster.intersectObject(selectionPlane);
        offset.copy(intersects[0].point).sub(selectionPlane.position);

        container.style.cursor = 'move';

    }

}

//

function onDocumentMouseUp(event) {

    event.preventDefault();

    controls.enabled = true;

    if (INTERSECTED) {

        selectionPlane.position.copy(INTERSECTED.position);
        SELECTED = null;

    }

    container.style.cursor = 'auto';

}

//

function handleNewModelSelect(event) {

    removeAllModels();
    
    var files = event.target.files; // FileList model
    var file = files[0];
    var start = 0;
    var stop = file.size - 1;

    progress.style.width = '0%';
    progress.textContent = '0%';

    var reader = new FileReader();
    reader.onerror = errorHandler;
    var loader = new THREE.OBJLoader();

    reader.onprogress = updateProgress;

    reader.onloadstart = function (e) {

        document.getElementById('progress_bar').className = 'loading';

    };

    reader.onload = function (e) {

        progress.style.width = '100%';
        progress.textContent = '100%';
        setTimeout("document.getElementById('progress_bar').className='';", 2000);

    }

    reader.onloadend = function (event) {

        if (event.target.readyState == FileReader.DONE) {

            var x;
            loader.loadLocalModel(event.target.result, function (x) {

                var object = x;
                object.children[0].geometry.computeFaceNormals();
                var geometry;
                if (object.children.length > 1) {

                    for (var i = 1; i < object.children.length; i++) {

                        geometry = object.children[0].geometry;
                        THREE.GeometryUtils.merge(geometry, object.children[i].geometry);
                    }
                }
                else {

                    geometry = object.children[0].geometry;
                }

                material = new THREE.MeshPhongMaterial({ color: 0xA0A0A0 });
                material.side = THREE.DoubleSide;
                mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);
                objects.push(mesh);
                addModelInfo(file.name, mesh.geometry.faces.length, mesh.geometry.vertices.length, byteToMB(file.size));
            });
        }
    };

    model = scene.children[0];
    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}

//

function handleAddModelSelect(event) {
    {

        reset();

        var files = event.target.files; // FileList model
        var file = files[0];
        var start = 0;
        var stop = file.size - 1;

        progress.style.width = '0%';
        progress.textContent = '0%';

        var reader = new FileReader();
        reader.onerror = errorHandler;
        var loader = new THREE.OBJLoader();

        reader.onprogress = updateProgress;

        reader.onloadstart = function (e) {
            document.getElementById('progress_bar').className = 'loading';
        };

        reader.onload = function (e) {
            progress.style.width = '100%';
            progress.textContent = '100%';
            setTimeout("document.getElementById('progress_bar').className='';", 2000);
        }

        reader.onloadend = function (event) {
            if (event.target.readyState == FileReader.DONE) {
                var x;
                loader.loadLocalModel(event.target.result, function (x) {
                    var object = x;
                    object.children[0].geometry.computeFaceNormals();
                    var geometry;
                    if (object.children.length > 1) {
                        for (var i = 1; i < object.children.length; i++) {
                            geometry = object.children[0].geometry;
                            THREE.GeometryUtils.merge(geometry, object.children[i].geometry);
                        }
                    }
                    else {
                        geometry = object.children[0].geometry;
                    }

                    material = new THREE.MeshPhongMaterial({ color: 0xA0A0A0 });

                    mesh = new THREE.Mesh(geometry, material);
                    scene.add(mesh);
                    objects.push(mesh);
                    addModelInfo(file.name, mesh.geometry.faces.length, mesh.geometry.vertices.length, byteToMB(file.size));
                });
            }
        };

        model = scene.children[0];
        var blob = file.slice(start, stop + 1);
        reader.readAsBinaryString(blob);
    }
}

//

function handleTextureSelect(event) {

    var geometry = objects[objects.length - 1].geometry;
    geometry.buffersNeedUpdate = true;
    geometry.uvsNeedUpdate = true;      

    scene.remove(objects[objects.length - 1]);
    objects.pop();

    var files = event.target.files; // FileList object
    var file = files[0];

    var reader = new FileReader();
    var loader = new THREE.ImageLoader();
    var texture = new THREE.Texture();

    reader.onload = (function (theFile) {

        return function (e) {

            loader.addEventListener("load", function (event) {

                texture.image = event.content;
                texture.needsUpdate = true;

            });

            loader.load(e.target.result);

        };
    })(file);

    // Read in the image file as a data URL.
    reader.readAsDataURL(file);

    texture.anisotropy = 4;
    texture.repeat.set(0.998, 0.998);
    texture.offset.set(0.001, 0.001)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.format = THREE.RGBFormat;

    var material = new THREE.MeshPhongMaterial({ shininess: 10, bumpMap: texture, map: texture, bumpScale: 20 });
    material.side = THREE.DoubleSide;
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    objects.push(mesh);
}

//

function removeAllModels() {
    reset();

    for (var i = 0; i < objects.length; i++) {

        scene.remove(objects[i]);
        objects[i].geometry.dispose();
        objects[i].material.dispose();
    }
    for (var i = 0; i < papers.length; i++) {

        scene.remove(papers[i]);
        papers[i].geometry.dispose();
        papers[i].material.dispose();

    }
    removeModelInfo();
    objects = [];
    papers = [];
}

//

function errorHandler(evt) {

    switch (evt.target.error.code) {

        case evt.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
        case evt.target.error.NOT_READABLE_ERR:
            alert('File is not readable');
            break;
        default:
            alert('An error occurred reading this file.');
    };
}

//

function updateProgress(event) {

    if (event.lengthComputable) {

        var percentLoaded = Math.round((event.loaded / event.total) * 100);

        if (percentLoaded < 100) {

            progress.style.width = percentLoaded + '%';
            progress.textContent = percentLoaded + '%';
        }
    }
}

// End Event Listeners-----------------------------------------------------------------


// Start Visual Tools------------------------------------------------------------------
function toggleAnaglyph() {
    if (multiMode == false && parallax != true) {

        if (anaglyph == false) {

            anaglyph = true;

            document.getElementById('liAnaglyph').className = "selected";

            effect = new THREE.AnaglyphEffect(renderer);
            effect.setSize(windowWidth, windowHeight);
        }
        else {

            anaglyph = false;
            scene.remove(effect);
            document.getElementById('liAnaglyph').className = "";
        }
    }
}

//

function toggleParallaxBarrier() {

    if (multiMode == false && anaglyph != true) {

        if (parallax == false) {

            parallax = true;
            document.getElementById('liParallaxBarrier').className = "selected";
            effect = new THREE.ParallaxBarrierEffect(renderer);
            effect.setSize(windowWidth, windowHeight);
        }

        else {

            parallax = false;
            document.getElementById('liParallaxBarrier').className = "";
            scene.remove(effect);
        }
    }
}

//

function reset() {

    if (multiMode == false) {

        scene.remove(camera);
        axisScene.remove(axisCamera);

        camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, 10000);
        camera.useQuaternion == true
        camera.position.set(0, 0, 500);
        camera.rotation.set(0, 0, 0);

        axisCamera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
        axisCamera.up = camera.up; // important!
        axisScene.add(axisCamera);

        scene.remove(controls);
        controls = new THREE.TrackballControls(camera, container);

        for (var i = 0; i < objects.length; i++) {

            objects[i].position.set(0, 0, -10);
            objects[i].rotation.set(0, 0, 0);

        }
    }
}

// End Visual Tools------------------------------------------------------------------

// Start Snap to View------------------------------------------------------------------

function toTop() {

    scene.remove(camera);
    axisScene.remove(axisCamera);

    camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, 10000);
    camera.useQuaternion == true
    camera.position.set(0, 500, 0);
    camera.rotation.set(0, 0, 0);

    axisCamera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
    axisCamera.up = camera.up; // important!
    axisScene.add(axisCamera);

    scene.remove(controls);
    controls = new THREE.TrackballControls(camera, container);
}

//

function toBottom() {

    scene.remove(camera);
    axisScene.remove(axisCamera);

    camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, 10000);
    camera.useQuaternion == true
    camera.position.set(0, -500, 0);
    camera.rotation.set(0, 0, 0);

    axisCamera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
    axisCamera.up = camera.up; // important!
    axisScene.add(axisCamera);

    scene.remove(controls);
    controls = new THREE.TrackballControls(camera, container);
}

//

function toLeft() {

    scene.remove(camera);
    axisScene.remove(axisCamera);

    camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, 10000);
    camera.useQuaternion == true
    camera.position.set(500, 0, 0);
    camera.rotation.set(0, 0, 0);

    axisCamera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
    axisCamera.up = camera.up; // important!
    axisScene.add(axisCamera);

    scene.remove(controls);
    controls = new THREE.TrackballControls(camera, container);
}

//

function toRight() {

    scene.remove(camera);
    axisScene.remove(axisCamera);

    camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, 10000);
    camera.useQuaternion == true
    camera.position.set(-500, 0, 0);
    camera.rotation.set(0, 0, 0);

    axisCamera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
    axisCamera.up = camera.up; // important!
    axisScene.add(axisCamera);

    scene.remove(controls);
    controls = new THREE.TrackballControls(camera, container);
}

//

function toFront() {

    scene.remove(camera);
    axisScene.remove(axisCamera);

    camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, 10000);
    camera.useQuaternion == true
    camera.position.set(0, 0, 500);
    camera.rotation.set(0, 0, 0);

    axisCamera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
    axisCamera.up = camera.up; // important!
    axisScene.add(axisCamera);

    scene.remove(controls);
    controls = new THREE.TrackballControls(camera, container);
}

//

function toBack() {

    scene.remove(camera);
    axisScene.remove(axisCamera);

    camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 1, 10000);
    camera.useQuaternion == true
    camera.position.set(0, 0, -500);
    camera.rotation.set(0, 0, 0);

    axisCamera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
    axisCamera.up = camera.up; // important!
    axisScene.add(axisCamera);

    scene.remove(controls);
    controls = new THREE.TrackballControls(camera, container);
}
// End Snap to View------------------------------------------------------------------

// Start Newspaper------------------------------------------------------------------

function newspaperModel() {

    removeAllModels();


    var sideOne = new THREE.PlaneGeometry(1152, 1774);
    var sideTwo = new THREE.PlaneGeometry(1152, 1774);

    sideTwo.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));

    THREE.GeometryUtils.merge(sideOne, sideTwo);

    var textureFront = new THREE.ImageUtils.loadTexture('mtl/19021004.jpg');

    var textureBack = new THREE.ImageUtils.loadTexture('mtl/19021004_p2.jpg');

    var materials = [
    new THREE.MeshBasicMaterial({ color: 0xffffff, map: textureFront }),
    new THREE.MeshBasicMaterial({ color: 0xffffff, map: textureBack })
    ];

    sideOne.materials = materials;
    sideOne.faces[0].materialIndex = 0;
    sideOne.faces[1].materialIndex = 1;

    paper = new THREE.Mesh(sideOne, new THREE.MeshFaceMaterial(materials));


    addModelInfo("19021004", mesh.geometry.faces.length, mesh.geometry.vertices.length, 7.34);
    scene.add(paper);
    papers.push(paper);
}

// End Newspaper------------------------------------------------------------------

// Start Point Cloud------------------------------------------------------------------

function showWalrusMandible() {

    removeAllModels();

    var loader = new THREE.OBJLoader();
    loader.addEventListener('load', function (event) {

        var object = event.content;
        var geometry = object.children[0].geometry;

        var mapHeight = THREE.ImageUtils.loadTexture("mtl/WALRUS_mandible-web.BMP");

        mapHeight.anisotropy = 4;
        mapHeight.repeat.set(0.998, 0.998);
        mapHeight.offset.set(0.001, 0.001)
        mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
        mapHeight.format = THREE.RGBFormat;

        var material = new THREE.MeshPhongMaterial({ shininess: 10, bumpMap: mapHeight, map: mapHeight, bumpScale: 20 });
        material.side = THREE.DoubleSide;
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        objects.push(mesh);
        addModelInfo("Walrus Mandible", mesh.geometry.faces.length, mesh.geometry.vertices.length, 1.41)
    });
    loader.load('obj/WALRUS_mandible-web.OBJ');
}

function pointCloud() {

    var loader = new THREE.OBJLoader();
    loader.addEventListener('load', function (event) {

        var object = event.content;
        var geometry = object.children[0].geometry;

        mesh = new THREE.ParticleSystem(geometry, new THREE.ParticleBasicMaterial());
        scene.add(mesh);
        objects.push(mesh);
    });
    loader.load('mtl/Skull-Web.OBJ');

}

function bigPointCloud() {
    var materials = [];
    geometry = new THREE.Geometry();

    for (i = 0; i < 200000; i++) {

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2000 - 1000;
        vertex.y = Math.random() * 2000 - 1000;
        vertex.z = Math.random() * 2000 - 1000;

        geometry.vertices.push(vertex);

    }

    parameters = [
    					[[1, 1, 0.5], 5],
    					[[0.95, 1, 0.5], 4],
    					[[0.90, 1, 0.5], 3],
    					[[0.85, 1, 0.5], 2],
    					[[0.80, 1, 0.5], 1]
    				];

    for (i = 0; i < parameters.length; i++) {

        size = parameters[i][1];

        materials[i] = new THREE.ParticleBasicMaterial({ size: size, color: Math.random() * 0x808080 + 0x808080 });

        particles = new THREE.ParticleSystem(geometry, materials[i]);

        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;

        scene.add(particles);
    }
}

// End Point Cloud------------------------------------------------------------------


// Start Bounding Box Calc------------------------------------------------------------------

function getBoundingBox() {
    for (var i = 0; i < scene.children.length; i++) {
        if (scene.children[i] instanceof THREE.Mesh && scene.children[i].geometry instanceof THREE.Geometry) {
            scene.children[i].geometry.computeBoundingBox();
            boundingBox = scene.children[i].geometry.boundingBox.clone();
            if (boundingBoxMaxX < boundingBox.max.x) {
                boundingBoxMaxX = boundingBox.max.x;
            }
            if (boundingBoxMaxY < boundingBox.max.y) {
                boundingBoxMaxY = boundingBox.max.y;
            }
            if (boundingBoxMaxZ < boundingBox.max.z) {
                boundingBoxMaxZ = boundingBox.max.z;
            }

            if (boundingBoxMinX > boundingBox.min.x) {
                boundingBoxMinX = boundingBox.min.x;
            }
            if (boundingBoxMinX > boundingBox.min.x) {
                boundingBoxMinX = boundingBox.min.x;
            }
            if (boundingBoxMinX > boundingBox.min.x) {
                boundingBoxMinX = boundingBox.min.x;
            }
        }
    }
}

// End Bounding Box Calc------------------------------------------------------------------


// Start Instruction Functions---------------------------------------------------------------------

function showPageInstructions() {
    var BrowserDetect = {
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
            this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
        },
        searchString: function (data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1)
                        return data[i].identity;
                }
                else if (dataProp)
                    return data[i].identity;
            }
        },
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        },
        dataBrowser: [
		{
		    string: navigator.userAgent,
		    subString: "Chrome",
		    identity: "Chrome"
		},
		{ string: navigator.userAgent,
		    subString: "OmniWeb",
		    versionSearch: "OmniWeb/",
		    identity: "OmniWeb"
		},
		{
		    string: navigator.vendor,
		    subString: "Apple",
		    identity: "Safari",
		    versionSearch: "Version"
		},
		{
		    prop: window.opera,
		    identity: "Opera",
		    versionSearch: "Version"
		},
		{
		    string: navigator.vendor,
		    subString: "iCab",
		    identity: "iCab"
		},
		{
		    string: navigator.vendor,
		    subString: "KDE",
		    identity: "Konqueror"
		},
		{
		    string: navigator.userAgent,
		    subString: "Firefox",
		    identity: "Firefox"
		},
		{
		    string: navigator.vendor,
		    subString: "Camino",
		    identity: "Camino"
		},
		{		// for newer Netscapes (6+)
		    string: navigator.userAgent,
		    subString: "Netscape",
		    identity: "Netscape"
		},
		{
		    string: navigator.userAgent,
		    subString: "MSIE",
		    identity: "Explorer",
		    versionSearch: "MSIE"
		},
		{
		    string: navigator.userAgent,
		    subString: "Gecko",
		    identity: "Mozilla",
		    versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
		    string: navigator.userAgent,
		    subString: "Mozilla",
		    identity: "Netscape",
		    versionSearch: "Mozilla"
		}
	],
        dataOS: [
		{
		    string: navigator.platform,
		    subString: "Win",
		    identity: "Windows"
		},
		{
		    string: navigator.platform,
		    subString: "Mac",
		    identity: "Mac"
		},
		{
		    string: navigator.userAgent,
		    subString: "iPhone",
		    identity: "iPhone/iPod"
		},
		{
		    string: navigator.platform,
		    subString: "Linux",
		    identity: "Linux"
		}
	]

    };
    BrowserDetect.init();

    var instructions = "Welcome to the IRI 3D Model Viewer!\n\n"
    + "To get you going here are some basic instructions.\n"
    + "\xB7 Holding down the left mouse button will rotate a model.\n"
	+ "\xB7 Holding dow the right mouse button will pan a model.\n"
	+ "\xB7 The mouse wheel can be used to zoom the viewing camera in and out.\n\n";

    if (Detector.webgl) {
        instructions = instructions + "Looks like your using WebGL. Enjoy your viewing experience.";
    }

    else {
        instructions = instructions + "Looks like your not using WebGL. This will hinder your viewing experience. WebGL can be found in the following browsers:\n"
        + "\xB7 Mozilla Firefox\n"
        + "\xB7 Google Chrome\n"
        + "\xB7 Safari\n"
        + "\xB7 Opera\n\n";

        if (BrowserDetect.browser == "Explorer") {
            instructions = instructions + "Looks like you're using Internet Explorer. As of version 10, there is no built-in support for WebGL."
            + " I would recommend using one of the above WebGL enabled browsers to give you a better model viewing experience."
        }

        else if (BrowserDetect.browser == "Safari") {
            instructions = instructions + "Looks like you're using Safari, but WebGL is disabled. Here is how you can enable WebGL:\n"
            + "\xB7 Open the Safari menu and select Preferences\n"
            + "\xB7 Click the Advanced tab in the Preferences window\n"
            + "\xB7 At the bottom of the window, check the Show Develop menu in menu bar checkbox\n"
            + "\xB7 Then, open the Develop menu in the menu bar and select Enable WebGL";
        }

        else if (BrowserDetect.browser == "Opera") {
            instructions = instructions + "Looks like you're using Opera, but WebGL is disabled. Here is how you can enable WebGL:\n"
            + "Enter opera:config in the address bar. In the User Prefs section set both Enable Hardware Acceleration and Enable WebGL to 1.\n"
            + "Scroll to the bottom of the list of user preferences and click the Save button. Restart the browser.";
        }
    }
    alert(instructions);
}

//

function showMeasurementInstructions() {

    var instructions = 'To make a measurement, click on the surface you want to measure from, then click on the surface you want to measure to.' +
            ' This will generate a point-to-point measurement.\n\n' +
            'Note that you can increase the precision of your measurement points by zooming in on the surface you want to click.\n\n' +
            'To remove your measurements simply uncheck the “Measure” box.'
    alert(instructions);
}

//

function showCrossSectionInstructions() {

    var instructions = 'To view a cross section of the models on the screen, simply click and drag the “Section Depth” bar to the left or right.' +
            ' The higher the percentage of the section depth, the less of the model you will see.\n\n' +
            'If you can’t reach your desired section depth value, try extending the bar by dragging on the left side of the menu panel; this will make your depth values more precise.';
    alert(instructions);
}

// End Instruction Functions---------------------------------------------------------------------

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                pointData = rawFile.responseText;
                //var point = JSON.parse(pointData.data);
                alert(pointData);
            }
        }
    }
    rawFile.send(null);
}