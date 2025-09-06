"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare } from "lucide-react"

interface TaskDetailModalProps {
  task: any
  isOpen: boolean
  onClose: () => void
  projectMembers: Array<{
    id: number
    name: string
    initials: string
    avatar: string
  }>
}

const statusOptions = [
  { value: "todo", label: "To Do", color: "bg-gray-100 text-gray-800" },
  { value: "inProgress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
  { value: "done", label: "Done", color: "bg-green-100 text-green-800" },
]

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

export function TaskDetailModal({ task, isOpen, onClose, projectMembers }: TaskDetailModalProps) {
  const [status, setStatus] = useState(task?.status || "todo")
  const [comment, setComment] = useState("")

  if (!task) return null

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    // In a real app, this would update the task status
  }

  const handleAddComment = () => {
    if (comment.trim()) {
      // In a real app, this would add the comment to the task
      setComment("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-foreground">{task.title}</DialogTitle>
              <DialogDescription className="mt-2">{task.description}</DialogDescription>
            </div>
            <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>{task.priority}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assignee</Label>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{task.assignee.name}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <div className="flex items-center gap-2 p-3 rounded-lg border border-border">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${option.color.split(" ")[0]}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <Label>Comments</Label>
            </div>

            {/* Mock existing comments */}
            <div className="space-y-3 max-h-40 overflow-y-auto">
              <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/diverse-user-avatars.png" />
                  <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-sm text-foreground">
                    I've started working on the wireframes. Should have the first draft ready by tomorrow.
                  </p>
                </div>
              </div>
            </div>

            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                className="rounded-2xl resize-none"
              />
              <Button
                onClick={handleAddComment}
                disabled={!comment.trim()}
                className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Add Comment
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} className="flex-1 rounded-2xl bg-transparent">
              Close
            </Button>
            <Button className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
