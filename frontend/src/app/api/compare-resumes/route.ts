import { NextRequest, NextResponse } from 'next/server'

// Python ML Service URL
const PYTHON_ML_SERVICE = process.env.PYTHON_ML_SERVICE_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const userResume = formData.get('user_resume') as File
    const sampleResume = formData.get('sample_resume') as File
    const jobRole = formData.get('job_role') as string

    // Validate input
    if (!userResume || !sampleResume) {
      return NextResponse.json(
        { error: 'Both resume files are required' },
        { status: 400 }
      )
    }

    if (!jobRole || typeof jobRole !== 'string') {
      return NextResponse.json(
        { error: 'Job role is required' },
        { status: 400 }
      )
    }

    // Forward request to Python ML service
    const mlFormData = new FormData()
    mlFormData.append('user_resume', userResume)
    mlFormData.append('sample_resume', sampleResume)
    mlFormData.append('job_role', jobRole)

    const response = await fetch(`${PYTHON_ML_SERVICE}/api/compare`, {
      method: 'POST',
      body: mlFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'ML service error' }))
      return NextResponse.json(
        { error: errorData.error || 'Failed to compare resumes' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('API Gateway error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Gateway error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
