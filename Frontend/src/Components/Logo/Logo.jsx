import React from 'react'
import './Logo.css'

export default function Logo({ size = 32, showText = true, textSize = 22, className = '' }) {
    return (
        <div className={`checkwork-logo-wrapper ${className}`} style={{ gap: size * 0.35 }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="checkwork-logo-svg"
            >
                <defs>
                    <linearGradient id="logo-box-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#9333ea" />
                        <stop offset="35%" stop-color="#7c3aed" />
                        <stop offset="70%" stop-color="#3b82f6" />
                        <stop offset="100%" stop-color="#06b6d4" />
                    </linearGradient>

                    <linearGradient id="logo-check-grad" x1="0%" y1="85%" x2="100%" y2="15%">
                        <stop offset="0%" stop-color="#a855f7" />
                        <stop offset="35%" stop-color="#6366f1" />
                        <stop offset="70%" stop-color="#0ea5e9" />
                        <stop offset="100%" stop-color="#00f2fe" />
                    </linearGradient>

                    <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#8b5cf6" floodOpacity="0.45" />
                    </filter>
                </defs>

                <g filter="url(#logo-glow)">
                    {/* Marco redondeado con corte superior derecho */}
                    <path
                        d="M 64 22 H 36 C 24 22 15 31 15 43 V 77 C 15 89 24 98 36 98 H 70 C 82 98 91 89 91 77 V 52"
                        fill="none"
                        stroke="url(#logo-box-grad)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Checkmark neón */}
                    <path
                        d="M 32 58 L 50 76 L 99 26"
                        fill="none"
                        stroke="url(#logo-check-grad)"
                        strokeWidth="13"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </svg>

            {showText && (
                <span className="checkwork-logo-text" style={{ fontSize: `${textSize}px` }}>
                    <span className="checkwork-text-check">Check</span>
                    <span className="checkwork-text-work">Work</span>
                </span>
            )}
        </div>
    )
}
