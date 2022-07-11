// Imports for shaders
import ProgramCreator from './lib/programCreator.js';
import { PhongVertexShaderSrc } from './Shaders/Phong/vertex.js';
import { PhongFragmentShaderSrc } from './Shaders/Phong/fragment.js';
import { GouradVertexShaderSrc } from './Shaders/Gourad/vertex.js';
import { GouradFragmentShaderSrc } from './Shaders/Gourad/fragment.js';

// Imports for object rendering, tranformations and light behavior
import { vec3, mat4, quat } from 'https://cdn.skypack.dev/gl-matrix';
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import Mesh from './lib/Mesh.js';
import Renderer from './lib/renderer.js';

let camera = {
    eye: {
        x: 0,
        y: 0,
        z: 30,
    },
    
    center: {
        x: 0,
        y: 0,
        z: 0,
    },
    
    up: {
        x: 0,
        y: 1,
        z: 0,
    },
    
    radius: 30,
}

let cameraX = Math.PI / 1000, cameraY = Math.PI / 1000;

let projectVal = 
{
    fovy: Math.PI/3,
    aspect: window.innerWidth/ window.innerHeight,
    near: 1,
    far: 2000
}

const renderer = new Renderer();
const gl = renderer.getGlContext();
const phongShaderCode = new ProgramCreator(gl, PhongVertexShaderSrc, PhongFragmentShaderSrc);
const gouradShaderCode = new ProgramCreator(gl, GouradVertexShaderSrc, GouradFragmentShaderSrc);

let Red = {
    ka : 0.9, 
    kd : 0.9, 
    ks : 0.03,

    Ambientcolor : vec3.fromValues(0.0, 0.0, 0.0),
    DiffuseColor : vec3.fromValues(0.78, 0.1, 0.23),
    SpecularColor : vec3.fromValues(0.8, 0.59, 0.5),
    
    Shine : 800,
    Limit : Math.PI / 9
}

let Blue = {
    ka : 0.1,
    kd : 0.3,
    ks : 0.07,

    Ambientcolor : vec3.fromValues(0, 0, 0),
    DiffuseColor : vec3.fromValues(0, 0, 0.23),
    SpecularColor : vec3.fromValues(0, 0, 0.5),

    Shine : 800,
    Limit : Math.PI / 9
}

let scene = [];


let UrnMesh;
let UrnPosition = vec3.fromValues(-10, 5, 0);

fetch('./models/urn.obj')
    .then(response => response.text())
    .then(data => {
        UrnMesh = new Mesh(gl, 
            JSON.parse(JSON.stringify(new objLoader.Mesh(data))), 
            projectVal, 
            new Float32Array([0.1, 0, 0.5, 1.0]), 
            camera, 
            5,
            0);
        UrnMesh.setLightAttrs(Blue);

        UrnMesh.transform.setTranslate(UrnPosition);
        UrnMesh.transform.updateMVPMatrix();
        
        scene.push(UrnMesh);
    })


let SphereMesh;

let SpherePosition = vec3.fromValues(15, -0.5, 0) 
fetch('./models/sphere.obj')
    .then(response => response.text())
    .then(data => {
        SphereMesh = new Mesh(gl, 
            JSON.parse(JSON.stringify(new objLoader.Mesh(data))), 
            projectVal, 
            new Float32Array([0, 0.0, 0, 1.0]), 
            camera, 
            6,
            2);
        SphereMesh.setLightAttrs(Red);

        SphereMesh.transform.setTranslate(SpherePosition);
        SphereMesh.transform.updateMVPMatrix();
        
        scene.push(SphereMesh);
    })

let selected = -1;
let mode = 0;
let mousePos = 0;
let mouseClickX, mouseClickY;
let cameraDragY = false;
let canCameraRotate = true;

let SelectedObject = document.querySelector('#selected-obj');
let selObjName = document.createTextNode("");
SelectedObject.appendChild(selObjName);

let LightMode = document.querySelector('#mode-val');
let lightMode = document.createTextNode("");
LightMode.appendChild(lightMode);

let Shading = document.querySelector('#shading-val');
let shadingMode = document.createTextNode("");
Shading.appendChild(shadingMode);

// Events code
window.onload = () => 
{

    renderer.getCanvas().addEventListener("mouseup", (event) => {
        cameraDragY = false;
    });

    document.addEventListener("keydown", (event) => {
        switch(event.key){
            case '3':
                    // Urn
                selected = 0;
                canCameraRotate = false;
                mode = 0;
                break;
            case '4':
                    // Sphere
                selected = 2;
                canCameraRotate = false;
                mode = 0;
                break;

            case '2':
                selected = -1;
                canCameraRotate = true;
                mode = 0;
                break;

            case 'i':
                mode = mode + 1;
                mode = mode % 2;
                break;

            case '0':
                for(let mesh in scene)
                {
                    if(scene[mesh].getID() == selected && mode == 1)
                        scene[mesh].lightProps.lightSwitch(0);
                }
                break;
            
            case '1':
                for(let mesh in scene)
                {
                    if(scene[mesh].getID() == selected && mode == 1)
                        scene[mesh].lightProps.lightSwitch(1);                    
                }
                break;

            case 'x':
                for(let mesh in scene)
                {
                    if(scene[mesh].getID() == selected && mode == 1){
                        let lightPos = scene[mesh].getLightPos();
                        lightPos[0] -= 0.1;
                        console.log(lightPos[0]);
                        scene[mesh].translateLight(lightPos);
                    }
                }
                break;

            case "x":
                for(let mesh in scene)
                {
                    if(scene[mesh].getID() == selected && mode == 1){                            
                        let lightPos = scene[mesh].getLightPos();
                        lightPos[0] += 0.1;        
                        scene[mesh].translateLight(lightPos);
                    }
                }
                break;

            case 'y':
                for(let mesh in scene){
                    if(scene[mesh].getID() == selected && mode == 1){
                        let lightPos = scene[mesh].getLightPos();
                        lightPos[1] += 0.1;
                        scene[mesh].translateLight(lightPos);
                    }
                }
                break;

            case 'Y':
                for(let mesh in scene){
                    if(scene[mesh].getID() == selected && mode == 1){
                        let lightPos = scene[mesh].getLightPos();
                        lightPos[1] -= 0.1;
                        scene[mesh].translateLight(lightPos);
                    }
                }
                break;

            case 'z':
                for(let mesh in scene){
                    if(scene[mesh].getID() == selected && mode == 1){
                        let lightPos = scene[mesh].getLightPos();
                        lightPos[2] -= 0.1;
                        scene[mesh].translateLight(lightPos);
                    }
                }
                break;

            case 'Z':
                for(let mesh in scene){
                    if(scene[mesh].getID() == selected && mode == 1){
                        let lightPos = scene[mesh].getLightPos();
                        lightPos[2] += 0.1;
                        scene[mesh].translateLight(lightPos);
                    }
                }
                    break;

                case "ArrowLeft":
                
                    for(let mesh in scene)
                    {
                        if(scene[mesh].getID() == selected)
                        {
                            let translation = scene[mesh].transform.getTranslate();
                            translation[0] -= 0.1;
                            vec3.set(scene[mesh].translation, translation[0], translation[1], translation[2]);
                            scene[mesh].transform.setTranslate(scene[mesh].translation);
                            scene[mesh].transform.updateMVPMatrix();

                            let lightPos = scene[mesh].getLightPos();
                            lightPos[0] -= 0.1;
                            scene[mesh].translateLight(lightPos);
                        }
                    }
                    break;
        
        
                case "ArrowRight":
                
                    for(let mesh in scene)
                    {
                        if(scene[mesh].getID() == selected)
                        {
                            let translation = scene[mesh].transform.getTranslate();
                            translation[0] += 0.1;
                            vec3.set(scene[mesh].translation, translation[0], translation[1], translation[2]);
                            scene[mesh].transform.setTranslate(scene[mesh].translation);
                            scene[mesh].transform.updateMVPMatrix();

                            let lightPos = scene[mesh].getLightPos();
                            lightPos[0] += 0.1;
                            scene[mesh].translateLight(lightPos);
                        }
                    }
                    break;
        

                    case "ArrowUp":
                    
                        for(let mesh in scene)
                        {
                            if(scene[mesh].getID() == selected)
                            {
                                let translation = scene[mesh].transform.getTranslate();
                                translation[1] += 0.1;
                                vec3.set(scene[mesh].translation, translation[0], translation[1], translation[2]);
                                scene[mesh].transform.setTranslate(scene[mesh].translation);
                                scene[mesh].transform.updateMVPMatrix();

                                let lightPos = scene[mesh].getLightPos();
                                lightPos[1] += 0.1;
                                scene[mesh].translateLight(lightPos);
                            }
                        }
                    
                    break;
                    case "ArrowDown":
                    {
                        for(let mesh in scene)
                        {
                            if(scene[mesh].getID() == selected)
                            {
                                let translation = scene[mesh].transform.getTranslate();
                                translation[1] -= 0.1;
                                vec3.set(scene[mesh].translation, translation[0], translation[1], translation[2]);
                                scene[mesh].transform.setTranslate(scene[mesh].translation);
                                scene[mesh].transform.updateMVPMatrix();

                                let lightPos = scene[mesh].getLightPos();
                                lightPos[1] -= 0.1;
                                scene[mesh].translateLight(lightPos);
                            }
                        }
                    }
                    break;
                    case "a":
                        for(let mesh in scene)
                        {
                            if(scene[mesh].getID() == selected)
                            {
                                let translation = scene[mesh].transform.getTranslate();
                                translation[2] -= 0.1;
                                vec3.set(scene[mesh].translation, translation[0], translation[1], translation[2]);
                                scene[mesh].transform.setTranslate(scene[mesh].translation);
                                scene[mesh].transform.updateMVPMatrix();

                                let lightPos = scene[mesh].getLightPos();
                                lightPos[2] -= 0.1;
                                scene[mesh].translateLight(lightPos);
                            }
                        }
                        break;
                    case "d":
                        for(let mesh in scene)
                        {
                            if(scene[mesh].getID() == selected)
                            {
                                let translation = scene[mesh].transform.getTranslate();
                                translation[2] += 0.1;
                                vec3.set(scene[mesh].translation, translation[0], translation[1], translation[2]);
                                scene[mesh].transform.setTranslate(scene[mesh].translation);
                                scene[mesh].transform.updateMVPMatrix();

                                let lightPos = scene[mesh].getLightPos();
                                lightPos[2] += 0.1;
                                scene[mesh].translateLight(lightPos);
                            }
                        }
                        break;
                    case "+":
                    
                        for(let mesh in scene)
                        {
                            if(scene[mesh].getID() == selected)
                            {
                                let translation = scene[mesh].transform.getTranslate();
                                translation[1] -= 0.1;
                                vec3.set(scene[mesh].translation, translation[0], translation[1], translation[2]);
                                scene[mesh].transform.setTranslate(scene[mesh].translation);
                                scene[mesh].transform.updateMVPMatrix();

                                let lightPos = scene[mesh].getLightPos();
                                lightPos[1] -= 0.1;
                                scene[mesh].translateLight(lightPos);
                            }
                        }
                        break;
        

                    case "-":
                    
                        for(let mesh in scene)
                        {
                            if(scene[mesh].getID() == selected)
                            {
                                let scale = scene[mesh].transform.getScale();
                                scale[0] = scale[0] - 0.1;
                                scale[1] = scale[1] - 0.1;
                                scale[2] = scale[2] - 0.1;
                                scene[mesh].scaleBy = scale[0];
                                scene[mesh].transform.setScale(scale);
                                scene[mesh].transform.updateMVPMatrix();
                            }
                        }
                        break;
        

                    case "s":
                    
                        for(let mesh in scene){
                            if(scene[mesh].getID() == selected)
                                scene[mesh].setShader();
                        }
        
    }
    });

    renderer.getCanvas().addEventListener("mousedown", (event) => {
        if(1)
        {
            let mouseX = event.clientX;
            let mouseY = event.clientY;

            let render_area = renderer.getCanvas().getBoundingClientRect();
            mouseX = mouseX - render_area.left;
            mouseY = mouseY - render_area.top;

            mousePos = renderer.mouseToClipCoord(mouseX, mouseY);
            
            [mouseClickX, mouseClickY] = mousePos;
            cameraDragY = true;
        }
    });
    
 
    document.addEventListener("mousemove" , (event)=> {
        let mouseX = event.clientX;
        let mouseY = event.clientY;

        let render_area = renderer.getCanvas().getBoundingClientRect();
        mouseX = mouseX - render_area.left;
        mouseY = mouseY - render_area.top;

        mousePos = renderer.mouseToClipCoord(mouseX, mouseY);
        if(canCameraRotate == true)
        {
            if(cameraDragY == true)
            {
                let moveX = mousePos[0] - mouseClickX;
                let moveY = mousePos[1] - mouseClickY;

                if(moveX > 0)
                    {cameraX = moveX/(20*camera.radius);}
        
                else
                    {cameraX = moveX/(20*camera.radius);}
                
                if(moveY > 0)
                    {
                        cameraY = moveY/(20*camera.radius);
                    }
                else
                        cameraY = moveY/(20*camera.radius);}

                if(cameraX > 2*Math.PI | cameraX < -2*Math.PI)
                {
                    cameraX = 0;
                }
                
                if(cameraY > 2*Math.PI | cameraY < -2*Math.PI)
                {
                    cameraY = 0;
                }
                
                camera.eye.x = camera.radius * Math.sin(cameraX)*Math.cos(cameraY);
                camera.eye.z = camera.radius * Math.cos(cameraX)*Math.cos(cameraY);
                camera.eye.y = camera.radius * Math.sin(cameraY);

                
                
                    for(let mesh in scene)
                    {
                        scene[mesh].updateCamera(camera);
                    }
                
            }        
        
        else
        {
            if(cameraDragY == true)
            {
                //Initial Vector P1
                let p1 = vec3.create();
                vec3.normalize(p1, vec3.fromValues(mouseClickX, mouseClickY, 1000));
                // Moved Vector P2
                let p2 = vec3.create();
                vec3.normalize(p2, vec3.fromValues(mousePos[0], mousePos[1], 1000));
                
                //Rotation Angle
                let theta = vec3.angle(p1, p2);
                
                // Rotation Axis
                let rotAxis = vec3.create();
                vec3.cross(rotAxis, p1, p2);

                for(let mesh in scene)
                {
                    if(scene[mesh].getID() == selected)
                    {
                        let Quat = quat.create();
                        quat.setAxisAngle(Quat, rotAxis, theta);
                        quat.normalize(Quat, Quat);
                        let RotMat = mat4.create();
                        mat4.fromQuat(RotMat, Quat);

                        let current = scene[mesh].transform.getRotate();
                        mat4.multiply(current, current, RotMat);
                        scene[mesh].transform.setRotate(current);
                        scene[mesh].transform.updateMVPMatrix();
                    }
                }
            }
        }    
    });
};

function animate()
{
    renderer.clear();
    
    if(selected == 0)
    {
        selObjName.nodeValue = "Urn";
        scene.forEach(element => {
            if(element.getID() == 0)
                shadingMode.nodeValue = (element.getShader() == 0) ? "Gourad" : "Phong";
            
        }
        );
    }
    
    else 
        selObjName.nodeValue = (selected == 2) ? "Sphere" : "None";
    

    if(selected != -1)
        lightMode.nodeValue = (mode === 0) ? "OFF" : "ON";   
    

    
    
    let CombinedLights = [];
    scene.forEach(element => {
        CombinedLights.push(element.lightProps.getStruct()) 
    }
    );
        
    scene.forEach(element => {
        element.setAllLights(CombinedLights);
            
        if(element.getShader() == 0){
            gouradShaderCode.use();
            element.draw(gouradShaderCode, false);
        }

        else{
            phongShaderCode.use();
            element.draw(phongShaderCode, false);
        }
     });


    window.requestAnimationFrame(animate);
}
animate();