import { mat4 } from 'gl-matrix';
import { RefObject } from 'react';
import { store } from '../store/store';
import { setError } from '../store/television/televisionSlice';


const VIDEO_URL = process.env.PUBLIC_URL + 'video.mp4';

// In order for this to work we need another canvas with 'webgl' context.
// Code works but there is a bug with rerendering the image when resizing window: dimensions are not adjusted to window size.
export class Cube {
    buffers: any;
    texture: WebGLTexture | null;
    video: HTMLVideoElement;
    then: number = 0;
    programInfo: any;
    gl: WebGLRenderingContext | null;
    cubeRotation = 0.0;
    // will set to true when video can be copied to texture
    copyVideo = false;


    constructor(canvasRef: RefObject<HTMLCanvasElement>) {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const gl = canvas.getContext("webgl") as WebGLRenderingContext;

        // If we don't have a GL context, give up now

        if (!gl) {
            store.dispatch(setError({
                title: 'An Error Occurred!',
                description: "Unable to initialize WebGL. Your browser or machine may not support it."
            }));
            return;
        }

        this.gl = gl;

        // Vertex shader program

        const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec2 aTextureCoord;
    
        uniform mat4 uNormalMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
    
        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;
    
        void main(void) {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
          vTextureCoord = aTextureCoord;
    
          // Apply lighting effect
    
          highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
          highp vec3 directionalLightColor = vec3(1, 1, 1);
          highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
    
          highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
    
          highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
          vLighting = ambientLight + (directionalLightColor * directional);
        }
      `;

        // Fragment shader program

        const fsSource = `
        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;
    
        uniform sampler2D uSampler;
    
        void main(void) {
          highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
    
          gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
        }
      `;

        // Initialize a shader program; this is where all the lighting
        // for the vertices and so forth is established.
        const shaderProgram = this.initShaderProgram(gl, vsSource, fsSource);

        // Collect all the info needed to use the shader program.
        // Look up which attributes our shader program is using
        // for aVertexPosition, aVertexNormal, aTextureCoord,
        // and look up uniform locations.
        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram as WebGLProgram, "aVertexPosition"),
                vertexNormal: gl.getAttribLocation(shaderProgram as WebGLProgram, "aVertexNormal"),
                textureCoord: gl.getAttribLocation(shaderProgram as WebGLProgram, "aTextureCoord"),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(
                    shaderProgram as WebGLProgram,
                    "uProjectionMatrix"
                ),
                modelViewMatrix: gl.getUniformLocation(shaderProgram as WebGLProgram, "uModelViewMatrix"),
                normalMatrix: gl.getUniformLocation(shaderProgram as WebGLProgram, "uNormalMatrix"),
                uSampler: gl.getUniformLocation(shaderProgram as WebGLProgram, "uSampler"),
            },
        };

        // Here's where we call the routine that builds all the
        // objects we'll be drawing.
        this.buffers = this.initBuffers(gl);

        this.texture = this.initTexture(gl);

        this.video = this.setupVideo(VIDEO_URL);

        this.then = 0;

    }


    setupVideo(url: string) {
        const video = document.createElement("video");

        let playing = false;
        let timeupdate = false;

        video.playsInline = true;
        video.muted = true;
        video.loop = true;

        // Waiting for these 2 events ensures
        // there is data in the video

        video.addEventListener(
            "playing",
            () => {
                playing = true;
                checkReady();
            },
            true
        );

        video.addEventListener(
            "timeupdate",
            () => {
                timeupdate = true;
                checkReady();
            },
            true
        );

        video.src = url;
        video.play();

        const checkReady = () => {
            if (playing && timeupdate) {
                this.copyVideo = true;
            }
        }

        return video;
    }

    //
    // initBuffers
    //
    // Initialize the buffers we'll need. For this demo, we just
    // have one object -- a simple three-dimensional cube.
    //
    initBuffers(gl: WebGLRenderingContext) {
        // Create a buffer for the cube's vertex positions.

        const positionBuffer = gl.createBuffer();

        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Now create an array of positions for the cube.

        const positions = [
            // Front face
            -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
        ];

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // Set up the normals for the vertices, so that we can compute lighting.

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

        const vertexNormals = [
            // Front
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

            // Back
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

            // Top
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

            // Bottom
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

            // Right
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

            // Left
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        ];

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(vertexNormals),
            gl.STATIC_DRAW
        );

        // Now set up the texture coordinates for the faces.

        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

        const textureCoordinates = [
            // Front
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            // Back
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            // Top
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            // Bottom
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            // Right
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            // Left
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        ];

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(textureCoordinates),
            gl.STATIC_DRAW
        );

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        const indices = [
            0,
            1,
            2,
            0,
            2,
            3, // front
            4,
            5,
            6,
            4,
            6,
            7, // back
            8,
            9,
            10,
            8,
            10,
            11, // top
            12,
            13,
            14,
            12,
            14,
            15, // bottom
            16,
            17,
            18,
            16,
            18,
            19, // right
            20,
            21,
            22,
            20,
            22,
            23, // left
        ];

        // Now send the element array to GL

        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices),
            gl.STATIC_DRAW
        );

        return {
            position: positionBuffer,
            normal: normalBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        };
    }

    //
    // Initialize a texture.
    //
    initTexture(gl: WebGLRenderingContext, url?: string) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Because video havs to be download over the internet
        // they might take a moment until it's ready so
        // put a single pixel in the texture so we can
        // use it immediately.
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            width,
            height,
            border,
            srcFormat,
            srcType,
            pixel
        );

        // Turn off mips and set  wrapping to clamp to edge so it
        // will work regardless of the dimensions of the video.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        return texture;
    }

    //
    // copy the video texture
    //
    updateTexture(gl: WebGLRenderingContext, texture: any, video: any) {
        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            video
        );
    }

    //
    // Draw the scene.
    //
    drawScene(gl: WebGLRenderingContext, programInfo: any, buffers: any, texture: any, deltaTime: any) {
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        // Clear the canvas before we start drawing on it.

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.

        const fieldOfView = (45 * Math.PI) / 180; // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelViewMatrix = mat4.create();

        // Now move the drawing position a bit to where we want to
        // start drawing the square.

        mat4.translate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to translate
            [-0.0, 0.0, -6.0]
        ); // amount to translate
        mat4.rotate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to rotate
            this.cubeRotation, // amount to rotate in radians
            [0, 0, 1]
        ); // axis to rotate around (Z)
        mat4.rotate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to rotate
            this.cubeRotation * 0.7, // amount to rotate in radians
            [0, 1, 0]
        ); // axis to rotate around (X)

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the texture coordinates from
        // the texture coordinate buffer into the textureCoord attribute.
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
            gl.vertexAttribPointer(
                programInfo.attribLocations.textureCoord,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
        }

        // Tell WebGL how to pull out the normals from
        // the normal buffer into the vertexNormal attribute.
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexNormal,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix
        );

        // Specify the texture to map onto the faces.

        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        {
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

        // Update the rotation for the next draw

        this.cubeRotation += deltaTime;
    }

    //
    // Initialize a shader program, so WebGL knows how to draw our data
    //
    initShaderProgram(gl: WebGLRenderingContext, vsSource: any, fsSource: any) {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        // Create the shader program

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram as WebGLProgram, vertexShader as WebGLShader);
        gl.attachShader(shaderProgram as WebGLProgram, fragmentShader as WebGLShader);
        gl.linkProgram(shaderProgram as WebGLProgram);

        // If creating the shader program failed, alert

        if (!gl.getProgramParameter(shaderProgram as WebGLProgram, gl.LINK_STATUS)) {
            console.error(
                "Unable to initialize the shader program: " +
                gl.getProgramInfoLog(shaderProgram as WebGLProgram)
            );
            return null;
        }

        return shaderProgram;
    }

    //
    // creates a shader of the given type, uploads the source and
    // compiles it.
    //
    loadShader(gl: WebGLRenderingContext, type: any, source: any) {
        const shader = gl.createShader(type);

        // Send the source to the shader object

        gl.shaderSource(shader as WebGLShader, source);

        // Compile the shader program

        gl.compileShader(shader as WebGLShader);

        // See if it compiled successfully

        if (!gl.getShaderParameter(shader as WebGLShader, gl.COMPILE_STATUS)) {
            console.error(
                "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader as WebGLShader)
            );
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    // Draw the scene repeatedly
    render(now: number) {
        now *= 0.001; // convert to seconds
        const deltaTime = now - this.then;
        this.then = now;

        if (this.copyVideo) {
            this.updateTexture(this.gl as WebGLRenderingContext, this.texture, this.video);
            this.drawScene(this.gl as WebGLRenderingContext, this.programInfo, this.buffers, this.texture, deltaTime);
        }
    }
}