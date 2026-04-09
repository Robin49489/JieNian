import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import {
  Group,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  type MeshStandardMaterial as MeshStandardMaterialType
} from "three";

type Block = {
  position: [number, number, number];
  scale: [number, number, number];
};

type TerrainBlocks = {
  dirt: Block[];
  grass: Block[];
  path: Block[];
  water: Block[];
};

function makeTerrainBlocks(): TerrainBlocks {
  const dirt: Block[] = [];
  const grass: Block[] = [];
  const path: Block[] = [];
  const water: Block[] = [];

  for (let x = -28; x <= 28; x += 1) {
    for (let z = -24; z <= 18; z += 1) {
      const lake =
        ((x - 15) * (x - 15)) / 64 + ((z - 3) * (z - 3)) / 30 <= 1 ||
        (x >= 8 && x <= 16 && z >= 0 && z <= 3) ||
        (x >= 6 && x <= 10 && z >= -1 && z <= 1);

      const northLift = z >= 12 ? (z - 12) * 0.08 : 0;
      const farWestLift = x <= -23 ? (-23 - x) * 0.06 : 0;
      const farEastLift = x >= 22 ? (x - 22) * 0.05 : 0;
      const plazaDip = x >= -8 && x <= 10 && z >= -11 && z <= 2 ? -0.72 : 0;
      const frontMeadow = z <= -11 ? -0.32 : 0;
      const riverBank = x >= 6 && x <= 18 && z >= -1 && z <= 9 ? -0.22 : 0;

      const height = Math.max(
        1,
        Math.round(
          1.9 +
            Math.sin(x * 0.12) * 0.42 +
            Math.cos(z * 0.14) * 0.38 +
            Math.sin((x + z) * 0.09) * 0.22 +
            northLift +
            farWestLift +
            farEastLift +
            plazaDip +
            frontMeadow +
            riverBank
        )
      );

      const mainRoad =
        Math.abs(z - Math.round(Math.sin((x + 10) * 0.14) * 1.25 - 8.2)) <= 1 && x <= 6;
      const bridgeRoad = x >= 6 && x <= 15 && Math.abs(z - 1) <= 1;
      const sideRoad = x <= -10 && x >= -18 && Math.abs(z - 2) <= 1;
      const isPath = mainRoad || bridgeRoad || sideRoad;

      if (lake) {
        water.push({ position: [x, 0.36, z], scale: [1, 0.72, 1] });
        continue;
      }

      dirt.push({ position: [x, height / 2 - 1, z], scale: [1, height, 1] });

      if (isPath) {
        path.push({ position: [x, height - 0.42, z], scale: [1, 0.16, 1] });
      } else {
        grass.push({ position: [x, height - 0.42, z], scale: [1, 0.16, 1] });
      }
    }
  }

  return { dirt, grass, path, water };
}

function InstancedBlocks({ blocks, color, roughness = 1, metalness = 0 }: { blocks: Block[]; color: string; roughness?: number; metalness?: number }) {
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const material = useMemo(() => new MeshStandardMaterial({ color, roughness, metalness }), [color, roughness, metalness]);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    blocks.forEach((block, index) => {
      dummy.position.set(...block.position);
      dummy.scale.set(...block.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [blocks, dummy]);

  return (
    <instancedMesh castShadow receiveShadow args={[undefined, undefined, blocks.length]} material={material} ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}

function AnimatedWaterBlocks({ blocks }: { blocks: Block[] }) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const materialRef = useRef<MeshStandardMaterialType>(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    blocks.forEach((block, index) => {
      dummy.position.set(...block.position);
      dummy.scale.set(...block.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [blocks, dummy]);

  useFrame((state) => {
    if (!groupRef.current || !materialRef.current) return;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.03;
    materialRef.current.color.setHSL(0.55, 0.9, 0.72 + Math.sin(state.clock.elapsedTime * 0.5) * 0.012);
  });

  return (
    <group ref={groupRef}>
      <instancedMesh castShadow receiveShadow args={[undefined, undefined, blocks.length]} ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#86D8FF" metalness={0.12} ref={materialRef} roughness={0.34} />
      </instancedMesh>
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 1.15, 0]}><boxGeometry args={[0.68, 2.3, 0.68]} /><meshStandardMaterial color="#B98A62" roughness={0.95} /></mesh>
      <mesh castShadow position={[0, 3, 0]}><boxGeometry args={[2.1, 1.5, 2.1]} /><meshStandardMaterial color="#6DBA5F" roughness={0.95} /></mesh>
      <mesh castShadow position={[0.56, 3.58, 0.16]}><boxGeometry args={[1.02, 1.02, 1.02]} /><meshStandardMaterial color="#5EA24D" roughness={0.95} /></mesh>
    </group>
  );
}

function PineTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 1.45, 0]}><boxGeometry args={[0.52, 2.9, 0.52]} /><meshStandardMaterial color="#B98A62" roughness={0.96} /></mesh>
      <mesh castShadow position={[0, 3.1, 0]}><boxGeometry args={[1.4, 1.05, 1.4]} /><meshStandardMaterial color="#74BB63" roughness={0.95} /></mesh>
      <mesh castShadow position={[0, 3.95, 0]}><boxGeometry args={[1.05, 0.95, 1.05]} /><meshStandardMaterial color="#63A852" roughness={0.95} /></mesh>
      <mesh castShadow position={[0, 4.7, 0]}><boxGeometry args={[0.7, 0.8, 0.7]} /><meshStandardMaterial color="#5A9E4A" roughness={0.95} /></mesh>
    </group>
  );
}

function MainHall() {
  return (
    <group position={[0.8, 2.8, -8.4]}>
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}><boxGeometry args={[6.8, 0.4, 5.8]} /><meshStandardMaterial color="#D7D4C8" roughness={0.95} /></mesh>
      <mesh castShadow position={[0, 1.5, -0.9]}><boxGeometry args={[3.5, 2.4, 1.3]} /><meshStandardMaterial color="#C99763" roughness={0.93} /></mesh>
      <mesh castShadow position={[0, 2.7, -0.9]}><boxGeometry args={[4.1, 0.34, 1.7]} /><meshStandardMaterial color="#8CCF6A" roughness={0.95} /></mesh>
      <mesh castShadow position={[-2.1, 1.4, 1.7]}><boxGeometry args={[0.62, 2.5, 0.62]} /><meshStandardMaterial color="#D7D4C8" roughness={0.92} /></mesh>
      <mesh castShadow position={[2.1, 1.4, 1.7]}><boxGeometry args={[0.62, 2.5, 0.62]} /><meshStandardMaterial color="#D7D4C8" roughness={0.92} /></mesh>
      <mesh castShadow position={[4.8, 1.35, -1.2]}><boxGeometry args={[1.05, 2.6, 1.05]} /><meshStandardMaterial color="#D7D4C8" roughness={0.9} /></mesh>
      <mesh castShadow position={[4.8, 2.92, -1.2]}><boxGeometry args={[1.6, 0.28, 1.6]} /><meshStandardMaterial color="#F2C14E" roughness={0.85} /></mesh>
    </group>
  );
}

function House({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}><boxGeometry args={[3.1, 0.4, 3.1]} /><meshStandardMaterial color="#D7D4C8" roughness={0.95} /></mesh>
      <mesh castShadow position={[0, 1.45, 0]}><boxGeometry args={[2.2, 2.05, 2.2]} /><meshStandardMaterial color="#C99763" roughness={0.93} /></mesh>
      <mesh castShadow position={[0, 2.62, 0]}><boxGeometry args={[2.8, 0.46, 2.8]} /><meshStandardMaterial color="#8CCF6A" roughness={0.95} /></mesh>
      <mesh castShadow position={[0.35, 1.02, 1.12]}><boxGeometry args={[0.46, 1.18, 0.14]} /><meshStandardMaterial color="#7A5236" roughness={0.94} /></mesh>
    </group>
  );
}

function WatchTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[[-0.54, 1.34, -0.54], [0.54, 1.34, -0.54], [-0.54, 1.34, 0.54], [0.54, 1.34, 0.54]].map((pillar, index) => (
        <mesh castShadow key={index} position={pillar as [number, number, number]}><boxGeometry args={[0.24, 2.68, 0.24]} /><meshStandardMaterial color="#B98A62" roughness={0.94} /></mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, 2.75, 0]}><boxGeometry args={[2, 0.28, 2]} /><meshStandardMaterial color="#D7D4C8" roughness={0.95} /></mesh>
      <mesh castShadow position={[0, 3.68, 0]}><boxGeometry args={[2.32, 0.26, 2.32]} /><meshStandardMaterial color="#8CCF6A" roughness={0.94} /></mesh>
    </group>
  );
}

function Windmill({ position }: { position: [number, number, number] }) {
  const bladesRef = useRef<Group>(null);
  useFrame((state) => { if (bladesRef.current) bladesRef.current.rotation.z = state.clock.elapsedTime * 0.28; });
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 1.55, 0]}><boxGeometry args={[1.4, 3.1, 1.4]} /><meshStandardMaterial color="#D7D4C8" roughness={0.94} /></mesh>
      <mesh castShadow position={[0, 3.4, 0]}><boxGeometry args={[2, 0.34, 2]} /><meshStandardMaterial color="#8CCF6A" roughness={0.95} /></mesh>
      <group position={[0, 2.1, 0.78]} ref={bladesRef}>
        {[0, Math.PI / 2].map((rotation, index) => (
          <mesh castShadow key={index} rotation={[0, 0, rotation]}><boxGeometry args={[1.9, 0.14, 0.16]} /><meshStandardMaterial color="#C99763" roughness={0.94} /></mesh>
        ))}
      </group>
    </group>
  );
}

function FarmPatch({ position, rows = 5 }: { position: [number, number, number]; rows?: number }) {
  return (
    <group position={position}>
      <mesh receiveShadow position={[0, 0, 0]}><boxGeometry args={[4, 0.16, 2.7]} /><meshStandardMaterial color="#7D5A3C" roughness={0.98} /></mesh>
      {Array.from({ length: rows }).map((_, index) => {
        const x = -1.44 + index * 0.7;
        return (
          <group key={`${position.join("-")}-${index}`} position={[x, 0.16, 0]}>
            <mesh castShadow position={[0, 0.22, -0.74]}><boxGeometry args={[0.16, 0.45, 0.16]} /><meshStandardMaterial color="#7AC96A" roughness={0.95} /></mesh>
            <mesh castShadow position={[0, 0.32, -0.14]}><boxGeometry args={[0.16, 0.66, 0.16]} /><meshStandardMaterial color="#8CCF6A" roughness={0.95} /></mesh>
            <mesh castShadow position={[0, 0.26, 0.46]}><boxGeometry args={[0.16, 0.54, 0.16]} /><meshStandardMaterial color="#73C561" roughness={0.95} /></mesh>
          </group>
        );
      })}
      <mesh receiveShadow position={[1.68, 0.06, 0]}><boxGeometry args={[0.28, 0.12, 2.7]} /><meshStandardMaterial color="#86D8FF" metalness={0.08} roughness={0.28} /></mesh>
    </group>
  );
}

function Bridge({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}><boxGeometry args={[4.8, 0.22, 1.55]} /><meshStandardMaterial color="#C99763" roughness={0.94} /></mesh>
      <mesh castShadow position={[0, 1.02, 0.58]}><boxGeometry args={[4.55, 0.1, 0.12]} /><meshStandardMaterial color="#D7D4C8" roughness={0.92} /></mesh>
      <mesh castShadow position={[0, 1.02, -0.58]}><boxGeometry args={[4.55, 0.1, 0.12]} /><meshStandardMaterial color="#D7D4C8" roughness={0.92} /></mesh>
    </group>
  );
}

function Portal({ position }: { position: [number, number, number] }) {
  const coreRef = useRef<MeshStandardMaterialType>(null);
  useFrame((state) => { if (coreRef.current) coreRef.current.emissive.setHSL(0.54, 0.85, 0.34 + Math.sin(state.clock.elapsedTime * 1.1) * 0.04); });
  return (
    <group position={position}>
      <mesh castShadow position={[-0.82, 1.3, 0]}><boxGeometry args={[0.3, 2.6, 0.3]} /><meshStandardMaterial color="#5D536C" roughness={0.88} /></mesh>
      <mesh castShadow position={[0.82, 1.3, 0]}><boxGeometry args={[0.3, 2.6, 0.3]} /><meshStandardMaterial color="#5D536C" roughness={0.88} /></mesh>
      <mesh castShadow position={[0, 2.48, 0]}><boxGeometry args={[1.94, 0.3, 0.3]} /><meshStandardMaterial color="#5D536C" roughness={0.88} /></mesh>
      <mesh position={[0, 1.3, 0]}><boxGeometry args={[1.42, 2.18, 0.12]} /><meshStandardMaterial color="#86D8FF" emissive="#4CC4FF" emissiveIntensity={0.5} metalness={0.12} ref={coreRef} roughness={0.28} /></mesh>
    </group>
  );
}

function Agents() {
  const refs = useRef<Array<Group | null>>([]);
  useFrame((state) => {
    refs.current.forEach((group, index) => {
      if (!group) return;
      const t = state.clock.elapsedTime * 0.32 + index * 1.1;
      group.position.x += Math.sin(t) * 0.0012;
      group.position.z += Math.cos(t * 0.86) * 0.001;
      group.rotation.y = Math.sin(t * 0.92) * 0.18;
      group.position.y = [2.45, 2.85, 3.1, 3.4][index] + Math.sin(t * 1.25) * 0.028;
    });
  });

  const configs = [
    { position: [-4.8, 2.45, -7.2] as const, color: "#F2C14E" },
    { position: [1.8, 2.85, -4.1] as const, color: "#8CCF6A" },
    { position: [10.6, 3.1, 2.2] as const, color: "#86D8FF" },
    { position: [-12.8, 3.4, 3.8] as const, color: "#8CCF6A" }
  ];

  return (
    <>
      {configs.map((config, index) => (
        <group key={`${config.position.join("-")}-${index}`} position={[...config.position]} ref={(node) => { refs.current[index] = node; }}>
          <mesh castShadow position={[0, 0.5, 0]}><boxGeometry args={[0.38, 0.64, 0.38]} /><meshStandardMaterial color={config.color} roughness={0.88} /></mesh>
          <mesh castShadow position={[0, 0.98, 0]}><boxGeometry args={[0.42, 0.32, 0.42]} /><meshStandardMaterial color="#F7E7D4" roughness={0.92} /></mesh>
        </group>
      ))}
    </>
  );
}

function FloatingCloud({ position, scale }: { position: [number, number, number]; scale: number }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x += Math.sin(state.clock.elapsedTime * 0.08 + position[0]) * 0.0014;
    ref.current.position.y += Math.sin(state.clock.elapsedTime * 0.06 + position[1]) * 0.0008;
  });
  return (
    <group position={position} ref={ref} scale={scale}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[3.1, 0.62, 1.3]} /><meshStandardMaterial color="#FFFFFF" roughness={1} /></mesh>
      <mesh position={[1.25, 0.2, 0.04]}><boxGeometry args={[1.45, 0.68, 1.06]} /><meshStandardMaterial color="#F8FCFF" roughness={1} /></mesh>
      <mesh position={[-1.28, 0.16, 0.08]}><boxGeometry args={[1.2, 0.56, 1]} /><meshStandardMaterial color="#F8FCFF" roughness={1} /></mesh>
    </group>
  );
}

function WorldRig({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const targetRotationY = -0.22 + state.pointer.x * 0.012;
    const targetRotationX = -0.09 + state.pointer.y * 0.008;
    const targetPositionY = -2.45 + Math.sin(state.clock.elapsedTime * 0.14) * 0.04;
    ref.current.rotation.y += (targetRotationY - ref.current.rotation.y) * 0.018;
    ref.current.rotation.x += (targetRotationX - ref.current.rotation.x) * 0.018;
    ref.current.position.y += (targetPositionY - ref.current.position.y) * 0.018;
  });
  return (
    <group position={[0, -2.45, 0]} ref={ref} rotation={[-0.09, -0.22, -0.012]}>
      {children}
    </group>
  );
}

function Scene() {
  const { dirt, grass, path, water } = useMemo(() => makeTerrainBlocks(), []);
  return (
    <>
      <color attach="background" args={["#DCEFFF"]} />
      <fog attach="fog" args={["#DCEFFF", 42, 90]} />
      <ambientLight intensity={1.22} />
      <hemisphereLight args={["#F9FDFF", "#81BD6B", 1.38]} />
      <directionalLight castShadow intensity={1.55} position={[20, 22, 12]} shadow-mapSize-height={2048} shadow-mapSize-width={2048} />
      <WorldRig>
        <InstancedBlocks blocks={dirt} color="#B98A62" />
        <InstancedBlocks blocks={grass} color="#8CCF6A" />
        <InstancedBlocks blocks={path} color="#D7D4C8" />
        <AnimatedWaterBlocks blocks={water} />
        <MainHall />
        <House position={[-8.6, 2.2, -9.1]} />
        <WatchTower position={[12.8, 2.55, -6.4]} />
        <FarmPatch position={[-10.4, 2.08, 1.8]} rows={5} />
        <Windmill position={[-10.8, 2.25, 6]} />
        <Bridge position={[12.8, 2.02, 2.2]} />
        <Portal position={[16.8, 2.85, 6.2]} />
        <Tree position={[-16.2, 2.9, -11.2]} scale={1.02} />
        <Tree position={[-10.8, 2.6, -12.6]} scale={0.94} />
        <Tree position={[0.4, 3, -11.8]} scale={0.98} />
        <Tree position={[16.2, 2.9, 1.2]} scale={0.88} />
        <PineTree position={[-22.4, 3.9, 10.2]} scale={0.94} />
        <PineTree position={[-7.4, 4.35, 13.8]} scale={0.9} />
        <PineTree position={[13.8, 4.4, 14.2]} scale={0.94} />
        <Agents />
      </WorldRig>
      <FloatingCloud position={[-17.5, 13.8, -20]} scale={1.42} />
      <FloatingCloud position={[-1.5, 15.1, -22]} scale={1.22} />
      <FloatingCloud position={[14.5, 13.6, -19]} scale={1.34} />
      <FloatingCloud position={[25, 15, -23]} scale={1.1} />
    </>
  );
}

export default function MinecraftHeroScene() {
  return (
    <Canvas camera={{ fov: 23, position: [24, 10.8, 46] }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} shadows>
      <Scene />
    </Canvas>
  );
}
