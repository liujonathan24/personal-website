// This is a variant with wireframe-style triangles
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Delaunator from 'delaunator';

const WireframeBackground = () => {
  const containerRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const originalPositions = useRef([]);
  const requestRef = useRef();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Get container dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      0.1,
      1000
    );
    camera.position.z = 100;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);
    
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
        const baseX = (col * cellWidth) - (width / 2);
        const baseY = (row * cellHeight) - (height / 2);
        
        points.push([
          addJitter(baseX, cellWidth),
          addJitter(baseY, cellHeight)
        ]);
      }
    }
    
    // Create Delaunay triangulation
    const delaunay = new Delaunator(points.flat());
    const triangles = delaunay.triangles;
    const triangleCount = triangles.length / 3;
    
    // Create geometry
    const triangleGeometry = new THREE.BufferGeometry();
    const vertices = [];
    
    // Create vertices array
    for (let i = 0; i < triangles.length; i += 3) {
      const p1 = points[triangles[i]];
      const p2 = points[triangles[i + 1]];
      const p3 = points[triangles[i + 2]];
      
      vertices.push(
        p1[0], p1[1], 0,
        p2[0], p2[1], 0,
        p3[0], p3[1], 0
      );
    }
    
    // Set vertices
    triangleGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    
    // Store original positions for animation
    originalPositions.current = [...vertices];
    
    // Create material with wireframe effect
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });
    
    material.wireframe = true;
    material.wireframeLinewidth = 1;
    material.wireframeLinecap = 'round';
    material.wireframeLinejoin = 'round';
    material.wireframeLinecolor = new THREE.Color(1, 1, 1); // White wireframe
    material.opacity = 1; // Full opacity
    
    const mesh = new THREE.Mesh(triangleGeometry, material);
    mesh.renderOrder = 0;
    scene.add(mesh);
    
    // Handle mouse movement
    const handleMouseMove = (event) => {
      mousePosition.current = {
        x: event.clientX - width / 2,
        y: -(event.clientY - height / 2)
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      
      // Update vertex positions for warping effect
      const positions = triangleGeometry.attributes.position.array;
      const time = Date.now() * 0.001;
      
      // Calculate mouse influence radius
      const influenceRadius = width * 0.3;
      const falloffDistance = width * 0.2;
      
      for (let i = 0; i < positions.length; i += 3) {
        const originalX = originalPositions.current[i];
        const originalY = originalPositions.current[i + 1];
        
        // Calculate distance from point to mouse
        const dx = originalX - mousePosition.current.x;
        const dy = originalY - mousePosition.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate influence factor based on distance
        let influence = 0;
        if (distance < influenceRadius) {
          influence = Math.cos(Math.min(distance / falloffDistance, 1) * Math.PI) * 0.5 + 0.5;
        }
        
        // Calculate wave phase based on distance and time
        const speed = 2;
        const wavelength = width * 0.1;
        const wavePhase = (distance / wavelength + time * speed) * Math.PI * 2;
        const radialWave = Math.sin(wavePhase) * Math.exp(-distance / influenceRadius);
        
        // Calculate displacement
        const maxDisplacement = width * 0.015;
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
      mesh.rotation.x += (mousePosition.current.y / height - mesh.rotation.x) * rotationSpeed;
      mesh.rotation.y += (mousePosition.current.x / width - mesh.rotation.y) * rotationSpeed;
      
      // Clamp rotation
      mesh.rotation.x = Math.max(Math.min(mesh.rotation.x, maxRotation), -maxRotation);
      mesh.rotation.y = Math.max(Math.min(mesh.rotation.y, maxRotation), -maxRotation);
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      camera.left = newWidth / -2;
      camera.right = newWidth / 2;
      camera.top = newHeight / 2;
      camera.bottom = newHeight / -2;
      camera.updateProjectionMatrix();
      
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  
  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default WireframeBackground;
