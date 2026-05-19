import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { BookOpen, Mail, Lock } from 'lucide-react'
import { useLogin } from '@/queries/authQueries'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate: login, isPending, isError } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem('token', data.access_token)
          navigate('/shelf/currently-reading')
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-main flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-warm-border p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center mb-4">
            <BookOpen size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-warm-text text-center leading-tight">
            Welcome Back to<br />Your Bookshelf
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-2 border border-warm-border rounded-lg px-3 py-2.5 focus-within:border-brand transition-colors">
            <Mail size={15} className="text-warm-muted shrink-0" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="flex-1 text-sm text-warm-text placeholder:text-warm-muted bg-transparent outline-none"
            />
          </div>

          <div className="flex items-center gap-2 border border-warm-border rounded-lg px-3 py-2.5 focus-within:border-brand transition-colors">
            <Lock size={15} className="text-warm-muted shrink-0" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="flex-1 text-sm text-warm-text placeholder:text-warm-muted bg-transparent outline-none"
            />
          </div>

          {isError && (
            <p className="text-xs text-red-500">Invalid email or password.</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand hover:bg-brand-dark text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {isPending ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-warm-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
