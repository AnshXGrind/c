'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  RotateCcw,
  Target,
  TrendingUp,
  Phone,
  PhoneOff,
  Award,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  FileType,
  BookOpen,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  extractTextFromFile,
  analyzeResumeWithAI,
  type AnalysisResponse,
} from '@/lib/resume-utils'

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
  { value: 'ux-designer', label: 'UX Designer' },
  { value: 'mobile-dev', label: 'Mobile Developer' },
  { value: 'cloud-architect', label: 'Cloud Architect' },
  { value: 'cybersecurity', label: 'Cybersecurity Analyst' },
  { value: 'qa-engineer', label: 'QA Engineer' },
]

export function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [jobRole, setJobRole] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [results, setResults] = useState<AnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0]
      if (uploadedFile) {
        const validTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
        ]
        
        // Also check by extension
        const fileName = uploadedFile.name.toLowerCase()
        const validExtensions = ['.pdf', '.docx', '.doc']
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
        
        if (!validTypes.includes(uploadedFile.type) && !hasValidExtension) {
          toast({
            title: 'Invalid file type',
            description: 'Please upload a PDF or DOCX file.',
            variant: 'destructive',
          })
          return
        }
        if (uploadedFile.size > 10 * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: 'Please upload a file smaller than 10MB.',
            variant: 'destructive',
          })
          return
        }
        setFile(uploadedFile)
        setResults(null)
        setError(null)
        toast({
          title: 'File uploaded!',
          description: `${uploadedFile.name} is ready for analysis.`,
        })
      }
    },
    [toast]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxFiles: 1,
    multiple: false,
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
    setAnalysisProgress(0)
    setProgressMessage('Starting analysis...')
    setError(null)

    try {
      // Step 1: Extract text from file
      setAnalysisProgress(10)
      setProgressMessage('📄 Reading your resume...')
      
      let resumeText: string
      try {
        resumeText = await extractTextFromFile(file)
      } catch (extractError) {
        throw new Error(
          extractError instanceof Error 
            ? extractError.message 
            : 'Could not read your resume. Please try a different file format.'
        )
      }

      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error(
          'Could not extract enough text from your resume. Please ensure your file contains readable text (not scanned images). Try saving your resume as DOCX from Microsoft Word or Google Docs.'
        )
      }

      setAnalysisProgress(30)
      setProgressMessage('🔍 Extracting skills and keywords...')
      await new Promise(resolve => setTimeout(resolve, 500))

      // Step 2: Send to AI for analysis
      setAnalysisProgress(50)
      setProgressMessage('🤖 AI is analyzing your resume...')
      
      const roleLabel = jobRoles.find((r) => r.value === jobRole)?.label || jobRole
      const analysisResults = await analyzeResumeWithAI(resumeText, roleLabel)

      setAnalysisProgress(80)
      setProgressMessage('📊 Generating your personalized report...')
      await new Promise(resolve => setTimeout(resolve, 500))

      setAnalysisProgress(100)
      setProgressMessage('✅ Analysis complete!')
      
      setResults(analysisResults)
      
      // Show appropriate toast based on recruiter decision
      if (analysisResults.recruiter_decision?.would_call) {
        toast({
          title: '🎉 Great news!',
          description: 'A recruiter would likely call you for an interview!',
        })
      } else {
        toast({
          title: '📝 Analysis complete',
          description: 'Check the report for improvement suggestions.',
        })
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Analysis failed. Please try again.'
      setError(errorMessage)
      toast({
        title: 'Analysis failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setResults(null)
    setError(null)
  }

  const resetAnalysis = () => {
    setResults(null)
    setError(null)
    setFile(null)
    setJobRole('')
    setAnalysisProgress(0)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Outstanding'
    if (score >= 80) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    if (score >= 50) return 'Needs Work'
    return 'Poor'
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
            <Sparkles className="mr-2 h-3 w-3" />
            AI-Powered Resume Analysis
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Will a Recruiter <span className="gradient-text">Call You?</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Upload your resume and find out if recruiters would call you for an interview. Get honest feedback, ATS compatibility score, and a personalized improvement roadmap.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Badge variant="outline" className="px-3 py-1">
              📞 Recruiter Decision
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              🎯 ATS Score
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              📈 90-Day Roadmap
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              🔒 100% Private
            </Badge>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!results ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Upload Your Resume</CardTitle>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Supported: PDF, DOCX • Max size: 10MB • Your data is never stored
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`
                    relative flex flex-col items-center justify-center p-8 md:p-12
                    border-2 border-dashed rounded-2xl cursor-pointer
                    transition-all duration-300 min-h-[200px]
                    ${isDragActive
                      ? 'border-primary bg-primary/10 scale-[1.02]'
                      : file 
                        ? 'border-green-500 bg-green-500/5' 
                        : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  
                  {file ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                        <FileText className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-lg">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile()
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove file
                      </Button>
                    </div>
                  ) : (
                    <>
                      <motion.div
                        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-4"
                        animate={{ 
                          y: isDragActive ? -10 : 0,
                          scale: isDragActive ? 1.1 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Upload className="h-10 w-10 text-primary" />
                      </motion.div>
                      <p className="text-xl font-semibold mb-2">
                        {isDragActive ? '📄 Drop it here!' : '📤 Drop your resume here'}
                      </p>
                      <p className="text-muted-foreground mb-4">
                        or click to browse your files
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">
                          <FileType className="h-3 w-3 mr-1" />
                          PDF
                        </Badge>
                        <Badge variant="secondary">
                          <FileType className="h-3 w-3 mr-1" />
                          DOCX
                        </Badge>
                      </div>
                    </>
                  )}
                </div>

                {/* Job Role Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Target Job Role
                  </label>
                  <Select value={jobRole} onValueChange={setJobRole}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="What position are you applying for?" />
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

                {/* File Rejection Errors */}
                {fileRejections.length > 0 && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-5 w-5" />
                      <p className="font-medium">File upload error</p>
                    </div>
                    <p className="text-sm text-red-500 mt-1">
                      {fileRejections[0].errors[0].message}
                    </p>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <XCircle className="h-5 w-5" />
                      <p className="font-medium">Analysis Error</p>
                    </div>
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                  </div>
                )}

                {/* Progress Bar */}
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{progressMessage}</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(analysisProgress)}%
                      </span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                  </motion.div>
                )}

                {/* Analyze Button */}
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full text-lg py-6 font-semibold"
                  disabled={!file || !jobRole || isAnalyzing}
                  onClick={handleAnalyze}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      {!file ? 'Upload Resume First' : !jobRole ? 'Select Job Role' : 'Analyze My Resume'}
                    </>
                  )}
                </Button>

                {file && jobRole && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      ✓ Ready! Click analyze to find out if recruiters would call you.
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Results Section */
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Action Button */}
            <div className="flex justify-start">
              <Button variant="outline" onClick={resetAnalysis}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Analyze Another Resume
              </Button>
            </div>

            {/* RECRUITER DECISION - Main Highlight */}
            <Card className={`border-2 ${results.recruiter_decision?.would_call ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10'}`}>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Decision Icon */}
                  <div className={`flex h-24 w-24 items-center justify-center rounded-full ${results.recruiter_decision?.would_call ? 'bg-green-500' : 'bg-orange-500'}`}>
                    {results.recruiter_decision?.would_call ? (
                      <Phone className="h-12 w-12 text-white" />
                    ) : (
                      <PhoneOff className="h-12 w-12 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h2 className={`text-3xl font-bold mb-2 ${results.recruiter_decision?.would_call ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      {results.recruiter_decision?.would_call 
                        ? '📞 Recruiter Would Call You!' 
                        : '📝 Not Yet Ready for Interviews'}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-4">{results.verdict}</p>
                    
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Badge variant={results.recruiter_decision?.would_call ? 'default' : 'secondary'} className="text-sm">
                        Confidence: {results.recruiter_decision?.confidence || 'medium'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recruiter Reasons */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Why Recruiter Would/Wouldn't Call */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {results.recruiter_decision?.would_call ? (
                      <>
                        <ThumbsUp className="h-5 w-5 text-green-500" />
                        Why You'd Get Called
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        Why Not Yet
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.recruiter_decision?.reasons?.map((reason, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-white text-xs ${results.recruiter_decision?.would_call ? 'bg-green-500' : 'bg-orange-500'}`}>
                          {index + 1}
                        </span>
                        <span className="text-sm">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* What to Improve */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    To Improve Your Chances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.recruiter_decision?.improvements_needed?.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                          {index + 1}
                        </span>
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  {/* ATS Score */}
                  <div className="text-center">
                    <div className="relative inline-flex">
                      <svg className="w-24 h-24">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
                        <circle
                          cx="48" cy="48" r="40" fill="none"
                          stroke={results.ats_score >= 70 ? '#22c55e' : results.ats_score >= 50 ? '#eab308' : '#ef4444'}
                          strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${(results.ats_score / 100) * 251} 251`}
                          transform="rotate(-90 48 48)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getScoreColor(results.ats_score)}`}>
                          {results.ats_score}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium">ATS Score</p>
                    <p className="text-xs text-muted-foreground">{getScoreLabel(results.ats_score)}</p>
                  </div>

                  {/* Formatting Score */}
                  <div className="text-center">
                    <div className="relative inline-flex">
                      <svg className="w-24 h-24">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
                        <circle
                          cx="48" cy="48" r="40" fill="none"
                          stroke={results.formatting_score >= 70 ? '#22c55e' : results.formatting_score >= 50 ? '#eab308' : '#ef4444'}
                          strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${(results.formatting_score / 100) * 251} 251`}
                          transform="rotate(-90 48 48)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getScoreColor(results.formatting_score)}`}>
                          {results.formatting_score}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium">Formatting</p>
                    <p className="text-xs text-muted-foreground">Layout & Structure</p>
                  </div>

                  {/* Keyword Score */}
                  <div className="text-center">
                    <div className="relative inline-flex">
                      <svg className="w-24 h-24">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
                        <circle
                          cx="48" cy="48" r="40" fill="none"
                          stroke={results.keyword_score >= 70 ? '#22c55e' : results.keyword_score >= 50 ? '#eab308' : '#ef4444'}
                          strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${(results.keyword_score / 100) * 251} 251`}
                          transform="rotate(-90 48 48)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getScoreColor(results.keyword_score)}`}>
                          {results.keyword_score}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium">Keywords</p>
                    <p className="text-xs text-muted-foreground">Role Relevance</p>
                  </div>

                  {/* Experience Score */}
                  <div className="text-center">
                    <div className="relative inline-flex">
                      <svg className="w-24 h-24">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
                        <circle
                          cx="48" cy="48" r="40" fill="none"
                          stroke={results.experience_relevance >= 70 ? '#22c55e' : results.experience_relevance >= 50 ? '#eab308' : '#ef4444'}
                          strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${(results.experience_relevance / 100) * 251} 251`}
                          transform="rotate(-90 48 48)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getScoreColor(results.experience_relevance)}`}>
                          {results.experience_relevance}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium">Experience</p>
                    <p className="text-xs text-muted-foreground">Job Match</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Analysis */}
            {results.skills_gap && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Your Skills ({results.skills_gap.current_skills?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {results.skills_gap.current_skills?.length > 0 ? (
                        results.skills_gap.current_skills.map((skill, index) => (
                          <Badge key={index} className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            ✓ {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No skills detected. Make sure to list your technical skills clearly.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Missing Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-500" />
                      Skills to Add
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.skills_gap.skill_gaps?.length > 0 ? (
                        results.skills_gap.skill_gaps.map((gap, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                            <div>
                              <p className="font-medium text-sm">{gap.skill}</p>
                              <p className="text-xs text-muted-foreground">{gap.learning_time}</p>
                            </div>
                            <Badge 
                              variant={gap.importance === 'critical' ? 'destructive' : gap.importance === 'high' ? 'default' : 'secondary'}
                            >
                              {gap.importance}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No skill gaps detected.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Weak Sections */}
            {results.weak_sections?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Sections Needing Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {results.weak_sections.map((section, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-white text-xs shrink-0">
                          !
                        </span>
                        <span className="text-sm">{section}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 90-Day Roadmap */}
            {results.roadmap?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Your 90-Day Action Plan
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Follow this roadmap to significantly improve your chances of getting hired
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-violet-500 to-green-500" />
                    <div className="space-y-4">
                      {results.roadmap.map((item, index) => (
                        <motion.div 
                          key={index} 
                          className="relative pl-10"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={`absolute left-1.5 top-2 h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            item.day <= 7 ? 'bg-primary' : item.day <= 30 ? 'bg-violet-500' : 'bg-green-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4 hover:bg-muted/70 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                Day {item.day}
                              </Badge>
                              {item.day <= 7 && <Badge className="text-xs bg-primary">Start Now</Badge>}
                            </div>
                            <p className="text-sm">{item.task}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* How it Works Section */}
      {!results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Upload className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-lg">1. Upload Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload your resume in PDF or DOCX format. Make sure it's text-based (not a scanned image).
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center mb-3">
                <Sparkles className="h-7 w-7 text-violet-500" />
              </div>
              <CardTitle className="text-lg">2. AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our AI acts like a senior recruiter, analyzing your resume for ATS compatibility, keywords, and job fit.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                <Phone className="h-7 w-7 text-green-500" />
              </div>
              <CardTitle className="text-lg">3. Get Verdict</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Find out if recruiters would call you, plus get a personalized 90-day roadmap to improve.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
