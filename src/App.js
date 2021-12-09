import * as THREE from "three";
import { useControls } from "leva";

import React, {
  useCallback,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF, ContactShadows } from "@react-three/drei";
import { useSpring } from "@react-spring/core";
import { a as three } from "@react-spring/three";
import { a as web } from "@react-spring/web";
import { useDropzone } from "react-dropzone";
import { TextureLoader } from "three";

function MyDropzone({ onLoad, ...props }) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        onLoad(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}
function IPhone({ open, texture, ...props }) {
  const group = useRef();
  useEffect(() => {
    if (texture) {
      const newT = new TextureLoader().load(
        texture,
        undefined,
        (texture) => {
          console.log("success");
        },
        (error) => {
          console.log("error");
          console.log(error);
        }
      );
      newT.flipY = false;
      materials.Display.map = newT;
    }
  }, [texture]);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      open ? Math.cos(t / 2) / 8 + 0.25 : Math.cos(t) / 8 - 0.25,
      0.1
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      open? -0.5 + Math.sin(t / 4) / 4 : +0.5 + Math.sin(t / 4) / 4,
      0.1
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      true ? Math.sin(t) / 5 : props.position.y,
      0.1
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      open ? Math.PI : 0,
      0.1
    );
  });

  const { nodes, materials } = useGLTF("/PRO.gltf");
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI, 0.0, -Math.PI]} scale={0.04}>
        <mesh
          geometry={nodes.立方体001.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          geometry={nodes.立方体001_1.geometry}
          material={materials.Black}
        />
        <mesh geometry={nodes.立方体001_2.geometry} material={materials.Back} />
        <mesh geometry={nodes.立方体001_3.geometry} material={materials.GOLD} />
        <mesh
          geometry={nodes.立方体001_4.geometry}
          material={materials.BARRES}
        />
        <mesh
          geometry={nodes.立方体001_5.geometry}
          material={materials.Labber}
        />
        <mesh
          geometry={nodes.立方体001_7.geometry}
          material={materials.Lenscover}
        />
        <mesh
          geometry={nodes.立方体001_9.geometry}
          material={materials.Display}
        />
      </group>
    </group>
  );
}

export default function App() {
  const { title, background } = useControls({
    title: "Hello!",
    background: "#f0f0f0",
  });

  // This flag controls open state, alternates between true & false
  const [open, setOpen] = useState(false);
  const [texture, setTexture] = useState("");
  // We turn this into a spring animation that interpolates between 0 and 1
  const props = useSpring({ open: Number(open) });
  return (
    <web.main style={{ background: background }}>
      <h1>{title}</h1>
      <MyDropzone onLoad={(i) => { setTexture(i); }} />
      <Canvas camera={{ fov: 32, position: [13, 3, 6] }}>
        <three.pointLight
          position={[10, 10, 10]}
          intensity={1.5}
          color={props.open.to([0, 1], ["#f0f0f0", "#f0f0f0"])}
        />
        <Suspense fallback={null}>
          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -2.6, 0]}
            opacity={0.4}
            width={8}
            height={8}
            blur={2}
            far={7.5}
          />
          <IPhone
            onClick={() => setOpen(!open)}
            open={open}
            texture={texture}
            position={[0.0, -1.0, 0.0]}
          />
        </Suspense>
      </Canvas>
    </web.main>
  );
}
