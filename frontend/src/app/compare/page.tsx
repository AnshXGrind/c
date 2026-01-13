import { ResumeComparison } from '@/components/compare/resume-comparison'

export const metadata = {
  title: 'Compare Resumes | CareerAI',
  description: 'Compare your resume side-by-side with recruiter-approved samples and see what top candidates do differently.',
}

export default function ComparePage() {
  return (
    <div className="container py-10 md:py-16">
      <ResumeComparison />
    </div>
  )
}
