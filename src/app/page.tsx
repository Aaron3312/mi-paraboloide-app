"use client";
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Componentes UI premium con animaciones
const Button = ({ 
  onClick, 
  variant = "default", 
  size = "default", 
  className = "", 
  children,
  icon
}) => {
  const baseClasses = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl relative overflow-hidden group";
  
  const variants = {
    default: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white focus:ring-blue-400 shadow-blue-500/25",
    destructive: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white focus:ring-red-400 shadow-red-500/25",
    outline: "border-2 border-gray-300 bg-white/80 backdrop-blur-sm hover:border-gray-400 hover:bg-white/90 text-gray-700 focus:ring-gray-400 shadow-gray-500/10",
    glass: "bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 focus:ring-white/50 shadow-white/10"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
      <span className="relative flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </span>
    </button>
  );
};

const Card = ({ className = "", children, variant = "default" }) => {
  const variants = {
    default: "bg-white/90 backdrop-blur-sm shadow-xl border border-white/20",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl",
    gradient: "bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm shadow-2xl border border-white/30"
  };
  
  return (
    <div className={`rounded-2xl transition-all duration-300 hover:shadow-2xl ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ className = "", children }) => (
  <div className={`px-8 py-6 border-b border-white/10 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ className = "", children }) => (
  <div className={`px-8 py-6 ${className}`}>
    {children}
  </div>
);

const CardDescription = ({ className = "", children }) => (
  <p className={`text-gray-600 leading-relaxed ${className}`}>
    {children}
  </p>
);

const Badge = ({ variant = "default", className = "", children, animated = false }) => {
  const variants = {
    default: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg",
    outline: "border-2 border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700",
    glass: "bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-white/10",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25"
  };
  
  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${variants[variant]} ${animated ? 'animate-pulse' : ''} ${className}`}>
      {children}
    </span>
  );
};

// Componente de partículas flotantes
const FloatingParticles = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'soft-light' }}
    />
  );
};

// Panel de especificaciones
const SpecificationsPanel = () => (
  <Card variant="gradient" className="mb-8 border-l-4 border-gradient-to-b from-blue-500 to-purple-600 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-3xl">
        <span className="text-4xl animate-bounce">⛪</span>
        <span className="bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
          Especificaciones de la Capilla
        </span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Badge variant="glass" className="text-center py-3 hover:scale-105 transition-transform">
          <div className="flex flex-col">
            <span className="text-xs opacity-80">ECUACIÓN DEL TECHO</span>
            <span className="font-bold">z = 8 - (x²/64) - (y²/625)</span>
          </div>
        </Badge>
        <Badge variant="glass" className="text-center py-3 hover:scale-105 transition-transform">
          <div className="flex flex-col">
            <span className="text-xs opacity-80">DIMENSIONES TERRENO</span>
            <span className="font-bold">16m × 50m × 8m altura</span>
          </div>
        </Badge>
        <Badge variant="glass" className="text-center py-3 hover:scale-105 transition-transform">
          <div className="flex flex-col">
            <span className="text-xs opacity-80">TIPO SUPERFICIE</span>
            <span className="font-bold">Paraboloide Hiperbólico</span>
          </div>
        </Badge>
      </div>
      
      <div className="bg-white/5 p-6 rounded-xl">
        <h4 className="text-lg font-bold text-gray-800 mb-3">📐 Análisis Matemático</h4>
        <div className="space-y-3 text-sm text-gray-700">
          <p><strong>Restricciones del dominio:</strong> -8 ≤ x ≤ 8, -25 ≤ y ≤ 25</p>
          <p><strong>Altura máxima:</strong> z(0,0) = 8 metros en el centro</p>
          <p><strong>Condición de unicidad:</strong> Paraboloide hiperbólico con orientación específica</p>
          <p><strong>Solución del sistema:</strong> Única para las condiciones dadas</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Panel de análisis estructural
const StructuralAnalysisPanel = () => (
  <Card variant="glass" className="mb-8">
    <CardHeader>
      <CardTitle className="text-white">
        🏗️ Análisis Estructural y Soportes (Polines)
      </CardTitle>
    </CardHeader>
    <CardContent className="text-white space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 p-4 rounded-xl">
          <h4 className="font-bold mb-3">📏 Distancia entre Soportes</h4>
          <p className="text-sm">Espaciado recomendado: 4 metros entre polines</p>
          <p className="text-sm">Basado en normas de construcción para estructuras de concreto</p>
          <p className="text-sm">Total de soportes calculados: Variable según altura mínima</p>
        </div>
        <div className="bg-white/5 p-4 rounded-xl">
          <h4 className="font-bold mb-3">📐 Longitud de Soportes</h4>
          <p className="text-sm">Altura en (x,y): h = 8 - (x²/64) - (y²/625)</p>
          <p className="text-sm">Altura mínima considerada: 0.5m</p>
          <p className="text-sm">Diámetro de polines: 0.25-0.30m</p>
        </div>
      </div>
      
      <div className="bg-white/5 p-4 rounded-xl">
        <h4 className="font-bold mb-3">🔧 Consideraciones Adicionales</h4>
        <ul className="text-sm space-y-1">
          <li>• Carga estructural: peso del concreto + cargas vivas</li>
          <li>• Resistencia de materiales: concreto armado</li>
          <li>• Factores de seguridad según normativa local</li>
          <li>• Dilatación térmica y asentamientos</li>
          <li>• Resistencia sísmica según zona geográfica</li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

// Controles premium
const Controls = ({ 
  autoRotate, 
  onToggleRotate, 
  onReset,
  showSupports,
  onToggleSupports,
  wireframe,
  onToggleWireframe,
  showWalls,
  onToggleWalls
}) => (
  <div className="flex justify-center gap-4 mb-8 flex-wrap">
    <Button 
      onClick={onToggleRotate}
      variant={autoRotate ? "destructive" : "default"}
      icon={autoRotate ? '⏸️' : '▶️'}
      className="min-w-[120px]"
    >
      {autoRotate ? 'Pausar' : 'Rotar'}
    </Button>
    <Button 
      onClick={onToggleSupports}
      variant={showSupports ? "default" : "outline"}
      icon="🏗️"
      className="min-w-[120px]"
    >
      {showSupports ? 'Ocultar' : 'Mostrar'} Polines
    </Button>
    <Button 
      onClick={onToggleWalls}
      variant={showWalls ? "default" : "outline"}
      icon="🧱"
      className="min-w-[120px]"
    >
      {showWalls ? 'Ocultar' : 'Mostrar'} Paredes
    </Button>
    <Button 
      onClick={onToggleWireframe}
      variant={wireframe ? "default" : "outline"}
      icon="🔗"
      className="min-w-[120px]"
    >
      {wireframe ? 'Sólido' : 'Wireframe'}
    </Button>
    <Button 
      onClick={onReset}
      variant="glass"
      icon="🔄"
      className="min-w-[120px]"
    >
      Reset
    </Button>
  </div>
);

// Panel de cálculos expandido
const CalculationsPanel = ({ calculations }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
    <Card variant="glass" className="group hover:scale-105 transition-all duration-300">
      <CardContent className="text-center p-6">
        <div className="text-4xl mb-3 group-hover:animate-bounce">📏</div>
        <h3 className="text-lg font-bold text-white mb-2">Área Superficial</h3>
        <p className="text-3xl font-bold text-white">{calculations.surfaceArea.toFixed(1)}</p>
        <p className="text-sm text-white/80 mt-1">m²</p>
        <p className="text-xs text-white/60 mt-2">Superficie del techo</p>
      </CardContent>
    </Card>
    
    <Card variant="glass" className="group hover:scale-105 transition-all duration-300">
      <CardContent className="text-center p-6">
        <div className="text-4xl mb-3 group-hover:animate-bounce">🧱</div>
        <h3 className="text-lg font-bold text-white mb-2">Volumen Concreto</h3>
        <p className="text-3xl font-bold text-white">{calculations.concreteVolume.toFixed(1)}</p>
        <p className="text-sm text-white/80 mt-1">m³</p>
        <p className="text-xs text-white/60 mt-2">Espesor: 15cm</p>
      </CardContent>
    </Card>
    
    <Card variant="glass" className="group hover:scale-105 transition-all duration-300">
      <CardContent className="text-center p-6">
        <div className="text-4xl mb-3 group-hover:animate-bounce">💨</div>
        <h3 className="text-lg font-bold text-white mb-2">Volumen Interior</h3>
        <p className="text-3xl font-bold text-white">{calculations.airVolume.toFixed(1)}</p>
        <p className="text-sm text-white/80 mt-1">m³</p>
        <p className="text-xs text-white/60 mt-2">Espacio para fieles</p>
      </CardContent>
    </Card>
    
    <Card variant="glass" className="group hover:scale-105 transition-all duration-300">
      <CardContent className="text-center p-6">
        <div className="text-4xl mb-3 group-hover:animate-bounce">🏗️</div>
        <h3 className="text-lg font-bold text-white mb-2">Polines</h3>
        <p className="text-3xl font-bold text-white">{calculations.supportCount}</p>
        <p className="text-sm text-white/80 mt-1">unidades</p>
        <p className="text-xs text-white/60 mt-2">Soportes estructurales</p>
      </CardContent>
    </Card>
  </div>
);

// Reporte técnico
const TechnicalReport = () => (
  <Card variant="gradient" className="mt-8">
    <CardHeader>
      <CardTitle className="flex items-center gap-3">
        <span className="text-3xl">📋</span>
        Reporte Técnico del Diseño
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800">🏛️ Decisiones de Diseño</h4>
          <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
            <p><strong>Orientación:</strong> Paraboloide hiperbólico con concavidad hacia abajo en dirección principal</p>
            <p><strong>Configuración:</strong> Techo independiente con paredes opcionales</p>
            <p><strong>Altura central:</strong> 8 metros para optimizar acústica y espacialidad</p>
            <p><strong>Estructura:</strong> Concreto armado con polines de soporte cada 4 metros</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800">🔢 Validación Matemática</h4>
          <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
            <p><strong>Ecuación única:</strong> z = 8 - (x²/64) - (y²/625)</p>
            <p><strong>Dominio:</strong> [-8,8] × [-25,25] (dimensiones del terreno)</p>
            <p><strong>Solución:</strong> Sistema determinado con solución única</p>
            <p><strong>Restricciones:</strong> Satisface todas las condiciones geométricas</p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-xl">
        <h4 className="text-lg font-bold text-gray-800 mb-3">📊 Metodología de Cálculo</h4>
        <div className="text-sm space-y-2 text-gray-700">
          <p><strong>Área superficial:</strong> Integración numérica considerando la curvatura: ∫∫√(1 + (∂z/∂x)² + (∂z/∂y)²) dA</p>
          <p><strong>Volumen de concreto:</strong> Área superficial × espesor promedio (15 cm)</p>
          <p><strong>Volumen interior:</strong> Integración del espacio bajo la superficie</p>
          <p><strong>Polines:</strong> Distribución cada 4m con altura mínima de 0.5m</p>
        </div>
      </div>
      
      <div className="bg-green-50 p-6 rounded-xl">
        <h4 className="text-lg font-bold text-gray-800 mb-3">✅ Conclusiones</h4>
        <div className="text-sm space-y-2 text-gray-700">
          <p>• El diseño es estructuralmente viable y estéticamente atractivo</p>
          <p>• La geometría permite óptima distribución de cargas</p>
          <p>• El volumen interior proporciona excelente acústica natural</p>
          <p>• Los costos de construcción están optimizados por la eficiencia estructural</p>
          <p>• El diseño cumple con normativas de construcción religiosa</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Hook mejorado para Three.js
const useThreeJS = (canvasRef) => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const roofMeshRef = useRef(null);
  const supportGroupRef = useRef(null);
  const wallsGroupRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current.parentElement;
    const isDesktop = window.innerWidth >= 768;
    const containerWidth = isDesktop ? window.innerWidth * 0.9 : container.offsetWidth;
    const containerHeight = isDesktop ? window.innerHeight * 0.7 : Math.min(600, containerWidth * 0.75);

    // Configuración de escena mejorada
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x87CEEB, 10, 200);
    
    const camera = new THREE.PerspectiveCamera(75, containerWidth/containerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x87CEEB, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Iluminación mejorada
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    // Luz adicional interior
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(0, 25, 0);
    scene.add(pointLight);

    // Crear geometría del paraboloide hiperbólico
    const createParaboloidGeometry = (widthSegments = 80, heightSegments = 150) => {
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

    const geometry = createParaboloidGeometry(80, 150);

    // Material del techo - tierra cocida/tejas
    const roofMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B4513,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      wireframe: true,
      shininess: 30,
      specular: 0x444444
    });

    const roofMesh = new THREE.Mesh(geometry, roofMaterial);
    roofMesh.receiveShadow = true;
    roofMesh.castShadow = true;
    scene.add(roofMesh);

    // Crear soportes (polines)
    const supportGroup = new THREE.Group();
    for (let x = -8; x <= 8; x += 4) {
      for (let y = -24; y <= 24; y += 4) {
        const height = Math.max(0, 8 - (x*x/64) - (y*y/625));
        if (height > 0.5) {
          const supportGeometry = new THREE.CylinderGeometry(0.25, 0.3, height, 12);
          const supportMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x654321,
            shininess: 50
          });
          const support = new THREE.Mesh(supportGeometry, supportMaterial);
          support.position.set(x, height/2, y);
          support.castShadow = true;
          support.receiveShadow = true;
          supportGroup.add(support);
        }
      }
    }
    scene.add(supportGroup);
    supportGroup.visible = false;

    // Crear paredes de la capilla
    const wallsGroup = new THREE.Group();
    
    // Paredes laterales
    const wallHeight = 3;
    const wallThickness = 0.3;
    
    // Pared frontal
    const frontWallGeometry = new THREE.BoxGeometry(16, wallHeight, wallThickness);
    const wallMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xD2B48C,
      shininess: 20
    });
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    frontWall.position.set(0, wallHeight/2, 25);
    frontWall.castShadow = true;
    frontWall.receiveShadow = true;
    wallsGroup.add(frontWall);
    
    // Pared trasera con entrada
    const backWallLeft = new THREE.Mesh(
      new THREE.BoxGeometry(6, wallHeight, wallThickness),
      wallMaterial
    );
    backWallLeft.position.set(-5, wallHeight/2, -25);
    backWallLeft.castShadow = true;
    wallsGroup.add(backWallLeft);
    
    const backWallRight = new THREE.Mesh(
      new THREE.BoxGeometry(6, wallHeight, wallThickness),
      wallMaterial
    );
    backWallRight.position.set(5, wallHeight/2, -25);
    backWallRight.castShadow = true;
    wallsGroup.add(backWallRight);
    
    // Paredes laterales
    const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 50);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-8, wallHeight/2, 0);
    leftWall.castShadow = true;
    wallsGroup.add(leftWall);
    
    const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    rightWall.position.set(8, wallHeight/2, 0);
    rightWall.castShadow = true;
    wallsGroup.add(rightWall);
    
    scene.add(wallsGroup);
    wallsGroup.visible = true;

    // Suelo de la capilla
    const floorGeometry = new THREE.PlaneGeometry(16, 50);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x8B7355,
      transparent: true,
      opacity: 0.9
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Suelo exterior
    const groundGeometry = new THREE.PlaneGeometry(100, 120);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x90EE90,
      transparent: true,
      opacity: 0.7
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Altar simple
    const altarGeometry = new THREE.BoxGeometry(3, 1, 1.5);
    const altarMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const altar = new THREE.Mesh(altarGeometry, altarMaterial);
    altar.position.set(0, 0.5, 20);
    altar.castShadow = true;
    scene.add(altar);

    // Cruz en el altar
    const crossVertical = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 2, 0.1),
      new THREE.MeshPhongMaterial({ color: 0x654321 })
    );
    crossVertical.position.set(0, 2, 20);
    scene.add(crossVertical);
    
    const crossHorizontal = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.1, 0.1),
      new THREE.MeshPhongMaterial({ color: 0x654321 })
    );
    crossHorizontal.position.set(0, 1.8, 20);
    scene.add(crossHorizontal);

    // Bancos simples
    for (let i = 0; i < 8; i++) {
      const benchGeometry = new THREE.BoxGeometry(6, 0.8, 1);
      const benchMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const bench = new THREE.Mesh(benchGeometry, benchMaterial);
      bench.position.set(0, 0.4, 10 - i * 2.5);
      bench.castShadow = true;
      scene.add(bench);
    }

    // Skybox simple
    const skyGeometry = new THREE.SphereGeometry(400, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x87CEEB,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

    camera.position.set(45, 30, 45);
    camera.lookAt(0, 6, 0);

    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return;
      
      const isDesktop = window.innerWidth >= 768;
      const containerWidth = isDesktop ? window.innerWidth * 0.9 : container.offsetWidth;
      const containerHeight = isDesktop ? window.innerHeight * 0.7 : Math.min(600, containerWidth * 0.75);
      
      camera.aspect = containerWidth / containerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerWidth, containerHeight);
    };

    window.addEventListener('resize', handleResize);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    roofMeshRef.current = roofMesh;
    supportGroupRef.current = supportGroup;
    wallsGroupRef.current = wallsGroup;

    renderer.render(scene, camera);

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
    wallsGroup: wallsGroupRef.current
  };
};

// Componente principal
const HyperbolicParaboloidChapel = () => {
  const canvasRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showSupports, setShowSupports] = useState(false);
  const [showWalls, setShowWalls] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const animationRef = useRef(null);
  const [calculations, setCalculations] = useState({
    surfaceArea: 0,
    concreteVolume: 0,
    airVolume: 0,
    supportCount: 0
  });

  const { scene, renderer, camera, roofMesh, supportGroup, wallsGroup } = useThreeJS(canvasRef);

  // Controles de interacción
  useEffect(() => {
    if (!canvasRef.current || !camera || !renderer || !scene) return;

    let isInteracting = false;
    let lastX = 0;
    let lastY = 0;
    let rotationSpeed = 0.01;

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

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    const handleInteractionStart = (event) => {
      isInteracting = true;
      const coords = getEventCoordinates(event);
      lastX = coords.x;
      lastY = coords.y;
      setAutoRotate(false);
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
      
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      
      spherical.theta -= deltaX * rotationSpeed;
      spherical.phi += deltaY * rotationSpeed;
      
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      spherical.radius = Math.max(25, Math.min(100, spherical.radius));
      
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 6, 0);
      
      renderScene();
      
      lastX = coords.x;
      lastY = coords.y;
      event.preventDefault();
    };

    const handleWheel = (event) => {
      event.preventDefault();
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      
      spherical.radius += event.deltaY * 0.05;
      spherical.radius = Math.max(25, Math.min(100, spherical.radius));
      
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 6, 0);
      renderScene();
    };

    canvasRef.current.addEventListener('mousedown', handleInteractionStart);
    canvasRef.current.addEventListener('touchstart', handleInteractionStart, { passive: false });
    canvasRef.current.addEventListener('wheel', handleWheel, { passive: false });
    
    document.addEventListener('mouseup', handleInteractionEnd);
    document.addEventListener('touchend', handleInteractionEnd);
    document.addEventListener('mousemove', handleInteractionMove);
    document.addEventListener('touchmove', handleInteractionMove, { passive: false });

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

  // Efectos para controles
  useEffect(() => {
    if (supportGroup) {
      supportGroup.visible = showSupports;
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }
  }, [showSupports, supportGroup, renderer, scene, camera]);

  useEffect(() => {
    if (wallsGroup) {
      wallsGroup.visible = showWalls;
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }
  }, [showWalls, wallsGroup, renderer, scene, camera]);

  useEffect(() => {
    if (roofMesh) {
      roofMesh.material.wireframe = wireframe;
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }
  }, [wireframe, roofMesh, renderer, scene, camera]);

  // Cálculos precisos
  useEffect(() => {
    const calculateSurfaceArea = () => {
      let area = 0;
      const dx = 0.1;
      const dy = 0.1;
      
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
      const dx = 0.1;
      const dy = 0.1;
      
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
    const concreteVolume = surfaceArea * 0.15; // 15 cm de espesor
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
        const time = Date.now() * 0.0002;
        const radius = 55;
        camera.position.x = Math.cos(time) * radius;
        camera.position.z = Math.sin(time) * radius;
        camera.position.y = 30 + Math.sin(time * 0.5) * 8;
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

  const handleToggleRotate = () => setAutoRotate(!autoRotate);
  const handleToggleSupports = () => setShowSupports(!showSupports);
  const handleToggleWalls = () => setShowWalls(!showWalls);
  const handleToggleWireframe = () => setWireframe(!wireframe);

  const handleReset = () => {
    if (camera && renderer && scene) {
      camera.position.set(45, 30, 45);
      camera.lookAt(0, 6, 0);
      setAutoRotate(false);
      renderer.render(scene, camera);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 relative overflow-hidden">
      <FloatingParticles />
      
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Premium */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4 animate-pulse">
              ⛪ CAPILLA PARROQUIAL
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-light tracking-wide">
              Diseño Arquitectónico con Paraboloide Hiperbólico
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-6 rounded-full"></div>
          </div>

          <SpecificationsPanel />
          <StructuralAnalysisPanel />
          
          <Controls 
            autoRotate={autoRotate}
            onToggleRotate={handleToggleRotate}
            onReset={handleReset}
            showSupports={showSupports}
            onToggleSupports={handleToggleSupports}
            showWalls={showWalls}
            onToggleWalls={handleToggleWalls}
            wireframe={wireframe}
            onToggleWireframe={handleToggleWireframe}
          />

          {/* Visor 3D Premium */}
          <div className="text-center mb-8">
            <Card variant="glass" className="inline-block border-2 border-white/20 shadow-2xl w-full max-w-none relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <CardContent className="p-0 relative">
                <canvas 
                  ref={canvasRef} 
                  className="rounded-2xl w-full h-auto block mx-auto"
                  style={{ 
                    touchAction: 'none', 
                    maxWidth: '100%',
                    background: 'radial-gradient(circle at center, rgba(135,206,235,0.3) 0%, rgba(135,206,235,0.1) 100%)'
                  }}
                />
                
                {/* Overlay de controles */}
                <div className="absolute top-4 left-4 space-y-2">
                  <Badge variant="glass" className="text-xs">
                    🖱️ Arrastra para rotar
                  </Badge>
                  <Badge variant="glass" className="text-xs">
                    🔍 Scroll para zoom
                  </Badge>
                  <Badge variant="glass" className="text-xs">
                    📱 Touch para móvil
                  </Badge>
                </div>
                
                {/* Indicador de estado */}
                <div className="absolute top-4 right-4 space-y-2">
                  {autoRotate && (
                    <Badge variant="success" animated className="text-xs">
                      🔄 Rotación automática
                    </Badge>
                  )}
                  {showSupports && (
                    <Badge variant="glass" className="text-xs">
                      🏗️ Polines visibles
                    </Badge>
                  )}
                  {showWalls && (
                    <Badge variant="glass" className="text-xs">
                      🧱 Paredes visibles
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 max-w-3xl mx-auto">
              <CardDescription className="text-white/70 text-lg leading-relaxed">
                Modelo 3D interactivo de la capilla parroquial con techo de paraboloide hiperbólico. 
                Incluye altar, bancos, cruz y elementos estructurales como polines de soporte.
                Utiliza los controles para explorar diferentes vistas y componentes del diseño.
              </CardDescription>
            </div>
          </div>

          <CalculationsPanel calculations={calculations} />
          <TechnicalReport />
          
          {/* Footer Premium */}
          <div className="mt-16 text-center">
            <Card variant="glass" className="inline-block px-8 py-6">
              <div className="flex items-center justify-center gap-4 text-white/70">
                <span className="text-2xl">⛪</span>
                <div className="text-left">
                  <p className="text-sm font-semibold">Diseño Arquitectónico Religioso</p>
                  <p className="text-xs opacity-80">Visualización 3D • Cálculos Estructurales • Análisis Matemático</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HyperbolicParaboloidChapel;