"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

interface AreaChartGradientProps {
  data: Array<Record<string, any>>
  config: ChartConfig
  className?: string
  height?: number
  xAxisKey: string
  yAxisKey: string
  showGrid?: boolean
  showTooltip?: boolean
  showYAxis?: boolean
  showXAxis?: boolean
  gradientId?: string
  fillOpacity?: number
  strokeWidth?: number
  curve?: "linear" | "natural" | "monotone" | "step" | "stepBefore" | "stepAfter"
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
}

export function AreaChartGradient({
  data,
  config,
  className,
  height = 300,
  xAxisKey,
  yAxisKey,
  showGrid = true,
  showTooltip = true,
  showYAxis = false,
  showXAxis = true,
  gradientId = "fillGradient",
  fillOpacity = 0.6,
  strokeWidth = 2,
  curve = "natural",
  margin = { top: 20, right: 30, left: 20, bottom: 5 },
}: AreaChartGradientProps) {
  return (
    <ChartContainer
      config={config}
      className={cn("h-[300px] w-full", className)}
      style={{ height: `${height}px`, width: "100%" }}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={margin}
        height={height}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.3}
          />
        )}
        {showXAxis && (
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
            }}
          />
        )}
        {showYAxis && (
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
            }}
          />
        )}
        {showTooltip && (
          <ChartTooltip
            cursor={{
              stroke: "hsl(var(--border))",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
            content={<ChartTooltipContent indicator="dot" />}
          />
        )}
        <Area
          dataKey={yAxisKey}
          type={curve}
          fill={`url(#${gradientId})`}
          fillOpacity={fillOpacity}
          stroke="hsl(var(--chart-1))"
          strokeWidth={strokeWidth}
          dot={{
            fill: "hsl(var(--chart-1))",
            strokeWidth: 2,
            r: 4,
          }}
          activeDot={{
            r: 6,
            fill: "hsl(var(--chart-1))",
            strokeWidth: 2,
            stroke: "hsl(var(--background))",
          }}
        />
      </AreaChart>
    </ChartContainer>
  )
}

// Multi-area chart variant for multiple data series
interface MultiAreaChartGradientProps extends Omit<AreaChartGradientProps, 'yAxisKey' | 'gradientId'> {
  areas: Array<{
    dataKey: string
    color: string
    gradientId?: string
    fillOpacity?: number
    strokeWidth?: number
  }>
}

export function MultiAreaChartGradient({
  data,
  config,
  className,
  height = 300,
  xAxisKey,
  showGrid = true,
  showTooltip = true,
  showYAxis = false,
  showXAxis = true,
  curve = "natural",
  margin = { top: 20, right: 30, left: 20, bottom: 5 },
  areas,
}: MultiAreaChartGradientProps) {
  return (
    <ChartContainer
      config={config}
      className={cn("h-[300px] w-full", className)}
      style={{ height: `${height}px`, width: "100%" }}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={margin}
        height={height}
      >
        <defs>
          {areas.map((area, index) => (
            <linearGradient
              key={area.gradientId || `gradient-${index}`}
              id={area.gradientId || `gradient-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={area.color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={area.color} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.3}
          />
        )}
        {showXAxis && (
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
            }}
          />
        )}
        {showYAxis && (
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
            }}
          />
        )}
        {showTooltip && (
          <ChartTooltip
            cursor={{
              stroke: "hsl(var(--border))",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
            content={<ChartTooltipContent />}
          />
        )}
        {areas.map((area, index) => (
          <Area
            key={area.dataKey}
            dataKey={area.dataKey}
            type={curve}
            stackId="1"
            fill={`url(#${area.gradientId || `gradient-${index}`})`}
            fillOpacity={area.fillOpacity || 0.6}
            stroke={area.color}
            strokeWidth={area.strokeWidth || 2}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}
