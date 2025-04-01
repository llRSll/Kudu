"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { Laptop, Home } from "lucide-react"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Please select a theme.",
  }),
  compact_mode: z.boolean().default(false),
  reduce_animations: z.boolean().default(false),
  high_contrast: z.boolean().default(false),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function AppearanceSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Ensure we're mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: (mounted && (theme as "light" | "dark" | "system")) || "system",
      compact_mode: false,
      reduce_animations: false,
      high_contrast: false,
    },
  })

  // Update form when theme changes
  useEffect(() => {
    if (mounted && theme) {
      form.setValue("theme", theme as "light" | "dark" | "system")
    }
  }, [mounted, theme, form])

  function onSubmit(data: AppearanceFormValues) {
    setIsLoading(true)

    // Update the theme
    setTheme(data.theme)

    setTimeout(() => {
      setIsLoading(false)
      toast.success("Appearance settings updated successfully")
    }, 1000)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how Kudu looks and feels</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Theme</FormLabel>
                    <FormDescription>Select the theme for the dashboard</FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value)
                          setTheme(value)
                        }}
                        value={field.value}
                        className="grid grid-cols-3 gap-4 pt-2"
                      >
                        <FormItem>
                          <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                            <FormControl>
                              <RadioGroupItem value="light" className="sr-only" />
                            </FormControl>
                            <div className="theme-preview mb-2 border-2 border-muted">
                              <div className="theme-preview-header">
                                <div className="theme-preview-logo">
                                  <div className="theme-preview-logo-icon bg-[#333] text-white">
                                    <Home className="h-3 w-3" />
                                  </div>
                                  <div className="theme-preview-logo-text">KUDU</div>
                                </div>
                              </div>
                              <div className="theme-preview-content">
                                <div className="theme-preview-card">Dashboard</div>
                                <div className="theme-preview-button bg-[#333] text-white">View</div>
                              </div>
                            </div>
                            <span className="text-xs">Light</span>
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                            <FormControl>
                              <RadioGroupItem value="dark" className="sr-only" />
                            </FormControl>
                            <div className="theme-preview mb-2 border-2 border-muted dark bg-[#111]">
                              <div className="theme-preview-header">
                                <div className="theme-preview-logo">
                                  <div className="theme-preview-logo-icon bg-[#ccc] text-[#111]">
                                    <Home className="h-3 w-3" />
                                  </div>
                                  <div className="theme-preview-logo-text text-white">KUDU</div>
                                </div>
                              </div>
                              <div className="theme-preview-content">
                                <div className="theme-preview-card bg-[#1a1a1a] text-white border-[#333]">
                                  Dashboard
                                </div>
                                <div className="theme-preview-button bg-[#ccc] text-[#111]">View</div>
                              </div>
                            </div>
                            <span className="text-xs">Dark</span>
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                            <FormControl>
                              <RadioGroupItem value="system" className="sr-only" />
                            </FormControl>
                            <div className="theme-preview mb-2 border-2 border-muted">
                              <div className="theme-preview-header">
                                <div className="theme-preview-logo">
                                  <div className="theme-preview-logo-icon">
                                    <Laptop className="h-3 w-3" />
                                  </div>
                                  <div className="theme-preview-logo-text">System</div>
                                </div>
                              </div>
                              <div className="theme-preview-content">
                                <div className="theme-preview-card">Follows your device</div>
                                <div className="theme-preview-button">Auto</div>
                              </div>
                            </div>
                            <span className="text-xs">System</span>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Display Options</h3>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="compact_mode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Compact Mode</FormLabel>
                          <FormDescription className="text-xs">
                            Use a more compact layout to fit more content on screen
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reduce_animations"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Reduce Animations</FormLabel>
                          <FormDescription className="text-xs">
                            Minimize motion effects throughout the interface
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="high_contrast"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">High Contrast</FormLabel>
                          <FormDescription className="text-xs">
                            Increase contrast for better readability
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save appearance settings"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

