import React, { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

export const AnimatedAuthBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate lightweight random glowing particles
  useEffect(() => {
    const colors = [
      'rgba(99, 102, 241, 0.7)',  // Indigo
      'rgba(168, 85, 247, 0.7)',  // Purple
      'rgba(236, 72, 153, 0.7)',  // Pink
      'rgba(6, 182, 212, 0.7)',   // Cyan
      'rgba(59, 130, 246, 0.7)',  // Electric Blue
    ];

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 12 : 24;

    const generated: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: colors[i % colors.length],
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 3,
    }));

    setParticles(generated);
  }, []);

  // Subtle mouse tracking for desktop interactive floating response
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 px-4 py-8 sm:py-12"
    >
      {/* Animated Multi-Color Mesh Gradient Canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.4),rgba(255,255,255,0))]" />

      {/* 4 Large Moving Blurred Gradient Blobs */}
      {/* 1. Electric Blue Blob */}
      <div
        style={{
          transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`,
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] min-w-[320px] min-h-[320px] rounded-full bg-gradient-to-br from-blue-600/45 to-cyan-400/35 blur-[120px] animate-blob-1 pointer-events-none"
      />

      {/* 2. Deep Purple / Violet Blob */}
      <div
        style={{
          transform: `translate(${-mousePos.x * 0.6}px, ${-mousePos.y * 0.6}px)`,
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] min-w-[350px] min-h-[350px] rounded-full bg-gradient-to-tr from-purple-700/40 to-indigo-500/40 blur-[130px] animate-blob-2 pointer-events-none"
      />

      {/* 3. Pink / Magenta Blob */}
      <div
        style={{
          transform: `translate(${mousePos.x * 0.5}px, ${-mousePos.y * 0.5}px)`,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-[30%] right-[10%] w-[35vw] h-[35vw] min-w-[280px] min-h-[280px] rounded-full bg-gradient-to-bl from-pink-500/35 to-rose-400/25 blur-[110px] animate-blob-3 pointer-events-none"
      />

      {/* 4. Cyan / Turquoise Blob */}
      <div
        style={{
          transform: `translate(${-mousePos.x * 0.7}px, ${mousePos.y * 0.7}px)`,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute bottom-[20%] left-[5%] w-[40vw] h-[40vw] min-w-[300px] min-h-[300px] rounded-full bg-gradient-to-tr from-cyan-500/35 to-teal-400/25 blur-[115px] animate-blob-4 pointer-events-none"
      />

      {/* Floating Glowing Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 12px ${p.color}`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              transform: `translate(${mousePos.x * (p.size * 0.1)}px, ${mousePos.y * (p.size * 0.1)}px)`,
            }}
            className="absolute rounded-full animate-particle"
          />
        ))}
      </div>

      {/* Subtle Glowing Rotating Circular Ring Behind Auth Card */}
      <div className="absolute z-0 pointer-events-none w-[520px] h-[520px] rounded-full border border-indigo-400/20 shadow-[0_0_60px_rgba(99,102,241,0.15)] animate-rotate-slow flex items-center justify-center">
        {/* Orbiting glowing dots */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6]" />
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
      </div>

      {/* Secondary Inner Subtle Dashed Ring */}
      <div className="absolute z-0 pointer-events-none w-[440px] h-[440px] rounded-full border border-dashed border-purple-400/15 animate-rotate-slow [animation-direction:reverse]" />

      {/* Content wrapper */}
      <div className="relative z-10 w-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
};
