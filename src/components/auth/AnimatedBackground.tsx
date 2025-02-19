
import React from "react";

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-[10px] opacity-50">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"
          style={{
            animation: 'fadeInAndScale 1s ease-out forwards, pulseGlow 3s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[80px]"
          style={{
            animation: 'fadeInAndFloat 1.2s ease-out forwards, floatAnimation 4s ease-in-out infinite',
            animationDelay: '0.3s'
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[90px]"
          style={{
            animation: 'fadeInAndRotate 1.5s ease-out forwards, rotateGlow 5s linear infinite',
            animationDelay: '0.6s'
          }}
        ></div>
      </div>
      <style>
        {`
          @keyframes fadeInAndScale {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
          }
          @keyframes fadeInAndFloat {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 0.5; transform: translateY(0); }
          }
          @keyframes floatAnimation {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes fadeInAndRotate {
            0% { opacity: 0; transform: rotate(0deg); }
            100% { opacity: 0.5; transform: rotate(360deg); }
          }
          @keyframes rotateGlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};
