"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

// Mock task data
const mockTasks = {
  todo: [
    {
      id: 1,
      title: "Design homepage mockup",
      description: "Create wireframes and high-fidelity mockups for the new homepage",
      assignee: { id: 1, name: "John Doe", initials: "JD", avatar: "/diverse-user-avatars.png" },
      dueDate: "2024-01-20",
      priority: "high",
    },
    {
      id: 2,
      title: "Research competitor websites",
      description: "Analyze top 5 competitor websites for design inspiration",
      assignee: { id: 2, name: "Jane Smith", initials: "JS", avatar: "/diverse-user-avatars.png" },
      dueDate: "2024-01-18",
      priority: "medium",
    },
  ],
  inProgress: [
    {
      id: 3,
      title: "Implement responsive navigation",
      description: "Build mobile-first navigation component with hamburger menu",
      assignee: { id: 3, name: "Mike Johnson", initials: "MJ", avatar: "/diverse-user-avatars.png" },
      dueDate: "2024-01-22",
      priority: "high",
    },
    {
      id: 4,
      title: "Set up development environment",
      description: "Configure build tools and development server",
      assignee: { id: 4, name: "Sarah Wilson", initials: "SW", avatar: "/diverse-user-avatars.png" },
      dueDate: "2024-01-16",
      priority: "low",
    },
  ],
  done: [
    {
      id: 5,
      title: "Project kickoff meeting",
      description: "Initial team meeting to discuss project scope and timeline",
      assignee: { id: 1, name: "John Doe", initials: "JD", avatar: "/diverse-user-avatars.png" },
      dueDate: "2024-01-10",
      priority: "medium",
    },
    {
      id: 6,
      title: "Gather requirements",
      description: "Document all functional and technical requirements",
      assignee: { id: 2, name: "Jane Smith", initials: "JS", avatar: "/diverse-user-avatars.png" },
      dueDate: "2024-01-12",
      priority: "high",
    },
  ],
}

const priorityColors = {
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

interface TaskBoardProps {
  onTaskClick: (task: any) => void
}

export function TaskBoard({ onTaskClick }: TaskBoardProps) {
  const columns = [
    { id: "todo", title: "To Do", tasks: mockTasks.todo, color: "border-l-gray-400" },
    { id: "inProgress", title: "In Progress", tasks: mockTasks.inProgress, color: "border-l-blue-400" },
    { id: "done", title: "Done", tasks: mockTasks.done, color: "border-l-green-400" },
  ]

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
            {column.tasks.map((task) => (
              <Card
                key={task.id}
                className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${column.color} border-0 shadow-sm`}
                onClick={() => onTaskClick(task)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-medium text-foreground line-clamp-2">{task.title}</CardTitle>
                    <Badge className={`text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                      {task.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>

                  <div className="flex items-center justify-between">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                    </Avatar>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
