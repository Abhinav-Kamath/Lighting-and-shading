/*
 * The Shader class creates and maintains both vertex as well as fragment shaders. 
 * It also compiles and links them to form a program.
*/

export default class ProgramCreator
{
    constructor(gl, vertexShaderSrc, fragmentShaderSrc)
    {
        this.gl = gl;
        this.vertexShaderSrc = vertexShaderSrc;
        this.fragmentShaderSrc = fragmentShaderSrc;

        // Creating vertex shader
        this.vertexShader = this.gl.createShader(gl.VERTEX_SHADER);
        this.gl.shaderSource(this.vertexShader, vertexShaderSrc);
        this.gl.compileShader(this.vertexShader);

        if(!this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS))
        {
            console.error(`Error while compiling this.vertexShader ${vertexShaderSrc}`);
            throw new Error(this.gl.getShaderInfoLog(this.vertexShader));
        }

        // Creating fragment shader
        this.fragmentShader = this.gl.createShader(gl.FRAGMENT_SHADER);
        this.gl.shaderSource(this.fragmentShader, fragmentShaderSrc);
        this.gl.compileShader(this.fragmentShader);

        if(!this.gl.getShaderParameter(this.fragmentShader, this.gl.COMPILE_STATUS))
        {
            console.error(`Error while compiling this.fragmentShader ${fragmentShaderSrc}`);
            throw new Error(this.gl.getShaderInfoLog(this.fragmentShader));
        }

        // We want to combine them use them together called- program
        this.program = this.gl.createProgram();
	    
	// Attach both vertex and fragment shaders one by one    
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        
	// Link the program together (compile, attach, link)    
	this.gl.linkProgram(this.program);

	// Check for link errors
        if(!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS))
        {
            console.error(`Error while linking shaders`);
            throw new Error(this.gl.getProgramInfoLog(this.program));
        }
    }

    // This method calls the useProgram function which
    // combines the two shaders and allows us to use them
    use()
    {
        this.gl.useProgram(this.program);
    }

    /*
     * Functions for storing attribute or uniform variable values 
    */

    attribute(attributeName)
    {
        return this.gl.getAttribLocation(this.program, attributeName);
    }

    uniform(uniformName)
    {
	return this.gl.getUniformLocation(this.program, uniformName);
    }

    setUniform1f(uniformLocation, mat1)
    {
        this.gl.uniform1f(uniformLocation, mat1);
    }

    setUniform1i(uniformLocation, val)
    {
        this.gl.uniform1i(uniformLocation, val);
    }

    setUniform3fv(uniformLocation, vec3)
    {
	this.gl.uniform4fv(uniformLocation, vec3);
    }

    setUniformMatrix4fv(uniformLocation, mat4)
    {
        this.gl.uniformMatrix4fv(uniformLocation, false, mat4);
    }

    setUniform3fv(uniformLocation, mat3)
    {
        this.gl.uniform3fv(uniformLocation, mat3);
    }
}
