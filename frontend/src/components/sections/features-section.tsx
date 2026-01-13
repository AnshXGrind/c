'use client'

import { motion } from 'framer-motion'
import {
  FileSearch,
  Target,
  Map,
  BarChart3,
  FileText,
  Zap,
  CheckCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: FileSearch,
    title: 'AI Resume Analyzer',
    description:
      'Get instant ATS compatibility scores, keyword analysis, and section-by-section feedback powered by advanced AI.',
    badge: 'Most Popular',
    gradient: 'from-blue-500 to-cyan-500',
    highlights: [
      'ATS Score (0-100)',
      'Keyword Density',
      'Format Check',
      'Recruiter Verdict',
    ],
  },
  {
    icon: Target,
    title: 'Skills Gap Analysis',
    description:
      'Compare your skills against live job market demands. Discover missing, weak, and high-ROI skills for your target role.',
    gradient: 'from-orange-500 to-red-500',
    highlights: [
      'Missing Skills',
      'Weak Areas',
      'High-ROI Skills',
      'Market Trends',
    ],
  },
  {
    icon: Map,
    title: 'Career Roadmap',
    description:
      'Get a personalized 30-60-90 day learning plan with courses, projects, and certifications tailored to your goals.',
    gradient: 'from-violet-500 to-purple-500',
    highlights: [
      '30-60-90 Day Plan',
      'Project Ideas',
      'Course Suggestions',
      'Certifications',
    ],
  },
  {
    icon: BarChart3,
    title: 'Job Market Intelligence',
    description:
      'Stay ahead with real-time insights on job trends, salary ranges, and in-demand skills for your target roles.',
    gradient: 'from-green-500 to-emerald-500',
    highlights: [
      'Demand Trends',
      'Salary Data',
      'Hot Skills',
      'ATS Keywords',
    ],
  },
  {
    icon: FileText,
    title: 'Resume Comparison',
    description:
      'Compare your resume side-by-side with recruiter-approved samples. See exactly what top candidates do differently.',
    gradient: 'from-pink-500 to-rose-500',
    highlights: [
      'Side-by-Side View',
      'Gap Analysis',
      'Best Practices',
      'Quick Fixes',
    ],
  },
  {
    icon: Zap,
    title: 'AI Career Report',
    description:
      'Download a comprehensive PDF report with all insights, recommendations, and actionable next steps.',
    gradient: 'from-amber-500 to-orange-500',
    highlights: [
      'Full Analysis',
      'Actionable Steps',
      'Downloadable PDF',
      'Share Ready',
    ],
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
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
              Powerful Features
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="gradient-text">Land Your Dream Job</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Our AI-powered platform analyzes your resume, identifies gaps, and
              creates a personalized roadmap to make you job-ready.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full card-hover border-0 shadow-lg bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    {feature.badge && (
                      <Badge variant="default" className="text-xs">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"
                      >
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
