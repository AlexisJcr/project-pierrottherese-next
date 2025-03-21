import LoginForm from "@/ui/components/Auth/login-form"

import Navbar from "@/ui/components/Navbar/navbar"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4 pt-20">
        <Navbar />
        <LoginForm />
      </main>
    </div>
  )
}

