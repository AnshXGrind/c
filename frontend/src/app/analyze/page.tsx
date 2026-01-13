import { ResumeAnalyzer } from '@/components/resume/resume-analyzer'

export const metadata = {
  title: 'Resume Analyzer | Talentra - AI-Powered Career Platform',
  description: 'Get instant AI-powered resume analysis with ATS compatibility scores, keyword optimization, missing skills identification, and a personalized 90-day improvement roadmap.',
}

export default function AnalyzePage() {
  return (
    <div className="container py-10 md:py-16">
      <ResumeAnalyzer />
    </div>
  )
}
