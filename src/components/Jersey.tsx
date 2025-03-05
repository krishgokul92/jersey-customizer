import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Decal, useGLTF, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { JerseyColors, TextTransform, JerseyText } from '../types/jersey';
import * as THREE from 'three';
import styles from '../styles/Jersey.module.css';

interface JerseyProps {
  colors: JerseyColors;
  number: string;
  numberTransform: TextTransform;
  name: JerseyText;
}

// Add DebugBox component
const DebugBox = ({ position, rotation, scale, color }: { 
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}) => (
  <mesh
    position={position}
    rotation={rotation}
    scale={scale}
  >
    <boxGeometry args={[1, 1, 0.1]} />
    <meshBasicMaterial color={color} wireframe opacity={0.5} transparent />
  </mesh>
);

function JerseyModel({ colors, number, numberTransform, name }: { 
  colors: JerseyColors; 
  number: string; 
  numberTransform: TextTransform;
  name: JerseyText;
}) {
  const { nodes, materials } = useGLTF('/models/Jersey.glb') as any;
  const numberTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const numberCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const nameTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const nameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Log materials and nodes for debugging
  useEffect(() => {
    console.log('Available materials:', Object.keys(materials));
    console.log('Available nodes:', nodes);
  }, [materials, nodes]);

  // Create canvases once
  useEffect(() => {
    // Number canvas
    const numberCanvas = document.createElement('canvas');
    numberCanvas.width = 512;
    numberCanvas.height = 512;
    numberCanvasRef.current = numberCanvas;

    // Name canvas
    const nameCanvas = document.createElement('canvas');
    nameCanvas.width = 512;
    nameCanvas.height = 512;
    nameCanvasRef.current = nameCanvas;

    return () => {
      numberCanvasRef.current = null;
      nameCanvasRef.current = null;
      if (numberTextureRef.current) {
        numberTextureRef.current.dispose();
        numberTextureRef.current = null;
      }
      if (nameTextureRef.current) {
        nameTextureRef.current.dispose();
        nameTextureRef.current = null;
      }
    };
  }, []);

  // Update number texture
  useEffect(() => {
    if (!numberCanvasRef.current) {
      console.log('Number canvas ref is null');
      return;
    }
    const context = numberCanvasRef.current.getContext('2d');
    if (!context) {
      console.log('Failed to get 2d context for number');
      return;
    }

    console.log('Drawing number:', number, 'with color:', colors.numberColor);
    
    context.clearRect(0, 0, 512, 512);
    context.fillStyle = 'rgba(255, 255, 255, 0)';
    context.fillRect(0, 0, 512, 512);
    
    context.font = 'bold 400px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    context.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    context.lineWidth = 8;
    context.strokeText(number || '00', 256, 256);
    
    context.fillStyle = colors.numberColor;
    context.fillText(number || '00', 256, 256);

    if (!numberTextureRef.current) {
      numberTextureRef.current = new THREE.CanvasTexture(numberCanvasRef.current);
      numberTextureRef.current.anisotropy = 16;
      numberTextureRef.current.premultiplyAlpha = true;
      numberTextureRef.current.format = THREE.RGBAFormat;
      console.log('Created new number texture');
    } else {
      numberTextureRef.current.needsUpdate = true;
      console.log('Updated existing number texture');
    }
  }, [colors.numberColor, number]);

  // Update name texture
  useEffect(() => {
    if (!nameCanvasRef.current) {
      console.log('Name canvas ref is null');
      return;
    }
    if (!name.content) {
      console.log('No name content provided');
      return;
    }
    const context = nameCanvasRef.current.getContext('2d');
    if (!context) {
      console.log('Failed to get 2d context for name');
      return;
    }

    console.log('Drawing name:', name.content, 'with color:', colors.nameColor);

    context.clearRect(0, 0, 512, 512);
    context.fillStyle = 'rgba(255, 255, 255, 0)';
    context.fillRect(0, 0, 512, 512);
    
    context.font = 'bold 400px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    context.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    context.lineWidth = 8;
    context.strokeText(name.content.toUpperCase(), 256, 256);
    
    context.fillStyle = colors.nameColor;
    context.fillText(name.content.toUpperCase(), 256, 256);

    if (!nameTextureRef.current) {
      nameTextureRef.current = new THREE.CanvasTexture(nameCanvasRef.current);
      nameTextureRef.current.anisotropy = 16;
      nameTextureRef.current.premultiplyAlpha = true;
      nameTextureRef.current.format = THREE.RGBAFormat;
      console.log('Created new name texture');
    } else {
      nameTextureRef.current.needsUpdate = true;
      console.log('Updated existing name texture');
    }
  }, [colors.nameColor, name.content]);

  // Update materials with custom colors
  useEffect(() => {
    // Detailed logging for debugging
    console.log('Available materials:', Object.keys(materials));
    
    // Log each material's details
    Object.entries(materials).forEach(([name, material]) => {
      const mat = material as THREE.MeshStandardMaterial;
      console.log('Material:', {
        name,
        type: mat.type,
        color: mat.color?.getHexString()
      });

      // Make all materials less shiny and more flat
      mat.roughness = 0.8;  // Higher roughness = less shiny (0-1)
      mat.metalness = 0.1;  // Lower metalness = more flat/matte (0-1)
      mat.envMapIntensity = 0.5; // Lower environment map intensity
      mat.needsUpdate = true;
    });

    // Try different possible material names
    Object.entries(materials).forEach(([name, material]) => {
      const meshMaterial = material as THREE.MeshStandardMaterial;
      console.log('Processing material:', name);

      // Convert both to lowercase for case-insensitive comparison
      const lowerName = name.toLowerCase();
      
      // Try to match body material
      if (lowerName.includes('body') || lowerName === 'material' || lowerName.includes('jersey') || lowerName.includes('main')) {
        console.log('Setting body color for:', name);
        meshMaterial.color = new THREE.Color(colors.body);
        meshMaterial.needsUpdate = true;
      }
      
      // Try to match sleeve material
      if (lowerName.includes('sleeve')) {
        console.log('Setting sleeve color for:', name);
        meshMaterial.color = new THREE.Color(colors.sleeves);
        meshMaterial.needsUpdate = true;
      }
      
      // Try to match collar material - expanded matching
      if (lowerName.includes('borders')) {
        console.log('Setting collar color for:', name);
        meshMaterial.color = new THREE.Color(colors.collar);
        meshMaterial.needsUpdate = true;
      }

      // Log if material wasn't matched
      if (!lowerName.includes('body') && 
          !lowerName.includes('sleeve') && 
          !lowerName.includes('collar') && 
          !lowerName.includes('neck') &&
          !lowerName.includes('trim')) {
        console.log('Unmatched material:', name);
      }
    });
  }, [colors, materials]);

  // Calculate surface normal based on position
  const calculateSurfaceNormal = (position: [number, number, number]): [number, number, number] => {
    const [x, y, z] = position;
    const radius = 2;
    const angle = Math.atan2(x, z);
    return [Math.sin(angle), 0, Math.cos(angle)];
  };

  // Calculate rotation matrix to align with surface
  const calculateRotation = (position: [number, number, number]): [number, number, number] => {
    const normal = calculateSurfaceNormal(position);
    const angle = Math.atan2(normal[0], normal[2]);
    return [0, -angle, numberTransform.rotation];
  };

  // Find the main jersey mesh from the nodes
  const jerseyMesh = Object.values(nodes).find((node: any) => 
    node.type === 'Mesh' && 
    (node.name === 'Body' || node.name.toLowerCase().includes('jersey'))
  ) as THREE.Mesh;

  console.log('Jersey mesh found:', jerseyMesh ? {
    name: jerseyMesh.name,
    geometry: jerseyMesh.geometry,
  } : 'No mesh found');

  return (
    <group dispose={null} scale={[1, 1, 1]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <primitive object={nodes.Scene} />
      
      {/* Number with debug box */}
      {jerseyMesh && numberTextureRef.current && (
        <>
          <mesh geometry={jerseyMesh.geometry}>
            <Decal
              debug
              position={numberTransform.position}
              rotation={[0, Math.PI + numberTransform.rotation * Math.PI / 180, 0]}
              scale={[numberTransform.scale, numberTransform.scale, 1]}
            >
              <meshBasicMaterial
                map={numberTextureRef.current}
                transparent
                opacity={1}
                depthTest={true}
                polygonOffset={true}
                polygonOffsetFactor={-4}
              />
            </Decal>
          </mesh>
          
          {/* Debug box for number */}
          <mesh
            position={numberTransform.position}
            rotation={[0, Math.PI + numberTransform.rotation * Math.PI / 180, 0]}
            scale={[numberTransform.scale * 2, numberTransform.scale * 2, 0.1]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#ff0000" wireframe opacity={1} transparent={false} />
          </mesh>
        </>
      )}
      
      {/* Name with debug box */}
      {jerseyMesh && nameTextureRef.current && name.content && (
        <>
          <mesh geometry={jerseyMesh.geometry}>
            <Decal
              debug
              position={name.transform.position}
              rotation={[0, (name.isBack ? 0 : Math.PI) + name.transform.rotation * Math.PI / 180, 0]}
              scale={[name.transform.scale, name.transform.scale * 0.3, 1]}
            >
              <meshBasicMaterial
                map={nameTextureRef.current}
                transparent
                opacity={1}
                depthTest={true}
                polygonOffset={true}
                polygonOffsetFactor={-4}
              />
            </Decal>
          </mesh>
          
          {/* Debug box for name */}
          <mesh
            position={name.transform.position}
            rotation={[0, (name.isBack ? 0 : Math.PI) + name.transform.rotation * Math.PI / 180, 0]}
            scale={[name.transform.scale * 2, name.transform.scale * 0.6, 0.1]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#0000ff" wireframe opacity={1} transparent={false} />
          </mesh>
        </>
      )}
      
    </group>
  );
}

const Jersey: React.FC<JerseyProps> = ({ colors, number, numberTransform, name }) => {
  const orbitControlsRef = useRef<any>(null);

  return (
    <div className={styles.jerseyContainer}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 2]} fov={25} />
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={5}
          target={[0, 0, 0]}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
          makeDefault
        />
        
        {/* Softer lighting setup for matte materials */}
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[2, 2, 2]} 
          intensity={0.5} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight 
          position={[-2, -2, -2]} 
          intensity={0.3}
        />
        <hemisphereLight
          args={[0xffffff, 0x444444, 0.4]}
        />
        
        {/* Main Jersey Group */}
        <group position={[0, 0, 0]}>
          <JerseyModel colors={colors} number={number} numberTransform={numberTransform} name={name} />
        </group>

        {/* Orbit Gizmo */}
        <GizmoHelper
          alignment="bottom-right"
          margin={[80, 80]}
          onUpdate={() => orbitControlsRef.current?.update()}
        >
          <GizmoViewport 
            axisColors={['#f73', '#0af', '#0f3']} 
            labelColor="black"
          />
        </GizmoHelper>
      </Canvas>
    </div>
  );
};

export default Jersey;

// Preload the model
useGLTF.preload('/models/Jersey.glb'); 