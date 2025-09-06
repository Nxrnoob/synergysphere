"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Reply } from "lucide-react"
import { formatExactTime } from "@/lib/date-utils"

// Mock discussion data
const mockMessages = [
  {
    id: 1,
    content:
      "Hey team! I've uploaded the initial wireframes to the shared folder. Please take a look and let me know your thoughts.",
    author: {
      id: 1,
      name: "John Doe",
      initials: "JD",
      avatar: "/diverse-user-avatars.png",
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    replies: [
      {
        id: 2,
        content: "Great work! The navigation structure looks really intuitive. I especially like the mobile layout.",
        author: {
          id: 2,
          name: "Jane Smith",
          initials: "JS",
          avatar: "/diverse-user-avatars.png",
        },
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        parentId: 1,
      },
      {
        id: 3,
        content: "Agreed! Should we schedule a quick review meeting for tomorrow?",
        author: {
          id: 3,
          name: "Mike Johnson",
          initials: "MJ",
          avatar: "/diverse-user-avatars.png",
        },
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        parentId: 1,
      },
    ],
  },
  {
    id: 4,
    content:
      "I've started working on the responsive breakpoints. The design looks great on tablet sizes, but we might need to adjust the sidebar on smaller screens.",
    author: {
      id: 4,
      name: "Sarah Wilson",
      initials: "SW",
      avatar: "/diverse-user-avatars.png",
    },
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    replies: [],
  },
  {
    id: 5,
    content:
      "Quick update: The API integration is complete and ready for testing. All endpoints are documented in the project wiki.",
    author: {
      id: 2,
      name: "Jane Smith",
      initials: "JS",
      avatar: "/diverse-user-avatars.png",
    },
    timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
    replies: [
      {
        id: 6,
        content: "Awesome! I'll start testing the user authentication flow this afternoon.",
        author: {
          id: 1,
          name: "John Doe", // Current user
          initials: "JD",
          avatar: "/diverse-user-avatars.png",
        },
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        parentId: 5,
      },
    ],
  },
]

interface DiscussionViewProps {
  projectId: string
}

export function DiscussionView({ projectId }: DiscussionViewProps) {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      content: newMessage,
      author: {
        id: 1,
        name: "John Doe", // Current user
        initials: "JD",
        avatar: "/diverse-user-avatars.png",
      },
      timestamp: new Date(),
      replies: [],
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleSendReply = (parentId: number) => {
    if (!replyContent.trim()) return

    const reply = {
      id: Date.now(),
      content: replyContent,
      author: {
        id: 1,
        name: "John Doe", // Current user
        initials: "JD",
        avatar: "/diverse-user-avatars.png",
      },
      timestamp: new Date(),
      parentId,
    }

    setMessages(messages.map((msg) => (msg.id === parentId ? { ...msg, replies: [...msg.replies, reply] } : msg)))
    setReplyContent("")
    setReplyingTo(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      action()
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((message) => (
          <div key={message.id} className="space-y-3">
            {/* Main Message */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={message.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-sm">{message.author.initials}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{message.author.name}</span>
                      <span className="text-xs text-muted-foreground">{formatExactTime(message.timestamp)}</span>
                    </div>

                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{message.content}</p>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setReplyingTo(replyingTo === message.id ? null : message.id)}
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Replies */}
            {message.replies.length > 0 && (
              <div className="ml-8 space-y-2">
                {message.replies.map((reply) => (
                  <Card key={reply.id} className="border-0 shadow-sm bg-muted/30">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{reply.author.initials}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground text-sm">{reply.author.name}</span>
                            <span className="text-xs text-muted-foreground">{formatExactTime(reply.timestamp)}</span>
                          </div>

                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Reply Input */}
            {replyingTo === message.id && (
              <div className="ml-8">
                <Card className="border-0 shadow-sm bg-muted/20">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src="/diverse-user-avatars.png" />
                        <AvatarFallback className="text-xs">JD</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, () => handleSendReply(message.id))}
                          className="border-0 bg-background focus-visible:ring-1 rounded-2xl"
                        />

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSendReply(message.id)}
                            disabled={!replyContent.trim()}
                            className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
                          >
                            Reply
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyContent("")
                            }}
                            className="h-7 px-3 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback className="text-sm">JD</AvatarFallback>
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
