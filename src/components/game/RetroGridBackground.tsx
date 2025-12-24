'use client';

import React from 'react';

const RetroGridBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-background pointer-events-none">
      {/* Fog/Vignette Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-background/80" />
      
      {/* 3D Grid Container */}
      <div 
        className="absolute inset-0 z-0"
        style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
        }}
        >
        {/* Moving Grid Plane */}
        <div 
            className="absolute top-0 left-[-50%] w-[200%] h-[200%] animate-grid-flow"
            style={{
                backgroundSize: '40px 40px',
                backgroundImage: `
                    linear-gradient(to right, rgba(0, 255, 0, 0.2) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0, 255, 0, 0.2) 1px, transparent 1px)
                `,
                transform: 'rotateX(60deg)',
                transformOrigin: '50% 0%',
                boxShadow: '0 0 100px rgba(0, 255, 0, 0.1) inset'
            }}
        />
      </div>
      
      {/* Horizon Glow */}
      <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-primary/10 to-transparent z-0 opacity-20 pointer-events-none" />
    </div>
  );
};

export default RetroGridBackground;
