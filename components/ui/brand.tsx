"use client"

import Link from "next/link"
import { FC } from "react"
import { IconScale, IconGavel } from "@tabler/icons-react"

interface BrandProps {
  theme?: "dark" | "light"
  size?: "sm" | "md" | "lg" | "header"
  showTagline?: boolean
  variant?: "full" | "compact" | "icon-only"
}

export const Brand: FC<BrandProps> = ({
  theme = "dark",
  size = "md",
  showTagline = false,
  variant = "full"
}) => {
  const sizeClasses = {
    header: "text-xl",
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl"
  }

  const iconSizes = {
    header: 24,
    sm: 40,
    md: 60,
    lg: 80
  }

  // Header compact version
  if (variant === "compact" || size === "header") {
    return (
      <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
        <div className="relative">
          <div className="ali-gradient rounded-lg p-2 shadow-md">
            <IconGavel
              size={iconSizes.header}
              className="text-white"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-xl font-bold ali-text-gradient leading-none">
            ALI
          </div>
          <div className="text-xs text-muted-foreground font-medium leading-none">
            Legal AI
          </div>
        </div>
      </Link>
    )
  }

  // Icon only version
  if (variant === "icon-only") {
    return (
      <Link href="/" className="hover:opacity-80 transition-opacity">
        <div className="ali-gradient rounded-lg p-2 shadow-md">
          <IconGavel
            size={iconSizes[size]}
            className="text-white"
          />
        </div>
      </Link>
    )
  }

  // Full version (for hero sections, etc.)
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
