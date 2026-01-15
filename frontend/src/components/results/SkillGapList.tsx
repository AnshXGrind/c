"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  BookOpen,
  ExternalLink 
} from "lucide-react";

interface SkillGapListProps {
  presentSkills: string[];
  missingSkills: string[];
  requiredSkills: string[];
  isLoading?: boolean;
}

export function SkillGapList({ 
  presentSkills, 
  missingSkills, 
  requiredSkills,
  isLoading = false 
}: SkillGapListProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-6 w-20 bg-muted rounded-full"></div>
              ))}
            </div>
            <div className="h-6 bg-muted rounded w-1/3 mt-4"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 w-20 bg-muted rounded-full"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const matchPercentage = requiredSkills.length > 0
    ? Math.round((presentSkills.length / requiredSkills.length) * 100)
    : 100;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Skill Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {presentSkills.length}
            </p>
            <p className="text-xs text-muted-foreground">Skills Present</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {missingSkills.length}
            </p>
            <p className="text-xs text-muted-foreground">Skills Missing</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {matchPercentage}%
            </p>
            <p className="text-xs text-muted-foreground">Match Rate</p>
          </div>
        </div>

        {/* Present Skills */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <h4 className="font-medium text-sm">Skills You Have</h4>
            <Badge variant="secondary" className="ml-auto">
              {presentSkills.length}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {presentSkills.length > 0 ? (
              presentSkills.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="outline"
                  className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No matching skills detected
              </p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <h4 className="font-medium text-sm">Skills to Develop</h4>
            <Badge variant="secondary" className="ml-auto">
              {missingSkills.length}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="outline"
                  className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                >
                  {skill}
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Badge>
              ))
            ) : (
              <p className="text-sm text-green-600 dark:text-green-400">
                🎉 You have all the required skills!
              </p>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        {missingSkills.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-2">💡 Quick Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Focus on the top 3-5 missing skills first</li>
              <li>• Check the Learning Roadmap for study resources</li>
              <li>• Consider adding projects that demonstrate these skills</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
