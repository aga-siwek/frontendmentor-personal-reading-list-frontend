import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ChevronRight, Check } from 'lucide-react'
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
  const { data: allGoals = [] } = useGoals()

  const [nameInput, setNameInput] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [editingGoal, setEditingGoal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [visibleYears, setVisibleYears] = useState(5)
  const [showStats, setShowStats] = useState(false)

  const statsByYear = [...allGoals].sort((a, b) => b.year - a.year)
  const goalPercentage = goal ? Math.min(Math.round((goal.books_finished / goal.goal) * 100), 100) : 0

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

  return (
    <div className="min-h-full bg-white md:bg-main">
      <div className="md:max-w-2xl md:mx-auto md:py-6 md:space-y-6">

        {/* ── Profile header ── */}
        <div className="flex items-center gap-4 px-5 py-5 border-b border-warm-border md:bg-white md:rounded-xl md:border">
          <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center text-white font-bold text-xl shrink-0">
            {user ? getInitials(user.user_name, user.user_email) : '?'}
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold text-warm-text truncate">{user?.user_name ?? 'No name set'}</p>
            <p className="text-sm text-warm-muted truncate">{user?.user_email}</p>
          </div>
        </div>

        {/* ── Account ── */}
        <div className="md:bg-white md:rounded-xl md:border md:border-warm-border md:overflow-hidden">
          <p className="px-5 pt-5 pb-2 text-xs font-semibold uppercase tracking-widest text-warm-muted">Account</p>

          <button
            onClick={() => { setNameInput(user?.user_name ?? ''); setEditingName(v => !v) }}
            className="flex items-center justify-between w-full px-5 py-5 border-t border-warm-border/60 active:bg-gray-50 transition-colors"
          >
            <div className="text-left min-w-0 flex-1">
              <p className="text-lg font-semibold text-warm-text leading-tight">Display Name</p>
              <p className="text-sm text-warm-muted mt-0.5">{user?.user_name ?? 'Not set'}</p>
            </div>
            <ChevronRight size={20} className="text-warm-muted shrink-0 ml-3" />
          </button>

          {editingName && (
            <div className="px-5 pb-5 space-y-3 border-t border-warm-border/60 pt-4">
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false) }}
                autoFocus
                placeholder="Your name"
                className="w-full text-sm border border-warm-border rounded-lg px-3 py-3 text-warm-text bg-transparent outline-none focus:border-brand transition-colors"
              />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditingName(false)} className="px-4 py-2 text-sm text-warm-muted">Cancel</button>
                <button onClick={handleSaveName} className="px-5 py-2 text-sm bg-brand text-white font-medium rounded-lg hover:bg-brand-dark transition-colors">Save</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Reading Goal ── */}
        <div className="md:bg-white md:rounded-xl md:border md:border-warm-border md:overflow-hidden">
          <p className="px-5 pt-5 pb-2 text-xs font-semibold uppercase tracking-widest text-warm-muted">Reading Goal {year}</p>

          <button
            onClick={() => { setGoalInput(String(goal?.goal ?? '')); setEditingGoal(v => !v) }}
            className="flex items-center justify-between w-full px-5 py-5 border-t border-warm-border/60 active:bg-gray-50 transition-colors"
          >
            <div className="text-left min-w-0 flex-1">
              <p className="text-lg font-semibold text-warm-text leading-tight">Books goal</p>
              {goal ? (
                <div className="mt-1.5 space-y-1.5">
                  <p className="text-sm text-warm-muted">{goal.books_finished} / {goal.goal} books · {goalPercentage}%</p>
                  <div className="h-1.5 bg-warm-border rounded-full overflow-hidden w-48 max-w-full">
                    <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${goalPercentage}%` }} />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-warm-muted mt-0.5">No goal set</p>
              )}
            </div>
            <ChevronRight size={20} className="text-warm-muted shrink-0 ml-3" />
          </button>

          {editingGoal && (
            <div className="px-5 pb-5 space-y-3 border-t border-warm-border/60 pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveGoal(); if (e.key === 'Escape') setEditingGoal(false) }}
                  autoFocus
                  min={1}
                  placeholder="books"
                  className="w-28 text-sm border border-warm-border rounded-lg px-3 py-3 text-warm-text bg-transparent outline-none focus:border-brand transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-sm text-warm-muted">books in {year}</span>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditingGoal(false)} className="px-4 py-2 text-sm text-warm-muted">Cancel</button>
                <button onClick={handleSaveGoal} className="px-5 py-2 text-sm bg-brand text-white font-medium rounded-lg hover:bg-brand-dark transition-colors">Save</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Statistics ── */}
        <div className="md:bg-white md:rounded-xl md:border md:border-warm-border md:overflow-hidden">
          <p className="px-5 pt-5 pb-2 text-xs font-semibold uppercase tracking-widest text-warm-muted">Statistics</p>

          <button
            onClick={() => setShowStats(v => !v)}
            className="flex items-center justify-between w-full px-5 py-5 border-t border-warm-border/60 active:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <p className="text-lg font-semibold text-warm-text leading-tight">Reading history</p>
              <p className="text-sm text-warm-muted mt-0.5">{allGoals.length} year{allGoals.length !== 1 ? 's' : ''} tracked</p>
            </div>
            <ChevronRight size={20} className={`text-warm-muted shrink-0 ml-3 transition-transform duration-200 ${showStats ? 'rotate-90' : ''}`} />
          </button>

          {showStats && (
            <div className="border-t border-warm-border/60">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-warm-border/40">
                    <th className="text-left text-xs text-warm-muted font-medium py-3 px-5">Year</th>
                    <th className="text-right text-xs text-warm-muted font-medium py-3 px-5">Finished</th>
                    <th className="text-right text-xs text-warm-muted font-medium py-3 px-5">Goal</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {statsByYear.slice(0, visibleYears).map(row => (
                    <tr key={row.year} className="border-b border-warm-border/30 last:border-0">
                      <td className="py-4 px-5 text-base font-semibold text-warm-text">{row.year}</td>
                      <td className="py-4 px-5 text-right text-base text-warm-text">{row.books_finished}</td>
                      <td className="py-4 px-5 text-right text-base text-warm-muted">{row.goal}</td>
                      <td className="py-4 pr-5 text-center">
                        {row.books_finished >= row.goal && <Check size={16} className="text-brand mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {statsByYear.length > visibleYears && (
                <button
                  onClick={() => setVisibleYears(v => v + 5)}
                  className="w-full py-4 text-sm font-semibold text-warm-muted hover:text-brand transition-colors border-t border-warm-border/50"
                >
                  Load more ({statsByYear.length - visibleYears} more)
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Danger Zone ── */}
        <div className="md:bg-white md:rounded-xl md:border md:border-warm-border md:overflow-hidden">
          <p className="px-5 pt-5 pb-2 text-xs font-semibold uppercase tracking-widest text-warm-muted">Danger Zone</p>

          {confirmDelete ? (
            <div className="px-5 pb-5 border-t border-warm-border/60 pt-4 space-y-4">
              <p className="text-base text-warm-text">Are you sure? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(false)} className="flex-1 py-3 text-sm text-warm-muted border border-warm-border rounded-lg">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-3 text-sm text-white bg-red-500 rounded-lg font-medium hover:bg-red-600 transition-colors">Delete account</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-between w-full px-5 py-5 border-t border-warm-border/60 active:bg-red-50 transition-colors"
            >
              <p className="text-lg font-semibold text-red-500 leading-tight">Delete Account</p>
              <ChevronRight size={20} className="text-red-300 shrink-0 ml-3" />
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default SettingsPage
