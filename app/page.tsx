"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LayoutBuilder } from "@/components/layout-builder"
import { CodePreview } from "@/components/code-preview"
import { AccessibilityChecker } from "@/components/accessibility-checker"
import { Layout, Code, Accessibility } from "lucide-react"

export interface GridConfig {
  columns: number
  rows: number
  gap: number
  areas: {
    header?: string
    navigation?: string
    sidebar?: string
    main: string
    footer?: string
  }
}

export interface BreakpointConfig {
  name: string
  minWidth: number
  grid: GridConfig
}

export interface LayoutConfig {
  hasHeader: boolean
  hasNavigation: boolean
  hasSidebar: boolean
  sidebarPosition: "left" | "right"
  hasFooter: boolean
  mainContentWidth: "full" | "container" | "narrow"
  colorScheme: "light" | "dark" | "system"
  includeSkipLinks: boolean
  includeLandmarks: boolean
  includeHeadingStructure: boolean
  useGridLayout: boolean
  breakpoints: {
    mobile: BreakpointConfig
    tablet: BreakpointConfig
    desktop: BreakpointConfig
  }
}

export default function HomePage() {
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    hasHeader: true,
    hasNavigation: true,
    hasSidebar: false,
    sidebarPosition: "left",
    hasFooter: true,
    mainContentWidth: "container",
    colorScheme: "light",
    includeSkipLinks: true,
    includeLandmarks: true,
    includeHeadingStructure: true,
    useGridLayout: true,
    breakpoints: {
      mobile: {
        name: "Mobile",
        minWidth: 0,
        grid: {
          columns: 1,
          rows: 4,
          gap: 16,
          areas: {
            header: "1 / 1 / 2 / 2",
            navigation: "2 / 1 / 3 / 2",
            main: "3 / 1 / 4 / 2",
            footer: "4 / 1 / 5 / 2",
          },
        },
      },
      tablet: {
        name: "Tablet",
        minWidth: 768,
        grid: {
          columns: 2,
          rows: 3,
          gap: 20,
          areas: {
            header: "1 / 1 / 2 / 3",
            main: "2 / 1 / 3 / 2",
            sidebar: "2 / 2 / 3 / 3",
            footer: "3 / 1 / 4 / 3",
          },
        },
      },
      desktop: {
        name: "Desktop",
        minWidth: 1024,
        grid: {
          columns: 3,
          rows: 3,
          gap: 24,
          areas: {
            header: "1 / 1 / 2 / 4",
            sidebar: "2 / 1 / 3 / 2",
            main: "2 / 2 / 3 / 4",
            footer: "3 / 1 / 4 / 4",
          },
        },
      },
    },
  })

  const [activeTab, setActiveTab] = useState("builder")

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

     

      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Build Responsive Grid Layouts</h2>
          <p className="text-muted-foreground text-lg">
            Create semantic HTML layouts with CSS Grid and responsive breakpoints, built with WCAG 2.2.1 compliance.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="builder" className="flex items-center space-x-2">
              <Layout className="h-4 w-4" />
              <span>Grid Builder</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Code Preview</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center space-x-2">
              <Accessibility className="h-4 w-4" />
              <span>Accessibility</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-1">
                <LayoutBuilder config={layoutConfig} onConfigChange={setLayoutConfig} />
              </div>
              <div className="xl:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Responsive Grid Preview</CardTitle>
                    <CardDescription>See how your grid layout adapts across different screen sizes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GridLayoutPreview config={layoutConfig} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <CodePreview config={layoutConfig} />
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <AccessibilityChecker config={layoutConfig} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Grid Layout Builder. Built with accessibility and modern CSS in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function GridLayoutPreview({ config }: { config: LayoutConfig }) {
  const [activeBreakpoint, setActiveBreakpoint] = useState<"mobile" | "tablet" | "desktop">("desktop")

  const currentGrid = config.breakpoints[activeBreakpoint].grid

  const getGridStyle = () => {
    return {
      display: "grid",
      gridTemplateColumns: `repeat(${currentGrid.columns}, 1fr)`,
      gridTemplateRows: `repeat(${currentGrid.rows}, minmax(60px, auto))`,
      gap: `${currentGrid.gap}px`,
      minHeight: "300px",
      border: "2px dashed #e2e8f0",
      borderRadius: "8px",
      padding: "16px",
      backgroundColor: "#f8fafc",
    }
  }

  const getAreaStyle = (area: string) => {
    return {
      gridArea: area,
      padding: "12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center" as const,
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {(["mobile", "tablet", "desktop"] as const).map((breakpoint) => (
            <Button
              key={breakpoint}
              variant={activeBreakpoint === breakpoint ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveBreakpoint(breakpoint)}
            >
              {config.breakpoints[breakpoint].name}
              <span className="ml-1 text-xs opacity-70">{config.breakpoints[breakpoint].minWidth}px+</span>
            </Button>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          {currentGrid.columns} × {currentGrid.rows} grid, {currentGrid.gap}px gap
        </div>
      </div>

      <div style={getGridStyle()}>
        {config.hasHeader && currentGrid.areas.header && (
          <div style={{ ...getAreaStyle(currentGrid.areas.header), backgroundColor: "#dbeafe", color: "#1e40af" }}>
            <div>
              <div className="font-semibold">{"<header>"}</div>
              <div className="text-xs opacity-80">Site Header</div>
            </div>
          </div>
        )}

        {config.hasNavigation && currentGrid.areas.navigation && (
          <div style={{ ...getAreaStyle(currentGrid.areas.navigation), backgroundColor: "#dcfce7", color: "#166534" }}>
            <div>
              <div className="font-semibold">{"<nav>"}</div>
              <div className="text-xs opacity-80">Navigation</div>
            </div>
          </div>
        )}

        {config.hasSidebar && currentGrid.areas.sidebar && (
          <div style={{ ...getAreaStyle(currentGrid.areas.sidebar), backgroundColor: "#fef3c7", color: "#92400e" }}>
            <div>
              <div className="font-semibold">{"<aside>"}</div>
              <div className="text-xs opacity-80">Sidebar</div>
            </div>
          </div>
        )}

        <div style={{ ...getAreaStyle(currentGrid.areas.main), backgroundColor: "#f0fdf4", color: "#166534" }}>
          <div>
            <div className="font-semibold">{"<main>"}</div>
            <div className="text-xs opacity-80">Main Content</div>
          </div>
        </div>

        {config.hasFooter && currentGrid.areas.footer && (
          <div style={{ ...getAreaStyle(currentGrid.areas.footer), backgroundColor: "#f3e8ff", color: "#7c3aed" }}>
            <div>
              <div className="font-semibold">{"<footer>"}</div>
              <div className="text-xs opacity-80">Footer</div>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
        <strong>Grid Areas:</strong>{" "}
        {Object.entries(currentGrid.areas)
          .filter(([key]) => {
            if (key === "header") return config.hasHeader
            if (key === "navigation") return config.hasNavigation
            if (key === "sidebar") return config.hasSidebar
            if (key === "footer") return config.hasFooter
            return true
          })
          .map(([key, value]) => `${key}: ${value}`)
          .join(" | ")}
      </div>
    </div>
  )
}
