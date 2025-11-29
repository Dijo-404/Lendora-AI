/**
 * Lendora AI - 3D Agent Status Orb
 * Animated 3D visualization of agent status
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

interface AgentStatusOrbProps {
    status: 'profiting' | 'negotiating' | 'idle' | 'error';
}

const STATUS_CONFIG = {
    profiting: {
        color: '#00FF88',
        emissive: '#00FF88',
        emissiveIntensity: 0.3,
        text: 'PROFITING',
        scale: 1.2
    },
    negotiating: {
        color: '#3B82F6',
        emissive: '#3B82F6',
        emissiveIntensity: 0.4,
        text: 'NEGOTIATING',
        scale: 1.1
    },
    idle: {
        color: '#6B7280',
        emissive: '#6B7280',
        emissiveIntensity: 0.1,
        text: 'IDLE',
        scale: 1.0
    },
    error: {
        color: '#EF4444',
        emissive: '#EF4444',
        emissiveIntensity: 0.5,
        text: 'ERROR',
        scale: 0.9
    }
};

export function AgentStatusOrb({ status }: AgentStatusOrbProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);

    const config = STATUS_CONFIG[status];

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle rotation
            meshRef.current.rotation.y += 0.01;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

            // Pulsing scale
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            meshRef.current.scale.setScalar(config.scale * pulse);
        }

        if (materialRef.current) {
            // Dynamic emissive intensity
            const intensity = config.emissiveIntensity + Math.sin(state.clock.elapsedTime * 3) * 0.1;
            materialRef.current.emissiveIntensity = Math.max(0, intensity);
        }
    });

    return (
        <group>
            {/* Main orb */}
            <Sphere ref={meshRef} args={[1, 32, 32]}>
                <meshStandardMaterial
                    ref={materialRef}
                    color={config.color}
                    emissive={config.emissive}
                    emissiveIntensity={config.emissiveIntensity}
                    roughness={0.1}
                    metalness={0.8}
                    transparent
                    opacity={0.8}
                />
            </Sphere>

            {/* Outer glow ring */}
            <Sphere args={[1.3, 16, 16]}>
                <meshBasicMaterial
                    color={config.color}
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </Sphere>

            {/* Status text */}
            <Text
                position={[0, -1.8, 0]}
                fontSize={0.2}
                color={config.color}
                anchorX="center"
                anchorY="middle"
                font="/fonts/inter-bold.woff"
            >
                {config.text}
            </Text>

            {/* Particle effects */}
            {Array.from({ length: 8 }).map((_, i) => (
                <mesh
                    key={i}
                    position={[
                        Math.cos((i / 8) * Math.PI * 2) * 2,
                        Math.sin((i / 8) * Math.PI * 2) * 2,
                        0
                    ]}
                >
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial
                        color={config.color}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            ))}
        </group>
    );
}
