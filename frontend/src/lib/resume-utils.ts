// Resume text extraction utilities

export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase()
  const fileType = file.type

  // Send all files to server for extraction
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const response = await fetch('/api/extract-text', {
      method: 'POST',
      body: formData,
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to extract text from file')
    }
    
    return data.text
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to extract text from file. Please try a different file or format.')
  }
}

// API response types
export interface RecruiterDecision {
  would_call: boolean
  confidence: string
  reasons: string[]
  improvements_needed: string[]
}

export interface AnalysisResponse {
  ats_score: number
  verdict: string
  recruiter_decision: RecruiterDecision
  formatting_score: number
  keyword_score: number
  experience_relevance: number
  missing_skills: string[]
  weak_sections: string[]
  roadmap: { day: number; task: string }[]
  skills_gap: {
    current_skills: string[]
    skill_gaps: { skill: string; importance: string; learning_time: string }[]
  }
}

export interface AnalysisError {
  error: string
}

// Call the analyze-resume API
export async function analyzeResumeWithAI(
  resumeText: string,
  role: string
): Promise<AnalysisResponse> {
  const response = await fetch('/api/analyze-resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resumeText, role }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Analysis failed')
  }

  return data as AnalysisResponse
}
