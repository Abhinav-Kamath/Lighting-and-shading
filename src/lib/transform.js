import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Transform
{
    constructor()
	{
		this.scale = vec3.fromValues(1, 1, 1);
				
		this.rotationAngle = 0;
		this.rotationAxis = vec3.fromValues(0, 1, 0);

		this.translate = vec3.fromValues(0, 0, 0);
		
		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);

		this.mvpMatrix = this.modelTransformMatrix;

		this.tempTranslate = vec3.fromValues(0, 0, 0);
		this.tempX = 0;
		this.tempY = 0;

		this.RotMatrix = mat4.create();
		mat4.identity(this.RotMatrix);
		this.updateMVPMatrix();
	}
    
	/*
	  * Getters and setters for the differnt attributes and some matrix operations
	*/
	
	getModelMatrix()
	{
		return this.modelTransformMatrix;
	}

	updateMVPMatrix()
	{
		mat4.identity(this.modelTransformMatrix);
        	mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);
        	mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, this.RotMatrix);
	}

	setRotate(RotMat)
	{
		this.RotMatrix = RotMat;
	}

	getRotate()
	{
		return this.RotMatrix;
	}

	setTranslate(translationVec)
	{
		this.translate = translationVec;
	}

	getTranslate()
	{
		return this.translate;
	}

	setScale(scalingVec)
	{
		this.scale = scalingVec;
	}

	getScale()
	{
		return this.scale;
	}
};
