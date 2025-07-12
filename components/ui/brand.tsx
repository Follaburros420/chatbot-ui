"use client"

import Link from "next/link"
import { FC } from "react"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  return (
    <Link
      className="flex cursor-pointer flex-col items-center hover:opacity-50"
      href="https://www.abogados.aprenderia.site"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="mb-2">
        <img src="/justice-logo.png" alt="Justice Logo" style={{ width: 60, height: 60 }} />
      </div>

      <div className="text-4xl font-bold tracking-wide">ALI</div>
    </Link>
  )
}
