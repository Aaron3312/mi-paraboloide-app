"use client";
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Componente para el panel de información
const InfoPanel = () => (
  <div className="bg-gray-100 rounded-lg p-4 mb-5 border-l-4 border-blue-500">
    <h3 className="text-lg font-semibold mb-2 text-gray-800">📐 Especificaciones del Proyecto</h3>
    <p className="mb-1 text-gray-700"><strong>Ecuación:</strong> z = 8 - (x²/64) - (y²/625)</p>
    <p className="mb-1 text-gray-700"><strong>Dimensiones:</strong> 16m × 50m × 8m (ancho × largo × altura máxima)</p>
    <p className="text-gray-700"><strong>Tipo:</strong> Paraboloide Hiperbólico (silla de montar)</p>
  </div>
);

// Componente para los controles
const Controls = ({ 
  autoRotate, 
  showWireframe, 
  showSupports, 
  onToggleRotate, 
  onToggleWireframe, 
  onToggleSupports, 
  onReset 
}) => (
  <div className="flex justify-center gap-2 sm:gap-5 mb-5 flex-wrap">
    <div className="flex flex-col items-center gap-1">
      <button 
        onClick={onToggleRotate}
        className={`px-3 sm:px-5 py-2 rounded border-none text-white cursor-pointer text-xs sm:text-sm transition-all duration-300 hover:transform hover:-translate-y-0.5 ${
          autoRotate ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        🔄 Rotar
      </button>
      <button 
        onClick={onToggleWireframe}
        className={`px-3 sm:px-5 py-2 rounded border-none text-white cursor-pointer text-xs sm:text-sm transition-all duration-300 hover:transform hover:-translate-y-0.5 ${
          showWireframe ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        📐 Wireframe
      </button>
    </div>
    <div className="flex flex-col items-center gap-1">
      <button 
        onClick={onToggleSupports}
        className={`px-3 sm:px-5 py-2 rounded border-none text-white cursor-pointer text-xs sm:text-sm transition-all duration-300 hover:transform hover:-translate-y-0.5 ${
          showSupports ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        🏗️ Soportes
      </button>
      <button 
        onClick={onReset}
        className="px-3 sm:px-5 py-2 rounded border-none bg-green-500 hover:bg-green-600 text-white cursor-pointer text-xs sm:text-sm transition-all duration-300 hover:transform hover:-translate-y-0.5"
      >
        🔄 Reset
      </button>
    </div>
  </div>
);

// Componente para los cálculos
const CalculationsPanel = ({ calculations }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
    <div className="bg-green-50 p-4 rounded-lg border border-green-500">
      <h3 className="mt-0 text-green-800 font-semibold">📏 Área Superficial</h3>
      <p className="text-gray-800 font-medium">{calculations.surfaceArea.toFixed(1)} m²</p>
    </div>
    <div className="bg-green-50 p-4 rounded-lg border border-green-500">
      <h3 className="mt-0 text-green-800 font-semibold">🧱 Volumen de Concreto</h3>
      <p className="text-gray-800 font-medium">{calculations.concreteVolume.toFixed(1)} m³</p>
      <small className="text-gray-700">Espesor asumido: 0.15m</small>
    </div>
    <div className="bg-green-50 p-4 rounded-lg border border-green-500">
      <h3 className="mt-0 text-green-800 font-semibold">🌬️ Volumen de Aire</h3>
      <p className="text-gray-800 font-medium">{calculations.airVolume.toFixed(1)} m³</p>
    </div>
    <div className="bg-green-50 p-4 rounded-lg border border-green-500">
      <h3 className="mt-0 text-green-800 font-semibold">🏗️ Soportes Necesarios</h3>
      <p className="text-gray-800 font-medium">{calculations.supportCount} soportes necesarios</p>
    </div>
  </div>
);

// Hook personalizado para Three.js
const useThreeJS = (canvasRef) => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const roofMeshRef = useRef(null);
  const supportGroupRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Obtener el tamaño del contenedor
    const container = canvasRef.current.parentElement;
    const containerWidth = container.offsetWidth;
    const containerHeight = Math.min(600, containerWidth * 0.75); // Aspect ratio 4:3 máximo 600px

    // Configuración inicial
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerWidth/containerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    });
    
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0x87CEEB);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Crear el paraboloide hiperbólico manualmente
    const createParaboloidGeometry = (widthSegments = 50, heightSegments = 100) => {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const indices = [];
      const uvs = [];
      
      for (let i = 0; i <= heightSegments; i++) {
        for (let j = 0; j <= widthSegments; j++) {
          const u = j / widthSegments;
          const v = i / heightSegments;
          
          const x = (u - 0.5) * 16;
          const y = (v - 0.5) * 50;
          const z = Math.max(0, 8 - (x*x/64) - (y*y/625));
          
          vertices.push(x, z, y);
          uvs.push(u, v);
        }
      }
      
      for (let i = 0; i < heightSegments; i++) {
        for (let j = 0; j < widthSegments; j++) {
          const a = i * (widthSegments + 1) + j;
          const b = a + widthSegments + 1;
          const c = a + 1;
          const d = b + 1;
          
          indices.push(a, b, c);
          indices.push(b, d, c);
        }
      }
      
      geometry.setIndex(indices);
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geometry.computeVertexNormals();
      
      return geometry;
    };

    const geometry = createParaboloidGeometry(50, 100);

    const material = new THREE.MeshLambertMaterial({ 
      color: 0x8B4513,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });

    const roofMesh = new THREE.Mesh(geometry, material);
    roofMesh.receiveShadow = true;
    roofMesh.castShadow = true;
    scene.add(roofMesh);

    // Crear soportes
    const supportGroup = new THREE.Group();
    for (let x = -8; x <= 8; x += 4) {
      for (let y = -24; y <= 24; y += 4) {
        const height = Math.max(0, 8 - (x*x/64) - (y*y/625));
        if (height > 0.5) {
          const supportGeometry = new THREE.CylinderGeometry(0.2, 0.2, height, 8);
          const supportMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
          const support = new THREE.Mesh(supportGeometry, supportMaterial);
          support.position.set(x, height/2, y);
          support.castShadow = true;
          supportGroup.add(support);
        }
      }
    }
    scene.add(supportGroup);
    supportGroup.visible = false;

    // Crear el suelo
    const groundGeometry = new THREE.PlaneGeometry(60, 80);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Posición inicial de la cámara
    camera.position.set(30, 20, 30);
    camera.lookAt(0, 4, 0);

    // Función para manejar el resize
    const handleResize = () => {
      const container = canvasRef.current.parentElement;
      const containerWidth = container.offsetWidth;
      const containerHeight = Math.min(600, containerWidth * 0.75);
      
      camera.aspect = containerWidth / containerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerWidth, containerHeight);
    };

    // Agregar listener para resize
    window.addEventListener('resize', handleResize);

    // Guardar referencias
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    roofMeshRef.current = roofMesh;
    supportGroupRef.current = supportGroup;

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      renderer.dispose();
    };
  }, []);

  return {
    scene: sceneRef.current,
    renderer: rendererRef.current,
    camera: cameraRef.current,
    roofMesh: roofMeshRef.current,
    supportGroup: supportGroupRef.current,
    animationRef
  };
};

// Componente principal
const HyperbolicParaboloidViewer = () => {
  const canvasRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);
  const [showSupports, setShowSupports] = useState(false);
  const [calculations, setCalculations] = useState({
    surfaceArea: 0,
    concreteVolume: 0,
    airVolume: 0,
    supportCount: 0
  });

  const { scene, renderer, camera, roofMesh, supportGroup, animationRef } = useThreeJS(canvasRef);

  // Controles de mouse
  useEffect(() => {
    if (!canvasRef.current || !camera) return;

    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseDown = (event) => {
      mouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
      setAutoRotate(false);
    };

    const handleMouseUp = () => {
      mouseDown = false;
    };

    const handleMouseMove = (event) => {
      if (!mouseDown) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 4, 0);
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    canvasRef.current.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera]);

  // Cálculos
  useEffect(() => {
    if (!supportGroup) return;

    const calculateSurfaceArea = () => {
      let area = 0;
      const dx = 0.5;
      const dy = 0.5;
      
      for (let x = -8; x <= 8; x += dx) {
        for (let y = -25; y <= 25; y += dy) {
          const z = Math.max(0, 8 - (x*x/64) - (y*y/625));
          if (z > 0) {
            const dzdx = -x/32;
            const dzdy = -2*y/625;
            const dA = Math.sqrt(1 + dzdx*dzdx + dzdy*dzdy) * dx * dy;
            area += dA;
          }
        }
      }
      return area;
    };

    const calculateAirVolume = () => {
      let volume = 0;
      const dx = 0.5;
      const dy = 0.5;
      
      for (let x = -8; x <= 8; x += dx) {
        for (let y = -25; y <= 25; y += dy) {
          const z = Math.max(0, 8 - (x*x/64) - (y*y/625));
          volume += z * dx * dy;
        }
      }
      return volume;
    };

    const surfaceArea = calculateSurfaceArea();
    const airVolume = calculateAirVolume();
    const concreteVolume = surfaceArea * 0.15;
    const supportCount = supportGroup.children.length;

    setCalculations({
      surfaceArea,
      concreteVolume,
      airVolume,
      supportCount
    });
  }, [supportGroup]);

  // Animación
  useEffect(() => {
    if (!scene || !renderer || !camera) return;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (autoRotate) {
        const time = Date.now() * 0.0005;
        camera.position.x = Math.cos(time) * 40;
        camera.position.z = Math.sin(time) * 40;
        camera.lookAt(0, 4, 0);
      }
      
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scene, renderer, camera, autoRotate]);

  // Efectos de los controles
  useEffect(() => {
    if (roofMesh) {
      roofMesh.material.wireframe = showWireframe;
    }
  }, [showWireframe, roofMesh]);

  useEffect(() => {
    if (supportGroup) {
      supportGroup.visible = showSupports;
    }
  }, [showSupports, supportGroup]);

  const handleToggleRotate = () => {
    setAutoRotate(!autoRotate);
  };

  const handleToggleWireframe = () => {
    setShowWireframe(!showWireframe);
  };

  const handleToggleSupports = () => {
    setShowSupports(!showSupports);
  };

  const handleReset = () => {
    if (camera) {
      camera.position.set(30, 20, 30);
      camera.lookAt(0, 4, 0);
      setAutoRotate(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 p-2 sm:p-5">
      <div className="max-w-6xl mx-auto bg-white rounded-lg p-3 sm:p-5 shadow-2xl">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-4 sm:mb-8 text-gray-800 drop-shadow-sm">
          ⛪ Diseño del Techo de Paraboloide Hiperbólico
        </h1>
        
        <InfoPanel />
        
        <Controls 
          autoRotate={autoRotate}
          showWireframe={showWireframe}
          showSupports={showSupports}
          onToggleRotate={handleToggleRotate}
          onToggleWireframe={handleToggleWireframe}
          onToggleSupports={handleToggleSupports}
          onReset={handleReset}
        />

        <div className="text-center">
          <div className="w-full max-w-4xl mx-auto">
            <canvas 
              ref={canvasRef} 
              className="border-2 border-gray-300 rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          <div className="text-sm text-gray-800 mt-2 font-medium">
            Use el mouse para rotar la vista. Haga clic en los botones para cambiar la visualización.
          </div>
        </div>

        <CalculationsPanel calculations={calculations} />
      </div>
    </div>
  );
};

export default HyperbolicParaboloidViewer;