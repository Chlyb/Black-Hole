const width = 400;
const height = 400;

var camPos = [];
var camDistance = 300;
var pitch = 0.1;
var yaw = 0;
var mass = 4000;
var fov = 80;

var render = true;

const mouseSensitivity = 0.01;

function main() {
    /* Step1: Prepare the canvas and get WebGL context */
    var canvas = document.getElementById('my_Canvas');
    var gl = canvas.getContext('webgl2');
    canvas.width = width;
    canvas.height = height;

    /* Step2: Define the geometry and store it in buffer objects */

    var vertices = [-1, -1, -1, 1, 1, 1,
        -1, -1, 1, 1, 1, -1
    ];

    // Create a new buffer object
    var vertex_buffer = gl.createBuffer();

    // Bind an empty array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertices data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /* Step3: Create and compile Shader programs */

    // Vertex shader source code
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
        console.error('Error compiling vertex shader', gl.getShaderInfoLog(vertShader));
    //Fragment shader source code

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Attach fragment shader sauce code
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
        console.error('Error compiling fragment shader', gl.getShaderInfoLog(fragShader));


    var shaderProgram = gl.createProgram();

    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);

    // Link both programs
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Error linking program', gl.getProgramInfoLog(shaderProgram));
    }
    gl.validateProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
        console.error('Error validating program', gl.getProgramInfoLog(shaderProgram));
    } else {
        console.log('program validated');
    }

    gl.useProgram(shaderProgram);

    /* Step 4: Associate the shader programs to buffer objects */

    //Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    //Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    var massLoc = gl.getUniformLocation(shaderProgram, "m");
    var camPosLoc = gl.getUniformLocation(shaderProgram, "cam_pos");
    var skyboxLoc = gl.getUniformLocation(shaderProgram, "u_skybox");
    var fovHorLoc = gl.getUniformLocation(shaderProgram, "fov_h");
    var fovVerLoc = gl.getUniformLocation(shaderProgram, "fov_v");

    //point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

    //Enable the attribute
    gl.enableVertexAttribArray(coord);

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    const faceInfos = [{
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            url: 'images/1/xneg.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            url: 'images/1/xpos.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            url: 'images/1/ypos.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            url: 'images/1/yneg.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            url: 'images/1/zpos.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            url: 'images/1/zneg.jpg',
        },
    ];
    faceInfos.forEach((faceInfo) => {
        const {
            target,
            url
        } = faceInfo;

        // Upload the canvas to the cubemap face.
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1024;
        const height = 1024;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;

        // setup each face so it's immediately renderable
        gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

        // Asynchronously load an image
        const image = new Image();
        image.src = url;
        image.addEventListener('load', function() {
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            gl.texImage2D(target, level, internalFormat, format, type, image);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        });
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    function loop() {
        if (render) {
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform3f(camPosLoc, camPos[0], camPos[1], camPos[2]);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            render = false;
        }
        requestAnimationFrame(loop);
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.uniform1f(massLoc, 4000.0);

    calculateCamPos();
    gl.uniform3f(camPosLoc, camPos[0], camPos[1], camPos[2]);
    gl.uniform1i(skyboxLoc, 0);

    let fovH = Math.tan(fov / 2 * Math.PI / 180);
    gl.uniform1f(fovHorLoc, fovH);
    gl.uniform1f(fovVerLoc, fovH * height / width);

    requestAnimationFrame(loop);
}

function moveCamera(e) {
    if (e.buttons == 0) return;
    
    yaw += e.movementX * mouseSensitivity;
    pitch += e.movementY * mouseSensitivity;

    if (pitch > Math.PI / 2)
        pitch = Math.PI / 2;
    if (pitch < -Math.PI / 2)
        pitch = -Math.PI / 2;

    calculateCamPos();
    
    render = true;
}

function calculateCamPos(){
  camPos[0] = camDistance * Math.cos(pitch) * Math.cos(yaw);
  camPos[1] = camDistance * Math.sin(pitch);
  camPos[2] = camDistance * Math.cos(pitch) * Math.sin(yaw);
}