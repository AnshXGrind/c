'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    avatar: 'SC',
    rating: 5,
    quote:
      'CareerAI helped me identify critical gaps in my resume. Within 2 months of following their roadmap, I landed my dream job at Google!',
    highlight: 'Landed job at Google',
  },
  {
    name: 'Michael Roberts',
    role: 'Data Analyst at Meta',
    avatar: 'MR',
    rating: 5,
    quote:
      'I was getting zero callbacks. After using CareerAI, I understood exactly why. The ATS optimization tips were game-changing.',
    highlight: '10x more callbacks',
  },
  {
    name: 'Priya Sharma',
    role: 'Product Manager at Amazon',
    avatar: 'PS',
    rating: 5,
    quote:
      'The skill gap analysis was eye-opening. I learned exactly which certifications to get, and the roadmap made learning manageable.',
    highlight: 'Clear learning path',
  },
  {
    name: 'James Wilson',
    role: 'ML Engineer at OpenAI',
    avatar: 'JW',
    rating: 5,
    quote:
      'Comparing my resume to recruiter-selected samples showed me what I was missing. The before/after difference was incredible.',
    highlight: '5 offers in 3 months',
  },
  {
    name: 'Emily Zhang',
    role: 'Frontend Developer at Stripe',
    avatar: 'EZ',
    rating: 5,
    quote:
      'As a career changer, I had no idea where to start. CareerAI gave me a structured plan that actually worked.',
    highlight: 'Career change success',
  },
  {
    name: 'David Kim',
    role: 'DevOps Engineer at Netflix',
    avatar: 'DK',
    rating: 5,
    quote:
      'The AI feedback was more useful than any human review I\'ve paid for. It caught issues I never would have noticed.',
    highlight: 'Better than paid reviews',
  },
]

export function TestimonialsSection() {
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
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Join <span className="gradient-text">50,000+</span> Job Seekers
              Who Found Success
            </h2>
            <p className="text-lg text-muted-foreground">
              Real people, real results. See how CareerAI has transformed
              careers.
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full card-hover border-0 shadow-lg bg-background">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />

                  {/* Quote */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    &quot;{testimonial.quote}&quot;
                  </p>

                  {/* Highlight Badge */}
                  <Badge variant="success" className="mb-6">
                    {testimonial.highlight}
                  </Badge>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
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
