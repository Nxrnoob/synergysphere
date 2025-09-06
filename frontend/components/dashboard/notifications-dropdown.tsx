"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "task_assigned",
    title: "New task assigned",
    description: "You've been assigned to 'Update homepage design'",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false,
    avatar: "/diverse-user-avatars.png",
    initials: "JS",
  },
  {
    id: 2,
    type: "project_created",
    title: "Project created",
    description: "Mobile App Development project has been created",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    avatar: "/diverse-user-avatars.png",
    initials: "MJ",
  },
  {
    id: 3,
    type: "message",
    title: "New message",
    description: "Sarah Wilson commented on Website Redesign",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    avatar: "/diverse-user-avatars.png",
    initials: "SW",
  },
]

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <Card className="absolute right-0 top-12 w-80 z-[60] shadow-lg border-0">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                    Mark all read
                  </Button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer",
                        !notification.read && "bg-blue-50/50",
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{notification.initials}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{notification.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{formatTime(notification.timestamp)}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
