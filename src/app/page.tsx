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

// Componente para el panel de información actualizado
const InfoPanel = () => (
  <Card className="mb-6 border-l-4 border-purple-500">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <span>⛪</span>
        Especificaciones del Proyecto - Equipo 6
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="text-sm">
          <strong>Ecuación:</strong> z = 8 - 0.078125·x² + 0.0064·y²
        </Badge>
        <Badge variant="outline" className="text-sm">
          <strong>Dominio:</strong> -8 ≤ x ≤ 8, -25 ≤ y ≤ 25
        </Badge>
        <Badge variant="outline" className="text-sm">
          <strong>Altura Central:</strong> 8m | <strong>Bordes ancho:</strong> 3m | <strong>Bordes largo:</strong> 12m
        </Badge>
        <Badge variant="outline" className="text-sm">
          <strong>Tipo:</strong> Paraboloide Hiperbólico (superficie de silla)
        </Badge>
        <Badge variant="outline" className="text-sm">
          <strong>Orientación:</strong> Cóncava en X (drenaje), Convexa en Y (elevación al altar)
        </Badge>
      </div>
    </CardContent>
  </Card>
);

// Componente para mostrar las alturas de verificación
const VerificationPanel = () => (
  <Card className="mb-6 border-l-4 border-green-500">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-green-700">
        <span>✓</span>
        Verificación de Alturas
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="text-center">
          <div className="font-semibold">Centro (0,0)</div>
          <div className="text-green-600 font-bold">8.0 m</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">Bordes ancho (±8,0)</div>
          <div className="text-blue-600 font-bold">3.0 m</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">Bordes largo (0,±25)</div>
          <div className="text-purple-600 font-bold">12.0 m</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">Esquinas (±8,±25)</div>
          <div className="text-orange-600 font-bold">7.0 m</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Componente para los controles
const Controls = ({ 
  autoRotate, 
  onToggleRotate, 
  onReset,
  showSupports,
  onToggleSupports,
  showWireframe,
  onToggleWireframe,
  showChurch,
  onToggleChurch
}) => (
  <div className="flex justify-center gap-3 mb-6 flex-wrap">
    <Button 
      onClick={onToggleRotate}
      variant={autoRotate ? "destructive" : "default"}
      className="transform hover:scale-105"
    >
      {autoRotate ? '⏸️ Pausar' : '▶️ Rotar'}
    </Button>
    <Button 
      onClick={onToggleSupports}
      variant={showSupports ? "default" : "outline"}
      className="transform hover:scale-105"
    >
      {showSupports ? '🏗️ Ocultar Polines' : '🏗️ Mostrar Polines'}
    </Button>
    <Button 
      onClick={onToggleWireframe}
      variant={showWireframe ? "default" : "outline"}
      className="transform hover:scale-105"
    >
      {showWireframe ? '🎨 Sólido' : '📐 Wireframe'}
    </Button>
    <Button 
      onClick={onToggleChurch}
      variant={showChurch ? "default" : "outline"}
      className="transform hover:scale-105"
    >
      {showChurch ? '⛪ Ocultar Iglesia' : '⛪ Mostrar Iglesia'}
    </Button>
    <Button 
      onClick={onReset}
      variant="outline"
      className="transform hover:scale-105"
    >
      🔄 Reset
    </Button>
  </div>
);

// Componente para los cálculos actualizados
const CalculationsPanel = ({ calculations }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
    <Card className="border-2 border-green-500 bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 text-lg flex items-center gap-2">
          <span>📏</span>
          Área Superficial
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-gray-800">{calculations.surfaceArea.toFixed(1)} m²</p>
        <CardDescription className="mt-1">Superficie del techo</CardDescription>
      </CardContent>
    </Card>
    
    <Card className="border-2 border-blue-500 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-blue-800 text-lg flex items-center gap-2">
          <span>🧱</span>
          Volumen de Concreto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-gray-800">{calculations.concreteVolume.toFixed(1)} m³</p>
        <CardDescription className="mt-1">Espesor: 0.15m</CardDescription>
      </CardContent>
    </Card>

    <Card className="border-2 border-purple-500 bg-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-purple-800 text-lg flex items-center gap-2">
          <span>🏗️</span>
          Soportes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-gray-800">{calculations.supportCount}</p>
        <CardDescription className="mt-1">Polines de cimbra (20x30cm)</CardDescription>
      </CardContent>
    </Card>
  </div>
);

// Hook personalizado para Three.js actualizado
const useThreeJS = (canvasRef) => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const roofMeshRef = useRef(null);
  const supportGroupRef = useRef(null);
  const churchGroupRef = useRef(null);

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

    // Iluminación mejorada
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 30);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -40;
    directionalLight.shadow.camera.right = 40;
    directionalLight.shadow.camera.top = 40;
    directionalLight.shadow.camera.bottom = -40;
    scene.add(directionalLight);

    // Luz adicional para el altar
    const altarLight = new THREE.PointLight(0xffd700, 0.5, 100);
    altarLight.position.set(0, 15, 25);
    scene.add(altarLight);

    // Función de la ecuación corregida: z = 8 - 0.078125·x² + 0.0064·y²
    const heightFunction = (x, y) => {
      return Math.max(0, 8 - 0.078125 * x * x + 0.0064 * y * y);
    };

    // Crear el paraboloide hiperbólico con la ecuación correcta
    const createParaboloidGeometry = (widthSegments = 60, heightSegments = 120) => {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const indices = [];
      const uvs = [];
      const normals = [];
      
      for (let i = 0; i <= heightSegments; i++) {
        for (let j = 0; j <= widthSegments; j++) {
          const u = j / widthSegments;
          const v = i / heightSegments;
          
          // Dominio: -8 ≤ x ≤ 8, -25 ≤ y ≤ 25
          const x = (u - 0.5) * 16; // de -8 a 8
          const y = (v - 0.5) * 50; // de -25 a 25
          const z = heightFunction(x, y);
          
          vertices.push(x, z, y);
          uvs.push(u, v);

          // Calcular normales usando las derivadas parciales
          const dzdx = -0.078125 * 2 * x;
          const dzdy = 0.0064 * 2 * y;
          const normal = new THREE.Vector3(-dzdx, 1, -dzdy).normalize();
          normals.push(normal.x, normal.y, normal.z);
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
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      
      return geometry;
    };

    const geometry = createParaboloidGeometry(60, 120);

    // Material mejorado para la capilla
    const material = new THREE.MeshLambertMaterial({ 
      color: 0xD2691E, // Color tierra/adobe para capilla
      side: THREE.DoubleSide,
      transparent: false,
      wireframe: false
    });

    const roofMesh = new THREE.Mesh(geometry, material);
    roofMesh.receiveShadow = true;
    roofMesh.castShadow = true;
    scene.add(roofMesh);

    // Crear soportes estructurales (polines) según los cálculos
    const supportGroup = new THREE.Group();
    const supportPositions = [];
    
    // Generar polines en una cuadrícula de 9x11 (2m x 5m de separación)
    // Dirección X: -8 a 8, cada 2m (9 polines)
    // Dirección Y: -25 a 25, cada 5m (11 polines)
    for (let x = -8; x <= 8; x += 2) {
      for (let y = -25; y <= 25; y += 5) {
        const height = heightFunction(x, y);
        // Crear polín rectangular (20cm x 30cm según cálculos)
        const supportGeometry = new THREE.BoxGeometry(0.2, height, 0.3);
        const supportMaterial = new THREE.MeshLambertMaterial({ 
          color: 0x8B4513, // Color madera
          transparent: false
        });
        const support = new THREE.Mesh(supportGeometry, supportMaterial);
        support.position.set(x, height/2, y);
        support.castShadow = true;
        supportGroup.add(support);
        supportPositions.push({x, y, height});
      }
    }
    scene.add(supportGroup);
    supportGroup.visible = false;

    // Crear elementos de la iglesia construida
    const churchGroup = new THREE.Group();
    
    // Crear muros laterales de la iglesia
    const createWalls = () => {
      const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xDEB887 }); // Beige claro
      
      // Muro lateral izquierdo
      const leftWallGeometry = new THREE.BoxGeometry(0.3, 4, 50);
      const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
      leftWall.position.set(-8.5, 2, 0);
      leftWall.castShadow = true;
      churchGroup.add(leftWall);
      
      // Muro lateral derecho
      const rightWallGeometry = new THREE.BoxGeometry(0.3, 4, 50);
      const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
      rightWall.position.set(8.5, 2, 0);
      rightWall.castShadow = true;
      churchGroup.add(rightWall);
      
      // Muro frontal (entrada)
      const frontWallGeometry = new THREE.BoxGeometry(17, 4, 0.3);
      const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
      frontWall.position.set(0, 2, -25.5);
      frontWall.castShadow = true;
      churchGroup.add(frontWall);
      
      // Arco de entrada
      const archGeometry = new THREE.BoxGeometry(3, 5, 0.5);
      const archMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const arch = new THREE.Mesh(archGeometry, archMaterial);
      arch.position.set(0, 2.5, -25.2);
      churchGroup.add(arch);
    };
    
    // Crear altar y cruz
    const createAltar = () => {
      // Base del altar
      const altarGeometry = new THREE.BoxGeometry(6, 1, 3);
      const altarMaterial = new THREE.MeshLambertMaterial({ color: 0xF5DEB3 });
      const altar = new THREE.Mesh(altarGeometry, altarMaterial);
      altar.position.set(0, 0.5, 22);
      altar.castShadow = true;
      churchGroup.add(altar);
      
      // Mesa del altar
      const tableGeometry = new THREE.BoxGeometry(4, 0.2, 2);
      const tableMaterial = new THREE.MeshLambertMaterial({ color: 0xD2691E });
      const table = new THREE.Mesh(tableGeometry, tableMaterial);
      table.position.set(0, 1.1, 22);
      table.castShadow = true;
      churchGroup.add(table);
      
      // Cruz vertical
      const crossVerticalGeometry = new THREE.BoxGeometry(0.3, 4, 0.3);
      const crossMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const crossVertical = new THREE.Mesh(crossVerticalGeometry, crossMaterial);
      crossVertical.position.set(0, 3, 24);
      crossVertical.castShadow = true;
      churchGroup.add(crossVertical);
      
      // Cruz horizontal
      const crossHorizontalGeometry = new THREE.BoxGeometry(2, 0.3, 0.3);
      const crossHorizontal = new THREE.Mesh(crossHorizontalGeometry, crossMaterial);
      crossHorizontal.position.set(0, 3.5, 24);
      crossHorizontal.castShadow = true;
      churchGroup.add(crossHorizontal);
    };
    
    // Crear bancas
    const createBenches = () => {
      const benchMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      
      for (let row = 0; row < 8; row++) {
        for (let side = -1; side <= 1; side += 2) {
          // Asiento de la banca
          const seatGeometry = new THREE.BoxGeometry(1.5, 0.1, 6);
          const seat = new THREE.Mesh(seatGeometry, benchMaterial);
          seat.position.set(side * 3, 0.45, -18 + row * 4);
          seat.castShadow = true;
          churchGroup.add(seat);
          
          // Respaldo de la banca
          const backGeometry = new THREE.BoxGeometry(1.5, 1, 0.1);
          const back = new THREE.Mesh(backGeometry, benchMaterial);
          back.position.set(side * 3, 0.95, -18 + row * 4 + 2.95);
          back.castShadow = true;
          churchGroup.add(back);
          
          // Patas de la banca
          for (let i = 0; i < 4; i++) {
            const legGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.1);
            const leg = new THREE.Mesh(legGeometry, benchMaterial);
            const xOffset = i < 2 ? -0.7 : 0.7;
            const zOffset = i % 2 === 0 ? -2.9 : 2.9;
            leg.position.set(side * 3 + xOffset, 0.2, -18 + row * 4 + zOffset);
            leg.castShadow = true;
            churchGroup.add(leg);
          }
        }
      }
    };
    
    // Crear figura del sacerdote
    const createPriest = () => {
      const priestGroup = new THREE.Group();
      
      // Cuerpo
      const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.5, 1.5, 8);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 }); // Negro
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.set(0, 0.75, 20);
      body.castShadow = true;
      priestGroup.add(body);
      
      // Cabeza
      const headGeometry = new THREE.SphereGeometry(0.25, 8, 8);
      const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBCA }); // Piel
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.set(0, 1.75, 20);
      head.castShadow = true;
      priestGroup.add(head);
      
      // Brazos
      const armGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 6);
      const armMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-0.6, 1.2, 20);
      leftArm.rotation.z = Math.PI / 6;
      leftArm.castShadow = true;
      priestGroup.add(leftArm);
      
      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(0.6, 1.2, 20);
      rightArm.rotation.z = -Math.PI / 6;
      rightArm.castShadow = true;
      priestGroup.add(rightArm);
      
      churchGroup.add(priestGroup);
    };
    
    // Crear todos los elementos de la iglesia
    createWalls();
    createAltar();
    createBenches();
    createPriest();
    
    scene.add(churchGroup);
    churchGroup.visible = false;

    // Crear marcadores para puntos de verificación
    const createMarker = (x, y, z, color, label) => {
      const markerGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const markerMaterial = new THREE.MeshBasicMaterial({ color });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, z + 0.5, y);
      scene.add(marker);
      
      // Agregar línea vertical de referencia
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0, y),
        new THREE.Vector3(x, z, y)
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({ color, opacity: 0.7, transparent: true });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    };

    // Agregar marcadores de verificación
    createMarker(0, 0, 8, 0x00ff00, 'Centro'); // Verde
    createMarker(8, 0, 3, 0x0000ff, 'Borde ancho'); // Azul
    createMarker(-8, 0, 3, 0x0000ff, 'Borde ancho'); // Azul
    createMarker(0, 25, 12, 0xff00ff, 'Borde largo'); // Magenta
    createMarker(0, -25, 12, 0xff00ff, 'Borde largo'); // Magenta
    createMarker(8, 25, 7, 0xff8800, 'Esquina'); // Naranja
    createMarker(-8, 25, 7, 0xff8800, 'Esquina'); // Naranja
    createMarker(8, -25, 7, 0xff8800, 'Esquina'); // Naranja
    createMarker(-8, -25, 7, 0xff8800, 'Esquina'); // Naranja

    // Crear el suelo con las dimensiones exactas
    const groundGeometry = new THREE.PlaneGeometry(20, 55);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Agregar líneas de cuadrícula para referencia
    const gridHelper = new THREE.GridHelper(60, 24, 0x888888, 0xcccccc);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // Posición inicial de la cámara optimizada
    camera.position.set(35, 25, 35);
    camera.lookAt(0, 6, 0);

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
    churchGroupRef.current = churchGroup;

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
    supportGroup: supportGroupRef.current,
    churchGroup: churchGroupRef.current
  };
};

// Componente principal actualizado
const HyperbolicParaboloidViewer = () => {
  const canvasRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showSupports, setShowSupports] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  const [showChurch, setShowChurch] = useState(false);
  const animationRef = useRef(null);
  const [calculations, setCalculations] = useState({
    surfaceArea: 0,
    concreteVolume: 0,
    supportCount: 0
  });

  const { scene, renderer, camera, roofMesh, supportGroup, churchGroup } = useThreeJS(canvasRef);

  // Controles de mouse y touch mejorados
  useEffect(() => {
    if (!canvasRef.current || !camera || !renderer || !scene) return;

    let isInteracting = false;
    let lastX = 0;
    let lastY = 0;
    let isPinching = false;
    let lastPinchDistance = 0;

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

    // Función para calcular distancia entre dos puntos touch
    const getPinchDistance = (event) => {
      if (event.touches && event.touches.length >= 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
      }
      return 0;
    };

    // Función para renderizar
    const renderScene = () => {
      renderer.render(scene, camera);
    };

    // Handlers para mouse/touch
    const handleInteractionStart = (event) => {
      if (event.touches && event.touches.length === 2) {
        // Comenzar pinch zoom
        isPinching = true;
        lastPinchDistance = getPinchDistance(event);
      } else {
        // Interacción normal de rotación
        isInteracting = true;
        const coords = getEventCoordinates(event);
        lastX = coords.x;
        lastY = coords.y;
      }
      setAutoRotate(false); // Pausar rotación automática
      event.preventDefault();
    };

    const handleInteractionEnd = () => {
      isInteracting = false;
      isPinching = false;
      lastPinchDistance = 0;
    };

    const handleInteractionMove = (event) => {
      if (event.touches && event.touches.length === 2 && isPinching) {
        // Manejar pinch zoom
        const currentDistance = getPinchDistance(event);
        if (lastPinchDistance > 0) {
          const scale = currentDistance / lastPinchDistance;
          const zoomFactor = (scale - 1) * 2; // Ajustar sensibilidad
          
          const currentCameraDistance = camera.position.distanceTo(new THREE.Vector3(0, 6, 0));
          
          // Limitar el zoom
          const minDistance = 10;
          const maxDistance = 100;
          
          // Calcular nueva posición de cámara
          const spherical = new THREE.Spherical();
          spherical.setFromVector3(camera.position.clone().sub(new THREE.Vector3(0, 6, 0)));
          
          // Ajustar el radio (distancia) - invertir para que pellizcar hacia adentro acerque
          spherical.radius *= (1 - zoomFactor);
          spherical.radius = Math.max(minDistance, Math.min(maxDistance, spherical.radius));
          
          // Aplicar nueva posición
          const newPosition = new THREE.Vector3();
          newPosition.setFromSpherical(spherical);
          newPosition.add(new THREE.Vector3(0, 6, 0));
          
          camera.position.copy(newPosition);
          camera.lookAt(0, 6, 0);
          
          // Renderizar inmediatamente
          renderScene();
        }
        lastPinchDistance = currentDistance;
        event.preventDefault();
      } else if (isInteracting && (!event.touches || event.touches.length === 1)) {
        // Rotación normal
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
        camera.lookAt(0, 6, 0);
        
        // Renderizar inmediatamente
        renderScene();
        
        lastX = coords.x;
        lastY = coords.y;
        event.preventDefault();
      }
    };

    // Handler para zoom con rueda del ratón
    const handleWheel = (event) => {
      event.preventDefault();
      
      const zoomFactor = 0.1;
      const direction = event.deltaY > 0 ? 1 : -1;
      const currentDistance = camera.position.distanceTo(new THREE.Vector3(0, 6, 0));
      
      // Limitar el zoom para evitar estar muy cerca o muy lejos
      const minDistance = 10;
      const maxDistance = 100;
      
      if ((direction > 0 && currentDistance < maxDistance) || 
          (direction < 0 && currentDistance > minDistance)) {
        
        // Calcular nueva posición de cámara
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position.clone().sub(new THREE.Vector3(0, 6, 0)));
        
        // Ajustar el radio (distancia)
        spherical.radius += direction * spherical.radius * zoomFactor;
        spherical.radius = Math.max(minDistance, Math.min(maxDistance, spherical.radius));
        
        // Aplicar nueva posición
        const newPosition = new THREE.Vector3();
        newPosition.setFromSpherical(spherical);
        newPosition.add(new THREE.Vector3(0, 6, 0));
        
        camera.position.copy(newPosition);
        camera.lookAt(0, 6, 0);
        
        // Renderizar inmediatamente
        renderScene();
      }
    };

    // Event listeners
    canvasRef.current.addEventListener('mousedown', handleInteractionStart);
    canvasRef.current.addEventListener('touchstart', handleInteractionStart, { passive: false });
    canvasRef.current.addEventListener('wheel', handleWheel, { passive: false });
    
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
        canvasRef.current.removeEventListener('wheel', handleWheel);
        canvasRef.current.removeEventListener('touchstart', preventScroll);
        canvasRef.current.removeEventListener('touchmove', preventScroll);
      }
      document.removeEventListener('mouseup', handleInteractionEnd);
      document.removeEventListener('touchend', handleInteractionEnd);
      document.removeEventListener('mousemove', handleInteractionMove);
      document.removeEventListener('touchmove', handleInteractionMove);
    };
  }, [camera, renderer, scene]);

  // Cálculos actualizados con la ecuación correcta
  useEffect(() => {
    // Función de altura corregida
    const heightFunction = (x, y) => {
      return Math.max(0, 8 - 0.078125 * x * x + 0.0064 * y * y);
    };

    const calculateSurfaceArea = () => {
      let area = 0;
      const dx = 0.5;
      const dy = 0.5;
      
      for (let x = -8; x <= 8; x += dx) {
        for (let y = -25; y <= 25; y += dy) {
          const z = heightFunction(x, y);
          if (z > 0) {
            // Derivadas parciales: ∂z/∂x = -0.078125·2x, ∂z/∂y = 0.0064·2y
            const dzdx = -0.078125 * 2 * x;
            const dzdy = 0.0064 * 2 * y;
            const dA = Math.sqrt(1 + dzdx*dzdx + dzdy*dzdy) * dx * dy;
            area += dA;
          }
        }
      }
      return area;
    };

    const calculateSupportCount = () => {
      // Cálculo según la distribución real de polines (9x11)
      // Dirección X: -8 a 8, cada 2m (9 polines)
      // Dirección Y: -25 a 25, cada 5m (11 polines)
      return 9 * 11; // = 99 polines
    };

    const surfaceArea = calculateSurfaceArea();
    const concreteVolume = surfaceArea * 0.15; // Espesor de 15cm
    const supportCount = calculateSupportCount();

    setCalculations({
      surfaceArea,
      concreteVolume,
      supportCount
    });
  }, []);

  // Animación de rotación automática
  useEffect(() => {
    if (!scene || !renderer || !camera) return;

    const animate = () => {
      if (autoRotate) {
        const time = Date.now() * 0.0005;
        const radius = 45;
        camera.position.x = Math.cos(time) * radius;
        camera.position.z = Math.sin(time) * radius;
        camera.lookAt(0, 6, 0);
        
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

  // Efectos para controlar visibilidad de elementos
  useEffect(() => {
    if (supportGroup) {
      supportGroup.visible = showSupports;
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }
  }, [showSupports, supportGroup, renderer, scene, camera]);

  useEffect(() => {
    if (roofMesh) {
      roofMesh.material.wireframe = showWireframe;
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }
  }, [showWireframe, roofMesh, renderer, scene, camera]);

  useEffect(() => {
    if (churchGroup) {
      churchGroup.visible = showChurch;
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }
  }, [showChurch, churchGroup, renderer, scene, camera]);

  const handleToggleRotate = () => {
    setAutoRotate(!autoRotate);
  };

  const handleToggleSupports = () => {
    setShowSupports(!showSupports);
  };

  const handleToggleWireframe = () => {
    setShowWireframe(!showWireframe);
  };

  const handleToggleChurch = () => {
    setShowChurch(!showChurch);
  };

  const handleReset = () => {
    if (camera && renderer && scene) {
      camera.position.set(35, 25, 35);
      camera.lookAt(0, 6, 0);
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
              Diseño de Capilla - Paraboloide Hiperbólico
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              Modelación Matemática Intermedia - Equipo 6 - Group 850
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 p-2 md:p-6">
            <InfoPanel />
            <VerificationPanel />
            
            <Controls 
              autoRotate={autoRotate}
              onToggleRotate={handleToggleRotate}
              onReset={handleReset}
              showSupports={showSupports}
              onToggleSupports={handleToggleSupports}
              showWireframe={showWireframe}
              onToggleWireframe={handleToggleWireframe}
              showChurch={showChurch}
              onToggleChurch={handleToggleChurch}
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
              <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <CardDescription className="text-sm text-blue-800 font-semibold text-center">
                  🖱️ Arrastra para rotar • 🔍 Rueda del ratón para zoom • 👆 Pellizca con dos dedos para zoom (móvil)
                </CardDescription>
                <CardDescription className="text-xs text-blue-600 text-center mt-1">
                  Los puntos de colores muestran las alturas de verificación del documento
                </CardDescription>
              </div>
            </div>

            <CalculationsPanel calculations={calculations} />

            {/* Panel de información técnica */}
            <Card className="mt-6 border-l-4 border-indigo-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <span>📊</span>
                  Análisis Matemático
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Propiedades Geométricas:</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Superficie de doble curvatura</li>
                      <li>• Superficie reglada (generada por líneas rectas)</li>
                      <li>• Punto silla en (0,0,8)</li>
                      <li>• Cóncava en dirección X (drenaje)</li>
                      <li>• Convexa en dirección Y (elevación)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Ventajas Arquitectónicas:</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Drenaje natural hacia los lados</li>
                      <li>• Elevación dramática hacia el altar</li>
                      <li>• Distribución equilibrada de cargas</li>
                      <li>• Estabilidad estructural</li>
                      <li>• Efecto visual ascendente</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Ecuación y Parámetros:</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Ecuación general:</strong> z = h - a·x² + b·y²</p>
                    <p><strong>Parámetros calculados:</strong></p>
                    <p className="ml-4">• a = 0.078125 (determina curvatura en X)</p>
                    <p className="ml-4">• b = 0.0064 (determina curvatura en Y)</p>
                    <p className="ml-4">• h = 8 m (altura central)</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800">Leyenda de Puntos de Verificación:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Centro (8m)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Bordes ancho (3m)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Bordes largo (12m)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>Esquinas (7m)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información del equipo */}
            <Card className="mt-6 border-l-4 border-gray-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-700">
                  <span>👥</span>
                  Equipo 6 - Group 850
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>• Aaron Hernandez Jimenez - A10642529</p>
                  <p>• Vianey Badamaidhu Vazquez García - A01773823</p>
                  <p>• Santiago Juárez Castillo - A01803648</p>
                  <p className="mt-2 font-medium">Modelación Matemática Intermedia - 12 Jul 2025</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HyperbolicParaboloidViewer;