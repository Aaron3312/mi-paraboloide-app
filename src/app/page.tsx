"use client";
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InfoPanel } from '@/components/InfoPanel';
import { VerificationPanel } from '@/components/VerificationPanel';
import { Controls } from '@/components/Controls';
import { CalculationsPanel } from '@/components/CalculationsPanel';
import { useThreeJS } from '@/hooks/useThreeJS';


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