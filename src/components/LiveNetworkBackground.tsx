/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  color: string;
  glowColor: string;
  pulsePhase: number;
  pulseSpeed: number;
  pulseAmount: number;
  isActivated?: boolean;
}

interface DataPacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

export const LiveNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { wallpaperEvent } = useApp();
  const eventRef = useRef(wallpaperEvent);

  useEffect(() => {
    eventRef.current = wallpaperEvent;
  }, [wallpaperEvent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Subtle parallax offset tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.015;
      targetMouseY = (e.clientY - height / 2) * 0.015;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isMobile = width < 768;
    // 45-65 nodes on desktop, 25-35 on mobile for an airy, elegant, uncluttered network
    const nodeCount = isMobile ? 30 : 54;
    const maxDistance = isMobile ? 95 : 120;

    // Palette matching the reference: predominantly cyan & electric blue, subtle purple, occasional emerald / amber
    const colorPalette = [
      { fill: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)' }, // Cyan
      { fill: '#38bdf8', glow: 'rgba(56, 189, 248, 0.35)' }, // Sky Blue
      { fill: '#60a5fa', glow: 'rgba(96, 165, 250, 0.3)' }, // Electric Blue
      { fill: '#818cf8', glow: 'rgba(129, 140, 248, 0.3)' }, // Indigo
      { fill: '#a855f7', glow: 'rgba(168, 85, 247, 0.35)' }, // Purple
      { fill: '#34d399', glow: 'rgba(52, 211, 153, 0.35)' }, // Occasional Emerald
      { fill: '#fbbf24', glow: 'rgba(251, 191, 36, 0.35)' }, // Occasional Amber
    ];

    // Initialize nodes naturally across empty space
    const nodes: Node[] = Array.from({ length: nodeCount }, () => {
      const colorObj = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        // Extremely slow, organic floating movement
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 1.4 + 1.2, // Tiny delicate dots
        baseAlpha: Math.random() * 0.35 + 0.45,
        color: colorObj.fill,
        glowColor: colorObj.glow,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.015,
        pulseAmount: Math.random() * 0.25 + 0.1,
      };
    });

    // 4-6 occasional tiny data particles traveling along connections
    const dataPackets: DataPacket[] = Array.from({ length: isMobile ? 3 : 5 }, () => ({
      fromIndex: Math.floor(Math.random() * nodeCount),
      toIndex: Math.floor(Math.random() * nodeCount),
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.003, // Slow and smooth
      color: Math.random() > 0.4 ? '#00f0ff' : '#818cf8',
      size: 1.5,
    }));

    // Find nearest neighbor for data packet re-routing
    const assignNewPath = (packet: DataPacket) => {
      const validTargets: number[] = [];
      const fromNode = nodes[packet.fromIndex];
      for (let j = 0; j < nodeCount; j++) {
        if (j === packet.fromIndex) continue;
        const dx = fromNode.x - nodes[j].x;
        const dy = fromNode.y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= maxDistance) {
          validTargets.push(j);
        }
      }

      if (validTargets.length > 0) {
        packet.toIndex = validTargets[Math.floor(Math.random() * validTargets.length)];
      } else {
        packet.fromIndex = Math.floor(Math.random() * nodeCount);
        packet.toIndex = (packet.fromIndex + 1) % nodeCount;
      }
      packet.progress = 0;
      packet.speed = 0.003 + Math.random() * 0.003;
      packet.color = Math.random() > 0.4 ? '#00f0ff' : '#818cf8';
    };

    let pulseGlowRadius = 0;
    let pulseGlowAlpha = 0;
    let lastProcessedTimestamp = 0;

    const render = () => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Check for incoming feedback submission event
      if (
        eventRef.current.type === 'feedback_submitted' &&
        eventRef.current.timestamp !== lastProcessedTimestamp
      ) {
        lastProcessedTimestamp = eventRef.current.timestamp;
        pulseGlowRadius = 10;
        pulseGlowAlpha = 0.35;

        // Light up a few nearby nodes gently
        nodes.forEach((n, idx) => {
          if (idx % 4 === 0) {
            n.pulsePhase = Math.PI / 2;
            n.pulseAmount = 0.45;
          }
        });

        // Boost data packet speed briefly
        dataPackets.forEach((p) => {
          p.speed = 0.008;
        });
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      ctx.save();
      ctx.translate(currentMouseX, currentMouseY);

      // Render subtle expanding cyan glow on feedback submission
      if (pulseGlowAlpha > 0.01) {
        pulseGlowRadius += 3.5;
        pulseGlowAlpha *= 0.96;

        const grad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          pulseGlowRadius
        );
        grad.addColorStop(0, `rgba(0, 240, 255, ${pulseGlowAlpha * 0.25})`);
        grad.addColorStop(0.5, `rgba(56, 189, 248, ${pulseGlowAlpha * 0.12})`);
        grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, pulseGlowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 1. Update and move nodes very slowly & organically
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += node.pulseSpeed;

        // Gentle soft boundary bounce with organic padding
        if (node.x <= 20) {
          node.x = 20;
          node.vx = Math.abs(node.vx);
        } else if (node.x >= width - 20) {
          node.x = width - 20;
          node.vx = -Math.abs(node.vx);
        }

        if (node.y <= 20) {
          node.y = 20;
          node.vy = Math.abs(node.vy);
        } else if (node.y >= height - 20) {
          node.y = height - 20;
          node.vy = -Math.abs(node.vy);
        }
      }

      // 2. Draw extremely thin, low-opacity connecting lines between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        let connectionCount = 0;

        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Only connect nearby nodes (maximum 3 links per node to avoid visual clutter)
          if (dist < maxDistance && connectionCount < 3) {
            connectionCount++;
            const lineAlpha = (1 - dist / maxDistance) * 0.12;

            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);

            // Subtle cyan / electric blue tinted hairline
            ctx.strokeStyle = '#00f0ff';
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      // 3. Render occasional tiny glowing data particles traveling along connections
      for (let i = 0; i < dataPackets.length; i++) {
        const p = dataPackets[i];
        const n1 = nodes[p.fromIndex];
        const n2 = nodes[p.toIndex];

        if (!n1 || !n2) continue;

        p.progress += p.speed;
        if (p.progress >= 1) {
          p.fromIndex = p.toIndex;
          assignNewPath(p);
          continue;
        }

        const px = n1.x + (n2.x - n1.x) * p.progress;
        const py = n1.y + (n2.y - n1.y) * p.progress;

        // Particle glow
        ctx.beginPath();
        ctx.arc(px, py, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.25;
        ctx.fill();

        // Particle core
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.9;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Render nodes: crisp tiny center dot + soft, low-intensity outer glow
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulse = Math.sin(node.pulsePhase) * node.pulseAmount;
        const currentAlpha = Math.max(0.2, Math.min(0.9, node.baseAlpha + pulse));
        const currentRadius = node.radius + pulse * 0.4;

        // Subtle soft outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = node.glowColor;
        ctx.globalAlpha = currentAlpha * 0.35;
        ctx.fill();

        // Crisp central dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 bg-[#02060B]"
      aria-hidden="true"
    >
      {/* Very faint, dark technological atmosphere gradient (subtle and dark, leaving lots of empty space) */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 15%, rgba(6, 182, 212, 0.04) 0%, transparent 45%),
            radial-gradient(circle at 90% 85%, rgba(99, 102, 241, 0.04) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(2, 6, 11, 0) 0%, #02060B 100%)
          `,
        }}
      />

      {/* HTML5 Canvas rendering the minimal, clean glowing network */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};
