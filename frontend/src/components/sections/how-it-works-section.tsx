'use client'

import { motion } from 'framer-motion'
import {
  Upload,
  Sparkles,
  Target,
  GraduationCap,
  Briefcase,
  ArrowDown,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Resume',
    description:
      'Simply drag and drop your resume (PDF or DOCX). Our system securely processes your document in seconds.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Analyzes Everything',
    description:
      'Our advanced AI scans your resume for ATS compatibility, keywords, formatting, and content quality.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    number: '03',
    icon: Target,
    title: 'Discover Your Gaps',
    description:
      'See exactly which skills you\'re missing, what recruiters are looking for, and where you need to improve.',
    color: 'from-orange-500 to-red-500',
  },
  {
    number: '04',
    icon: GraduationCap,
    title: 'Get Your Roadmap',
    description:
      'Receive a personalized learning plan with courses, projects, and certifications to close your skill gaps.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    number: '05',
    icon: Briefcase,
    title: 'Become Job-Ready',
    description:
      'Apply with confidence knowing your resume is optimized and your skills match what recruiters want.',
    color: 'from-pink-500 to-rose-500',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              From Upload to <span className="gradient-text">Job-Ready</span> in
              5 Steps
            </h2>
            <p className="text-lg text-muted-foreground">
              Our streamlined process helps you understand your resume&apos;s
              weaknesses and fix them fast.
            </p>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-violet-500 to-green-500 hidden md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className={`relative flex items-center gap-8 mb-12 last:mb-0 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Content Card */}
              <div
                className={`flex-1 ${
                  index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                }`}
              >
                <div
                  className={`bg-card border rounded-2xl p-6 shadow-lg ${
                    index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'
                  } max-w-md`}
                >
                  <span
                    className={`inline-block text-5xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent mb-2`}
                  >
                    {step.number}
                  </span>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>

              {/* Icon Node */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 hidden md:flex"
                whileHover={{ scale: 1.1 }}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${step.color} shadow-xl border-4 border-background`}
                >
                  <step.icon className="h-7 w-7 text-white" />
                </div>
              </motion.div>

              {/* Mobile Icon */}
              <div
                className={`flex md:hidden h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${step.color} shadow-xl shrink-0`}
              >
                <step.icon className="h-6 w-6 text-white" />
              </div>

              {/* Spacer for alternating layout */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
