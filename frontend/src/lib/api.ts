// Use Next.js API routes as gateway (deployed to Vercel)
// API routes will forward requests to Python ML Service (Render/Fly.io)

// Types
export interface SectionFeedback {
  name: string
  icon: 'experience' | 'skills' | 'education' | 'projects'
  score: number
  summary: string
  strengths: string[]
  improvements: string[]
}

export interface Improvement {
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
}

export interface ResumeAnalysis {
  overallScore: number
  atsScore: number
  keywordScore: number
  formatScore: number
  contentScore: number
  verdictSummary: string
  sectionFeedback: SectionFeedback[]
  keywordsFound: string[]
  keywordsMissing: string[]
  priorityImprovements: Improvement[]
}

export interface SkillGap {
  name: string
  currentLevel: number
  requiredLevel: number
  importance: 'critical' | 'important' | 'nice-to-have'
  category: string
}

export interface LearningResource {
  title: string
  type: 'video' | 'course' | 'certification' | 'project'
  provider: string
  url: string
  duration: string
  isFree: boolean
}

export interface RoadmapItem {
  day: string
  title: string
  description: string
  skills: string[]
  resources: LearningResource[]
}

export interface SkillsGapAnalysis {
  currentSkills: string[]
  missingSkills: SkillGap[]
  weakSkills: SkillGap[]
  highRoiSkills: SkillGap[]
  roadmap: {
    phase1: RoadmapItem[]
    phase2: RoadmapItem[]
    phase3: RoadmapItem[]
  }
}

export interface SampleResume {
  id: string
  name: string
  role: string
  company: string
  score: number
  highlights: string[]
  pdfUrl: string
}

export interface JobMarketData {
  role: string
  demandTrend: 'increasing' | 'stable' | 'decreasing'
  averageSalary: { min: number; max: number; currency: string }
  topSkills: { name: string; demand: number }[]
  topCompanies: string[]
  jobCount: number
}

// API Functions

export async function analyzeResume(file: File, jobRole: string): Promise<ResumeAnalysis> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('job_role', jobRole)

  try {
    // Call Next.js API Gateway (Vercel)
    const response = await fetch('/api/analyze-resume', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Analysis failed')
    }

    return response.json()
  } catch (error) {
    // Return mock data for demo purposes if API is unavailable
    console.warn('API unavailable, using mock data')
    return getMockAnalysis(jobRole)
  }
}

export async function getSkillsGap(file: File, jobRole: string): Promise<SkillsGapAnalysis> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('target_role', jobRole)

  try {
    // Call Next.js API Gateway (Vercel)
    const response = await fetch('/api/skills-gap', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Analysis failed')
    }

    return response.json()
  } catch (error) {
    console.warn('API unavailable, using mock data')
    return getMockSkillsGap()
  }
}

export async function compareResumes(
  userResume: File,
  sampleResume: File,
  jobRole: string
): Promise<any> {
  const formData = new FormData()
  formData.append('user_resume', userResume)
  formData.append('sample_resume', sampleResume)
  formData.append('job_role', jobRole)

  try {
    // Call Next.js API Gateway (Vercel)
    const response = await fetch('/api/compare-resumes', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Comparison failed')
    }

    return response.json()
  } catch (error) {
    console.warn('API unavailable')
    throw error
  }
}

export async function generateRoadmap(
  targetRole: string,
  currentSkills: string[],
  targetSkills: string[],
  timeframe: number = 90
): Promise<any> {
  try {
    // Call Next.js API Gateway (Vercel)
    const response = await fetch('/api/roadmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetRole,
        currentSkills,
        targetSkills,
        timeframe,
      }),
    })

    if (!response.ok) {
      throw new Error('Roadmap generation failed')
    }

    return response.json()
  } catch (error) {
    console.warn('API unavailable')
    throw error
  }
}

export async function getSampleResumes(jobRole: string): Promise<SampleResume[]> {
  try {
    // Call Next.js API Gateway (Vercel)
    const response = await fetch(`/api/samples/${jobRole}`)

    if (!response.ok) {
      throw new Error('Failed to fetch samples')
    }

    return response.json()
  } catch (error) {
    console.warn('API unavailable, using mock data')
    return getMockSampleResumes(jobRole)
  }
}

export async function getJobMarketData(jobRole: string): Promise<JobMarketData> {
  try {
    // Call Next.js API Gateway (Vercel)
    const response = await fetch(`/api/market-data?role=${encodeURIComponent(jobRole)}`)

    if (!response.ok) {
      throw new Error('Failed to fetch market data')
    }

    return response.json()
  } catch (error) {
    console.warn('API unavailable, using mock data')
    return getMockJobMarketData(jobRole)
  }
}

export async function generateCareerReport(
  analysis: ResumeAnalysis,
  skillsGap: SkillsGapAnalysis
): Promise<Blob> {
  try {
    // Call Next.js API Gateway (Vercel)
    const response = await fetch('/api/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ analysis, skillsGap }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate report')
    }

    return response.blob()
  } catch (error) {
    throw new Error('Report generation failed')
  }
}

// Mock Data Functions (for demo when API is unavailable)

function getMockAnalysis(jobRole: string): ResumeAnalysis {
  return {
    overallScore: 72,
    atsScore: 78,
    keywordScore: 65,
    formatScore: 85,
    contentScore: 70,
    verdictSummary: 'Your resume is good but needs some improvements to be recruiter-ready. Focus on adding more relevant keywords and quantifying your achievements.',
    sectionFeedback: [
      {
        name: 'Experience',
        icon: 'experience',
        score: 75,
        summary: 'Good experience section with room for improvement',
        strengths: [
          'Clear job titles and dates',
          'Good use of action verbs',
          'Relevant industry experience',
        ],
        improvements: [
          'Add more quantifiable achievements (numbers, percentages)',
          'Include more job-relevant keywords',
          'Expand on technical implementations',
        ],
      },
      {
        name: 'Skills',
        icon: 'skills',
        score: 68,
        summary: 'Skills section needs more relevant technical skills',
        strengths: [
          'Well-organized skills categories',
          'Includes both technical and soft skills',
        ],
        improvements: [
          'Add more industry-specific tools and technologies',
          'Include proficiency levels',
          'Add certifications if available',
        ],
      },
      {
        name: 'Education',
        icon: 'education',
        score: 82,
        summary: 'Education section is well-structured',
        strengths: [
          'Clear degree and institution information',
          'Relevant coursework included',
          'Good GPA mention',
        ],
        improvements: [
          'Add relevant academic projects',
          'Include honors or awards if applicable',
        ],
      },
      {
        name: 'Projects',
        icon: 'projects',
        score: 65,
        summary: 'Projects section could be stronger',
        strengths: [
          'Technical projects included',
          'Links to repositories provided',
        ],
        improvements: [
          'Add more detailed project descriptions',
          'Highlight technologies used more prominently',
          'Include impact metrics where possible',
        ],
      },
    ],
    keywordsFound: [
      'JavaScript',
      'React',
      'Node.js',
      'Python',
      'SQL',
      'Git',
      'Agile',
      'REST API',
    ],
    keywordsMissing: [
      'TypeScript',
      'AWS',
      'Docker',
      'Kubernetes',
      'CI/CD',
      'System Design',
      'Microservices',
      'GraphQL',
    ],
    priorityImprovements: [
      {
        title: 'Add Missing Critical Keywords',
        description: 'Include TypeScript, AWS, and Docker in your skills and experience sections to match job requirements.',
        impact: 'high',
      },
      {
        title: 'Quantify Your Achievements',
        description: 'Add specific numbers and percentages to your accomplishments (e.g., "Improved load time by 40%").',
        impact: 'high',
      },
      {
        title: 'Expand Project Descriptions',
        description: 'Provide more detail about your technical projects, including scale, challenges, and outcomes.',
        impact: 'medium',
      },
      {
        title: 'Add Certifications',
        description: 'Consider adding relevant certifications like AWS Certified Developer or similar credentials.',
        impact: 'medium',
      },
      {
        title: 'Optimize Summary Section',
        description: 'Add a compelling professional summary that highlights your key strengths and career goals.',
        impact: 'low',
      },
    ],
  }
}

function getMockSkillsGap(): SkillsGapAnalysis {
  return {
    currentSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'REST API'],
    missingSkills: [
      { name: 'TypeScript', currentLevel: 0, requiredLevel: 80, importance: 'critical', category: 'Languages' },
      { name: 'AWS', currentLevel: 0, requiredLevel: 70, importance: 'critical', category: 'Cloud' },
      { name: 'Docker', currentLevel: 0, requiredLevel: 75, importance: 'important', category: 'DevOps' },
      { name: 'Kubernetes', currentLevel: 0, requiredLevel: 60, importance: 'nice-to-have', category: 'DevOps' },
    ],
    weakSkills: [
      { name: 'System Design', currentLevel: 30, requiredLevel: 70, importance: 'critical', category: 'Architecture' },
      { name: 'Data Structures', currentLevel: 50, requiredLevel: 80, importance: 'important', category: 'Fundamentals' },
    ],
    highRoiSkills: [
      { name: 'TypeScript', currentLevel: 0, requiredLevel: 80, importance: 'critical', category: 'Languages' },
      { name: 'AWS', currentLevel: 0, requiredLevel: 70, importance: 'critical', category: 'Cloud' },
      { name: 'System Design', currentLevel: 30, requiredLevel: 70, importance: 'critical', category: 'Architecture' },
    ],
    roadmap: {
      phase1: [
        {
          day: 'Days 1-30',
          title: 'Foundation Building',
          description: 'Focus on TypeScript fundamentals and strengthen core programming concepts',
          skills: ['TypeScript', 'Advanced JavaScript', 'Data Structures'],
          resources: [
            { title: 'TypeScript Full Course', type: 'video', provider: 'YouTube', url: '#', duration: '3h', isFree: true },
            { title: 'TypeScript Deep Dive', type: 'course', provider: 'Udemy', url: '#', duration: '8h', isFree: false },
          ],
        },
      ],
      phase2: [
        {
          day: 'Days 31-60',
          title: 'Cloud & DevOps',
          description: 'Learn AWS fundamentals and containerization with Docker',
          skills: ['AWS', 'Docker', 'CI/CD'],
          resources: [
            { title: 'AWS Certified Developer', type: 'certification', provider: 'AWS', url: '#', duration: '40h', isFree: false },
            { title: 'Docker for Beginners', type: 'course', provider: 'Coursera', url: '#', duration: '10h', isFree: true },
          ],
        },
      ],
      phase3: [
        {
          day: 'Days 61-90',
          title: 'System Design & Practice',
          description: 'Master system design concepts and build portfolio projects',
          skills: ['System Design', 'Microservices', 'Portfolio Projects'],
          resources: [
            { title: 'System Design Primer', type: 'course', provider: 'GitHub', url: '#', duration: '20h', isFree: true },
            { title: 'Build a Full-Stack App', type: 'project', provider: 'Self-guided', url: '#', duration: '30h', isFree: true },
          ],
        },
      ],
    },
  }
}

function getMockSampleResumes(jobRole: string): SampleResume[] {
  return [
    {
      id: '1',
      name: 'Alex Thompson',
      role: 'Senior Software Engineer',
      company: 'Google',
      score: 95,
      highlights: [
        'Clear quantified achievements',
        'Perfect keyword optimization',
        'Excellent project showcase',
      ],
      pdfUrl: '#',
    },
    {
      id: '2',
      name: 'Sarah Chen',
      role: 'Software Engineer',
      company: 'Meta',
      score: 92,
      highlights: [
        'Strong technical skills section',
        'Great use of action verbs',
        'Impactful summary statement',
      ],
      pdfUrl: '#',
    },
    {
      id: '3',
      name: 'Michael Park',
      role: 'Full Stack Developer',
      company: 'Amazon',
      score: 90,
      highlights: [
        'Excellent project descriptions',
        'Well-organized layout',
        'Relevant certifications',
      ],
      pdfUrl: '#',
    },
  ]
}

function getMockJobMarketData(jobRole: string): JobMarketData {
  return {
    role: jobRole,
    demandTrend: 'increasing',
    averageSalary: { min: 120000, max: 180000, currency: 'USD' },
    topSkills: [
      { name: 'TypeScript', demand: 92 },
      { name: 'React', demand: 88 },
      { name: 'Node.js', demand: 85 },
      { name: 'AWS', demand: 82 },
      { name: 'Python', demand: 78 },
      { name: 'Docker', demand: 75 },
      { name: 'Kubernetes', demand: 70 },
      { name: 'GraphQL', demand: 65 },
    ],
    topCompanies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix'],
    jobCount: 15420,
  }
}
