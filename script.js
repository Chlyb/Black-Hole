const c = 30;
const G = 3;

var camPos;

const width = 400;
const height = 400;

var fov = 60;

main();

function main() {
      /* Step1: Prepare the canvas and get WebGL context */
         var canvas = document.getElementById('my_Canvas');
         var gl = canvas.getContext('webgl2');
         canvas.width = width;
         canvas.height = height;

         /* Step2: Define the geometry and store it in buffer objects */

         //var vertices = [-0.5, 0.5, -0.5, -0.5, 0.0, -0.5,];
         var vertices = [-1, -1, -1, 1, 1, 1,
         -1,-1,1,1,1,-1];

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
        if(!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
          console.error('Error compiling vertex shader', gl.getShaderInfoLog(vertShader));
         //Fragment shader source code
         
         var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

         // Attach fragment shader sauce code
         gl.shaderSource(fragShader, fragCode);
         gl.compileShader(fragShader);
        if(!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
            console.error('Error compiling fragment shader', gl.getShaderInfoLog(fragShader));


         var shaderProgram = gl.createProgram();

         // Attach a vertex shader
         gl.attachShader(shaderProgram, vertShader); 
         gl.attachShader(shaderProgram, fragShader);

         // Link both programs
         gl.linkProgram(shaderProgram);

        if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
              console.error('Error linking program', gl.getProgramInfoLog(shaderProgram));
        }
        gl.validateProgram(shaderProgram);
        if(!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)){
          console.error('Error validating program', gl.getProgramInfoLog(shaderProgram));
        }
        else{
          console.log('program validated');
        }
         
         gl.useProgram(shaderProgram);

         /* Step 4: Associate the shader programs to buffer objects */

         //Bind vertex buffer object
         gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

         //Get the attribute location
         var coord = gl.getAttribLocation(shaderProgram, "coordinates");

         var mass_loc = gl.getUniformLocation(shaderProgram, "m");
         var cam_pos_loc = gl.getUniformLocation(shaderProgram, "cam_pos");
         var fovH_loc = gl.getUniformLocation(shaderProgram, "fovH");
         var fovV_loc = gl.getUniformLocation(shaderProgram, "fovV");

         //point an attribute to the currently bound VBO
         gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

         //Enable the attribute
         gl.enableVertexAttribArray(coord);

         /* Step5: Drawing the required object (triangle) */

         // Clear the canvas
         gl.clearColor(0, 0, 0, 1);

         
         // Clear the color buffer bit
         gl.clear(gl.COLOR_BUFFER_BIT);

         // Set the view port
         gl.viewport(0,0,canvas.width,canvas.height);
        
         gl.uniform1f(mass_loc, 4000.0);
         gl.uniform3f(cam_pos_loc, -300.0,30.1,0.0);

         let fovH = Math.tan(fov/2 * Math.PI / 180);
         gl.uniform1f(fovH_loc, fovH);
         gl.uniform1f(fovV_loc, fovH * height / width);
         //gl.uniform1f(fovH_loc, 0.5);
         //gl.uniform1f(fovV_loc, 0.5);
         
         // Draw the triangle
         gl.drawArrays(gl.TRIANGLES, 0, 6);
}


  
