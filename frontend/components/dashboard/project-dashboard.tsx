"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plus, Search, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { NewProjectModal } from "./new-project-modal"
import { NotificationsDropdown } from "./notifications-dropdown"
import Link from "next/link"
import { projectsAPI, authAPI } from "@/lib/api"

interface Project {
  _id: string
  name: string
  description: string
  tasksCompleted: number
  totalTasks: number
  progress: number
  members: number
  dueDate: string
  createdAt: string
}

export function ProjectDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchProjects()
    fetchCurrentUser()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll()
      if (response.success) {
        // Transform the data to match the expected format
        const transformedProjects = response.data.map((project: any) => ({
          _id: project._id,
          name: project.name,
          description: project.description,
          tasksCompleted: 0, // We'll need to fetch this separately
          totalTasks: 0, // We'll need to fetch this separately
          progress: 0, // We'll calculate this based on tasks
          members: project.members?.length || 1,
          dueDate: project.createdAt, // Using createdAt as dueDate for now
          createdAt: project.createdAt
        }))
        setProjects(transformedProjects)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser()
      if (response.success) {
        setUser(response.data)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch user data")
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateProject = (project: any) => {
    // Add the new project to the list
    setProjects(prev => [...prev, {
      _id: project._id,
      name: project.name,
      description: project.description,
      tasksCompleted: 0,
      totalTasks: 0,
      progress: 0,
      members: project.members?.length || 1,
      dueDate: project.createdAt,
      createdAt: project.createdAt
    }])
    toast.success("Project created successfully!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">SynergySphere</h1>
          </div>

          <div className="flex items-center gap-3">
            <NotificationsDropdown />
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/profile">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user?.profileImage || "/diverse-user-avatars.png"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Welcome back, {user?.name || "User"}!
          </h2>
          <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-2xl"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link key={project._id} href={`/project/${project._id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-foreground line-clamp-1">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {project.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          {project.tasksCompleted}/{project.totalTasks} tasks
                        </span>
                        <span className="text-muted-foreground">{project.members} members</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Due {new Date(project.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No projects found matching your search." : "No projects yet."}
            </p>
            <Button
              onClick={() => setShowNewProjectModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <Button
        onClick={() => setShowNewProjectModal(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  )
}
