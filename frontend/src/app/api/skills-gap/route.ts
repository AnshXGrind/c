import { NextRequest, NextResponse } from 'next/server'

// Python ML Service URL
const PYTHON_ML_SERVICE = process.env.PYTHON_ML_SERVICE_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const targetRole = formData.get('target_role') as string

    // Validate input
    if (!file) {
      return NextResponse.json(
        { error: 'Resume file is required' },
        { status: 400 }
      )
    }

    if (!targetRole || typeof targetRole !== 'string') {
      return NextResponse.json(
        { error: 'Target role is required' },
        { status: 400 }
      )
    }

    // Forward request to Python ML service
    const mlFormData = new FormData()
    mlFormData.append('file', file)
    mlFormData.append('target_role', targetRole)

    const response = await fetch(`${PYTHON_ML_SERVICE}/api/skills-gap`, {
      method: 'POST',
      body: mlFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'ML service error' }))
      return NextResponse.json(
        { error: errorData.error || 'Failed to analyze skills gap' },
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
