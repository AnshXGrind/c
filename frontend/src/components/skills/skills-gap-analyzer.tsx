'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  X,
  Loader2,
  Target,
  TrendingUp,
  TrendingDown,
  Sparkles,
  BookOpen,
  Award,
  Code,
  ExternalLink,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { getSkillsGap, type SkillsGapAnalysis, type SkillGap, type RoadmapItem } from '@/lib/api'
import { cn } from '@/lib/utils'

const jobRoles = [
  { value: 'sde', label: 'Software Development Engineer' },
  { value: 'data-analyst', label: 'Data Analyst' },
  { value: 'ml-engineer', label: 'Machine Learning Engineer' },
  { value: 'product-manager', label: 'Product Manager' },
  { value: 'frontend', label: 'Frontend Developer' },
  { value: 'backend', label: 'Backend Developer' },
  { value: 'fullstack', label: 'Full Stack Developer' },
  { value: 'devops', label: 'DevOps Engineer' },
  { value: 'data-scientist', label: 'Data Scientist' },
]

function SkillGapCard({ skill }: { skill: SkillGap }) {
  const gapPercentage = ((skill.requiredLevel - skill.currentLevel) / skill.requiredLevel) * 100

  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-primary" />
            <span className="font-medium">{skill.name}</span>
          </div>
          <Badge
            variant={
              skill.importance === 'critical'
                ? 'destructive'
                : skill.importance === 'important'
                ? 'warning'
                : 'secondary'
            }
          >
            {skill.importance}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Current: {skill.currentLevel}%</span>
            <span>Required: {skill.requiredLevel}%</span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary/30 rounded-full"
              style={{ width: `${skill.requiredLevel}%` }}
            />
            <div
              className={cn(
                'absolute inset-y-0 left-0 rounded-full transition-all',
                skill.currentLevel >= skill.requiredLevel
                  ? 'bg-green-500'
                  : 'bg-primary'
              )}
              style={{ width: `${skill.currentLevel}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Gap: {Math.round(gapPercentage)}% to close
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function RoadmapPhase({ items, phase }: { items: RoadmapItem[]; phase: string }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden">
            <div
              className={cn(
                'h-1',
                phase === 'phase1' && 'bg-blue-500',
                phase === 'phase2' && 'bg-violet-500',
                phase === 'phase3' && 'bg-green-500'
              )}
            />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl',
                    phase === 'phase1' && 'bg-blue-500/10',
                    phase === 'phase2' && 'bg-violet-500/10',
                    phase === 'phase3' && 'bg-green-500/10'
                  )}
                >
                  <Calendar
                    className={cn(
                      'h-6 w-6',
                      phase === 'phase1' && 'text-blue-500',
                      phase === 'phase2' && 'text-violet-500',
                      phase === 'phase3' && 'text-green-500'
                    )}
                  />
                </div>
                <div>
                  <Badge variant="outline" className="mb-1">
                    {item.day}
                  </Badge>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{item.description}</p>

              {/* Skills to Learn */}
              <div>
                <p className="text-sm font-medium mb-2">Skills to Focus On:</p>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <p className="text-sm font-medium mb-2">Recommended Resources:</p>
                <div className="space-y-2">
                  {item.resources.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl',
                          resource.type === 'video' && 'bg-red-500/10',
                          resource.type === 'course' && 'bg-blue-500/10',
                          resource.type === 'certification' && 'bg-amber-500/10',
                          resource.type === 'project' && 'bg-green-500/10'
                        )}
                      >
                        {resource.type === 'video' && (
                          <BookOpen className="h-5 w-5 text-red-500" />
                        )}
                        {resource.type === 'course' && (
                          <BookOpen className="h-5 w-5 text-blue-500" />
                        )}
                        {resource.type === 'certification' && (
                          <Award className="h-5 w-5 text-amber-500" />
                        )}
                        {resource.type === 'project' && (
                          <Code className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{resource.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {resource.provider} • {resource.duration}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={resource.isFree ? 'success' : 'secondary'}>
                          {resource.isFree ? 'Free' : 'Paid'}
                        </Badge>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export function SkillsGapAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [jobRole, setJobRole] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<SkillsGapAnalysis | null>(null)
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setResults(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  const handleAnalyze = async () => {
    if (!file || !jobRole) {
      toast({
        title: 'Missing information',
        description: 'Please upload a resume and select a job role.',
        variant: 'destructive',
      })
      return
    }

    setIsAnalyzing(true)

    try {
      const analysisResults = await getSkillsGap(file, jobRole)
      setResults(analysisResults)
      toast({
        title: 'Analysis complete!',
        description: 'Your skills gap analysis is ready.',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

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
            <Target className="mr-2 h-3 w-3" />
            Skills Analysis
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Your <span className="gradient-text">Skills Gap</span>
          </h1>
          <p className="text-muted-foreground">
            Upload your resume and we&apos;ll identify the skills you need to
            learn, along with a personalized 90-day roadmap to become job-ready.
          </p>
        </motion.div>
      </div>

      {/* Upload Section */}
      <AnimatePresence mode="wait">
        {!results ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`
                    relative flex flex-col items-center justify-center p-8
                    border-2 border-dashed rounded-2xl cursor-pointer
                    transition-all duration-300
                    ${isDragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50'
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFile(null)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium">
                        Drop your resume here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PDF or DOCX • Max 10MB
                      </p>
                    </>
                  )}
                </div>

                {/* Job Role Selection */}
                <Select value={jobRole} onValueChange={setJobRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target job role" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Analyze Button */}
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  disabled={!file || !jobRole || isAnalyzing}
                  onClick={handleAnalyze}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Skills...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Analyze Skills Gap
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Results */}
            <Tabs defaultValue="overview" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
                  <TabsTrigger value="roadmap">90-Day Roadmap</TabsTrigger>
                </TabsList>
                <Button variant="outline" onClick={() => setResults(null)}>
                  Analyze Another
                </Button>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Current Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Your Current Skills
                    </CardTitle>
                    <CardDescription>
                      Skills we identified from your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {results.currentSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* High ROI Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      High-ROI Skills to Learn
                    </CardTitle>
                    <CardDescription>
                      These skills will have the biggest impact on your job search
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {results.highRoiSkills.map((skill) => (
                        <SkillGapCard key={skill.name} skill={skill} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Gaps Tab */}
              <TabsContent value="gaps" className="space-y-6">
                {/* Missing Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-500">
                      <TrendingDown className="h-5 w-5" />
                      Missing Skills
                    </CardTitle>
                    <CardDescription>
                      Skills you need to learn for this role
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {results.missingSkills.map((skill) => (
                        <SkillGapCard key={skill.name} skill={skill} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Weak Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-500">
                      <Target className="h-5 w-5" />
                      Skills to Strengthen
                    </CardTitle>
                    <CardDescription>
                      You have these skills but need to improve them
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {results.weakSkills.map((skill) => (
                        <SkillGapCard key={skill.name} skill={skill} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Roadmap Tab */}
              <TabsContent value="roadmap" className="space-y-8">
                {/* Phase 1 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Phase 1: Foundation</h3>
                      <p className="text-sm text-muted-foreground">Days 1-30</p>
                    </div>
                  </div>
                  <RoadmapPhase items={results.roadmap.phase1} phase="phase1" />
                </div>

                {/* Phase 2 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Phase 2: Growth</h3>
                      <p className="text-sm text-muted-foreground">Days 31-60</p>
                    </div>
                  </div>
                  <RoadmapPhase items={results.roadmap.phase2} phase="phase2" />
                </div>

                {/* Phase 3 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Phase 3: Mastery</h3>
                      <p className="text-sm text-muted-foreground">Days 61-90</p>
                    </div>
                  </div>
                  <RoadmapPhase items={results.roadmap.phase3} phase="phase3" />
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
