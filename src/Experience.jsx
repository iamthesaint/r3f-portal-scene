import { shaderMaterial, Sparkles, Center, useTexture, useGLTF, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'
import * as THREE from 'three'

const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color('#ffffff'),
        uColorEnd: new THREE.Color('#000000')
    },
    portalVertexShader,
    portalFragmentShader
)

// extends the shader material to be used in the mesh 
extend({ PortalMaterial: PortalMaterial })


export default function Experience()
{
    const { nodes } = useGLTF('./model/portal.glb')

    const bakedTexture = useTexture('./model/baked.jpg')
    bakedTexture.flipY = false

    const portalMaterial = useRef()
    useFrame((state, delta) =>
    {
        portalMaterial.current.uTime += delta
    })

    return <>

    <color args={ [ '#030202' ] } attach="background" />

    <OrbitControls makeDefault />

    <Center>

        <mesh geometry={ nodes.baked.geometry } >
            <meshBasicMaterial map={ bakedTexture } />
        </mesh>

        {/* right polelight */}
        <mesh
        geometry={ nodes.poleLightA.geometry }
        position={ nodes.poleLightA.position }
        >
            <meshBasicMaterial color="#ffffe5" />
        </mesh>

        {/* left polelight */} 
        <mesh
        geometry={ nodes.poleLightB.geometry }
        position={ nodes.poleLightB.position }
        >

            <meshBasicMaterial color="#ffffe5" />
        </mesh>

        {/* portal light */}
        <mesh
        geometry={ nodes.portalLight.geometry }
        position={ nodes.portalLight.position }
        rotation={ nodes.portalLight.rotation }        
        >
            <portalMaterial
            ref={ portalMaterial }
            side={ THREE.DoubleSide }
            />
        </mesh>

        {/* fireflies */}
        <Sparkles
        size={ 6 }
        scale={ [ 4, 2, 4 ] }
        position-y={ 1 }
        speed={ 0.5 }
        count={ 40 }
        />

    </Center>
    </>
}