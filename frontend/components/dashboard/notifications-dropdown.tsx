"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { notificationsAPI } from "@/lib/api"

interface Notification {
  _id: string
  type: "task_created" | "task_completed" | "project_update" | "task_assigned"
  message: string
  isRead: boolean
  createdAt: string
}

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getUnread()
      if (response.success) {
        setNotifications(response.data)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch notifications")
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = async (id: string) => {
    try {
      const response = await notificationsAPI.markAsRead(id)
      if (response.success) {
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)))
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to mark notification as read")
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await notificationsAPI.markAllAsRead()
      if (response.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        toast.success("All notifications marked as read")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to mark all notifications as read")
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
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
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={cn(
                        "p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer",
                        !notification.isRead && "bg-blue-50/50",
                      )}
                      onClick={() => markAsRead(notification._id)}
                    >
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="text-xs">N</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">
                                {notification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{formatTime(notification.createdAt)}</p>
                            </div>
                            {!notification.isRead && (
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
