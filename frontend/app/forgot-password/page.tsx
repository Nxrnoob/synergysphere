import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">SynergySphere</h1>
          <p className="text-muted-foreground">Reset your password</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
