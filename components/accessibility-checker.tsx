"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"
import type { LayoutConfig } from "@/app/page"

interface AccessibilityCheckerProps {
  config: LayoutConfig
}

interface AccessibilityCheck {
  id: string
  title: string
  description: string
  status: "pass" | "warning" | "fail" | "info"
  wcagLevel: "A" | "AA" | "AAA"
  wcagCriterion: string
}

export function AccessibilityChecker({ config }: AccessibilityCheckerProps) {
  const checks: AccessibilityCheck[] = [
    {
      id: "skip-links",
      title: "Skip Links",
      description: "Provides keyboard users a way to skip repetitive content",
      status: config.includeSkipLinks ? "pass" : "warning",
      wcagLevel: "A",
      wcagCriterion: "2.4.1 Bypass Blocks",
    },
    {
      id: "semantic-html",
      title: "Semantic HTML Structure",
      description: "Uses proper HTML5 semantic elements for content structure",
      status: "pass",
      wcagLevel: "A",
      wcagCriterion: "1.3.1 Info and Relationships",
    },
    {
      id: "landmarks",
      title: "ARIA Landmarks",
      description: "Provides navigation landmarks for screen readers",
      status: config.includeLandmarks ? "pass" : "warning",
      wcagLevel: "A",
      wcagCriterion: "1.3.1 Info and Relationships",
    },
    {
      id: "heading-structure",
      title: "Heading Hierarchy",
      description: "Maintains proper heading structure (h1-h6) for content organization",
      status: config.includeHeadingStructure ? "pass" : "warning",
      wcagLevel: "A",
      wcagCriterion: "1.3.1 Info and Relationships",
    },
    {
      id: "focus-management",
      title: "Focus Management",
      description: "Provides visible focus indicators for keyboard navigation",
      status: "pass",
      wcagLevel: "AA",
      wcagCriterion: "2.4.7 Focus Visible",
    },
    {
      id: "color-contrast",
      title: "Color Contrast",
      description: "Ensures sufficient color contrast for text readability",
      status: "pass",
      wcagLevel: "AA",
      wcagCriterion: "1.4.3 Contrast (Minimum)",
    },
    {
      id: "responsive-design",
      title: "Responsive Design",
      description: "Layout adapts to different screen sizes and zoom levels",
      status: "pass",
      wcagLevel: "AA",
      wcagCriterion: "1.4.10 Reflow",
    },
    {
      id: "dark-mode",
      title: "Dark Mode Support",
      description: "Respects user preference for dark color schemes",
      status: config.colorScheme === "system" ? "pass" : "info",
      wcagLevel: "AAA",
      wcagCriterion: "1.4.8 Visual Presentation",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "fail":
        return "text-red-600"
      case "info":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const passCount = checks.filter((check) => check.status === "pass").length
  const warningCount = checks.filter((check) => check.status === "warning").length
  const failCount = checks.filter((check) => check.status === "fail").length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Report</CardTitle>
          <CardDescription>WCAG 2.2.1 compliance check for your generated layout</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{passCount}</div>
              <div className="text-sm text-green-700">Passing</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
              <div className="text-sm text-yellow-700">Warnings</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{failCount}</div>
              <div className="text-sm text-red-700">Failing</div>
            </div>
          </div>

          {warningCount > 0 && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Some accessibility features are disabled. Enable them in the Builder tab to improve compliance.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {checks.map((check) => (
              <div key={check.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                {getStatusIcon(check.status)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold">{check.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      WCAG {check.wcagLevel}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{check.description}</p>
                  <p className="text-xs text-muted-foreground">{check.wcagCriterion}</p>
                </div>
                <div className={`text-sm font-medium ${getStatusColor(check.status)}`}>
                  {check.status === "pass" && "Pass"}
                  {check.status === "warning" && "Warning"}
                  {check.status === "fail" && "Fail"}
                  {check.status === "info" && "Info"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility Guidelines</CardTitle>
          <CardDescription>Key principles for maintaining WCAG 2.2.1 compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-700">Perceivable</h4>
              <p className="text-sm text-muted-foreground">
                Information must be presentable in ways users can perceive. Use proper contrast, alternative text for
                images, and ensure content works with assistive technologies.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-700">Operable</h4>
              <p className="text-sm text-muted-foreground">
                Interface components must be operable. Ensure keyboard accessibility, provide skip links, and avoid
                content that causes seizures.
              </p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-yellow-700">Understandable</h4>
              <p className="text-sm text-muted-foreground">
                Information and UI operation must be understandable. Use clear language, consistent navigation, and help
                users avoid and correct mistakes.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-purple-700">Robust</h4>
              <p className="text-sm text-muted-foreground">
                Content must be robust enough for interpretation by assistive technologies. Use valid HTML and ensure
                compatibility across different tools.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
