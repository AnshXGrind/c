'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Map,
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  Target,
  BookOpen,
  Award,
  Code,
  ExternalLink,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getJobMarketData, type JobMarketData } from '@/lib/api'

const jobRoles = [
  { value: 'sde', label: 'Software Development Engineer' },
  { value: 'data-analyst', label: 'Data Analyst' },
  { value: 'ml-engineer', label: 'Machine Learning Engineer' },
  { value: 'frontend', label: 'Frontend Developer' },
  { value: 'backend', label: 'Backend Developer' },
  { value: 'fullstack', label: 'Full Stack Developer' },
  { value: 'devops', label: 'DevOps Engineer' },
  { value: 'data-scientist', label: 'Data Scientist' },
]

const suggestedProjects = [
  {
    title: 'Full-Stack E-commerce Platform',
    description: 'Build a complete e-commerce site with user auth, payments, and admin dashboard.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    difficulty: 'Advanced',
    duration: '4-6 weeks',
  },
  {
    title: 'Real-time Chat Application',
    description: 'Create a chat app with WebSocket support, multiple rooms, and message history.',
    skills: ['TypeScript', 'Socket.io', 'Redis', 'Docker'],
    difficulty: 'Intermediate',
    duration: '2-3 weeks',
  },
  {
    title: 'CI/CD Pipeline Automation',
    description: 'Set up automated testing, building, and deployment for a sample application.',
    skills: ['GitHub Actions', 'Docker', 'AWS', 'Terraform'],
    difficulty: 'Intermediate',
    duration: '1-2 weeks',
  },
]

const certifications = [
  {
    name: 'AWS Certified Developer - Associate',
    provider: 'Amazon Web Services',
    duration: '2-3 months',
    cost: '$300',
    value: 'High',
  },
  {
    name: 'Google Professional Cloud Developer',
    provider: 'Google Cloud',
    duration: '2-3 months',
    cost: '$200',
    value: 'High',
  },
  {
    name: 'Kubernetes Administrator (CKA)',
    provider: 'CNCF',
    duration: '1-2 months',
    cost: '$395',
    value: 'Very High',
  },
]

export function RoadmapGenerator() {
  const [jobRole, setJobRole] = useState<string>('sde')
  const [marketData, setMarketData] = useState<JobMarketData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const data = await getJobMarketData(jobRole)
        setMarketData(data)
      } catch (error) {
        console.error('Failed to load market data')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
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
            <Map className="mr-2 h-3 w-3" />
            Career Roadmap
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Path to <span className="gradient-text">Career Success</span>
          </h1>
          <p className="text-muted-foreground">
            Get personalized career insights, market intelligence, and a
            structured roadmap to achieve your professional goals.
          </p>
        </motion.div>
      </div>

      {/* Role Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="text-sm font-medium whitespace-nowrap">
              Target Role:
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

      {marketData && (
        <>
          {/* Market Intelligence */}
          <div className="grid md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">Demand</span>
                  </div>
                  <p className="text-2xl font-bold capitalize text-green-500">
                    {marketData.demandTrend}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                      <DollarSign className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">Salary</span>
                  </div>
                  <p className="text-2xl font-bold">
                    ${(marketData.averageSalary.min / 1000).toFixed(0)}K - ${(marketData.averageSalary.max / 1000).toFixed(0)}K
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                      <Briefcase className="h-5 w-5 text-violet-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">Jobs</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {marketData.jobCount.toLocaleString()}+
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                      <Users className="h-5 w-5 text-amber-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">Companies</span>
                  </div>
                  <p className="text-2xl font-bold">{marketData.topCompanies.length}+</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Top Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                In-Demand Skills for {jobRoles.find(r => r.value === jobRole)?.label}
              </CardTitle>
              <CardDescription>
                Skills recruiters are actively searching for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketData.topSkills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.demand}% demand
                      </span>
                    </div>
                    <Progress value={skill.demand} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Companies */}
          <Card>
            <CardHeader>
              <CardTitle>Top Hiring Companies</CardTitle>
              <CardDescription>
                Companies actively hiring for this role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {marketData.topCompanies.map((company) => (
                  <Badge key={company} variant="secondary" className="text-sm py-1.5 px-3">
                    {company}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Portfolio Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Recommended Portfolio Projects
          </CardTitle>
          <CardDescription>
            Build these projects to showcase your skills to recruiters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {suggestedProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant={
                          project.difficulty === 'Advanced'
                            ? 'destructive'
                            : project.difficulty === 'Intermediate'
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {project.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {project.duration}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Recommended Certifications
          </CardTitle>
          <CardDescription>
            Industry-recognized certifications to boost your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 shrink-0">
                  <Award className="h-6 w-6 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold">{cert.name}</h4>
                  <p className="text-sm text-muted-foreground">{cert.provider}</p>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">{cert.duration}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Cost</p>
                    <p className="font-medium">{cert.cost}</p>
                  </div>
                  <Badge variant="success">{cert.value} Value</Badge>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
