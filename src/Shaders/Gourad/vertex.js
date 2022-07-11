//Gourad Vertex Shader
export const GouradVertexShaderSrc = `
attribute vec3 aPosition;
uniform mat4 modelMat;

uniform mat4 transposeWMat; 
attribute vec3 normalAttr;

uniform vec3 uViewWorldPos;

uniform mat4 viewMat;
uniform mat4 projMat;
uniform mat4 worldMat;

uniform float uShinyAmt;

uniform float Ka;
uniform float Kd;
uniform float Ks;

struct Light 
{
    vec3 uLightWorldPosition;
    vec3 uLightDirection;
    float maxDist;
    vec3 AmbientColor;
    vec3 DiffuseColor;
    vec3 SpecularColor;
    bool LightSourceOn;
};

varying vec4 vColor;

uniform Light LightPositions[2];

void main() {
    gl_Position = projMat * viewMat * modelMat * vec4(aPosition, 1);
    gl_PointSize = 5.0;
    
    vColor = vec4(0.0,0.0,0.0,1.0);

    vec3 surfaceWorldPosition = (modelMat* vec4(aPosition,1)).xyz;
    vec3 normal = normalize(mat3(transposeWMat) * normalAttr);

    for(int i=0;i < 2; i++)
    {
        vec3 surfaceToLightDirection = normalize(LightPositions[i].uLightWorldPosition - surfaceWorldPosition);
        vec3 surfaceToViewDirection = normalize(uViewWorldPos - surfaceWorldPosition);
        vec3 halfvector = normalize(surfaceToLightDirection + surfaceToViewDirection);

        float light = 0.0;
        float specular = 0.0;

        float dotFromDirection = dot(surfaceToLightDirection, -LightPositions[i].uLightDirection);
        
        float diff = max(dot(normal, surfaceToLightDirection), 0.0);
        vec3 diffuse = diff * LightPositions[i].DiffuseColor;

        light = dot(normal, surfaceToLightDirection);
        specular = pow(dot(normal, halfvector), uShinyAmt);

        float d = length(LightPositions[i].uLightWorldPosition - surfaceWorldPosition);
        float c1 = 0.0003;
        float c2 = 0.0003;
        float c3 = 0.0003;
        float attenuation = 1.0/(c1 + c2*d + c3*d*d);

        vec4 Color = vec4(Ka * LightPositions[i].AmbientColor,1) + 
                     attenuation * vec4(Kd * diffuse +
                                        Ks * specular * LightPositions[i].SpecularColor, 1.0);
                                        
        if(LightPositions[i].LightSourceOn)
        {
            vColor += Color;
        }
    }
}
`;




