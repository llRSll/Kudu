"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DocumentUploadDialog() {
  const [files, setFiles] = useState<File[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Documents
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Upload and categorize your documents. You can upload multiple files at once.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="files">Files</Label>
            <div
              className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, Word, Excel, PowerPoint, Images (up to 25MB each)
              </p>
              <Input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Selected Files</Label>
                <div className="max-h-[150px] overflow-auto rounded-md border p-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between py-1">
                      <div className="flex items-center">
                        <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="properties">Properties</SelectItem>
                <SelectItem value="investments">Investments</SelectItem>
                <SelectItem value="credit">Credit Facilities</SelectItem>
                <SelectItem value="entities">Entities</SelectItem>
                <SelectItem value="tax">Tax Documents</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="financial">Financial Statements</SelectItem>
                <SelectItem value="legal">Legal Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="related">Related To</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select related item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="123-main">123 Main Street</SelectItem>
                <SelectItem value="oceanview">Oceanview Condo</SelectItem>
                <SelectItem value="mountain">Mountain Development</SelectItem>
                <SelectItem value="doe-holdings">Doe Family Holdings, LLC</SelectItem>
                <SelectItem value="doe-trust">Doe Family Trust</SelectItem>
                <SelectItem value="boa-line">Bank of America Commercial Line</SelectItem>
                <SelectItem value="investment-portfolio">Investment Portfolio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeTag(tag)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Type a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea placeholder="Add a description for these documents" className="resize-none" />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" disabled={files.length === 0}>
            Upload {files.length > 0 ? `(${files.length} files)` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

