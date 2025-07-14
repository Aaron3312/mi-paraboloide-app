"use client";
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Componentes UI simplificados y reactivos
const Button = ({ 
  onClick, 
  variant = "default", 
  size = "default", 
  className = "", 
  children 
}) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500",
    destructive: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
    outline: "border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ className = "", children }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }) => (
  <div className={`px-6 py-4 border-b ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-xl font-semibold ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ className = "", children }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const CardDescription = ({ className = "", children }) => (
  <p className={`text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

const Badge = ({ variant = "default", className = "", children }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-gray-300 bg-white text-gray-700"
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Componente para el panel de información
const InfoPanel = () => (
  <Card className="mb-6 border-l-4 border-blue-500">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <span>📐</span>
        Especificaciones del Proyecto
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="text-sm">
          <strong>Ecuación:</strong> z = 8 - (x²/64) - (y²/625)
        </Badge>
        <Badge variant="outline" className="text-sm">
          <strong>Dimensiones:</strong> 16m × 50m × 8m (ancho × largo × altura máxima)
        </Badge>
        <Badge variant="outline" className="text-sm">
          <strong>Tipo:</strong> Paraboloide Hiperbólico (silla de montar)
        </Badge>
      </div>
    </CardContent>
  </Card>
);

// Componente para los controles
const Controls = ({ 
  autoRotate, 
  onToggleRotate, 
  onReset 
}) => (
  <div className="flex justify-center gap-4 mb-6 flex-wrap">
    <Button 
      onClick={onToggleRotate}
      variant={autoRotate ? "destructive" : "default"}
      size="default"
      className="transform hover:scale-105"
    >
      {autoRotate ? '⏸️ Pausar' : '▶️ Rotar'}
    </Button>
    <Button 
      onClick={onReset}
      variant="outline"
      size="default"
      className="transform hover:scale-105"
    >
      🔄 Reset
    </Button>
  </div>
);

// Componente para los cálculos
const CalculationsPanel = ({ calculations }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
    <Card className="border-2 border-green-500 bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 text-lg flex items-center gap-2">
          <span>📏</span>
          Área Superficial
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-gray-800">{calculations.surfaceArea.toFixed(1)} m²</p>
      </CardContent>
    </Card>
    
    <Card className="border-2 border-green-500 bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 text-lg flex items-center gap-2">
          <span>🧱</span>
          Volumen de Concreto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-gray-800">{calculations.concreteVolume.toFixed(1)} m³</p>
        <CardDescription className="mt-1">Espesor asumido: 0.15m</CardDescription>
      </CardContent>
    </Card>
  </div>
);

// Hook personalizado para Three.js
const useThreeJS = (canvasRef) => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const roofMeshRef = useRef(null);
  const supportGroupRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Obtener el tamaño del contenedor
    const container = canvasRef.current.parentElement;
    const isDesktop = window.innerWidth >= 768;
    const containerWidth = isDesktop ? window.innerWidth * 0.95 : container.offsetWidth;
    const containerHeight = isDesktop ? window.innerHeight * 0.6 : Math.min(600, containerWidth * 0.75);

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
      opacity: 0.8,
      wireframe: true
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
      const container = canvasRef.current?.parentElement;
      if (!container) return;
      
      const isDesktop = window.innerWidth >= 768;
      const containerWidth = isDesktop ? window.innerWidth * 0.95 : container.offsetWidth;
      const containerHeight = isDesktop ? window.innerHeight * 0.6 : Math.min(600, containerWidth * 0.75);
      
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

    // Render inicial
    renderer.render(scene, camera);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return {
    scene: sceneRef.current,
    renderer: rendererRef.current,
    camera: cameraRef.current,
    roofMesh: roofMeshRef.current,
    supportGroup: supportGroupRef.current
  };
};

// Componente principal
const HyperbolicParaboloidViewer = () => {
  const canvasRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const animationRef = useRef(null);
  const [calculations, setCalculations] = useState({
    surfaceArea: 0,
    concreteVolume: 0,
    airVolume: 0,
    supportCount: 0
  });

  const { scene, renderer, camera, roofMesh, supportGroup } = useThreeJS(canvasRef);

  // Controles de mouse y touch mejorados
  useEffect(() => {
    if (!canvasRef.current || !camera || !renderer || !scene) return;

    let isInteracting = false;
    let lastX = 0;
    let lastY = 0;

    // Función para obtener coordenadas del evento (mouse o touch)
    const getEventCoordinates = (event) => {
      if (event.touches && event.touches.length > 0) {
        return {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      }
      return {
        x: event.clientX,
        y: event.clientY
      };
    };

    // Función para renderizar
    const renderScene = () => {
      renderer.render(scene, camera);
    };

    // Handlers para mouse/touch
    const handleInteractionStart = (event) => {
      isInteracting = true;
      const coords = getEventCoordinates(event);
      lastX = coords.x;
      lastY = coords.y;
      setAutoRotate(false); // Pausar rotación automática
      event.preventDefault();
    };

    const handleInteractionEnd = () => {
      isInteracting = false;
    };

    const handleInteractionMove = (event) => {
      if (!isInteracting) return;
      
      const coords = getEventCoordinates(event);
      const deltaX = coords.x - lastX;
      const deltaY = coords.y - lastY;
      
      // Convertir posición de cámara a coordenadas esféricas
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      
      // Aplicar rotación
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      
      // Limitar phi para evitar que la cámara se voltee
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      
      // Actualizar posición de la cámara
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 4, 0);
      
      // Renderizar inmediatamente
      renderScene();
      
      lastX = coords.x;
      lastY = coords.y;
      event.preventDefault();
    };

    // Event listeners
    canvasRef.current.addEventListener('mousedown', handleInteractionStart);
    canvasRef.current.addEventListener('touchstart', handleInteractionStart, { passive: false });
    
    document.addEventListener('mouseup', handleInteractionEnd);
    document.addEventListener('touchend', handleInteractionEnd);
    
    document.addEventListener('mousemove', handleInteractionMove);
    document.addEventListener('touchmove', handleInteractionMove, { passive: false });

    // Prevenir scroll en canvas
    const preventScroll = (e) => e.preventDefault();
    canvasRef.current.addEventListener('touchstart', preventScroll);
    canvasRef.current.addEventListener('touchmove', preventScroll);

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', handleInteractionStart);
        canvasRef.current.removeEventListener('touchstart', handleInteractionStart);
        canvasRef.current.removeEventListener('touchstart', preventScroll);
        canvasRef.current.removeEventListener('touchmove', preventScroll);
      }
      document.removeEventListener('mouseup', handleInteractionEnd);
      document.removeEventListener('touchend', handleInteractionEnd);
      document.removeEventListener('mousemove', handleInteractionMove);
      document.removeEventListener('touchmove', handleInteractionMove);
    };
  }, [camera, renderer, scene]);

  // Cálculos
  useEffect(() => {
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

    const calculateSupportCount = () => {
      let count = 0;
      for (let x = -8; x <= 8; x += 4) {
        for (let y = -24; y <= 24; y += 4) {
          const height = Math.max(0, 8 - (x*x/64) - (y*y/625));
          if (height > 0.5) {
            count++;
          }
        }
      }
      return count;
    };

    const surfaceArea = calculateSurfaceArea();
    const airVolume = calculateAirVolume();
    const concreteVolume = surfaceArea * 0.15;
    const supportCount = calculateSupportCount();

    setCalculations({
      surfaceArea,
      concreteVolume,
      airVolume,
      supportCount
    });
  }, []);

  // Animación de rotación automática
  useEffect(() => {
    if (!scene || !renderer || !camera) return;

    const animate = () => {
      if (autoRotate) {
        const time = Date.now() * 0.0005;
        const radius = 40;
        camera.position.x = Math.cos(time) * radius;
        camera.position.z = Math.sin(time) * radius;
        camera.lookAt(0, 4, 0);
        
        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (autoRotate) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scene, renderer, camera, autoRotate]);

  const handleToggleRotate = () => {
    setAutoRotate(!autoRotate);
  };

  const handleReset = () => {
    if (camera && renderer && scene) {
      camera.position.set(30, 20, 30);
      camera.lookAt(0, 4, 0);
      setAutoRotate(false);
      renderer.render(scene, camera);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 p-2 md:p-4">
      <div className="max-w-none md:max-w-7xl mx-auto">
        <Card className="shadow-2xl overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <span>⛪</span>
              Diseño del Techo de Paraboloide Hiperbólico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 p-2 md:p-6">
            <InfoPanel />
            
            <Controls 
              autoRotate={autoRotate}
              onToggleRotate={handleToggleRotate}
              onReset={handleReset}
            />

            <div className="text-center">
              <Card className="inline-block border-2 border-gray-300 shadow-lg w-full max-w-none">
                <CardContent className="p-0">
                  <canvas 
                    ref={canvasRef} 
                    className="rounded-lg w-full h-auto block mx-auto"
                    style={{ touchAction: 'none', maxWidth: '100%' }}
                  />
                </CardContent>
              </Card>
              <CardDescription className="mt-4 text-sm text-gray-600 font-medium">
                Arrastra con el mouse o toca y arrastra para rotar la vista. Los controles funcionan correctamente.
              </CardDescription>
            </div>

            <CalculationsPanel calculations={calculations} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HyperbolicParaboloidViewer;