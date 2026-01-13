'use client'

import { motion } from 'framer-motion'
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Download,
  RotateCcw,
  FileText,
  Target,
  Briefcase,
  GraduationCap,
  Code,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import type { ResumeAnalysis } from '@/lib/api'
import { cn, getScoreColor, getScoreLabel } from '@/lib/utils'

interface ResumeResultsProps {
  results: ResumeAnalysis
  onReset: () => void
}

export function ResumeResults({ results, onReset }: ResumeResultsProps) {
  const getVerdictIcon = () => {
    if (results.overallScore >= 80) {
      return <CheckCircle2 className="h-8 w-8 text-green-500" />
    }
    if (results.overallScore >= 60) {
      return <AlertCircle className="h-8 w-8 text-yellow-500" />
    }
    return <XCircle className="h-8 w-8 text-red-500" />
  }

  const getVerdictColor = () => {
    if (results.overallScore >= 80) return 'from-green-500 to-emerald-500'
    if (results.overallScore >= 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-rose-500'
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Analyze Another Resume
        </Button>
        <Button variant="gradient">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden">
          <div
            className={`h-2 bg-gradient-to-r ${getVerdictColor()}`}
          />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Score Circle */}
              <div className="relative">
                <svg className="w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(results.overallScore / 100) * 352} 352`}
                    transform="rotate(-90 64 64)"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(262, 83%, 58%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn('text-4xl font-bold', getScoreColor(results.overallScore))}>
                    {results.overallScore}
                  </span>
                  <span className="text-xs text-muted-foreground">out of 100</span>
                </div>
              </div>

              {/* Verdict */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  {getVerdictIcon()}
                  <h2 className="text-2xl font-bold">
                    {getScoreLabel(results.overallScore)}
                  </h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  {results.verdictSummary}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary">
                    ATS Score: {results.atsScore}/100
                  </Badge>
                  <Badge variant="secondary">
                    Keywords: {results.keywordScore}/100
                  </Badge>
                  <Badge variant="secondary">
                    Format: {results.formatScore}/100
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Results */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'ATS Compatibility',
                score: results.atsScore,
                icon: FileText,
                description: 'How well ATS systems can read your resume',
              },
              {
                label: 'Keyword Density',
                score: results.keywordScore,
                icon: Target,
                description: 'Match with job-relevant keywords',
              },
              {
                label: 'Format & Readability',
                score: results.formatScore,
                icon: Briefcase,
                description: 'Visual structure and clarity',
              },
              {
                label: 'Content Quality',
                score: results.contentScore,
                icon: Award,
                description: 'Depth and relevance of content',
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className={cn('text-2xl font-bold', getScoreColor(item.score))}>
                          {item.score}
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={item.score}
                      className="h-2 mb-2"
                      indicatorClassName={
                        item.score >= 80
                          ? 'bg-green-500'
                          : item.score >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section-by-Section Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {results.sectionFeedback.map((section, index) => (
                  <AccordionItem key={section.name} value={section.name}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-4 w-full">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          {section.icon === 'experience' && <Briefcase className="h-5 w-5 text-primary" />}
                          {section.icon === 'skills' && <Code className="h-5 w-5 text-primary" />}
                          {section.icon === 'education' && <GraduationCap className="h-5 w-5 text-primary" />}
                          {section.icon === 'projects' && <Target className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">{section.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {section.summary}
                          </p>
                        </div>
                        <Badge
                          variant={
                            section.score >= 80
                              ? 'success'
                              : section.score >= 60
                              ? 'warning'
                              : 'destructive'
                          }
                        >
                          {section.score}/100
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="space-y-4 pl-14">
                        <div>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                            ✓ Strengths
                          </p>
                          <ul className="space-y-1">
                            {section.strengths.map((strength, i) => (
                              <li key={i} className="text-sm text-muted-foreground">
                                • {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                            ✗ Areas to Improve
                          </p>
                          <ul className="space-y-1">
                            {section.improvements.map((improvement, i) => (
                              <li key={i} className="text-sm text-muted-foreground">
                                • {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  Keywords Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.keywordsFound.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="bg-green-500/10 text-green-600">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-5 w-5" />
                  Missing Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.keywordsMissing.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="bg-red-500/10 text-red-600">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Improvements Tab */}
        <TabsContent value="improvements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Priority Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.priorityImprovements.map((improvement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium mb-1">{improvement.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {improvement.description}
                      </p>
                      <Badge
                        variant={
                          improvement.impact === 'high'
                            ? 'destructive'
                            : improvement.impact === 'medium'
                            ? 'warning'
                            : 'secondary'
                        }
                        className="mt-2"
                      >
                        {improvement.impact} impact
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
