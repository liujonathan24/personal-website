import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import Delaunator from 'delaunator';

const AnimatedBackground = () => {
  const containerRef = useRef();
  const mousePosition = useRef({ x: 0, y: 0 });
  const originalPositions = useRef();
  
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      preserveDrawingBuffer: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Calculate dimensions to cover viewport
    const distance = camera.position.z = 8;
    const fov = camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * distance;
    const width = height * camera.aspect;
    
    // Generate points in a more uniform grid with some randomness
    const gridSize = 15; // Adjust this for more/fewer triangles
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;
    const points = [];
    const jitterAmount = 0.35; // Amount of randomness (0-0.5, where 0.5 is max jitter)
    
    // Helper function to add jitter to points
    const addJitter = (value, cellSize) => {
      return value + (Math.random() - 0.5) * cellSize * jitterAmount * 2;
    };
    
    // Add border points with single offset
    const borderOffset = Math.min(cellWidth, cellHeight) * 0.5;
    
    // Add border points
    for (let col = -1; col <= gridSize + 1; col++) {
      const x = (col * cellWidth) - (width / 2);
      // Bottom edge
      points.push([x, -height/2 - borderOffset]);
      // Top edge
      points.push([x, height/2 + borderOffset]);
    }
    
    // Left and right edges
    for (let row = -1; row <= gridSize + 1; row++) {
      const y = (row * cellHeight) - (height / 2);
      // Left edge
      points.push([-width/2 - borderOffset, y]);
      // Right edge
      points.push([width/2 + borderOffset, y]);
    }
    
    // Add corner points
    const corners = [
      [-width/2 - borderOffset, -height/2 - borderOffset],
      [width/2 + borderOffset, -height/2 - borderOffset],
      [-width/2 - borderOffset, height/2 + borderOffset],
      [width/2 + borderOffset, height/2 + borderOffset]
    ];
    points.push(...corners);
    
    // Add points in a grid pattern with controlled randomness
    for (let row = -1; row <= gridSize; row++) {
      for (let col = -1; col <= gridSize; col++) {
        // Calculate base position
        const baseX = (col * cellWidth) - (width / 2);
        const baseY = (row * cellHeight) - (height / 2);
        
        // Add point with controlled randomness
        points.push([
          addJitter(baseX, cellWidth),
          addJitter(baseY, cellHeight)
        ]);
        
        // Add additional points near the edges for better coverage
        if (row === -1 || row === gridSize || col === -1 || col === gridSize) {
          points.push([
            addJitter(baseX, cellWidth),
            addJitter(baseY, cellHeight)
          ]);
        }
      }
    }
    
    // Create Delaunay triangulation
    const delaunay = new Delaunator(points.flat());
    const triangles = delaunay.triangles;
    const triangleCount = triangles.length / 3;
    
    // Create geometry
    const triangleGeometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    // Create vertices array and assign colors
    for (let i = 0; i < triangles.length; i += 3) {
      const p1 = points[triangles[i]];
      const p2 = points[triangles[i + 1]];
      const p3 = points[triangles[i + 2]];
      
      // Add vertices
      vertices.push(
        p1[0], p1[1], 0,
        p2[0], p2[1], 0,
        p3[0], p3[1], 0
      );
      
      // Generate a pastel color for this triangle
      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.9, 0.9);
      
      // Apply the same color to all vertices of this triangle
      for (let j = 0; j < 3; j++) {
        colors.push(color.r, color.g, color.b);
      }
    }
    
    // Store original positions for animation
    originalPositions.current = [...vertices];
    
    // Set vertices and colors
    triangleGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    triangleGeometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    );
    
    // Create material for solid colored triangles
    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      transparent: false,
      opacity: 1,
    });
    
    // Create mesh for triangles
    const mesh = new THREE.Mesh(triangleGeometry, material);
    mesh.renderOrder = 0;
    scene.add(mesh);
    
    // Create white wireframe overlay using a second mesh
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      wireframeLinewidth: 1,
      transparent: false,
      depthTest: false,
      depthWrite: false
    });
    
    const wireframe = new THREE.Mesh(triangleGeometry, wireframeMaterial);
    wireframe.renderOrder = 1;
    scene.add(wireframe);
    
    // Handle mouse movement
    const handleMouseMove = (event) => {
      // Convert to normalized device coordinates (-1 to +1)
      const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Convert normalized coordinates to scene coordinates
      mousePosition.current = {
        x: normalizedX * width / 2,
        y: normalizedY * height / 2
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      const newAspect = window.innerWidth / window.innerHeight;
      camera.aspect = newAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update vertex positions for warping effect
      const positions = triangleGeometry.attributes.position.array;
      const time = Date.now() * 0.001;
      
      // Calculate mouse influence radius
      const influenceRadius = width * 0.3;
      const falloffDistance = width * 0.2;
      
      for (let i = 0; i < positions.length; i += 3) {
        const originalX = originalPositions.current[i];
        const originalY = originalPositions.current[i + 1];
        
        // Calculate distance from mouse
        const dx = originalX - mousePosition.current.x;
        const dy = originalY - mousePosition.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate influence factor based on distance
        let influence = 0;
        if (distance < influenceRadius) {
          influence = Math.cos(Math.min(distance / falloffDistance, 1) * Math.PI) * 0.5 + 0.5;
        }
        
        // Calculate wave phase based on distance and time
        const speed = 0.5;
        const wavelength = width * 0.1;
        const wavePhase = (distance / wavelength + time * speed) * Math.PI * 2;
        const radialWave = Math.sin(wavePhase) * Math.exp(-distance / influenceRadius);
        
        // Calculate displacement
        const maxDisplacement = width * 0.008;
        const displaceAmount = maxDisplacement * influence * radialWave;
        
        // Apply displacement in the radial direction
        const angle = Math.atan2(dy, dx);
        positions[i] = originalX + Math.cos(angle) * displaceAmount;
        positions[i + 1] = originalY + Math.sin(angle) * displaceAmount;
      }
      
      triangleGeometry.attributes.position.needsUpdate = true;
      
      // Apply gentle rotation based on mouse position
      const rotationSpeed = 0.0002;
      const maxRotation = 0.1;
      
      // Use normalized mouse position for rotation
      const normalizedX = mousePosition.current.x / (width / 2);
      const normalizedY = mousePosition.current.y / (height / 2);
      
      mesh.rotation.x += (normalizedY - mesh.rotation.x) * rotationSpeed;
      mesh.rotation.y += (normalizedX - mesh.rotation.y) * rotationSpeed;
      
      // Clamp rotation
      mesh.rotation.x = Math.max(Math.min(mesh.rotation.x, maxRotation), -maxRotation);
      mesh.rotation.y = Math.max(Math.min(mesh.rotation.y, maxRotation), -maxRotation);
      
      // Copy rotation to wireframe
      wireframe.rotation.copy(mesh.rotation);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);
  
  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default AnimatedBackground;
