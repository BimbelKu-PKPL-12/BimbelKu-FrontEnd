import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      <header className="w-full py-4 px-6 border-b bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-600" />
            <span className="font-bold text-xl text-slate-800">BimbelKu</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-purple-600" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">{title}</h2>
            <p className="mt-2 text-center text-sm text-slate-600">{subtitle}</p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-slate-200">{children}</div>
        </div>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-slate-800">BimbelKu</span>
            </div>
            <p className="mt-2 sm:mt-0 text-sm text-slate-500">
              &copy; {new Date().getFullYear()} BimbelKu. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

