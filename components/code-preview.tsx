"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Check } from "lucide-react"
import type { LayoutConfig } from "@/app/page"

interface CodePreviewProps {
  config: LayoutConfig
}

export function CodePreview({ config }: CodePreviewProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  const generateHTML = () => {
    const skipLinks = config.includeSkipLinks
      ? `  <!-- Skip Links for Accessibility -->
  <a href="#main-content" class="skip-link">Skip to main content</a>
  ${config.hasNavigation ? '<a href="#navigation" class="skip-link">Skip to navigation</a>' : ""}

`
      : ""

    const gridContainer = `  <div class="grid-container">
${
  config.hasHeader
    ? `    <header${config.includeLandmarks ? ' role="banner"' : ""}>
      <h1>Site Title</h1>
      ${
        config.hasNavigation
          ? `<nav${config.includeLandmarks ? ' role="navigation" aria-label="Main navigation"' : ""}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>`
          : ""
      }
    </header>
`
    : ""
}${
  config.hasNavigation && !config.hasHeader
    ? `    <nav${config.includeLandmarks ? ' role="navigation" aria-label="Main navigation"' : ""} id="navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
`
    : ""
}    <main${config.includeLandmarks ? ' role="main"' : ""} id="main-content">
      ${
        config.includeHeadingStructure
          ? `<h1>Page Title</h1>
      <section>
        <h2>Main Section</h2>
        <p>Your main content goes here.</p>
        
        <article>
          <h3>Article Title</h3>
          <p>Article content...</p>
        </article>
      </section>`
          : "<p>Your main content goes here.</p>"
      }
    </main>
${
  config.hasSidebar
    ? `    <aside${config.includeLandmarks ? ' role="complementary" aria-label="Sidebar"' : ""}>
      <h2>Sidebar</h2>
      <p>Additional content and navigation.</p>
    </aside>
`
    : ""
}${
  config.hasFooter
    ? `    <footer${config.includeLandmarks ? ' role="contentinfo"' : ""}>
      <p>&copy; 2024 Your Site. All rights reserved.</p>
    </footer>
`
    : ""
}  </div>`

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Grid Layout</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body${config.colorScheme !== "light" ? ` class="${config.colorScheme}-theme"` : ""}>
${skipLinks}${gridContainer}
</body>
</html>`
  }

  const generateCSS = () => {
    const { mobile, tablet, desktop } = config.breakpoints

    return `/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fff;
}

/* Skip Links for Accessibility */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}

/* CSS Grid Layout Container */
.grid-container {
  display: grid;
  min-height: 100vh;
  max-width: ${config.mainContentWidth === "full" ? "100%" : config.mainContentWidth === "narrow" ? "800px" : "1200px"};
  margin: 0 auto;
  padding: 0 1rem;
}

/* Mobile First - Base Grid */
.grid-container {
  grid-template-columns: repeat(${mobile.grid.columns}, 1fr);
  grid-template-rows: repeat(${mobile.grid.rows}, minmax(auto, max-content));
  gap: ${mobile.grid.gap}px;
}

${
  config.hasHeader && mobile.grid.areas.header
    ? `
header {
  grid-area: ${mobile.grid.areas.header};
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

header h1 {
  margin: 0;
  font-size: 1.5rem;
}

header nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
}

header nav a {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

header nav a:hover,
header nav a:focus {
  background-color: #e9ecef;
}
`
    : ""
}

${
  config.hasNavigation && mobile.grid.areas.navigation
    ? `
nav {
  grid-area: ${mobile.grid.areas.navigation};
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem;
}

nav ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
}

nav a {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

nav a:hover,
nav a:focus {
  background-color: #e9ecef;
}
`
    : ""
}

main {
  grid-area: ${mobile.grid.areas.main};
  padding: 2rem 1rem;
}

${
  config.hasSidebar && mobile.grid.areas.sidebar
    ? `
aside {
  grid-area: ${mobile.grid.areas.sidebar};
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

aside h2 {
  margin-top: 0;
  font-size: 1.25rem;
}
`
    : ""
}

${
  config.hasFooter && mobile.grid.areas.footer
    ? `
footer {
  grid-area: ${mobile.grid.areas.footer};
  background: #343a40;
  color: #fff;
  padding: 2rem 1rem;
  text-align: center;
}
`
    : ""
}

${
  config.includeHeadingStructure
    ? `
/* Heading Hierarchy */
h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #212529;
}

h2 {
  font-size: 2rem;
  margin: 2rem 0 1rem 0;
  color: #495057;
}

h3 {
  font-size: 1.5rem;
  margin: 1.5rem 0 0.75rem 0;
  color: #6c757d;
}

section {
  margin-bottom: 2rem;
}

article {
  margin: 1.5rem 0;
  padding: 1rem;
  border-left: 4px solid #007bff;
  background: #f8f9fa;
}
`
    : ""
}

/* Tablet Breakpoint */
@media (min-width: ${tablet.minWidth}px) {
  .grid-container {
    grid-template-columns: repeat(${tablet.grid.columns}, 1fr);
    grid-template-rows: repeat(${tablet.grid.rows}, minmax(auto, max-content));
    gap: ${tablet.grid.gap}px;
  }

  ${
    config.hasHeader && tablet.grid.areas.header
      ? `
  header {
    grid-area: ${tablet.grid.areas.header};
  }
  `
      : ""
  }

  ${
    config.hasNavigation && tablet.grid.areas.navigation
      ? `
  nav {
    grid-area: ${tablet.grid.areas.navigation};
  }
  
  nav ul {
    gap: 1rem;
  }
  `
      : ""
  }

  main {
    grid-area: ${tablet.grid.areas.main};
  }

  ${
    config.hasSidebar && tablet.grid.areas.sidebar
      ? `
  aside {
    grid-area: ${tablet.grid.areas.sidebar};
  }
  `
      : ""
  }

  ${
    config.hasFooter && tablet.grid.areas.footer
      ? `
  footer {
    grid-area: ${tablet.grid.areas.footer};
  }
  `
      : ""
  }
}

/* Desktop Breakpoint */
@media (min-width: ${desktop.minWidth}px) {
  .grid-container {
    grid-template-columns: repeat(${desktop.grid.columns}, 1fr);
    grid-template-rows: repeat(${desktop.grid.rows}, minmax(auto, max-content));
    gap: ${desktop.grid.gap}px;
  }

  ${
    config.hasHeader && desktop.grid.areas.header
      ? `
  header {
    grid-area: ${desktop.grid.areas.header};
  }
  `
      : ""
  }

  ${
    config.hasNavigation && desktop.grid.areas.navigation
      ? `
  nav {
    grid-area: ${desktop.grid.areas.navigation};
  }
  `
      : ""
  }

  main {
    grid-area: ${desktop.grid.areas.main};
    padding: 2rem;
  }

  ${
    config.hasSidebar && desktop.grid.areas.sidebar
      ? `
  aside {
    grid-area: ${desktop.grid.areas.sidebar};
  }
  `
      : ""
  }

  ${
    config.hasFooter && desktop.grid.areas.footer
      ? `
  footer {
    grid-area: ${desktop.grid.areas.footer};
  }
  `
      : ""
  }
}

${
  config.colorScheme === "dark" || config.colorScheme === "system"
    ? `
/* Dark Theme */
.dark-theme {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

.dark-theme header,
.dark-theme nav {
  background: #2d2d2d;
  border-color: #404040;
}

.dark-theme aside,
.dark-theme article {
  background: #2d2d2d;
  border-color: #404040;
}

.dark-theme a {
  color: #e0e0e0;
}

.dark-theme a:hover,
.dark-theme a:focus {
  background-color: #404040;
}

.dark-theme footer {
  background: #0f0f0f;
}

${
  config.colorScheme === "system"
    ? `
@media (prefers-color-scheme: dark) {
  .system-theme {
    background-color: #1a1a1a;
    color: #e0e0e0;
  }
  
  .system-theme header,
  .system-theme nav {
    background: #2d2d2d;
    border-color: #404040;
  }
  
  .system-theme aside,
  .system-theme article {
    background: #2d2d2d;
    border-color: #404040;
  }
  
  .system-theme a {
    color: #e0e0e0;
  }
  
  .system-theme a:hover,
  .system-theme a:focus {
    background-color: #404040;
  }
  
  .system-theme footer {
    background: #0f0f0f;
  }
}`
    : ""
}
`
    : ""
}

/* Focus Styles for Accessibility */
a:focus,
button:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  body {
    background: #fff;
    color: #000;
  }
  
  a {
    color: #0000ff;
  }
  
  a:visited {
    color: #800080;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`
  }

  const generateReactComponent = () => {
    return `import React from 'react'

export default function Layout({ children }) {
  return (
    <div className="${config.colorScheme !== "light" ? `${config.colorScheme}-theme` : ""}">
      ${
        config.includeSkipLinks
          ? `{/* Skip Links for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      ${
        config.hasNavigation
          ? `<a href="#navigation" className="skip-link">
        Skip to navigation
      </a>`
          : ""
      }
      
      `
          : ""
      }${
        config.hasHeader
          ? `<header${config.includeLandmarks ? ' role="banner"' : ""}>
        <div className="container">
          <h1>Site Title</h1>
          ${
            config.hasNavigation
              ? `<nav${config.includeLandmarks ? ' role="navigation" aria-label="Main navigation"' : ""}>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>`
              : ""
          }
        </div>
      </header>
      
      `
          : ""
      }${
        config.hasNavigation && !config.hasHeader
          ? `<nav${config.includeLandmarks ? ' role="navigation" aria-label="Main navigation"' : ""} id="navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
      
      `
          : ""
      }<div className="${
        config.mainContentWidth === "full"
          ? "full-width"
          : config.mainContentWidth === "narrow"
            ? "narrow-container"
            : "container"
      }">
        ${
          config.hasSidebar && config.sidebarPosition === "left"
            ? `<aside${config.includeLandmarks ? ' role="complementary" aria-label="Sidebar"' : ""}>
          <h2>Sidebar</h2>
          <p>Additional content and navigation.</p>
        </aside>
        `
            : ""
        }<main${config.includeLandmarks ? ' role="main"' : ""} id="main-content">
          {children}
        </main>
        ${
          config.hasSidebar && config.sidebarPosition === "right"
            ? `<aside${config.includeLandmarks ? ' role="complementary" aria-label="Sidebar"' : ""}>
          <h2>Sidebar</h2>
          <p>Additional content and navigation.</p>
        </aside>`
            : ""
        }
      </div>
      
      ${
        config.hasFooter
          ? `<footer${config.includeLandmarks ? ' role="contentinfo"' : ""}>
        <div className="container">
          <p>&copy; 2024 Your Site. All rights reserved.</p>
        </div>
      </footer>`
          : ""
      }
    </div>
  )
}`
  }

  const copyToClipboard = async (text: string, tab: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedTab(tab)
      setTimeout(() => setCopiedTab(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generated Code</CardTitle>
              <CardDescription>Copy or download your accessible layout code</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Semantic HTML</Badge>
              <Badge variant="secondary">WCAG 2.2.1</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="html" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">index.html</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateHTML(), "html")}>
                    {copiedTab === "html" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedTab === "html" ? "Copied!" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadFile(generateHTML(), "index.html")}>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{generateHTML()}</code>
              </pre>
            </TabsContent>

            <TabsContent value="css" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">styles.css</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateCSS(), "css")}>
                    {copiedTab === "css" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedTab === "css" ? "Copied!" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadFile(generateCSS(), "styles.css")}>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{generateCSS()}</code>
              </pre>
            </TabsContent>

            <TabsContent value="react" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Layout.jsx</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateReactComponent(), "react")}
                  >
                    {copiedTab === "react" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedTab === "react" ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(generateReactComponent(), "Layout.jsx")}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{generateReactComponent()}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
