"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { toast } from "sonner"
import { tasksAPI } from "@/lib/api"

interface TaskAssignee {
  _id: string
  name: string
  email: string
  profileImage?: string
}

interface Task {
  _id: string
  title: string
  description: string
  assignee?: TaskAssignee
  dueDate?: string
  status: "To-Do" | "In Progress" | "Done"
  createdAt: string
}

const priorityColors = {
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

interface TaskBoardProps {
  onTaskClick: (task: any) => void
  projectId: string
}

export function TaskBoard({ onTaskClick, projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (projectId) {
      fetchTasks()
    }
  }, [projectId])

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getByProjectId(projectId)
      if (response.success) {
        setTasks(response.data)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  // Group tasks by status
  const groupedTasks = {
    "To-Do": tasks.filter(task => task.status === "To-Do"),
    "In Progress": tasks.filter(task => task.status === "In Progress"),
    "Done": tasks.filter(task => task.status === "Done"),
 }

  const columns = [
    { id: "todo", title: "To Do", tasks: groupedTasks["To-Do"], color: "border-l-gray-400" },
    { id: "inProgress", title: "In Progress", tasks: groupedTasks["In Progress"], color: "border-l-blue-400" },
    { id: "done", title: "Done", tasks: groupedTasks["Done"], color: "border-l-green-400" },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${column.color.replace("border-l-", "bg-")}`} />
              {column.title}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {column.tasks.length}
            </Badge>
          </div>

          <div className="space-y-3">
            {column.tasks.map((task) => {
              // Transform assignee data for UI
              const assigneeData = task.assignee ? {
                id: task.assignee._id,
                name: task.assignee.name,
                initials: task.assignee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                avatar: task.assignee.profileImage || "/placeholder.svg"
              } : null;

              return (
                <Card
                  key={task._id}
                  className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${column.color} border-0 shadow-sm`}
                  onClick={() => onTaskClick(task)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-medium text-foreground line-clamp-2">
                        {task.title}
                      </CardTitle>
                      <Badge className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        Medium
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between">
                      {assigneeData ? (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={assigneeData.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{assigneeData.initials}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">U</span>
                        </div>
                      )}

                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {column.tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
