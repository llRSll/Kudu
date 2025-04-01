"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, ZoomIn, ZoomOut } from "lucide-react"
import { useState } from "react"

export function EntityStructure() {
  const [zoom, setZoom] = useState(100)

  const handleZoomIn = () => {
    if (zoom < 150) setZoom(zoom + 10)
  }

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 10)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Entity Structure</CardTitle>
            <CardDescription>Organizational chart of your corporate structure</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{zoom}%</span>
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Chart View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <div className="relative overflow-auto border rounded-md p-4" style={{ height: "500px" }}>
              <div
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top left",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div className="flex flex-col items-center">
                  {/* Root entity */}
                  <div className="p-4 border rounded-md bg-primary/10 w-64 text-center mb-8">
                    <h3 className="font-semibold">Doe Family Holdings, LLC</h3>
                    <p className="text-sm text-muted-foreground">Parent Company</p>
                  </div>

                  {/* Level 1 entities */}
                  <div className="flex justify-center gap-16 mb-8 relative">
                    <div className="absolute top-[-40px] left-0 right-0 h-[40px] border-l border-dashed"></div>
                    <div className="absolute top-[-40px] left-[calc(50%-200px)] right-[calc(50%-200px)] h-[1px] border-t border-dashed"></div>
                    <div className="absolute top-[-40px] left-[calc(50%+200px)] right-[calc(50%+200px)] h-[1px] border-t border-dashed"></div>
                    <div className="absolute top-[-40px] left-[calc(50%)] right-[calc(50%)] h-[1px] border-t border-dashed"></div>

                    <div className="p-4 border rounded-md bg-background w-64 text-center relative">
                      <div className="absolute top-[-40px] left-[calc(50%-1px)] h-[40px] border-l border-dashed"></div>
                      <h3 className="font-semibold">Doe Real Estate, LLC</h3>
                      <p className="text-sm text-muted-foreground">Property Holdings</p>
                    </div>

                    <div className="p-4 border rounded-md bg-background w-64 text-center relative">
                      <div className="absolute top-[-40px] left-[calc(50%-1px)] h-[40px] border-l border-dashed"></div>
                      <h3 className="font-semibold">Doe Investments, Inc</h3>
                      <p className="text-sm text-muted-foreground">Investment Vehicle</p>
                    </div>

                    <div className="p-4 border rounded-md bg-background w-64 text-center relative">
                      <div className="absolute top-[-40px] left-[calc(50%-1px)] h-[40px] border-l border-dashed"></div>
                      <h3 className="font-semibold">Doe Family Trust</h3>
                      <p className="text-sm text-muted-foreground">Family Trust</p>
                    </div>
                  </div>

                  {/* Level 2 entities */}
                  <div className="flex justify-start gap-8 ml-[-100px] relative">
                    <div className="absolute top-[-40px] left-[32px] h-[40px] border-l border-dashed"></div>
                    <div className="absolute top-[-40px] left-[32px] right-[calc(100%-400px)] h-[1px] border-t border-dashed"></div>
                    <div className="absolute top-[-40px] left-[232px] h-[40px] border-l border-dashed"></div>
                    <div className="absolute top-[-40px] left-[432px] h-[40px] border-l border-dashed"></div>

                    <div className="p-3 border rounded-md bg-muted w-56 text-center relative">
                      <h3 className="font-semibold text-sm">123 Main St, LLC</h3>
                      <p className="text-xs text-muted-foreground">Commercial Property</p>
                    </div>

                    <div className="p-3 border rounded-md bg-muted w-56 text-center relative">
                      <h3 className="font-semibold text-sm">Oceanview Properties, LLC</h3>
                      <p className="text-xs text-muted-foreground">Residential Properties</p>
                    </div>

                    <div className="p-3 border rounded-md bg-muted w-56 text-center relative">
                      <h3 className="font-semibold text-sm">Mountain Development, LLC</h3>
                      <p className="text-xs text-muted-foreground">Development Project</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="list">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Entity Name</th>
                    <th className="p-3 text-left font-medium">Type</th>
                    <th className="p-3 text-left font-medium">Parent Entity</th>
                    <th className="p-3 text-left font-medium">Ownership %</th>
                    <th className="p-3 text-left font-medium">Tax Classification</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Doe Family Holdings, LLC</td>
                    <td className="p-3">Limited Liability Company</td>
                    <td className="p-3">-</td>
                    <td className="p-3">-</td>
                    <td className="p-3">Partnership</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Doe Real Estate, LLC</td>
                    <td className="p-3">Limited Liability Company</td>
                    <td className="p-3">Doe Family Holdings, LLC</td>
                    <td className="p-3">100%</td>
                    <td className="p-3">Disregarded Entity</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Doe Investments, Inc</td>
                    <td className="p-3">Corporation</td>
                    <td className="p-3">Doe Family Holdings, LLC</td>
                    <td className="p-3">100%</td>
                    <td className="p-3">C-Corporation</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Doe Family Trust</td>
                    <td className="p-3">Trust</td>
                    <td className="p-3">Doe Family Holdings, LLC</td>
                    <td className="p-3">100%</td>
                    <td className="p-3">Grantor Trust</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">123 Main St, LLC</td>
                    <td className="p-3">Limited Liability Company</td>
                    <td className="p-3">Doe Real Estate, LLC</td>
                    <td className="p-3">100%</td>
                    <td className="p-3">Disregarded Entity</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Oceanview Properties, LLC</td>
                    <td className="p-3">Limited Liability Company</td>
                    <td className="p-3">Doe Real Estate, LLC</td>
                    <td className="p-3">100%</td>
                    <td className="p-3">Disregarded Entity</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Mountain Development, LLC</td>
                    <td className="p-3">Limited Liability Company</td>
                    <td className="p-3">Doe Real Estate, LLC</td>
                    <td className="p-3">100%</td>
                    <td className="p-3">Disregarded Entity</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

