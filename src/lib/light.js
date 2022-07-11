// LightProps class allows us to set the properties of the light source.

import { vec3 } from 'https://cdn.skypack.dev/gl-matrix';

export default class LightProps
{
    constructor()
    {
        // Initial shine amount
        this.shinyAmt = 10;

        // Default values of light properties
        this.LightStruct = 
        {
            ka : 1.0,
            kd : 1.0,
            ks : 1.0,

            // Initializing AmbientColor to black
            AmbientColor : vec3.fromValues(1.0, 1.0, 1.0),
            
            // Initializing DiffuseColor to black
            DiffuseColor : vec3.fromValues(1.0, 1.0, 1.0),
            
            // Initializing SpecularColor to black
            SpecularColor : vec3.fromValues(1.0, 1.0, 1.0), 
            
            LightPos : vec3.fromValues(0, 0, 0),
            LightSourceOn : 1,
        }

        this.limit = 0.5;
    }

    // Setting ka value
    setKa(ka)
    {
        this.LightStruct.ka = ka;
    }

    // Getter for ka
    getKa()
    {
        return this.LightStruct.ka;
    }

    // Setting kd value
    setKd(kd)
    {
        this.LightStruct.kd = kd;
    }
    
    // Getter for kd
    getKd()
    {
        return this.LightStruct.kd;
    }

    // Setting ks value
    setKs(ks)
    {
        this.LightStruct.ks = ks;
    }

    // Getter for ks
    getKs()
    {
        return this.LightStruct.ks;
    }

    // Setting ambient value
    setAmbient(Color)
    {
        this.LightStruct.AmbientColor = Color;
    }
    
    // Setting diffuse value
    setDiffuse(Color)
    {
        this.LightStruct.DiffuseColor = Color;
    }

    // Setting specular value
    setSpecular(Color)
    {
        this.LightStruct.SpecularColor = Color;
    }

    // Setting shine value
    setShine(shine)
    {
        this.shinyAmt = shine;
    }

    // Getter for shine value
    getShine()
    {
        return this.shinyAmt;
    }

    // Setting Limit value
    setLimit(limit)
    {
        this.limit = limit;
    }
    
    // Setting and Accessing Position value for the light source object
    setPosition(LightPos)
    {
        this.LightStruct.LightPos = LightPos;
    }
    
    getPosition()
    {
        return this.LightStruct.LightPos;
    }

    // Switching on light source
    lightSwitch(val)
    {
        this.LightStruct.LightSourceOn = val;
    }

    // Getter for LightStruct
    getStruct()
    {
        return this.LightStruct;
    }
};
