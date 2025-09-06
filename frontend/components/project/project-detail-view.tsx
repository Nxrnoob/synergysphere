"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToastContainer } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Users, MessageSquare, CheckSquare } from "lucide-react"
import Link from "next/link"
import { TaskBoard } from "./task-board"
import { TaskCreationModal } from "./task-creation-modal"
import { TaskDetailModal } from "./task-detail-modal"
import { DiscussionView } from "./discussion-view"

// Mock project data
const mockProject = {
  id: 1,
  name: "Website Redesign",
  description: "Complete overhaul of company website with modern design and improved UX",
  tasksCompleted: 12,
  totalTasks: 18,
  progress: 67,
  members: [
    { id: 1, name: "John Doe", avatar: "/diverse-user-avatars.png", initials: "JD" },
    { id: 2, name: "Jane Smith", avatar: "/diverse-user-avatars.png", initials: "JS" },
    { id: 3, name: "Mike Johnson", avatar: "/diverse-user-avatars.png", initials: "MJ" },
    { id: 4, name: "Sarah Wilson", avatar: "/diverse-user-avatars.png", initials: "SW" },
  ],
  dueDate: "2024-01-15",
}

interface ProjectDetailViewProps {
  projectId: string
}

export function ProjectDetailView({ projectId }: ProjectDetailViewProps) {
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("tasks")
  const { toasts, toast, removeToast } = useToast()

  const handleTaskCreated = (title: string, assignee: string) => {
    toast.success("Task created successfully", `"${title}" has been assigned to ${assignee}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <ToastContainer toasts={toasts} onClose={removeToast} />

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
              <h1 className="text-lg font-semibold text-foreground">{mockProject.name}</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {mockProject.tasksCompleted}/{mockProject.totalTasks} tasks completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1">
              {mockProject.members.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                </Avatar>
              ))}
              {mockProject.members.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                  +{mockProject.members.length - 3}
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
              {mockProject.progress}% Complete
            </span>
            <span>Due {new Date(mockProject.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
        <Progress value={mockProject.progress} className="h-2" />
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
            <TaskBoard onTaskClick={setSelectedTask} />
          </TabsContent>

          <TabsContent value="discussions" className="space-y-4">
            <DiscussionView projectId={projectId} />
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="grid gap-4">
              {mockProject.members.map((member) => (
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
        projectMembers={mockProject.members}
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        projectMembers={mockProject.members}
      />
    </div>
  )
}
