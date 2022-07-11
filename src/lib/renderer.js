// This constant is the color the canvas is filled with when it is cleared
const bgColor = [0, 0, 0, 1];

export default class Renderer
{
    constructor()
    {
	// Creation of canvas element with id "canvas"
        this.canvas = document.createElement("canvas");
        this.canvas.className = 'Canvas1'
        document.querySelector("body").appendChild(this.canvas);
        
        const gl = this.canvas.getContext("webgl") 
        
	// Check if webgl supported
        if (!gl)
        {
	    console.log("Falling back on experimental-webgl");
            this.canvas.getContext("experimental-webgl");
        }

	// WebGL not supported at all    
        if (!gl) 
        {
            throw new Error("Your browser does not support WebGL");
        }

        this.gl = gl;
        
	// Setting canvas attributes
        this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }

    // Getter for canvas element
    getCanvas()
    {
        return this.canvas;
    }
	
    // Returns gl context
    getGlContext()
    {
        return this.gl;
    }
    
    // Call to clear the canvas and fill with a different color
    clear()
    {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(bgColor[0], bgColor[1], bgColor[2], bgColor[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    // Mouse to clip coordinates
    mouseToClipCoord(mouseX,mouseY) 
    {
	return [mouseX - this.canvas.width/2, this.canvas.height/2 - mouseY]
    }
}
