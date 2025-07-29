"use client"

import { Brand } from "@/components/ui/brand"
import { Button } from "@/components/ui/button"
import { IconArrowRight, IconScale, IconShield, IconBrain } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { useTranslation } from "react-i18next"
import Link from "next/link"

export default function HomePage() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <div className="flex size-full flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Hero Section */}
        <div className="ali-animate-fade-in">
          <Brand size="lg" showTagline={true} />
        </div>

        <div className="mt-8 ali-animate-slide-up">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            El Asistente Legal más Avanzado para Profesionales del Derecho
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Potencia tu práctica legal con inteligencia artificial especializada.
            ALI te ayuda con investigación jurídica, redacción de documentos y análisis de casos.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 ali-animate-scale-in">
          <div className="ali-card p-6">
            <IconScale className="w-12 h-12 text-legal-blue mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Investigación Jurídica</h3>
            <p className="text-sm text-muted-foreground">
              Análisis profundo de jurisprudencia y normativa actualizada
            </p>
          </div>
          <div className="ali-card p-6">
            <IconBrain className="w-12 h-12 text-legal-gold mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Redacción Inteligente</h3>
            <p className="text-sm text-muted-foreground">
              Asistencia en la creación de contratos, demandas y escritos
            </p>
          </div>
          <div className="ali-card p-6">
            <IconShield className="w-12 h-12 text-legal-blue mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Análisis de Casos</h3>
            <p className="text-sm text-muted-foreground">
              Evaluación estratégica y identificación de precedentes relevantes
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center ali-animate-slide-up">
          <Link href="/login">
            <Button className="ali-button-primary px-8 py-3 text-lg">
              Comenzar Ahora
              <IconArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" className="px-8 py-3 text-lg border-legal-blue text-legal-blue hover:bg-legal-blue hover:text-white">
              Ver Planes
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          Desde $2/mes • Especializado para abogados latinoamericanos
        </div>

        {/* Testimonials Section */}
        <div className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Lo que dicen nuestros usuarios</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="ali-card p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-legal-blue rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl">
                  MR
                </div>
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "ALI ha revolucionado mi práctica. Ahora puedo analizar contratos en minutos en lugar de horas."
              </p>
              <div className="font-semibold">María Rodríguez</div>
              <div className="text-sm text-muted-foreground">Abogada Corporativa, México</div>
            </div>

            <div className="ali-card p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-legal-gold rounded-full mx-auto flex items-center justify-center text-legal-navy font-bold text-xl">
                  JS
                </div>
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "La investigación jurisprudencial que antes me tomaba días, ahora la hago en horas con ALI."
              </p>
              <div className="font-semibold">Juan Silva</div>
              <div className="text-sm text-muted-foreground">Socio, Estudio Jurídico, Colombia</div>
            </div>

            <div className="ali-card p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-legal-blue rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl">
                  AG
                </div>
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "Como abogada independiente, ALI es como tener un equipo completo de investigación legal."
              </p>
              <div className="font-semibold">Ana García</div>
              <div className="text-sm text-muted-foreground">Abogada Independiente, Argentina</div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-legal-blue/5 rounded-2xl p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-legal-blue mb-2">10,000+</div>
              <div className="text-muted-foreground">Abogados activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-legal-blue mb-2">500,000+</div>
              <div className="text-muted-foreground">Consultas procesadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-legal-blue mb-2">95%</div>
              <div className="text-muted-foreground">Satisfacción del cliente</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-legal-blue mb-2">24/7</div>
              <div className="text-muted-foreground">Disponibilidad</div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-16 p-6 bg-muted/30 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Aviso Legal:</strong> {t("This AI assistant provides general legal information and should not replace professional legal advice")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("Always consult with a qualified attorney for specific legal matters")}
          </p>
        </div>
      </div>
    </div>
  )
}
