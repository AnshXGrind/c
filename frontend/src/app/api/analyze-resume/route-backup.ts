import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeText, role } = body

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      )
    }

    if (!role || typeof role !== 'string') {
      return NextResponse.json(
        { error: 'Job role is required' },
        { status: 400 }
      )
    }

    // Mock response for testing
    const mockResponse = {
      ats_score: 75,
      verdict: 'Your resume is good but could use some improvements for better ATS compatibility.',
      missing_skills: ['TypeScript', 'Docker', 'Kubernetes', 'CI/CD', 'System Design'],
      weak_sections: ['Projects', 'Skills'],
      roadmap: [
        { day: 1, task: 'Add TypeScript to your skillset - complete online tutorial' },
        { day: 7, task: 'Update resume with quantified achievements' },
        { day: 14, task: 'Learn Docker basics and add to projects' },
        { day: 30, task: 'Build a full-stack project showcasing new skills' },
        { day: 60, task: 'Study system design patterns and architectures' },
        { day: 90, task: 'Complete resume overhaul with all improvements' }
      ]
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    )
  }
}
