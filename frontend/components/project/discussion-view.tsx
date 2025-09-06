"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Reply } from "lucide-react"
import { toast } from "sonner"
import { discussionsAPI } from "@/lib/api"

interface DiscussionAuthor {
  _id: string
  name: string
  email: string
  profileImage?: string
}

interface DiscussionMessage {
  _id: string
  message: string
  userId: string
 timestamp: string
  projectId: string
  user?: DiscussionAuthor
}

interface DiscussionViewProps {
  projectId: string
}

export function DiscussionView({ projectId }: DiscussionViewProps) {
  const [messages, setMessages] = useState<DiscussionMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchDiscussions()
  }, [projectId])

  const fetchDiscussions = async () => {
    try {
      const response = await discussionsAPI.getByProjectId(projectId)
      if (response.success) {
        setMessages(response.data)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch discussions")
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const response = await discussionsAPI.create({
        projectId,
        message: newMessage
      })

      if (response.success) {
        setMessages([...messages, response.data])
        setNewMessage("")
        toast.success("Message sent successfully!")
      } else {
        toast.error(response.message || "Failed to send message")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send message")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      action()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((message) => {
          // Transform user data for UI
          const userData = message.user ? {
            id: message.user._id,
            name: message.user.name,
            initials: message.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            avatar: message.user.profileImage || "/placeholder.svg"
          } : {
            id: message.userId,
            name: "Unknown User",
            initials: "UU",
            avatar: "/placeholder.svg"
          };

          return (
            <div key={message._id} className="space-y-3">
              {/* Main Message */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-sm">{userData.initials}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{userData.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback className="text-sm">U</AvatarFallback>
          </Avatar>

          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleSendMessage)}
              className="flex-1 rounded-2xl"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="icon"
              className="h-10 w-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
