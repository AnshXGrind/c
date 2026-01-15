"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Calendar,
  Clock,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Code,
  Target
} from "lucide-react";

interface Resource {
  name: string;
  url: string;
  type: "video" | "article" | "course" | "docs" | "project";
  estimated_time?: string;
}

interface SkillItem {
  skill: string;
  priority: "high" | "medium" | "low";
  resources: Resource[];
  estimated_hours: number;
  learning_objectives?: string[];
  milestones?: string[];
}

interface LearningRoadmap {
  days_1_30: SkillItem[];
  days_31_60: SkillItem[];
  days_61_90: SkillItem[];
  weekly_schedule?: {
    weekdays: string;
    weekends: string;
  };
  success_metrics?: string[];
}

interface RoadmapTimelineProps {
  roadmap: LearningRoadmap;
  isLoading?: boolean;
}

export function RoadmapTimeline({ 
  roadmap, 
  isLoading = false 
}: RoadmapTimelineProps) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      case "course":
        return <BookOpen className="h-4 w-4" />;
      case "docs":
        return <FileText className="h-4 w-4" />;
      case "project":
        return <Code className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const phases = [
    { 
      key: "days_1_30", 
      title: "Phase 1: Foundation", 
      period: "Days 1-30",
      description: "Build core skills and fundamentals",
      color: "border-l-blue-500"
    },
    { 
      key: "days_31_60", 
      title: "Phase 2: Intermediate", 
      period: "Days 31-60",
      description: "Deepen knowledge and start projects",
      color: "border-l-purple-500"
    },
    { 
      key: "days_61_90", 
      title: "Phase 3: Advanced", 
      period: "Days 61-90",
      description: "Master skills and complete portfolio",
      color: "border-l-green-500"
    }
  ];

  const totalHours = [
    ...roadmap.days_1_30,
    ...roadmap.days_31_60,
    ...roadmap.days_61_90
  ].reduce((sum, item) => sum + (item.estimated_hours || 0), 0);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const isEmpty = 
    roadmap.days_1_30.length === 0 && 
    roadmap.days_31_60.length === 0 && 
    roadmap.days_61_90.length === 0;

  if (isEmpty) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Learning Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
              You&apos;re All Set! 🎉
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              No missing skills detected. Focus on deepening your existing expertise.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            90-Day Learning Roadmap
          </span>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            ~{totalHours} hours total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Schedule */}
        {roadmap.weekly_schedule && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">📅 Suggested Schedule</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Weekdays:</span>
                <p className="font-medium">{roadmap.weekly_schedule.weekdays}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Weekends:</span>
                <p className="font-medium">{roadmap.weekly_schedule.weekends}</p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Phases */}
        <Accordion type="single" collapsible defaultValue="days_1_30">
          {phases.map(({ key, title, period, description, color }) => {
            const items = roadmap[key as keyof LearningRoadmap] as SkillItem[];
            if (!Array.isArray(items) || items.length === 0) return null;

            const phaseHours = items.reduce((sum, item) => sum + (item.estimated_hours || 0), 0);

            return (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className={`border-l-4 ${color} pl-4 hover:no-underline`}>
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {period}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {items.length} skills • ~{phaseHours} hours
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-4 space-y-4">
                  <p className="text-sm text-muted-foreground">{description}</p>
                  
                  {items.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="border rounded-lg p-4 space-y-3 bg-card hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{item.skill}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.estimated_hours}h
                          </Badge>
                        </div>
                      </div>

                      {/* Learning Objectives */}
                      {item.learning_objectives && item.learning_objectives.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Learning Objectives:
                          </p>
                          <ul className="text-sm space-y-1">
                            {item.learning_objectives.map((obj, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Resources */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Free Resources:
                        </p>
                        <div className="space-y-2">
                          {item.resources.map((resource, i) => (
                            <a
                              key={i}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-muted transition-colors group"
                            >
                              {getResourceIcon(resource.type)}
                              <span className="flex-1 group-hover:text-primary transition-colors">
                                {resource.name}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {resource.type}
                              </Badge>
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Milestones */}
                      {item.milestones && item.milestones.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            🎯 Milestones:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {item.milestones.map((milestone, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {milestone}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Success Metrics */}
        {roadmap.success_metrics && roadmap.success_metrics.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-2">🏆 Success Metrics</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {roadmap.success_metrics.map((metric, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {metric}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
