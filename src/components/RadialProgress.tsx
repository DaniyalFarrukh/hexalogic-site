import React from 'react'

export default function RadialProgress({ 
  progress, 
  size = 120, 
  strokeWidth = 10,
}: { 
  progress: number
  size?: number
  strokeWidth?: number
  mode?: 'admin' | 'client'
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference
  
  const primaryColor = '#FF7324'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Track — currentColor + opacity so it picks up the existing dark-mode text-color
            override instead of a fixed rgba() that's invisible against a dark background. */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-gray-900 opacity-10"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={primaryColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="transparent"
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{progress}%</span>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Complete</span>
      </div>
    </div>
  )
}
