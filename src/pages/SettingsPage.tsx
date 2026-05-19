import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCurrentUser, useUpdateUser, useDeleteAccount } from '@/queries/authQueries'
import { useGoal, useSetGoal, useGoals } from '@/queries/goalQueries'

const getInitials = (name: string | null, email: string) => {
  if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  return email[0].toUpperCase()
}

const SettingsPage = () => {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const { mutate: updateUser } = useUpdateUser()
  const { mutate: deleteAccount } = useDeleteAccount()

  const year = new Date().getFullYear()
  const { data: goal } = useGoal(year)
  const { mutate: saveGoal } = useSetGoal()

  const [nameInput, setNameInput] = useState('')
  const [editingName, setEditingName] = useState(false)

  const [goalInput, setGoalInput] = useState('')
  const [editingGoal, setEditingGoal] = useState(false)

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [visibleYears, setVisibleYears] = useState(5)

  // ── stats ──────────────────────────────────────────────
  const { data: allGoals = [] } = useGoals()

  const statsByYear = [...allGoals].sort((a, b) => b.year - a.year)

  // ── handlers ──────────────────────────────────────────
  const handleSaveName = () => {
    const name = nameInput.trim()
    if (!name) return
    updateUser(name, {
      onSuccess: () => { toast.success('Name updated'); setEditingName(false) },
    })
  }

  const handleSaveGoal = () => {
    const value = parseInt(goalInput)
    if (!isNaN(value) && value > 0) {
      saveGoal({ year, goal: value }, {
        onSuccess: () => { toast.success('Goal updated'); setEditingGoal(false) },
      })
    }
  }

  const handleDelete = () => {
    deleteAccount(undefined, {
      onSuccess: () => {
        localStorage.removeItem('token')
        navigate('/login')
      },
    })
  }

  const goalPercentage = goal ? Math.min(Math.round((goal.books_finished / goal.goal) * 100), 100) : 0

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold text-warm-text">Settings</h1>

      {/* ── PROFILE ── */}
      <section className="bg-white rounded-xl border border-warm-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-warm-text">Profile</h2>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white font-semibold text-lg shrink-0">
            {user ? getInitials(user.user_name, user.user_email) : '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-warm-text truncate">{user?.user_name ?? 'No name set'}</p>
            <p className="text-xs text-warm-muted truncate">{user?.user_email}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-warm-muted mb-1.5">Display name</p>
          {editingName ? (
            <div className="space-y-2">
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false) }}
                autoFocus
                placeholder="Your name"
                className="w-full text-sm border border-warm-border rounded-lg px-3 py-2 text-warm-text bg-transparent outline-none focus:border-brand transition-colors"
              />
              <div className="flex gap-3">
                <button onClick={() => setEditingName(false)} className="text-sm text-warm-muted hover:text-warm-text transition-colors">Cancel</button>
                <button onClick={handleSaveName} className="text-sm text-brand font-medium hover:text-brand-dark transition-colors">Save</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setNameInput(user?.user_name ?? ''); setEditingName(true) }}
              className="text-sm text-brand hover:underline"
            >
              {user?.user_name ? 'Change name' : 'Add name'}
            </button>
          )}
        </div>
      </section>

      {/* ── READING GOAL ── */}
      <section className="bg-white rounded-xl border border-warm-border p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-warm-text">Reading Goal {year}</h2>
          {!editingGoal && (
            <button
              onClick={() => { setGoalInput(String(goal?.goal ?? '')); setEditingGoal(true) }}
              className="text-xs text-warm-muted hover:text-brand transition-colors"
            >
              {goal ? 'Edit' : 'Add goal'}
            </button>
          )}
        </div>

        {editingGoal ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSaveGoal(); if (e.key === 'Escape') setEditingGoal(false) }}
                autoFocus
                min={1}
                placeholder="books"
                className="w-24 text-sm border border-warm-border rounded-lg px-3 py-2 text-warm-text bg-transparent outline-none focus:border-brand transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-sm text-warm-muted">books in {year}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditingGoal(false)} className="text-sm text-warm-muted hover:text-warm-text transition-colors">Cancel</button>
              <button onClick={handleSaveGoal} className="text-sm text-brand font-medium hover:text-brand-dark transition-colors">Save</button>
            </div>
          </div>
        ) : goal ? (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-warm-muted">{goal.books_finished} / {goal.goal} books</span>
              <span className="font-medium text-brand">{goalPercentage}%</span>
            </div>
            <div className="h-2 bg-warm-border rounded-full overflow-hidden">
              <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${goalPercentage}%` }} />
            </div>
            <p className="text-xs text-warm-muted">
              {goal.goal - goal.books_finished > 0 ? `${goal.goal - goal.books_finished} books to go` : 'Goal reached! 🎉'}
            </p>
          </>
        ) : (
          <p className="text-sm text-warm-muted">No goal set for this year.</p>
        )}
      </section>

      {/* ── STATS ── */}
      <section className="bg-white rounded-xl border border-warm-border p-5 space-y-3">
        <h2 className="text-sm font-semibold text-warm-text">Your Stats</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-border">
                <th className="text-left text-xs text-warm-muted font-medium pb-2 pr-4">Year</th>
                <th className="text-right text-xs text-warm-muted font-medium pb-2 pr-4">Books finished</th>
                <th className="text-right text-xs text-warm-muted font-medium pb-2">Goal</th>
              </tr>
            </thead>
            <tbody>
              {statsByYear.slice(0, visibleYears).map(row => (
                <tr key={row.year} className="border-b border-warm-border/40 last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-warm-text">{row.year}</td>
                  <td className="py-2.5 pr-4 text-right text-warm-text">{row.books_finished}</td>
                  <td className="py-2.5 text-right">
                    <span className={row.books_finished >= row.goal ? 'text-brand font-medium' : 'text-warm-muted'}>
                      {row.books_finished} / {row.goal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {statsByYear.length > visibleYears && (
          <button
            onClick={() => setVisibleYears(v => v + 5)}
            className="text-xs text-warm-muted hover:text-brand transition-colors"
          >
            Load more ({statsByYear.length - visibleYears} more)
          </button>
        )}
      </section>

      {/* ── DELETE ACCOUNT ── */}
      <section className="bg-white rounded-xl border border-red-200 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-red-600">Danger Zone</h2>
        {confirmDelete ? (
          <div className="space-y-3">
            <p className="text-sm text-warm-text">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="text-sm text-warm-muted hover:text-warm-text transition-colors">Cancel</button>
              <button onClick={handleDelete} className="text-sm text-red-600 font-medium hover:text-red-700 transition-colors">Yes, delete my account</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete account
          </button>
        )}
      </section>
    </div>
  )
}

export default SettingsPage
