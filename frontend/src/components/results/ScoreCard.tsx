"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Target,
  Briefcase,
  Search,
  UserCheck
} from "lucide-react";

interface SubScores {
  skills_match: number;
  experience_relevance: number;
  keyword_coverage: number;
  role_alignment: number;
}

interface ScoreCardProps {
  score: number;
  subScores: SubScores;
  isLoading?: boolean;
}

export function ScoreCard({ 
  score, 
  subScores, 
  isLoading = false 
}: ScoreCardProps) {
  const getScoreColor = (value: number): string => {
    if (value >= 80) return "text-green-500";
    if (value >= 60) return "text-yellow-500";
    if (value >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBg = (value: number): string => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-yellow-500";
    if (value >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreLabel = (value: number): string => {
    if (value >= 80) return "Excellent Match";
    if (value >= 60) return "Good Match";
    if (value >= 40) return "Fair Match";
    return "Needs Improvement";
  };

  const getScoreIcon = (value: number) => {
    if (value >= 80) return <CheckCircle2 className="h-6 w-6 text-green-500" />;
    if (value >= 60) return <AlertCircle className="h-6 w-6 text-yellow-500" />;
    return <XCircle className="h-6 w-6 text-red-500" />;
  };

  const subScoreItems = [
    {
      key: "skills_match",
      label: "Skills Match",
      icon: Target,
      description: "How well your skills match the requirements"
    },
    {
      key: "experience_relevance",
      label: "Experience Relevance",
      icon: Briefcase,
      description: "Alignment of your work history"
    },
    {
      key: "keyword_coverage",
      label: "Keyword Coverage",
      icon: Search,
      description: "Presence of key terms from the JD"
    },
    {
      key: "role_alignment",
      label: "Role Alignment",
      icon: UserCheck,
      description: "Overall fit for the position"
    }
  ];

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-muted"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-2 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          {getScoreIcon(score)}
          Match Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Circle */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className={`
            relative flex items-center justify-center
            w-36 h-36 rounded-full 
            border-8 ${score >= 60 ? "border-primary/20" : "border-red-200"}
          `}>
            <div className="text-center">
              <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
          </div>
          <Badge 
            className={`mt-4 ${getScoreBg(score)} text-white`}
            variant="secondary"
          >
            {getScoreLabel(score)}
          </Badge>
        </div>

        {/* Sub-scores */}
        <div className="space-y-4">
          {subScoreItems.map(({ key, label, icon: Icon, description }) => {
            const value = subScores[key as keyof SubScores];
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${getScoreColor(value)}`}>
                    {value}%
                  </span>
                </div>
                <Progress 
                  value={value} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Score Interpretation */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2">What This Means</h4>
          <p className="text-sm text-muted-foreground">
            {score >= 80 && 
              "Your resume is an excellent match for this position. You have most of the required qualifications and should feel confident applying."
            }
            {score >= 60 && score < 80 &&
              "Your resume is a good match with room for improvement. Focus on the areas with lower scores to strengthen your application."
            }
            {score >= 40 && score < 60 &&
              "Your resume has some relevant qualifications but may need more work to be competitive. Review the skill gaps and learning roadmap."
            }
            {score < 40 &&
              "Your resume needs significant improvement for this role. Consider the learning roadmap to develop the required skills."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
