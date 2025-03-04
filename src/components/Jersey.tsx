import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Decal } from '@react-three/drei';
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

const Jersey: React.FC<JerseyProps> = ({ colors, number, transform }) => {
  const bodyRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    
    // Draw stroke first
    context.strokeStyle = colors.secondary;
    context.lineWidth = 8;
    context.strokeText(number || '00', 256, 256);
    
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
  }, [colors.numberColor, colors.secondary, number]);

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

  return (
    <JerseyContainer>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={5}
          maxDistance={12}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <spotLight position={[0, 5, 5]} intensity={0.5} angle={Math.PI / 4} />
        
        {/* Main Jersey Group */}
        <group position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
          {/* Main body cylinder */}
          <mesh ref={bodyRef} position={[0, 0, 0]}>
            <cylinderGeometry args={[1.8, 2.2, 4, 32]} />
            <meshPhongMaterial
              color={colors.main}
              shininess={30}
              specular={new THREE.Color(0x444444)}
            />
            {bodyRef.current && textureRef.current && (
              <Decal
                position={transform.position}
                rotation={calculateRotation(transform.position)}
                scale={[transform.scale, transform.scale, transform.scale]}
                map={textureRef.current}
              />
            )}
          </mesh>

          {/* Debug bounding box */}
          <DebugBox
            position={transform.position}
            rotation={calculateRotation(transform.position)}
            scale={[transform.scale, transform.scale, transform.scale]}
          />

          {/* Left Sleeve */}
          <mesh position={[-2.3, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.6, 0.7, 2, 32]} />
            <meshPhongMaterial
              color={colors.main}
              shininess={30}
              specular={new THREE.Color(0x444444)}
            />
          </mesh>

          {/* Right Sleeve */}
          <mesh position={[2.3, 0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.6, 0.7, 2, 32]} />
            <meshPhongMaterial
              color={colors.main}
              shininess={30}
              specular={new THREE.Color(0x444444)}
            />
          </mesh>

          {/* Collar */}
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 0.3, 32]} />
            <meshPhongMaterial
              color={colors.secondary}
              shininess={50}
              specular={new THREE.Color(0x666666)}
            />
          </mesh>

          {/* Secondary color trim */}
          <mesh position={[0, -2, 0]}>
            <cylinderGeometry args={[2.2, 2.2, 0.1, 32]} />
            <meshPhongMaterial
              color={colors.secondary}
              shininess={30}
            />
          </mesh>
        </group>
      </Canvas>
    </JerseyContainer>
  );
};

export default Jersey; 