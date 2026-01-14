import { NextRequest, NextResponse } from 'next/server'

// Python ML Service URL
const PYTHON_ML_SERVICE = process.env.PYTHON_ML_SERVICE_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { targetRole, currentSkills, targetSkills, timeframe } = body

    // Validate input
    if (!targetRole || !currentSkills || !targetSkills) {
      return NextResponse.json(
        { error: 'Target role, current skills, and target skills are required' },
        { status: 400 }
      )
    }

    // Forward request to Python ML service
    const response = await fetch(`${PYTHON_ML_SERVICE}/api/roadmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target_role: targetRole,
        current_skills: currentSkills,
        target_skills: targetSkills,
        timeframe: timeframe || 90,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'ML service error' }))
      return NextResponse.json(
        { error: errorData.error || 'Failed to generate roadmap' },
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
