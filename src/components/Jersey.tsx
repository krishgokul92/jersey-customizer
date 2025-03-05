import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Decal, useGLTF } from '@react-three/drei';
import { JerseyColors, NumberTransform } from '../types/jersey';
import * as THREE from 'three';

interface JerseyProps {
  colors: JerseyColors;
  number: string;
  transform: NumberTransform;
}

const JerseyContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border-radius: 12px;
`;

// Debug helper component to show bounding box
const DebugBox: React.FC<{ position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] }> = ({ position, rotation, scale }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <boxGeometry args={[1, 1, 0.1]} />
      <meshBasicMaterial color="red" wireframe={true} />
    </mesh>
  );
};

function JerseyModel({ colors, number, transform }: { colors: JerseyColors; number: string; transform: NumberTransform }) {
  const { nodes, materials } = useGLTF('/models/Jersey.glb') as any;
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Log materials and nodes for debugging
  useEffect(() => {
    console.log('Available materials:', Object.keys(materials));
    console.log('Available nodes:', nodes);
  }, [materials, nodes]);

  // Create canvas once
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    canvasRef.current = canvas;
    return () => {
      canvasRef.current = null;
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
    };
  }, []);

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

  // Update texture when number or colors change
  useEffect(() => {
    if (!canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    // Clear canvas with transparent background
    context.clearRect(0, 0, 512, 512);
    
    // Add stroke to number
    context.font = 'bold 280px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Comment out stroke functionality
    // context.strokeStyle = colors.numberStroke;
    // context.lineWidth = 8;
    // context.strokeText(number || '00', 256, 256);
    
    // Draw number
    context.fillStyle = colors.numberColor;
    context.fillText(number || '00', 256, 256);

    // Create or update texture
    if (!textureRef.current) {
      const texture = new THREE.CanvasTexture(canvasRef.current);
      texture.anisotropy = 16;
      texture.premultiplyAlpha = true;
      texture.format = THREE.RGBAFormat;
      textureRef.current = texture;
    }
    
    // Always update the texture
    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  }, [colors.numberColor, colors.numberStroke, number]);

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
    return [0, -angle, transform.rotation];
  };

  // Find the main jersey mesh from the nodes
  const jerseyMesh = Object.values(nodes).find((node: any) => 
    node.type === 'Mesh' && 
    (node.name === 'Body' || node.name.toLowerCase().includes('jersey'))
  ) as THREE.Mesh;

  return (
    <group dispose={null} scale={[1, 1, 1]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <primitive object={nodes.Scene} />
      {jerseyMesh && textureRef.current && (
        <mesh geometry={jerseyMesh.geometry}>
          <Decal
            position={transform.position}
            rotation={calculateRotation(transform.position)}
            scale={[transform.scale, transform.scale, transform.scale]}
            map={textureRef.current}
          />
        </mesh>
      )}
      {/* Debug bounding box */}
      <DebugBox
        position={transform.position}
        rotation={calculateRotation(transform.position)}
        scale={[transform.scale, transform.scale, transform.scale]}
      />
    </group>
  );
}

const Jersey: React.FC<JerseyProps> = ({ colors, number, transform }) => {
  return (
    <JerseyContainer>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 2]} fov={25} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={5}
          target={[0, 0, 0]}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
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
          <JerseyModel colors={colors} number={number} transform={transform} />
        </group>
      </Canvas>
    </JerseyContainer>
  );
};

export default Jersey;

// Preload the model
useGLTF.preload('/models/Jersey.glb'); 