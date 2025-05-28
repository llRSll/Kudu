"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, Database, RefreshCw, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// In a client component, we only use API routes to check Supabase status
// instead of importing Supabase directly
export default function DebugPage() {
  const [connectionStatus, setConnectionStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Use the API route for testing connection
      const response = await fetch('/api/test-connection')
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      
      const data = await response.json()
      setConnectionStatus(data)
    } catch (err) {
      console.error('Error testing connection:', err)
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Debug</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Connection Status
          </CardTitle>
          <CardDescription>
            Check the connection to your Supabase database
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : loading ? (
            <div className="flex items-center justify-center py-6">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2">Testing connection...</span>
            </div>
          ) : connectionStatus ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="font-medium mr-2">Overall Connection:</span>
                {connectionStatus.success ? (
                  <Badge variant="default" className="bg-green-500">
                    <Check className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <X className="mr-1 h-3 w-3" />
                    Failed
                  </Badge>
                )}
              </div>
              
              <div className="font-medium mb-2">Supabase URL:</div>
              <code className="bg-muted px-2 py-1 rounded text-sm">
                {connectionStatus.url || 'Not available'}
              </code>
              
              <div className="font-medium mt-4 mb-2">Table Status:</div>
              {connectionStatus.tables && connectionStatus.tables.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Table
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {connectionStatus.tables.map((table: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm font-mono">{table.table}</td>
                          <td className="px-4 py-3">
                            {table.connected ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="mr-1 h-3 w-3" />
                                Connected
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <X className="mr-1 h-3 w-3" />
                                Failed
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {table.connected ? (
                              `Count: ${table.count}`
                            ) : (
                              <span className="text-red-500">{table.error}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">No table information available</p>
              )}
              
              <div className="font-medium mt-4 mb-2">Last Updated:</div>
              <p className="text-muted-foreground">
                {connectionStatus.timestamp ? new Date(connectionStatus.timestamp).toLocaleString() : 'Unknown'}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground py-6 text-center">No connection data available</p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={testConnection} 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>
            Check if your environment variables are properly set
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="font-medium mb-2">NEXT_PUBLIC_SUPABASE_URL:</div>
              <div className="flex items-center">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="mr-1 h-3 w-3" />
                    Set
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <X className="mr-1 h-3 w-3" />
                    Not Set
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <div className="font-medium mb-2">NEXT_PUBLIC_SUPABASE_ANON_KEY:</div>
              <div className="flex items-center">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="mr-1 h-3 w-3" />
                    Set
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <X className="mr-1 h-3 w-3" />
                    Not Set
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <div className="font-medium mb-2">SUPABASE_SERVICE_ROLE_KEY:</div>
              <div className="flex items-center">
                {process.env.SUPABASE_SERVICE_ROLE_KEY ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="mr-1 h-3 w-3" />
                    Set
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <X className="mr-1 h-3 w-3" />
                    Not Set
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 