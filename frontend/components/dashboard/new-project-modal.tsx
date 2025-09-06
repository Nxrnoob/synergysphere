"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { projectsAPI } from "@/lib/api"

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateProject: (project: any) => void
}

export function NewProjectModal({ isOpen, onClose, onCreateProject }: NewProjectModalProps) {
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) return

    setIsLoading(true)

    try {
      const response = await projectsAPI.create({
        name: projectName,
        description: projectDescription
      })

      if (response.success) {
        toast.success("Project created successfully!")
        onCreateProject(response.data)
        setProjectName("")
        setProjectDescription("")
        onClose()
      } else {
        toast.error(response.message || "Failed to create project")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Start a new collaboration project for your team.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="rounded-2xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Describe your project (optional)"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="rounded-2xl min-h-[80px]"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={!projectName.trim() || isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
            >
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="rounded-2xl bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
