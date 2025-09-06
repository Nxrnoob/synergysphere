"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, User, Bell, Shield, LogOut } from "lucide-react"
import Link from "next/link"

// Mock user data
const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john.doe@company.com",
  initials: "JD",
  avatar: "/diverse-user-avatars.png",
  joinedDate: "January 2024",
  settings: {
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    weeklyDigest: true,
  },
}

export function UserProfile() {
  const [user, setUser] = useState(mockUser)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user.name)
  const [editedEmail, setEditedEmail] = useState(user.email)
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveProfile = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setUser({
      ...user,
      name: editedName,
      email: editedEmail,
    })

    setIsEditing(false)
    setIsLoading(false)
  }

  const handleCancelEdit = () => {
    setEditedName(user.name)
    setEditedEmail(user.email)
    setIsEditing(false)
  }

  const handleSettingChange = (setting: keyof typeof user.settings, value: boolean) => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        [setting]: value,
      },
    })
  }

  const handleLogout = () => {
    // In a real app, this would clear auth tokens and redirect
    window.location.href = "/"
  }

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
            <h1 className="text-lg font-semibold text-foreground">Profile & Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <CardDescription>Manage your personal information and account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">{user.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">Profile Picture</p>
                  <Button variant="outline" size="sm" className="mt-1 rounded-2xl bg-transparent">
                    Change Photo
                  </Button>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="rounded-2xl"
                    />
                  ) : (
                    <div className="p-3 rounded-2xl border border-border bg-muted/30">
                      <span className="text-foreground">{user.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="rounded-2xl"
                    />
                  ) : (
                    <div className="p-3 rounded-2xl border border-border bg-muted/30">
                      <span className="text-foreground">{user.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="p-3 rounded-2xl border border-border bg-muted/30">
                    <span className="text-foreground">{user.joinedDate}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="flex-1 rounded-2xl bg-transparent"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>Choose how you want to be notified about project updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive email updates about project activities</p>
                </div>
                <Switch
                  checked={user.settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Get instant notifications in your browser</p>
                </div>
                <Switch
                  checked={user.settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Task Reminders</Label>
                  <p className="text-xs text-muted-foreground">Remind me about upcoming task deadlines</p>
                </div>
                <Switch
                  checked={user.settings.taskReminders}
                  onCheckedChange={(checked) => handleSettingChange("taskReminders", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Weekly Digest</Label>
                  <p className="text-xs text-muted-foreground">Get a weekly summary of your project progress</p>
                </div>
                <Switch
                  checked={user.settings.weeklyDigest}
                  onCheckedChange={(checked) => handleSettingChange("weeklyDigest", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Manage your account security and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start rounded-2xl bg-transparent">
                Change Password
              </Button>

              <Button variant="outline" className="w-full justify-start rounded-2xl bg-transparent">
                Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>

          {/* Logout Section */}
          <Card className="border-0 shadow-sm border-destructive/20">
            <CardContent className="pt-6">
              <Button onClick={handleLogout} variant="destructive" className="w-full justify-center gap-2 rounded-2xl">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">You'll be signed out of all devices</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
