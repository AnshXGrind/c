import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Zap, 
  Brain,
  FileText,
  Target,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Resume & Career Intelligence System",
  description: "Get AI-powered resume analysis, find skill gaps, and get personalized learning roadmaps",
};

const features = [
  {
    icon: Zap,
    title: "Smart Resume Scoring",
    description: "Get an AI-driven score out of 100 with detailed breakdowns of skills, experience relevance, and role alignment."
  },
  {
    icon: Brain,
    title: "Skill Gap Analysis",
    description: "Identify missing skills and understand exactly what you need to learn for your target role."
  },
  {
    icon: TrendingUp,
    title: "90-Day Learning Roadmap",
    description: "Get a personalized, step-by-step learning path with free resources and realistic time estimates."
  },
  {
    icon: Target,
    title: "Rejection Explanation",
    description: "Understand why resumes get rejected with specific, actionable improvement suggestions."
  }
];

const steps = [
  {
    number: "1",
    title: "Upload Your Resume",
    description: "Upload your resume in PDF or DOCX format"
  },
  {
    number: "2",
    title: "Paste Job Description",
    description: "Copy and paste the job description you're applying for"
  },
  {
    number: "3",
    title: "Get Instant Analysis",
    description: "Receive AI-powered insights about your fit for the role"
  },
  {
    number: "4",
    title: "Follow Roadmap",
    description: "Use your personalized learning roadmap to improve"
  }
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Ace Your Next Interview
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get AI-powered resume analysis, identify skill gaps, and follow a personalized 90-day learning roadmap to land your dream job.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/analyze">
                <Button size="lg" className="text-base h-12 px-8">
                  Start Analyzing
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-base h-12 px-8">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">10k+</p>
              <p className="text-sm text-muted-foreground">Resumes Analyzed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">92%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground">Free Resources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:py-32">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to optimize your career
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 space-y-4">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 sm:py-32 bg-muted/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Get insights in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={step.number} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute left-1/2 w-6 h-0.5 bg-primary/20" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:py-32 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Level Up Your Career?
            </h2>
            <p className="text-lg text-muted-foreground">
              Get your personalized resume analysis and learning roadmap today
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/analyze">
              <Button size="lg" className="text-base h-12 px-8">
                Start Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-12 bg-muted/20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/analyze" className="hover:text-foreground transition">Analyzer</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Guides</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Contact</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">GitHub</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2026 AI Resume Intelligence. All rights reserved.</p>
            <p>Built with ❤️ for career growth</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
