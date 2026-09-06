"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Scène Three.js du hero : champ de particules technologiques,
 * solides d'ingénierie en wireframe (icosaèdre, tore noué, anneau)
 * et parallaxe liée au mouvement de la souris.
 */
export default function ThreeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030a16, 0.045);
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 120);
    camera.position.z = 10;

    const group = new THREE.Group();
    scene.add(group);

    // --- Particules ---
    const COUNT = 1100;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const gold = new THREE.Color(0xe3a82b);
    const blue = new THREE.Color(0x3d6ea8);
    for (let i = 0; i < COUNT; i++) {
      const r = 8 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.6 - 4;
      const c = Math.random() > 0.62 ? gold : blue;
      const fade = 0.35 + Math.random() * 0.65;
      colors[i * 3] = c.r * fade;
      colors[i * 3 + 1] = c.g * fade;
      colors[i * 3 + 2] = c.b * fade;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pGeo, pMat);
    group.add(points);

    // --- Solides d'ingénierie wireframe ---
    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.7, 1),
      new THREE.MeshBasicMaterial({ color: 0xe3a82b, wireframe: true, transparent: true, opacity: 0.22 })
    );
    ico.position.set(-4.6, 0.6, -3);
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.7, 0.42, 140, 12),
      new THREE.MeshBasicMaterial({ color: 0x2f6bb0, wireframe: true, transparent: true, opacity: 0.16 })
    );
    knot.position.set(5, -0.6, -4);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(4.6, 0.015, 8, 160),
      new THREE.MeshBasicMaterial({ color: 0xf3d07e, transparent: true, opacity: 0.35 })
    );
    ring.rotation.x = Math.PI / 2.35;
    group.add(ico, knot, ring);

    // --- Souris ---
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    let raf = 0;
    let t = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const render = () => {
      t += 0.004;
      tx += (mx - tx) * 0.04;
      ty += (my - ty) * 0.04;
      group.rotation.y = t * 0.22 + tx * 0.22;
      group.rotation.x = ty * 0.12;
      points.rotation.y = -t * 0.1;
      ico.rotation.x = t * 0.6;
      ico.rotation.y = t * 0.4;
      knot.rotation.z = t * 0.5;
      knot.rotation.y = t * 0.3;
      ring.rotation.z = t * 0.15;
      camera.position.x = tx * 0.7;
      camera.position.y = -ty * 0.5;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      pGeo.dispose();
      pMat.dispose();
      ico.geometry.dispose();
      (ico.material as THREE.Material).dispose();
      knot.geometry.dispose();
      (knot.material as THREE.Material).dispose();
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
