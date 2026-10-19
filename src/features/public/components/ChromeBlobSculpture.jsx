import React from 'react'

/**
 * Escultura metálica orgánica 3D estilo cromo / oro rosa irisado
 * Inspirada fielmente en el elemento 3D de la imagen de referencia (Image 1)
 */
export const ChromeBlobSculpture = ({ className = 'w-12 h-12', animated = true }) => {
  return (
    <div className={`relative shrink-0 select-none ${animated ? 'animate-float-slow' : ''} ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_12px_20px_rgba(139,92,246,0.22)]"
      >
        <defs>
          {/* Gradiente principal irisado: rosa dorado, violeta suave y cromo */}
          <linearGradient id="chromeGradient" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#f5d0c5" />
            <stop offset="25%" stopColor="#e3a7b8" />
            <stop offset="50%" stopColor="#c5a3d9" />
            <stop offset="75%" stopColor="#9a81bf" />
            <stop offset="100%" stopColor="#e0b8ab" />
          </linearGradient>

          {/* Brillo especular cromo */}
          <linearGradient id="specularGlow" x1="20%" y1="0%" x2="50%" y2="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Sombra de oclusión interna */}
          <radialGradient id="innerShadow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#54376e" stopOpacity="0" />
            <stop offset="100%" stopColor="#3d2157" stopOpacity="0.45" />
          </radialGradient>

          {/* Reflejo metálico secundario */}
          <linearGradient id="rimLight" x1="80%" y1="80%" x2="40%" y2="30%">
            <stop offset="0%" stopColor="#ffd8cb" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7a559e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Forma toroide / bucle orgánico fluido */}
        <path
          d="M 80 20 
             C 115 20, 142 45, 142 80 
             C 142 110, 118 138, 85 140 
             C 50 142, 20 120, 18 85 
             C 16 52, 45 20, 80 20 Z
             M 78 52 
             C 60 52, 48 68, 50 86 
             C 52 102, 68 112, 84 110 
             C 100 108, 112 94, 110 78 
             C 108 62, 94 52, 78 52 Z"
          fill="url(#chromeGradient)"
          fillRule="evenodd"
        />

        {/* Capa de oclusión interna */}
        <path
          d="M 80 20 
             C 115 20, 142 45, 142 80 
             C 142 110, 118 138, 85 140 
             C 50 142, 20 120, 18 85 
             C 16 52, 45 20, 80 20 Z
             M 78 52 
             C 60 52, 48 68, 50 86 
             C 52 102, 68 112, 84 110 
             C 100 108, 112 94, 110 78 
             C 108 62, 94 52, 78 52 Z"
          fill="url(#innerShadow)"
          fillRule="evenodd"
        />

        {/* Brillos especulares curvos en relieve */}
        <ellipse cx="60" cy="40" rx="22" ry="9" transform="rotate(-25 60 40)" fill="url(#specularGlow)" />
        <ellipse cx="120" cy="95" rx="16" ry="7" transform="rotate(45 120 95)" fill="url(#rimLight)" />
        <ellipse cx="40" cy="90" rx="12" ry="5" transform="rotate(70 40 90)" fill="url(#specularGlow)" />
        <circle cx="85" cy="30" r="4" fill="#ffffff" opacity="0.9" />
      </svg>
    </div>
  )
}

export default ChromeBlobSculpture
