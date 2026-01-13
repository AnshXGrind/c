'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Upload,
  Scan,
  Target,
  Map,
  CheckCircle2,
  Shield,
  Users,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const flowSteps = [
  { icon: Upload, label: 'Upload Resume', color: 'from-blue-500 to-cyan-500' },
  { icon: Scan, label: 'AI Analysis', color: 'from-violet-500 to-purple-500' },
  { icon: Target, label: 'Skill Gaps', color: 'from-orange-500 to-red-500' },
  { icon: Map, label: 'Roadmap', color: 'from-green-500 to-emerald-500' },
  { icon: CheckCircle2, label: 'Job Ready', color: 'from-primary to-blue-600' },
]

const trustIndicators = [
  { icon: Shield, label: 'ATS-Optimized' },
  { icon: Users, label: 'Recruiter-Backed' },
  { icon: Sparkles, label: 'AI-Powered' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      
      {/* Animated Background Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container relative py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Sparkles className="mr-2 h-3 w-3" />
              Join 50,000+ professionals advancing their careers
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Transform Your Career with{' '}
            <span className="gradient-text">AI-Powered Guidance</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Get instant AI-powered resume analysis, identify skill gaps, receive personalized learning roadmaps, and compare with recruiter-approved resumes. Everything you need to land your dream job.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/analyze">
              <Button variant="gradient" size="xl" className="group">
                Start Free Analysis
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/compare">
              <Button variant="outline" size="xl">
                View Sample Resumes
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {trustIndicators.map((item, index) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <item.icon className="h-4 w-4 text-primary" />
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Animated Flow */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="relative flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {flowSteps.map((step, index) => (
                <motion.div
                  key={step.label}
                  className="flex items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={`flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}
                      whileHover={{ scale: 1.1 }}
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        y: {
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: index * 0.2,
                        },
                      }}
                    >
                      <step.icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </motion.div>
                    <span className="mt-2 text-xs md:text-sm font-medium text-muted-foreground">
                      {step.label}
                    </span>
                  </div>
                  {index < flowSteps.length - 1 && (
                    <motion.div
                      className="hidden md:block mx-4"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    >
                      <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
