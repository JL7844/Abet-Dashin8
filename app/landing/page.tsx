'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, Zap, Shield, Clock, Users, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/3 to-accent/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/75 backdrop-blur-xl border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <Image
              src="/dashen-bank-logo.jpg"
              alt="Dashen Bank Logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg object-cover"
            /> */}
            <span className="text-xl font-bold text-foreground">Dashen Bank</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition">
              Benefits
            </Link>
            <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
              Attendance Management <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Reimagined</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Experience the future of employee attendance tracking with biometric face recognition, real-time analytics, and intelligent reporting. Built for modern banking institutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="gap-2">
              <Link href="/auth/sign-up">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/login">View Demo</Link>
            </Button>
          </div>

          {/* Floating Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12">
            <div className="bg-card border border-primary/10 rounded-xl p-4 text-left hover:border-primary/30 transition">
              <Zap className="h-6 w-6 text-primary mb-2" />
              <p className="font-semibold text-sm">Instant Verification</p>
              <p className="text-xs text-muted-foreground mt-1">3-point face scan in seconds</p>
            </div>
            <div className="bg-card border border-primary/10 rounded-xl p-4 text-left hover:border-primary/30 transition">
              <Clock className="h-6 w-6 text-primary mb-2" />
              <p className="font-semibold text-sm">Real-time Tracking</p>
              <p className="text-xs text-muted-foreground mt-1">Live attendance monitoring</p>
            </div>
            <div className="bg-card border border-primary/10 rounded-xl p-4 text-left hover:border-primary/30 transition">
              <BarChart3 className="h-6 w-6 text-primary mb-2" />
              <p className="font-semibold text-sm">Smart Analytics</p>
              <p className="text-xs text-muted-foreground mt-1">Powerful insights & reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-card/30 border-y border-primary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Powerful Features</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need to manage employee attendance with precision and ease
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-primary" />,
                title: 'Biometric Security',
                description: 'Military-grade face recognition technology ensures only authorized personnel check in'
              },
              {
                icon: <Users className="h-8 w-8 text-primary" />,
                title: 'Employee Management',
                description: 'Easily manage employee profiles, departments, and access permissions from one dashboard'
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-primary" />,
                title: 'Advanced Analytics',
                description: 'Get detailed attendance reports, trends, and insights to optimize workforce management'
              },
              {
                icon: <Clock className="h-8 w-8 text-primary" />,
                title: 'Real-time Monitoring',
                description: 'Live attendance feeds and instant notifications for late arrivals or absences'
              },
              {
                icon: <Zap className="h-8 w-8 text-primary" />,
                title: 'Instant Verification',
                description: 'Lightning-fast 3-point face verification with 99.9% accuracy rate'
              },
              {
                icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
                title: 'Illness Tracking',
                description: 'Seamless sick leave management with medical certificate uploads'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-background border border-primary/10 rounded-xl p-6 hover:border-primary/30 transition">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose Dashen Bank AMS?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Transform your attendance management with cutting-edge technology
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {[
              { number: '99.9%', label: 'Accuracy Rate', description: 'With advanced face recognition technology' },
              { number: '2 Sec', label: 'Check-in Time', description: 'Complete verification in seconds' },
              { number: '24/7', label: 'System Uptime', description: 'Reliable cloud-based infrastructure' },
              { number: '100%', label: 'Secure Data', description: 'Enterprise-grade encryption & compliance' }
            ].map((benefit, index) => (
              <div key={index} className="bg-card border border-primary/10 rounded-xl p-8 text-center hover:border-primary/30 transition">
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{benefit.number}</p>
                <h3 className="text-lg font-semibold mb-2">{benefit.label}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-y border-primary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Attendance?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of banking institutions using Dashen Bank&apos;s intelligent attendance management system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="gap-2">
              <Link href="/auth/sign-up">
                Start Your Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="mailto:contact@dashenbank.com">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-card/50 border-t border-primary/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-foreground">Dashen Bank AMS</span>
              </div>
              <p className="text-sm text-muted-foreground">Advanced Attendance Management System</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Updates'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Compliance', 'Cookies'] }
            ].map((col, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-primary/10 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Dashen Bank. All rights reserved. | Made with ❤️ for Ethiopian Banking</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
