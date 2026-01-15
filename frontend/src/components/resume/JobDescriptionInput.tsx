"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardCheck, FileText } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SAMPLE_JD = `Senior Full-Stack Developer

We are looking for an experienced Full-Stack Developer to join our team.

Requirements:
- 5+ years of experience in software development
- Strong proficiency in React, TypeScript, and Node.js
- Experience with Python and FastAPI or Django
- Solid understanding of SQL and NoSQL databases (PostgreSQL, MongoDB)
- Experience with cloud platforms (AWS, GCP, or Azure)
- Familiarity with Docker and Kubernetes
- Understanding of CI/CD pipelines
- Strong problem-solving skills

Nice to Have:
- Experience with Machine Learning or AI integration
- Knowledge of GraphQL
- Open source contributions

Responsibilities:
- Design and implement scalable web applications
- Write clean, maintainable code
- Collaborate with cross-functional teams
- Mentor junior developers
- Participate in code reviews`;

export function JobDescriptionInput({ 
  value, 
  onChange, 
  disabled = false 
}: JobDescriptionInputProps) {
  const [copied, setCopied] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch {
      console.error("Failed to read clipboard");
    }
  };

  const handleUseSample = () => {
    onChange(SAMPLE_JD);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="job-description" className="text-lg font-semibold">
              Job Description
            </Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUseSample}
                disabled={disabled}
              >
                <FileText className="h-4 w-4 mr-1" />
                Use Sample
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePaste}
                disabled={disabled}
              >
                <Clipboard className="h-4 w-4 mr-1" />
                Paste
              </Button>
              {value && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={disabled}
                >
                  {copied ? (
                    <ClipboardCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clipboard className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          <Textarea
            id="job-description"
            placeholder="Paste the job description here... Include requirements, responsibilities, and desired qualifications for the best analysis."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="min-h-[250px] resize-y"
          />

          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{wordCount} words</span>
            <span>
              {value.length < 100 
                ? "Add more details for better analysis" 
                : value.length < 500 
                  ? "Good amount of detail"
                  : "Comprehensive description"
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
