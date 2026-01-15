"use client";

import { useState, useRef } from "react";
import { UploadResume } from "@/components/resume/UploadResume";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { ScoreCard } from "@/components/results/ScoreCard";
import { SkillGapList } from "@/components/results/SkillGapList";
import { RoadmapTimeline } from "@/components/results/RoadmapTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

interface AnalysisResult {
  success: boolean;
  data: {
    score: number;
    sub_scores: {
      skills_match: number;
      experience_relevance: number;
      keyword_coverage: number;
      role_alignment: number;
    };
    rejection_reasons: string[];
    missing_skills: string[];
    present_skills: string[];
    required_skills: string[];
    learning_roadmap: any;
  };
}

export default function AnalyzePage() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!resume || !jobDescription.trim()) {
      setError("Please upload a resume and enter a job description");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("job_description", jobDescription);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Resume Intelligence Analyzer
          </h1>
          <p className="text-lg text-muted-foreground">
            Get AI-powered insights on how well your resume matches the job
          </p>
        </div>

        {/* Input Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <UploadResume 
            onFileSelect={setResume} 
            selectedFile={resume}
            isProcessing={isAnalyzing}
          />
          <JobDescriptionInput 
            value={jobDescription}
            onChange={setJobDescription}
            disabled={isAnalyzing}
          />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Analyze Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resume || !jobDescription.trim()}
            className="min-w-[300px] h-12 text-base"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Analyze Resume
              </>
            )}
          </Button>
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-lg font-medium">
                  AI is analyzing your resume...
                </p>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">
                This typically takes 10-30 seconds
              </p>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {result && (
          <div ref={resultsRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Success Message */}
            <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
              <CardContent className="pt-6 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-green-700 dark:text-green-400">
                  Analysis complete! Review your results below.
                </p>
              </CardContent>
            </Card>

            {/* Results Tabs */}
            <Tabs defaultValue="score" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="score">Score & Match</TabsTrigger>
                <TabsTrigger value="skills">Skill Gap</TabsTrigger>
                <TabsTrigger value="roadmap">Learning Path</TabsTrigger>
              </TabsList>

              {/* Score Tab */}
              <TabsContent value="score" className="space-y-4">
                <ScoreCard
                  score={result.data.score}
                  subScores={result.data.sub_scores}
                />

                {/* Rejection Reasons */}
                {result.data.rejection_reasons.length > 0 && (
                  <Card className="border-orange-200 dark:border-orange-800">
                    <CardContent className="pt-6 space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-2">
                        {result.data.rejection_reasons.map((reason, idx) => (
                          <li 
                            key={idx}
                            className="flex gap-3 text-sm"
                          >
                            <span className="text-orange-500 font-bold flex-shrink-0">
                              {idx + 1}.
                            </span>
                            <span className="text-muted-foreground">
                              {reason}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills">
                <SkillGapList
                  presentSkills={result.data.present_skills}
                  missingSkills={result.data.missing_skills}
                  requiredSkills={result.data.required_skills}
                />
              </TabsContent>

              {/* Roadmap Tab */}
              <TabsContent value="roadmap">
                <RoadmapTimeline
                  roadmap={result.data.learning_roadmap}
                />
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setResult(null);
                  setResume(null);
                  setJobDescription("");
                }}
              >
                Analyze Another Resume
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const element = document.documentElement;
                  element.style.scrollBehavior = "smooth";
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Back to Top
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
