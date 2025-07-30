"use client"

import { useState } from "react"
import { Brand } from "@/components/ui/brand"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  IconArrowRight,
  IconScale,
  IconShield,
  IconBrain,
  IconCheck,
  IconStar,
  IconSparkles,
  IconFileText,
  IconSearch,
  IconGavel,
  IconMenu,
  IconX,
  IconMessageCircle,
  IconRocket
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { useTranslation } from "react-i18next"
import Link from "next/link"

export default function HomePage() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: IconScale,
      title: "Investigación Jurídica",
      description: "Análisis profundo de jurisprudencia y normativa actualizada con IA especializada",
      color: "text-legal-blue"
    },
    {
      icon: IconBrain,
      title: "Redacción Inteligente",
      description: "Asistencia en la creación de contratos, demandas y escritos legales profesionales",
      color: "text-legal-gold"
    },
    {
      icon: IconShield,
      title: "Análisis de Casos",
      description: "Evaluación estratégica y identificación de precedentes relevantes para tu caso",
      color: "text-legal-blue"
    }
  ]

  const plans = [
    {
      name: "Básico",
      price: "$2",
      period: "mes",
      description: "Perfecto para abogados independientes",
      features: [
        "50 consultas mensuales",
        "Análisis básico de documentos",
        "Búsqueda de jurisprudencia",
        "Soporte por email"
      ],
      popular: false
    },
    {
      name: "Profesional",
      price: "$8",
      period: "mes",
      description: "Ideal para estudios jurídicos pequeños",
      features: [
        "Consultas ilimitadas",
        "Análisis avanzado de documentos",
        "Redacción asistida de contratos",
        "Soporte prioritario"
      ],
      popular: true
    },
    {
      name: "Empresarial",
      price: "$25",
      period: "mes",
      description: "Para grandes firmas y corporaciones",
      features: [
        "Todo lo del plan Profesional",
        "Colaboración en equipo",
        "API personalizada",
        "Soporte 24/7"
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Enhanced Mobile-Optimized Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Brand variant="compact" />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-legal-blue transition-colors relative group">
                Características
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-legal-blue transition-all group-hover:w-full"></span>
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-legal-blue transition-colors relative group">
                Precios
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-legal-blue transition-all group-hover:w-full"></span>
              </a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-legal-blue transition-colors relative group">
                Testimonios
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-legal-blue transition-all group-hover:w-full"></span>
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/es/login">
                <Button variant="ghost" size="sm" className="text-legal-blue hover:text-legal-blue/80 hover:bg-legal-blue/10 font-medium">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/es/login">
                <Button size="sm" className="ali-button-primary font-medium shadow-md hover:shadow-lg">
                  Crear Cuenta
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <IconX size={22} /> : <IconMenu size={22} />}
            </button>
          </div>

          {/* Enhanced Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/40 bg-background/98 backdrop-blur-sm">
              <div className="flex flex-col space-y-1">
                <a
                  href="#features"
                  className="text-sm font-medium text-muted-foreground hover:text-legal-blue hover:bg-legal-blue/5 transition-colors py-3 px-2 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Características
                </a>
                <a
                  href="#pricing"
                  className="text-sm font-medium text-muted-foreground hover:text-legal-blue hover:bg-legal-blue/5 transition-colors py-3 px-2 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Precios
                </a>
                <a
                  href="#testimonials"
                  className="text-sm font-medium text-muted-foreground hover:text-legal-blue hover:bg-legal-blue/5 transition-colors py-3 px-2 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonios
                </a>
                <div className="flex flex-col space-y-3 pt-4 mt-2 border-t border-border/40">
                  <Link href="/es/login">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-legal-blue hover:bg-legal-blue/10 font-medium">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/es/login">
                    <Button size="sm" className="w-full ali-button-primary font-medium">
                      Crear Cuenta
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Mobile Optimized */}
      <section className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-legal-blue/5 via-transparent to-legal-gold/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="ali-animate-fade-in">
            <Badge className="mb-4 sm:mb-6 bg-legal-blue/10 text-legal-blue border-legal-blue/20">
              <IconSparkles className="w-4 h-4 mr-2" />
              Potenciado por IA
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              El Futuro de la
              <span className="ali-text-gradient block">Práctica Legal</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              ALI revoluciona tu trabajo legal con inteligencia artificial especializada.
              Investiga, redacta y analiza casos con precisión y velocidad.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 ali-animate-slide-up px-4">
            <Link href="/es/login">
              <Button size="lg" className="w-full sm:w-auto ali-button-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl">
                Comenzar Prueba Gratuita
                <IconArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-legal-blue text-legal-blue hover:bg-legal-blue hover:text-white shadow-md hover:shadow-lg">
                Ver Planes
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-muted-foreground ali-animate-fade-in">
            <div className="flex items-center">
              <IconCheck className="w-4 h-4 text-green-500 mr-2" />
              Sin tarjeta de crédito
            </div>
            <div className="flex items-center">
              <IconCheck className="w-4 h-4 text-green-500 mr-2" />
              Configuración en 2 minutos
            </div>
            <div className="flex items-center">
              <IconCheck className="w-4 h-4 text-green-500 mr-2" />
              Soporte en español
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      <section id="features" className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Herramientas Diseñadas para
              <span className="ali-text-gradient block">Profesionales Legales</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Cada función de ALI está específicamente diseñada para las necesidades únicas
              de los abogados latinoamericanos
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="ali-card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted flex items-center justify-center mb-3 sm:mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section - Mobile Optimized */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Planes que se Adaptan a
              <span className="ali-text-gradient block">Tu Práctica Legal</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Desde abogados independientes hasta grandes firmas, tenemos el plan perfecto para ti
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`ali-card relative ${plan.popular ? 'border-legal-blue shadow-2xl md:scale-105 bg-gradient-to-b from-background to-legal-blue/5' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-legal-gold text-legal-navy px-3 py-1 text-xs sm:px-4 sm:py-1 sm:text-sm">
                    <IconStar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Más Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-6 sm:pb-8">
                  <CardTitle className="text-xl sm:text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                    {plan.description}
                  </CardDescription>
                  <div className="mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-legal-blue">{plan.price}</span>
                    <span className="text-muted-foreground text-base sm:text-lg">/{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <IconCheck className="w-4 h-4 sm:w-5 sm:h-5 text-legal-blue mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </div>
                  ))}

                  <div className="pt-4 sm:pt-6">
                    <Link href="/es/login">
                      <Button
                        className={`w-full ${plan.popular ? 'ali-button-primary shadow-lg hover:shadow-xl' : 'ali-button-gold shadow-md hover:shadow-lg'} py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold transition-all duration-200`}
                        size="lg"
                      >
                        {plan.popular ? 'Comenzar Ahora' : 'Seleccionar Plan'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
              ¿Necesitas un plan personalizado para tu firma?
            </p>
            <Button variant="outline" size="lg" className="border-legal-blue text-legal-blue hover:bg-legal-blue hover:text-white text-sm sm:text-base">
              Contactar Ventas Empresariales
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Confiado por Miles de
              <span className="ali-text-gradient block">Profesionales Legales</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Descubre cómo ALI está transformando la práctica legal en toda Latinoamérica
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="ali-card p-4 sm:p-6 lg:p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-legal-blue rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                  MR
                </div>
              </div>
              <blockquote className="text-muted-foreground mb-4 sm:mb-6 italic text-sm sm:text-base lg:text-lg leading-relaxed">
                &ldquo;ALI ha revolucionado mi práctica. Ahora puedo analizar contratos en minutos en lugar de horas. La precisión es impresionante.&rdquo;
              </blockquote>
              <div className="font-semibold text-base sm:text-lg">María Rodríguez</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Abogada Corporativa • México DF</div>
            </Card>

            <Card className="ali-card p-4 sm:p-6 lg:p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-legal-gold rounded-full mx-auto flex items-center justify-center text-legal-navy font-bold text-lg sm:text-xl">
                  JS
                </div>
              </div>
              <blockquote className="text-muted-foreground mb-4 sm:mb-6 italic text-sm sm:text-base lg:text-lg leading-relaxed">
                &ldquo;La investigación jurisprudencial que antes me tomaba días, ahora la hago en horas con ALI. Es como tener un equipo de investigadores.&rdquo;
              </blockquote>
              <div className="font-semibold text-base sm:text-lg">Juan Silva</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Socio • Silva & Asociados, Colombia</div>
            </Card>

            <Card className="ali-card p-4 sm:p-6 lg:p-8 text-center hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-legal-blue rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                  AG
                </div>
              </div>
              <blockquote className="text-muted-foreground mb-4 sm:mb-6 italic text-sm sm:text-base lg:text-lg leading-relaxed">
                &ldquo;Como abogada independiente, ALI es como tener un equipo completo de investigación legal. Indispensable para mi práctica.&rdquo;
              </blockquote>
              <div className="font-semibold text-base sm:text-lg">Ana García</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Abogada Independiente • Buenos Aires</div>
            </Card>
          </div>

          {/* Stats Section - Mobile Optimized */}
          <div className="mt-12 sm:mt-16 lg:mt-20 bg-gradient-to-r from-legal-blue/10 via-legal-gold/10 to-legal-blue/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold ali-text-gradient mb-1 sm:mb-2">10K+</div>
                <div className="text-muted-foreground font-medium text-xs sm:text-sm lg:text-base">Abogados Activos</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold ali-text-gradient mb-1 sm:mb-2">500K+</div>
                <div className="text-muted-foreground font-medium text-xs sm:text-sm lg:text-base">Consultas Procesadas</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold ali-text-gradient mb-1 sm:mb-2">95%</div>
                <div className="text-muted-foreground font-medium text-xs sm:text-sm lg:text-base">Satisfacción</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold ali-text-gradient mb-1 sm:mb-2">24/7</div>
                <div className="text-muted-foreground font-medium text-xs sm:text-sm lg:text-base">Disponibilidad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-legal-blue to-legal-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            ¿Listo para Revolucionar tu Práctica Legal?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Únete a miles de abogados que ya están usando ALI para trabajar más inteligentemente,
            no más duro.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
            <Link href="/es/login">
              <Button size="lg" className="w-full sm:w-auto bg-white text-legal-blue hover:bg-white/90 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl">
                Comenzar Prueba Gratuita
                <IconArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-legal-blue px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-md hover:shadow-lg">
              Agendar Demo
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-white/80">
            <div className="flex items-center">
              <IconCheck className="w-4 h-4 mr-2" />
              Prueba de 14 días gratis
            </div>
            <div className="flex items-center">
              <IconCheck className="w-4 h-4 mr-2" />
              Sin compromiso
            </div>
            <div className="flex items-center">
              <IconCheck className="w-4 h-4 mr-2" />
              Cancela cuando quieras
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer - Mobile Optimized */}
      <footer className="bg-legal-navy text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-4">
                <Brand variant="compact" />
              </div>
              <p className="text-white/70 mt-3 sm:mt-4 max-w-md text-sm sm:text-base leading-relaxed">
                ALI es el asistente legal inteligente diseñado específicamente para
                profesionales del derecho en Latinoamérica. Potencia tu práctica legal con IA.
              </p>
              <div className="mt-4 sm:mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  <strong className="text-legal-gold">Aviso Legal:</strong> ALI proporciona información legal general y no constituye
                  asesoramiento legal profesional. Siempre consulta con un abogado calificado para asuntos específicos.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-legal-gold">Producto</h3>
              <ul className="space-y-3 text-white/70 text-sm sm:text-base">
                <li>
                  <a href="#features" className="hover:text-legal-gold transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-legal-gold rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Características
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-legal-gold transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-legal-gold rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Precios
                  </a>
                </li>
                <li>
                  <a href="/es/login" className="hover:text-legal-gold transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-legal-gold rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Iniciar Sesión
                  </a>
                </li>
                <li>
                  <a href="/es/login" className="hover:text-legal-gold transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-legal-gold rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Crear Cuenta
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-legal-gold">Soporte</h3>
              <ul className="space-y-3 text-white/70 text-sm sm:text-base">
                <li>
                  <a href="mailto:soporte@ali-legal.com" className="hover:text-legal-gold transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-legal-gold rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="mailto:contacto@ali-legal.com" className="hover:text-legal-gold transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-legal-gold rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="/terminos" className="hover:text-legal-gold transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-legal-gold rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Términos de Servicio
                  </a>
                </li>
                <li>
                  <a href="/privacidad" className="hover:text-legal-gold transition-colors flex items-center group">
                    <span className="w-1 h-1 bg-legal-gold rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Política de Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 sm:mt-12 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <p className="text-white/60 text-xs sm:text-sm">
                  &copy; 2024 ALI - Asistente Legal Inteligente. Todos los derechos reservados.
                </p>
                <p className="text-white/40 text-xs mt-1">
                  Desarrollado con ❤️ para abogados latinoamericanos
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-white/40 text-xs">Síguenos:</span>
                <div className="flex space-x-3">
                  <a href="#" className="text-white/60 hover:text-legal-gold transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-white/60 hover:text-legal-gold transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button - Direct Access */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/es/chat">
          <Button
            size="lg"
            className="ali-button-primary rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group"
            title="Acceso directo al chatbot ALI"
          >
            <div className="relative">
              <IconMessageCircle size={28} className="group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-legal-gold rounded-full animate-pulse"></div>
            </div>
          </Button>
        </Link>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-legal-navy text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Chatbot ALI - Acceso Directo
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-legal-navy"></div>
        </div>
      </div>

      {/* Emergency Access Button for Development */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link href="/es/chat">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm border-legal-blue text-legal-blue hover:bg-legal-blue hover:text-white shadow-lg transition-all duration-200"
          >
            <IconRocket size={16} className="mr-2" />
            Chat Directo
          </Button>
        </Link>
      </div>
    </div>
  )
}
