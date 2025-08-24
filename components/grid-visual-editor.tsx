"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Smartphone, Tablet, Monitor, RotateCcw, Copy, Trash2, Plus } from "lucide-react"
import type { LayoutConfig } from "@/app/page"

interface GridVisualEditorProps {
  config: LayoutConfig
  onConfigChange: (config: LayoutConfig) => void
}

interface GridArea {
  id: string
  name: string
  element: "div" | "header" | "nav" | "main" | "aside" | "footer" | "section" | "article"
  startRow: number
  startCol: number
  endRow: number
  endCol: number
  color: string
}

const ELEMENT_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#6366f1",
]

const SEMANTIC_ELEMENTS = [
  { value: "div", label: "Div (Generic)" },
  { value: "header", label: "Header" },
  { value: "nav", label: "Navigation" },
  { value: "main", label: "Main Content" },
  { value: "aside", label: "Sidebar/Aside" },
  { value: "footer", label: "Footer" },
  { value: "section", label: "Section" },
  { value: "article", label: "Article" },
]

export function GridVisualEditor({ config, onConfigChange }: GridVisualEditorProps) {
  const [activeBreakpoint, setActiveBreakpoint] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [gridAreas, setGridAreas] = useState<GridArea[]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<{ row: number; col: number } | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<{ row: number; col: number } | null>(null)
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const currentGrid = config.breakpoints[activeBreakpoint].grid

  const generateAreaId = () => `area-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true)
    setSelectionStart({ row, col })
    setSelectionEnd({ row, col })
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelecting && selectionStart) {
      setSelectionEnd({ row, col })
    }
  }

  const handleMouseUp = () => {
    if (isSelecting && selectionStart && selectionEnd) {
      const startRow = Math.min(selectionStart.row, selectionEnd.row)
      const startCol = Math.min(selectionStart.col, selectionEnd.col)
      const endRow = Math.max(selectionStart.row, selectionEnd.row)
      const endCol = Math.max(selectionStart.col, selectionEnd.col)

      // Check if area overlaps with existing areas
      const overlaps = gridAreas.some(
        (area) =>
          !(
            endRow < area.startRow ||
            startRow > area.endRow - 1 ||
            endCol < area.startCol ||
            startCol > area.endCol - 1
          ),
      )

      if (!overlaps && (startRow !== endRow || startCol !== endCol)) {
        const newArea: GridArea = {
          id: generateAreaId(),
          name: `Area ${gridAreas.length + 1}`,
          element: "div",
          startRow,
          startCol,
          endRow: endRow + 1,
          endCol: endCol + 1,
          color: ELEMENT_COLORS[gridAreas.length % ELEMENT_COLORS.length],
        }

        setGridAreas([...gridAreas, newArea])
        setSelectedAreaId(newArea.id)
      }
    }

    setIsSelecting(false)
    setSelectionStart(null)
    setSelectionEnd(null)
  }

  const isInSelection = (row: number, col: number) => {
    if (!isSelecting || !selectionStart || !selectionEnd) return false

    const minRow = Math.min(selectionStart.row, selectionEnd.row)
    const maxRow = Math.max(selectionStart.row, selectionEnd.row)
    const minCol = Math.min(selectionStart.col, selectionEnd.col)
    const maxCol = Math.max(selectionStart.col, selectionEnd.col)

    return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol
  }

  const getAreaAtCell = (row: number, col: number) => {
    return gridAreas.find(
      (area) => row >= area.startRow && row < area.endRow && col >= area.startCol && col < area.endCol,
    )
  }

  const updateArea = (areaId: string, updates: Partial<GridArea>) => {
    setGridAreas((areas) => areas.map((area) => (area.id === areaId ? { ...area, ...updates } : area)))
  }

  const deleteArea = (areaId: string) => {
    setGridAreas((areas) => areas.filter((area) => area.id !== areaId))
    if (selectedAreaId === areaId) {
      setSelectedAreaId(null)
    }
  }

  const clearGrid = () => {
    setGridAreas([])
    setSelectedAreaId(null)
  }

  const generateHTML = () => {
    const semanticAreas = gridAreas.filter((area) => area.element !== "div")
    const divAreas = gridAreas.filter((area) => area.element === "div")

    let html = `<div class="grid-container">\n`

    // Add semantic elements first
    semanticAreas.forEach((area) => {
      html += `  <${area.element} class="grid-area-${area.id}">\n`
      html += `    <h2>${area.name}</h2>\n`
      html += `    <p>Content for ${area.name}</p>\n`
      html += `  </${area.element}>\n`
    })

    // Add div elements
    divAreas.forEach((area) => {
      html += `  <div class="grid-area-${area.id}">\n`
      html += `    <h3>${area.name}</h3>\n`
      html += `    <p>Content for ${area.name}</p>\n`
      html += `  </div>\n`
    })

    html += `</div>`
    return html
  }

  const generateCSS = () => {
    let css = `.grid-container {\n`
    css += `  display: grid;\n`
    css += `  grid-template-columns: repeat(${currentGrid.columns}, 1fr);\n`
    css += `  grid-template-rows: repeat(${currentGrid.rows}, minmax(60px, auto));\n`
    css += `  gap: ${currentGrid.gap}px;\n`
    css += `  min-height: 100vh;\n`
    css += `}\n\n`

    gridAreas.forEach((area) => {
      css += `.grid-area-${area.id} {\n`
      css += `  grid-area: ${area.startRow + 1} / ${area.startCol + 1} / ${area.endRow + 1} / ${area.endCol + 1};\n`
      css += `  padding: 1rem;\n`
      css += `  border: 1px solid #e5e7eb;\n`
      css += `  border-radius: 0.5rem;\n`
      css += `  background-color: ${area.color}20;\n`
      css += `}\n\n`
    })

    return css
  }

  const copyCode = async (type: "html" | "css") => {
    try {
      const code = type === "html" ? generateHTML() : generateCSS()
      await navigator.clipboard.writeText(code)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
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
        return null
    }
  }

  const selectedArea = gridAreas.find((area) => area.id === selectedAreaId)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Visual Grid Layout Builder</CardTitle>
            <CardDescription>Drag to create grid areas, then configure their semantic elements</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={clearGrid}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button variant="outline" size="sm" onClick={() => copyCode("html")}>
              <Copy className="h-4 w-4 mr-2" />
              Copy HTML
            </Button>
            <Button variant="outline" size="sm" onClick={() => copyCode("css")}>
              <Copy className="h-4 w-4 mr-2" />
              Copy CSS
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeBreakpoint}
          onValueChange={(value) => setActiveBreakpoint(value as any)}
          className="space-y-4"
        >
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getBreakpointIcon(breakpoint)}
                  <span className="font-medium">{config.breakpoints[breakpoint].name}</span>
                  <Badge variant="outline" className="text-xs">
                    {config.breakpoints[breakpoint].minWidth}px+
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {config.breakpoints[breakpoint].grid.columns} × {config.breakpoints[breakpoint].grid.rows} grid
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Area Properties Panel */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Grid Areas</h4>
                    <Badge variant="secondary">{gridAreas.length}</Badge>
                  </div>

                  {/* Area List */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {gridAreas.map((area) => (
                      <div
                        key={area.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedAreaId === area.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedAreaId(area.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: area.color }} />
                            <span className="text-sm font-medium">{area.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteArea(area.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {SEMANTIC_ELEMENTS.find((el) => el.value === area.element)?.label}
                        </div>
                      </div>
                    ))}

                    {gridAreas.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Drag on the grid to create areas</p>
                      </div>
                    )}
                  </div>

                  {/* Selected Area Properties */}
                  {selectedArea && (
                    <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
                      <h5 className="text-sm font-semibold">Area Properties</h5>

                      <div className="space-y-2">
                        <Label htmlFor="area-name" className="text-xs">
                          Name
                        </Label>
                        <Input
                          id="area-name"
                          value={selectedArea.name}
                          onChange={(e) => updateArea(selectedArea.id, { name: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="area-element" className="text-xs">
                          HTML Element
                        </Label>
                        <Select
                          value={selectedArea.element}
                          onValueChange={(value) => updateArea(selectedArea.id, { element: value as any })}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SEMANTIC_ELEMENTS.map((element) => (
                              <SelectItem key={element.value} value={element.value}>
                                {element.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Position: {selectedArea.startRow + 1},{selectedArea.startCol + 1} → {selectedArea.endRow},
                        {selectedArea.endCol}
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Grid */}
                <div className="lg:col-span-3">
                  <div className="space-y-4">
                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h5 className="text-sm font-semibold text-blue-800 mb-1">How to use:</h5>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Click and drag on empty grid cells to create new areas</li>
                        <li>• Click on existing areas to select and edit their properties</li>
                        <li>• Choose semantic HTML elements for better accessibility</li>
                        <li>• Use the generated HTML and CSS in your project</li>
                      </ul>
                    </div>

                    {/* Interactive Grid */}
                    <div
                      ref={gridRef}
                      className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50"
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      style={{ userSelect: "none" }}
                    >
                      {/* Grid Line Numbers */}
                      <div className="absolute -top-6 left-4 right-4 flex justify-between text-xs text-gray-400">
                        {Array.from({ length: currentGrid.columns + 1 }, (_, i) => (
                          <span key={i}>{i + 1}</span>
                        ))}
                      </div>
                      <div className="absolute -left-6 top-4 bottom-4 flex flex-col justify-between text-xs text-gray-400">
                        {Array.from({ length: currentGrid.rows + 1 }, (_, i) => (
                          <span key={i}>{i + 1}</span>
                        ))}
                      </div>

                      <div
                        className="grid gap-1"
                        style={{
                          gridTemplateColumns: `repeat(${currentGrid.columns}, 1fr)`,
                          gridTemplateRows: `repeat(${currentGrid.rows}, minmax(60px, 1fr))`,
                        }}
                      >
                        {Array.from({ length: currentGrid.rows }, (_, row) =>
                          Array.from({ length: currentGrid.columns }, (_, col) => {
                            const area = getAreaAtCell(row, col)
                            const isSelected = isInSelection(row, col)
                            const isAreaSelected = area && selectedAreaId === area.id

                            return (
                              <div
                                key={`${row}-${col}`}
                                className={`
                                  border border-gray-300 rounded cursor-pointer transition-all duration-150
                                  flex items-center justify-center text-xs font-medium
                                  ${isSelected ? "ring-2 ring-blue-500" : ""}
                                  ${isAreaSelected ? "ring-2 ring-green-500" : ""}
                                  ${area ? "hover:opacity-80" : "hover:border-gray-400 hover:bg-gray-100"}
                                `}
                                style={{
                                  backgroundColor: area ? `${area.color}30` : isSelected ? "#dbeafe" : "#ffffff",
                                  borderColor: area ? area.color : "#d1d5db",
                                }}
                                onMouseDown={() => !area && handleMouseDown(row, col)}
                                onMouseEnter={() => !area && handleMouseEnter(row, col)}
                                onClick={() => area && setSelectedAreaId(area.id)}
                              >
                                {area && (
                                  <div className="text-center">
                                    <div className="font-semibold text-xs">{area.name}</div>
                                    <div className="text-xs opacity-70">&lt;{area.element}&gt;</div>
                                  </div>
                                )}
                                {!area && !isSelected && (
                                  <div className="text-gray-400 text-xs">
                                    {row + 1},{col + 1}
                                  </div>
                                )}
                              </div>
                            )
                          }),
                        )}
                      </div>
                    </div>

                    {/* Generated Code Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-semibold mb-2">Generated HTML</h5>
                        <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto max-h-40">
                          <code>{generateHTML()}</code>
                        </pre>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold mb-2">Generated CSS</h5>
                        <pre className="bg-gray-900 text-blue-400 p-3 rounded text-xs font-mono overflow-x-auto max-h-40">
                          <code>{generateCSS()}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
