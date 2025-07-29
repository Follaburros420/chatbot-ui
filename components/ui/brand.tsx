"use client"

import Link from "next/link"
import { FC } from "react"
import { IconScale } from "@tabler/icons-react"

interface BrandProps {
  theme?: "dark" | "light"
  size?: "sm" | "md" | "lg"
  showTagline?: boolean
}

export const Brand: FC<BrandProps> = ({
  theme = "dark",
  size = "md",
  showTagline = false
}) => {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl"
  }

  const iconSizes = {
    sm: 40,
    md: 60,
    lg: 80
  }

  return (
    <div className="flex cursor-pointer flex-col items-center ali-animate-fade-in">
      <div className="mb-2 relative">
        <div className="ali-gradient rounded-full p-3 shadow-lg">
          <IconScale
            size={iconSizes[size]}
            className="text-white drop-shadow-sm"
          />
        </div>
      </div>

      <div className={`${sizeClasses[size]} font-bold tracking-wide ali-text-gradient mb-1`}>
        ALI
      </div>

      {showTagline && (
        <div className="text-sm text-legal-gray font-medium tracking-wide">
          Asistente Legal Inteligente
        </div>
      )}

      <div className="text-xs text-muted-foreground mt-1 font-light">
        Para Profesionales del Derecho
      </div>
    </div>
  )
}
