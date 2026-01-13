import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

interface AnalysisResult {
  ats_score: number
  verdict: string
  recruiter_decision: {
    would_call: boolean
    confidence: string
    reasons: string[]
    improvements_needed: string[]
  }
  missing_skills: string[]
  weak_sections: string[]
  roadmap: { day: number; task: string }[]
  skills_gap: {
    current_skills: string[]
    skill_gaps: { skill: string; importance: string; learning_time: string }[]
  }
  formatting_score: number
  keyword_score: number
  experience_relevance: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeText, role } = body

    // Validate input
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

    // Check API key
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Please add GROQ_API_KEY to your .env.local file.' },
        { status: 500 }
      )
    }

    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    // Enhanced prompt with recruiter decision
    const prompt = `You are an expert recruiter and ATS (Applicant Tracking System) analyst with 15+ years of experience hiring for tech companies like Google, Meta, Amazon, and Microsoft.

Analyze this resume for a "${role}" position and provide a DETAILED, HONEST assessment.

RESUME TEXT:
${resumeText}

Respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "ats_score": <number 0-100>,
  "verdict": "<2-3 sentence honest assessment of the candidate>",
  "recruiter_decision": {
    "would_call": <true if recruiter would call for interview, false otherwise>,
    "confidence": "<high|medium|low> - how confident are you in this decision",
    "reasons": ["<reason 1 why recruiter would/wouldn't call>", "<reason 2>", "<reason 3>"],
    "improvements_needed": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"]
  },
  "formatting_score": <number 0-100 for resume layout and formatting>,
  "keyword_score": <number 0-100 for relevant keywords for the role>,
  "experience_relevance": <number 0-100 for how relevant experience is to target role>,
  "missing_skills": ["<critical skill 1>", "<critical skill 2>", "<skill 3>", "<skill 4>", "<skill 5>"],
  "weak_sections": ["<weak section 1 with specific issue>", "<weak section 2 with specific issue>"],
  "roadmap": [
    {"day": 1, "task": "<immediate action to take today>"},
    {"day": 7, "task": "<skill or improvement to work on this week>"},
    {"day": 14, "task": "<project or certification to start>"},
    {"day": 30, "task": "<milestone to achieve by end of month>"},
    {"day": 60, "task": "<significant skill to master>"},
    {"day": 90, "task": "<final goal for job readiness>"}
  ],
  "skills_gap": {
    "current_skills": ["<skill from resume>", "<skill from resume>", ...all detected skills],
    "skill_gaps": [
      {"skill": "<missing skill name>", "importance": "critical", "learning_time": "1-2 weeks"},
      {"skill": "<missing skill name>", "importance": "high", "learning_time": "2-4 weeks"},
      {"skill": "<missing skill name>", "importance": "medium", "learning_time": "1-2 months"}
    ]
  }
}

SCORING GUIDELINES:
- ATS Score 90-100: Excellent, will pass most ATS systems, highly likely to get interviews
- ATS Score 70-89: Good, will pass most systems but needs minor improvements
- ATS Score 50-69: Fair, may get filtered out by some systems, needs work
- ATS Score below 50: Poor, likely to be rejected by ATS, major improvements needed

RECRUITER DECISION GUIDELINES:
- would_call: TRUE if ATS score >= 70 AND has relevant experience AND no major red flags
- would_call: FALSE if ATS score < 60 OR missing critical skills OR poor formatting OR no relevant experience

Be HONEST and SPECIFIC. Don't sugarcoat issues. Recruiters see hundreds of resumes - what makes this one stand out or fall short?`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      max_tokens: 2000,
    })

    const responseText = completion.choices[0]?.message?.content?.trim()

    if (!responseText) {
      return NextResponse.json(
        { error: 'AI analysis failed - empty response. Please try again.' },
        { status: 500 }
      )
    }

    // Parse JSON response
    let analysisResult: AnalysisResult
    try {
      // Remove any markdown code blocks if present
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      analysisResult = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, '\nResponse:', responseText)
      return NextResponse.json(
        { error: 'AI returned invalid format. Please try again.' },
        { status: 500 }
      )
    }

    // Validate and provide defaults for missing fields
    const validatedResult: AnalysisResult = {
      ats_score: typeof analysisResult.ats_score === 'number' ? analysisResult.ats_score : 50,
      verdict: typeof analysisResult.verdict === 'string' ? analysisResult.verdict : 'Analysis complete.',
      recruiter_decision: {
        would_call: analysisResult.recruiter_decision?.would_call ?? analysisResult.ats_score >= 70,
        confidence: analysisResult.recruiter_decision?.confidence || 'medium',
        reasons: Array.isArray(analysisResult.recruiter_decision?.reasons) 
          ? analysisResult.recruiter_decision.reasons 
          : ['Based on overall resume quality'],
        improvements_needed: Array.isArray(analysisResult.recruiter_decision?.improvements_needed)
          ? analysisResult.recruiter_decision.improvements_needed
          : ['Review and update resume content']
      },
      formatting_score: typeof analysisResult.formatting_score === 'number' ? analysisResult.formatting_score : 70,
      keyword_score: typeof analysisResult.keyword_score === 'number' ? analysisResult.keyword_score : 70,
      experience_relevance: typeof analysisResult.experience_relevance === 'number' ? analysisResult.experience_relevance : 70,
      missing_skills: Array.isArray(analysisResult.missing_skills) ? analysisResult.missing_skills : [],
      weak_sections: Array.isArray(analysisResult.weak_sections) ? analysisResult.weak_sections : [],
      roadmap: Array.isArray(analysisResult.roadmap) ? analysisResult.roadmap : [],
      skills_gap: {
        current_skills: Array.isArray(analysisResult.skills_gap?.current_skills) 
          ? analysisResult.skills_gap.current_skills 
          : [],
        skill_gaps: Array.isArray(analysisResult.skills_gap?.skill_gaps)
          ? analysisResult.skills_gap.skill_gaps
          : []
      }
    }

    return NextResponse.json(validatedResult)
  } catch (error) {
    console.error('Analysis error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to analyze resume: ${errorMessage}. Please try again.` },
      { status: 500 }
    )
  }
}
