"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ArrowLeft, Plus, Users, MessageSquare, CheckSquare } from "lucide-react"
import Link from "next/link"
import { TaskBoard } from "./task-board"
import { TaskCreationModal } from "./task-creation-modal"
import { TaskDetailModal } from "./task-detail-modal"
import { DiscussionView } from "./discussion-view"
import { projectsAPI } from "@/lib/api"

interface ProjectMember {
  _id: string
  name: string
  email: string
  profileImage?: string
}

interface Project {
  _id: string
  name: string
  description: string
  tasksCompleted: number
  totalTasks: number
  progress: number
 members: ProjectMember[]
  dueDate: string
  createdAt: string
}

interface ProjectDetailViewProps {
  projectId: string
}

export function ProjectDetailView({ projectId }: ProjectDetailViewProps) {
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("tasks")
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getById(projectId)
      if (response.success) {
        setProject({
          ...response.data,
          tasksCompleted: 0, // We'll need to fetch this separately
          totalTasks: 0, // We'll need to fetch this separately
          progress: 0, // We'll calculate this based on tasks
          dueDate: response.data.createdAt // Using createdAt as dueDate for now
        })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch project")
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (task: any) => {
    toast.success("Task created successfully", `"${task.title}" has been created`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Project not found</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Transform members for the UI components
  const projectMembers = project.members.map(member => ({
    id: member._id,
    name: member.name,
    avatar: member.profileImage || "/placeholder.svg",
    initials: member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{project.name}</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {project.tasksCompleted}/{project.totalTasks} tasks completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1">
              {projectMembers.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                </Avatar>
              ))}
              {projectMembers.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                  +{projectMembers.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Project Stats */}
      <div className="container px-4 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckSquare className="h-4 w-4" />
              {project.progress}% Complete
            </span>
            <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
        <Progress value={project.progress} className="h-2" />
      </div>

      {/* Tabs */}
      <div className="container px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <TaskBoard onTaskClick={setSelectedTask} projectId={projectId} />
          </TabsContent>

          <TabsContent value="discussions" className="space-y-4">
            <DiscussionView projectId={projectId} />
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="grid gap-4">
              {projectMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">Team Member</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Add Task Button */}
      {activeTab === "tasks" && (
        <Button
          onClick={() => setShowTaskModal(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      {/* Modals */}
      <TaskCreationModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onTaskCreated={handleTaskCreated}
        projectMembers={projectMembers}
        projectId={projectId}
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        projectMembers={projectMembers}
      />
    </div>
  )
}
