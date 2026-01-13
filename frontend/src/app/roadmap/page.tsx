import { RoadmapGenerator } from '@/components/roadmap/roadmap-generator'

export const metadata = {
  title: 'Career Roadmap | CareerAI',
  description: 'Get a personalized 30-60-90 day learning roadmap tailored to your career goals.',
}

export default function RoadmapPage() {
  return (
    <div className="container py-10 md:py-16">
      <RoadmapGenerator />
    </div>
  )
}
