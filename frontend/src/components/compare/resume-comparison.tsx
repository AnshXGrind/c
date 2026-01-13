'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeftRight,
  Star,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getSampleResumes, type SampleResume } from '@/lib/api'
import { cn } from '@/lib/utils'

const jobRoles = [
  { value: 'sde', label: 'Software Development Engineer' },
  { value: 'data-analyst', label: 'Data Analyst' },
  { value: 'ml-engineer', label: 'Machine Learning Engineer' },
  { value: 'frontend', label: 'Frontend Developer' },
  { value: 'backend', label: 'Backend Developer' },
  { value: 'fullstack', label: 'Full Stack Developer' },
  { value: 'devops', label: 'DevOps Engineer' },
]

const comparisonPoints = [
  { label: 'Professional Summary', user: true, sample: true },
  { label: 'Quantified Achievements', user: false, sample: true },
  { label: 'ATS-Friendly Format', user: true, sample: true },
  { label: 'Action Verbs', user: true, sample: true },
  { label: 'Technical Skills Section', user: true, sample: true },
  { label: 'Project Showcase', user: false, sample: true },
  { label: 'Relevant Keywords', user: false, sample: true },
  { label: 'Clean Layout', user: true, sample: true },
  { label: 'Certifications', user: false, sample: true },
  { label: 'Contact Information', user: true, sample: true },
]

export function ResumeComparison() {
  const [jobRole, setJobRole] = useState<string>('sde')
  const [samples, setSamples] = useState<SampleResume[]>([])
  const [selectedSample, setSelectedSample] = useState<SampleResume | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadSamples() {
      setIsLoading(true)
      try {
        const data = await getSampleResumes(jobRole)
        setSamples(data)
        if (data.length > 0) {
          setSelectedSample(data[0])
        }
      } catch (error) {
        console.error('Failed to load samples')
      } finally {
        setIsLoading(false)
      }
    }
    loadSamples()
  }, [jobRole])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-4">
            <ArrowLeftRight className="mr-2 h-3 w-3" />
            Resume Comparison
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Compare With <span className="gradient-text">Top Resumes</span>
          </h1>
          <p className="text-muted-foreground">
            See what recruiter-approved resumes look like and learn from the
            best. Select a job role to view sample resumes.
          </p>
        </motion.div>
      </div>

      {/* Role Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="text-sm font-medium whitespace-nowrap">
              Select Job Role:
            </label>
            <Select value={jobRole} onValueChange={setJobRole}>
              <SelectTrigger className="md:w-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {jobRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sample Resumes Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {samples.map((sample, index) => (
          <motion.div
            key={sample.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={cn(
                'cursor-pointer card-hover',
                selectedSample?.id === sample.id && 'ring-2 ring-primary'
              )}
              onClick={() => setSelectedSample(sample)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{sample.name}</h3>
                    <p className="text-sm text-muted-foreground">{sample.role}</p>
                    <p className="text-sm text-primary">{sample.company}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg">
                    <Star className="h-4 w-4 fill-green-500 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">
                      {sample.score}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  {sample.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Comparison Section */}
      {selectedSample && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Your Resume */}
          <Card>
            <CardHeader>
              <CardTitle>Your Resume</CardTitle>
              <CardDescription>
                Upload your resume to see a detailed comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[8.5/11] bg-muted rounded-xl flex items-center justify-center mb-4">
                <div className="text-center p-6">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Upload your resume on the Analyze page to see it here
                  </p>
                  <Button variant="outline" className="mt-4" asChild>
                    <a href="/analyze">Upload Resume</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Resume */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedSample.name}&apos;s Resume</CardTitle>
                  <CardDescription>
                    {selectedSample.role} at {selectedSample.company}
                  </CardDescription>
                </div>
                <Badge variant="success">{selectedSample.score}/100</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-[8.5/11] bg-muted rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                {/* Mock Resume Preview */}
                <div className="w-full h-full p-6 bg-white dark:bg-gray-900">
                  <div className="space-y-4">
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800 rounded" />
                    <div className="h-4 w-56 bg-gray-100 dark:bg-gray-800 rounded" />
                    <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-4" />
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                      <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                      <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
                    </div>
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-4" />
                    <div className="flex flex-wrap gap-2">
                      <div className="h-6 w-16 bg-primary/20 rounded" />
                      <div className="h-6 w-20 bg-primary/20 rounded" />
                      <div className="h-6 w-14 bg-primary/20 rounded" />
                      <div className="h-6 w-18 bg-primary/20 rounded" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  View Full Resume
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Comparison Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Comparison Checklist</CardTitle>
          <CardDescription>
            See how your resume compares to recruiter-approved samples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {comparisonPoints.map((point, index) => (
              <motion.div
                key={point.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
              >
                <span className="font-medium">{point.label}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">You:</span>
                    {point.user ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Sample:</span>
                    {point.sample ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
