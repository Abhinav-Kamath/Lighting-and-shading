//Phong Vertex Shader
export const PhongVertexShaderSrc= `
    attribute vec3 aPosition;
    
    uniform mat4 modelMat;
    
    uniform mat4 transposeWMat; 
    attribute vec3 normalAttr;
    varying vec3 normalVary;
    
    uniform mat4 viewMat;
    uniform mat4 projMat;

    varying vec3 surfaceWPos;
    
    void main() 
    {
        gl_Position = projMat * viewMat * modelMat * vec4(aPosition, 1);
        gl_PointSize = 5.0;
        normalVary = mat3(transposeWMat) * normalAttr;

        vec3 surfaceWPos = (modelMat* vec4(aPosition,1)).xyz;
    }
`;
