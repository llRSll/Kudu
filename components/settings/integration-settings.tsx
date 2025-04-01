"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Check, ExternalLink, X } from "lucide-react"

const integrationFormSchema = z.object({
  banking_integration: z.boolean().default(true),
  property_management: z.boolean().default(false),
  tax_software: z.boolean().default(true),
  document_storage: z.boolean().default(true),
  investment_platforms: z.boolean().default(true),
  api_key: z.string().optional(),
})

type IntegrationFormValues = z.infer<typeof integrationFormSchema>

const defaultValues: Partial<IntegrationFormValues> = {
  banking_integration: true,
  property_management: false,
  tax_software: true,
  document_storage: true,
  investment_platforms: true,
  api_key: "",
}

export function IntegrationSettings() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues,
  })

  function onSubmit(data: IntegrationFormValues) {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      toast.success("Integration settings updated successfully")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>External Integrations</CardTitle>
          <CardDescription>Connect Kudu with your other financial services and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Connected Services</h3>
                  <Button variant="outline" size="sm" className="text-xs">
                    Add New Service
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-xs text-primary">JP</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">JP Morgan Chase</div>
                        <div className="text-xs text-muted-foreground">Banking Integration</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-xs text-primary">FD</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Fidelity Investments</div>
                        <div className="text-xs text-muted-foreground">Investment Platform</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-xs text-primary">DB</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Dropbox</div>
                        <div className="text-xs text-muted-foreground">Document Storage</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Integration Settings</h3>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="banking_integration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Banking Integration</FormLabel>
                          <FormDescription className="text-xs">
                            Sync transactions and balances from connected banks
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
                    name="property_management"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Property Management</FormLabel>
                          <FormDescription className="text-xs">
                            Connect with property management software
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
                    name="tax_software"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Tax Software</FormLabel>
                          <FormDescription className="text-xs">Export data to tax preparation software</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="document_storage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Document Storage</FormLabel>
                          <FormDescription className="text-xs">
                            Sync documents with cloud storage providers
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
                    name="investment_platforms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Investment Platforms</FormLabel>
                          <FormDescription className="text-xs">
                            Connect with brokerage and investment accounts
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

              <div className="space-y-4">
                <h3 className="text-sm font-medium">API Access</h3>
                <FormField
                  control={form.control}
                  name="api_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          <Input type="password" placeholder="••••••••••••••••••••••••" {...field} />
                          <Button variant="outline" type="button">
                            Generate
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>Use this key to access the Kudu API programmatically</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center">
                  <Button variant="outline" size="sm" className="text-xs" type="button">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    View API Documentation
                  </Button>
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save integration settings"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

