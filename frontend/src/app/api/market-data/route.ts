import { NextRequest, NextResponse } from 'next/server'

// Python ML Service URL
const PYTHON_ML_SERVICE = process.env.PYTHON_ML_SERVICE_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    if (!role) {
      return NextResponse.json(
        { error: 'Job role parameter is required' },
        { status: 400 }
      )
    }

    // Forward request to Python ML service
    const response = await fetch(
      `${PYTHON_ML_SERVICE}/api/market-data?role=${encodeURIComponent(role)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'ML service error' }))
      return NextResponse.json(
        { error: errorData.error || 'Failed to fetch market data' },
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
