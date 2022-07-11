//Gourad Fragment Shader
export const GouradFragmentShaderSrc = `
    precision mediump float;
    uniform vec4 aColor;
    varying vec4 vColor;
    void main () 
    {
        gl_FragColor = vColor + aColor;
    }
`;
