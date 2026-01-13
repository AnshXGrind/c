import { SkillsGapAnalyzer } from '@/components/skills/skills-gap-analyzer'

export const metadata = {
  title: 'Skills Gap Analysis | CareerAI',
  description: 'Discover your skill gaps and get a personalized learning roadmap to become job-ready.',
}

export default function SkillsPage() {
  return (
    <div className="container py-10 md:py-16">
      <SkillsGapAnalyzer />
    </div>
  )
}
