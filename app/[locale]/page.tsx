"use client"

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
  IconUsers,
  IconTrendingUp,
  IconAward,
  IconSparkles,
  IconFileText,
  IconSearch,
  IconGavel,
  IconChevronRight
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { useTranslation } from "react-i18next"
import Link from "next/link"

export default function HomePage() {
  const { theme } = useTheme()
  const { t } = useTranslation()

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
    },
    {
      icon: IconFileText,
      title: "Revisión de Documentos",
      description: "Análisis automático de contratos y documentos legales con detección de riesgos",
      color: "text-legal-gold"
    },
    {
      icon: IconSearch,
      title: "Búsqueda Avanzada",
      description: "Encuentra precedentes y jurisprudencia relevante en segundos, no en horas",
      color: "text-legal-blue"
    },
    {
      icon: IconGavel,
      title: "Estrategia Legal",
      description: "Desarrolla estrategias legales sólidas basadas en análisis de datos y precedentes",
      color: "text-legal-gold"
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
        "Soporte por email",
        "Plantillas legales básicas"
      ],
      popular: false,
      cta: "Comenzar Prueba"
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
        "Análisis de casos complejos",
        "Soporte prioritario",
        "Integraciones con herramientas legales"
      ],
      popular: true,
      cta: "Más Popular"
    },
    {
      name: "Empresarial",
      price: "$25",
      period: "mes",
      description: "Para grandes firmas y corporaciones",
      features: [
        "Todo lo del plan Profesional",
        "Colaboración en equipo",
        "Integraciones personalizadas",
        "API personalizada",
        "Soporte 24/7",
        "Capacitación personalizada"
      ],
      popular: false,
      cta: "Contactar Ventas"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Brand size="sm" />
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Características
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Precios
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Testimonios
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-legal-blue hover:text-legal-blue/80">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/login">
                <Button className="ali-button-primary">
                  Crear Cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-legal-blue/5 via-transparent to-legal-gold/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="ali-animate-fade-in">
            <Badge className="mb-6 bg-legal-blue/10 text-legal-blue border-legal-blue/20">
              <IconSparkles className="w-4 h-4 mr-2" />
              Potenciado por Inteligencia Artificial
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              El Futuro de la
              <span className="ali-text-gradient block">Práctica Legal</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              ALI revoluciona tu trabajo legal con inteligencia artificial especializada.
              Investiga, redacta y analiza casos con la precisión de un experto y la velocidad de la IA.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 ali-animate-slide-up">
            <Link href="/login">
              <Button size="lg" className="ali-button-primary px-8 py-4 text-lg font-semibold">
                Comenzar Prueba Gratuita
                <IconArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-legal-blue text-legal-blue hover:bg-legal-blue hover:text-white">
                Ver Demo
                <IconChevronRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground ali-animate-fade-in">
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

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Herramientas Diseñadas para
              <span className="ali-text-gradient block">Profesionales Legales</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Cada función de ALI está específicamente diseñada para las necesidades únicas
              de los abogados latinoamericanos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="ali-card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent size={24} />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Planes que se Adaptan a
              <span className="ali-text-gradient block">Tu Práctica Legal</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Desde abogados independientes hasta grandes firmas, tenemos el plan perfecto para ti
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`ali-card relative ${plan.popular ? 'border-legal-blue shadow-2xl scale-105 bg-gradient-to-b from-background to-legal-blue/5' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-legal-gold text-legal-navy px-4 py-1">
                    <IconStar className="w-4 h-4 mr-1" />
                    Más Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-legal-blue">{plan.price}</span>
                    <span className="text-muted-foreground text-lg">/{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <IconCheck className="w-5 h-5 text-legal-blue mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}

                  <div className="pt-6">
                    <Link href="/login">
                      <Button
                        className={`w-full ${plan.popular ? 'ali-button-primary' : 'ali-button-gold'} py-3 text-lg font-semibold`}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              ¿Necesitas un plan personalizado para tu firma?
            </p>
            <Button variant="outline" size="lg" className="border-legal-blue text-legal-blue hover:bg-legal-blue hover:text-white">
              Contactar Ventas Empresariales
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Confiado por Miles de
              <span className="ali-text-gradient block">Profesionales Legales</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubre cómo ALI está transformando la práctica legal en toda Latinoamérica
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="ali-card p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <div className="size-16 bg-legal-blue rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl">
                  MR
                </div>
              </div>
              <blockquote className="text-muted-foreground mb-6 italic text-lg leading-relaxed">
                &ldquo;ALI ha revolucionado mi práctica. Ahora puedo analizar contratos en minutos en lugar de horas. La precisión es impresionante.&rdquo;
              </blockquote>
              <div className="font-semibold text-lg">María Rodríguez</div>
              <div className="text-sm text-muted-foreground">Abogada Corporativa • México DF</div>
            </Card>

            <Card className="ali-card p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <div className="size-16 bg-legal-gold rounded-full mx-auto flex items-center justify-center text-legal-navy font-bold text-xl">
                  JS
                </div>
              </div>
              <blockquote className="text-muted-foreground mb-6 italic text-lg leading-relaxed">
                &ldquo;La investigación jurisprudencial que antes me tomaba días, ahora la hago en horas con ALI. Es como tener un equipo de investigadores.&rdquo;
              </blockquote>
              <div className="font-semibold text-lg">Juan Silva</div>
              <div className="text-sm text-muted-foreground">Socio • Silva & Asociados, Colombia</div>
            </Card>

            <Card className="ali-card p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <div className="size-16 bg-legal-blue rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl">
                  AG
                </div>
              </div>
              <blockquote className="text-muted-foreground mb-6 italic text-lg leading-relaxed">
                &ldquo;Como abogada independiente, ALI es como tener un equipo completo de investigación legal. Indispensable para mi práctica.&rdquo;
              </blockquote>
              <div className="font-semibold text-lg">Ana García</div>
              <div className="text-sm text-muted-foreground">Abogada Independiente • Buenos Aires</div>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="mt-20 bg-gradient-to-r from-legal-blue/10 via-legal-gold/10 to-legal-blue/10 rounded-3xl p-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold ali-text-gradient mb-2">10,000+</div>
                <div className="text-muted-foreground font-medium">Abogados Activos</div>
              </div>
              <div>
                <div className="text-5xl font-bold ali-text-gradient mb-2">500K+</div>
                <div className="text-muted-foreground font-medium">Consultas Procesadas</div>
              </div>
              <div>
                <div className="text-5xl font-bold ali-text-gradient mb-2">95%</div>
                <div className="text-muted-foreground font-medium">Satisfacción</div>
              </div>
              <div>
                <div className="text-5xl font-bold ali-text-gradient mb-2">24/7</div>
                <div className="text-muted-foreground font-medium">Disponibilidad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-legal-blue to-legal-gold">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para Revolucionar tu Práctica Legal?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a miles de abogados que ya están usando ALI para trabajar más inteligentemente,
            no más duro.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/login">
              <Button size="lg" className="bg-white text-legal-blue hover:bg-white/90 px-8 py-4 text-lg font-semibold">
                Comenzar Prueba Gratuita
                <IconArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-legal-blue px-8 py-4 text-lg">
              Agendar Demo
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-white/80">
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

      {/* Footer */}
      <footer className="bg-legal-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <Brand size="sm" />
              <p className="text-white/70 mt-4 max-w-md">
                ALI es el asistente legal inteligente diseñado específicamente para
                profesionales del derecho en Latinoamérica.
              </p>
              <div className="mt-6">
                <p className="text-sm text-white/60">
                  <strong>Aviso Legal:</strong> ALI proporciona información legal general y no constituye
                  asesoramiento legal profesional. Siempre consulta con un abogado calificado.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Producto</h3>
              <ul className="space-y-2 text-white/70">
                <li><a href="#features" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Iniciar Sesión</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Crear Cuenta</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Soporte</h3>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos de Servicio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
            <p>&copy; 2024 ALI - Asistente Legal Inteligente. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
