"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Smartphone, Tablet, Monitor, Grid3X3 } from "lucide-react"
import type { LayoutConfig, BreakpointConfig } from "@/app/page"

interface LayoutBuilderProps {
  config: LayoutConfig
  onConfigChange: (config: LayoutConfig) => void
}

export function LayoutBuilder({ config, onConfigChange }: LayoutBuilderProps) {
  const updateConfig = (updates: Partial<LayoutConfig>) => {
    onConfigChange({ ...config, ...updates })
  }

  const updateBreakpoint = (breakpoint: "mobile" | "tablet" | "desktop", updates: Partial<BreakpointConfig>) => {
    updateConfig({
      breakpoints: {
        ...config.breakpoints,
        [breakpoint]: {
          ...config.breakpoints[breakpoint],
          ...updates,
        },
      },
    })
  }

  const updateGridConfig = (
    breakpoint: "mobile" | "tablet" | "desktop",
    gridUpdates: Partial<BreakpointConfig["grid"]>,
  ) => {
    updateBreakpoint(breakpoint, {
      grid: {
        ...config.breakpoints[breakpoint].grid,
        ...gridUpdates,
      },
    })
  }

  const generateGridAreas = (breakpoint: "mobile" | "tablet" | "desktop") => {
    const grid = config.breakpoints[breakpoint].grid
    const areas: any = { main: "1 / 1 / 2 / 2" }

    let currentRow = 1

    if (config.hasHeader) {
      areas.header = `${currentRow} / 1 / ${currentRow + 1} / ${grid.columns + 1}`
      currentRow++
    }

    if (config.hasNavigation && !config.hasHeader) {
      areas.navigation = `${currentRow} / 1 / ${currentRow + 1} / ${grid.columns + 1}`
      currentRow++
    }

    // Main content area
    if (config.hasSidebar) {
      if (config.sidebarPosition === "left") {
        areas.sidebar = `${currentRow} / 1 / ${currentRow + 1} / 2`
        areas.main = `${currentRow} / 2 / ${currentRow + 1} / ${grid.columns + 1}`
      } else {
        areas.main = `${currentRow} / 1 / ${currentRow + 1} / ${grid.columns}`
        areas.sidebar = `${currentRow} / ${grid.columns} / ${currentRow + 1} / ${grid.columns + 1}`
      }
    } else {
      areas.main = `${currentRow} / 1 / ${currentRow + 1} / ${grid.columns + 1}`
    }
    currentRow++

    if (config.hasFooter) {
      areas.footer = `${currentRow} / 1 / ${currentRow + 1} / ${grid.columns + 1}`
    }

    updateGridConfig(breakpoint, { areas })
  }

  const getBreakpointIcon = (breakpoint: string) => {
    switch (breakpoint) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      case "desktop":
        return <Monitor className="h-4 w-4" />
      default:
        return <Grid3X3 className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Layout Structure</CardTitle>
          <CardDescription>Configure your layout components and accessibility features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Structure Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold">Components</h3>
              <Badge variant="outline" className="text-xs">
                Semantic HTML
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="header-toggle" className="text-sm">
                  Header Section
                </Label>
                <Switch
                  id="header-toggle"
                  checked={config.hasHeader}
                  onCheckedChange={(checked) => updateConfig({ hasHeader: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="nav-toggle" className="text-sm">
                  Navigation
                </Label>
                <Switch
                  id="nav-toggle"
                  checked={config.hasNavigation}
                  onCheckedChange={(checked) => updateConfig({ hasNavigation: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sidebar-toggle" className="text-sm">
                  Sidebar
                </Label>
                <Switch
                  id="sidebar-toggle"
                  checked={config.hasSidebar}
                  onCheckedChange={(checked) => updateConfig({ hasSidebar: checked })}
                />
              </div>

              {config.hasSidebar && (
                <div className="ml-4 space-y-2">
                  <Label htmlFor="sidebar-position" className="text-sm text-muted-foreground">
                    Sidebar Position
                  </Label>
                  <Select
                    value={config.sidebarPosition}
                    onValueChange={(value: "left" | "right") => updateConfig({ sidebarPosition: value })}
                  >
                    <SelectTrigger id="sidebar-position">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="footer-toggle" className="text-sm">
                  Footer Section
                </Label>
                <Switch
                  id="footer-toggle"
                  checked={config.hasFooter}
                  onCheckedChange={(checked) => updateConfig({ hasFooter: checked })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Accessibility Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold">Accessibility</h3>
              <Badge variant="secondary" className="text-xs">
                WCAG 2.2.1
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="skip-links" className="text-sm">
                    Skip Links
                  </Label>
                  <p className="text-xs text-muted-foreground">Allow keyboard users to skip to main content</p>
                </div>
                <Switch
                  id="skip-links"
                  checked={config.includeSkipLinks}
                  onCheckedChange={(checked) => updateConfig({ includeSkipLinks: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="landmarks" className="text-sm">
                    ARIA Landmarks
                  </Label>
                  <p className="text-xs text-muted-foreground">Add semantic landmarks for screen readers</p>
                </div>
                <Switch
                  id="landmarks"
                  checked={config.includeLandmarks}
                  onCheckedChange={(checked) => updateConfig({ includeLandmarks: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="heading-structure" className="text-sm">
                    Heading Structure
                  </Label>
                  <p className="text-xs text-muted-foreground">Include proper heading hierarchy (h1-h6)</p>
                </div>
                <Switch
                  id="heading-structure"
                  checked={config.includeHeadingStructure}
                  onCheckedChange={(checked) => updateConfig({ includeHeadingStructure: checked })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Grid3X3 className="h-5 w-5" />
            <span>Responsive Grid Configuration</span>
          </CardTitle>
          <CardDescription>Configure CSS Grid layout for different screen sizes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="desktop" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mobile" className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span>Mobile</span>
              </TabsTrigger>
              <TabsTrigger value="tablet" className="flex items-center space-x-2">
                <Tablet className="h-4 w-4" />
                <span>Tablet</span>
              </TabsTrigger>
              <TabsTrigger value="desktop" className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span>Desktop</span>
              </TabsTrigger>
            </TabsList>

            {(["mobile", "tablet", "desktop"] as const).map((breakpoint) => (
              <TabsContent key={breakpoint} value={breakpoint} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold flex items-center space-x-2">
                      {getBreakpointIcon(breakpoint)}
                      <span>{config.breakpoints[breakpoint].name} Breakpoint</span>
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {config.breakpoints[breakpoint].minWidth}px+
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${breakpoint}-breakpoint`} className="text-sm">
                        Min Width (px)
                      </Label>
                      <Input
                        id={`${breakpoint}-breakpoint`}
                        type="number"
                        value={config.breakpoints[breakpoint].minWidth}
                        onChange={(e) =>
                          updateBreakpoint(breakpoint, { minWidth: Number.parseInt(e.target.value) || 0 })
                        }
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${breakpoint}-gap`} className="text-sm">
                        Grid Gap (px)
                      </Label>
                      <Input
                        id={`${breakpoint}-gap`}
                        type="number"
                        value={config.breakpoints[breakpoint].grid.gap}
                        onChange={(e) => updateGridConfig(breakpoint, { gap: Number.parseInt(e.target.value) || 0 })}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Grid Columns: {config.breakpoints[breakpoint].grid.columns}</Label>
                      <Slider
                        value={[config.breakpoints[breakpoint].grid.columns]}
                        onValueChange={([value]) => updateGridConfig(breakpoint, { columns: value })}
                        min={1}
                        max={12}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Grid Rows: {config.breakpoints[breakpoint].grid.rows}</Label>
                      <Slider
                        value={[config.breakpoints[breakpoint].grid.rows]}
                        onValueChange={([value]) => updateGridConfig(breakpoint, { rows: value })}
                        min={1}
                        max={8}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateGridAreas(breakpoint)}
                      className="w-full"
                    >
                      Auto-Generate Grid Areas
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Automatically arrange layout components based on current settings
                    </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
