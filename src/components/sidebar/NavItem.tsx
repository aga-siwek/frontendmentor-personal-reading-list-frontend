import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface NavItemProps {
  to: string
  icon: LucideIcon
  label: string
  count?: number
}

const NavItem = ({ to, icon: Icon, label, count }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-2 text-sm rounded-r-lg border-l-2 transition-colors',
          isActive
            ? 'border-brand text-brand font-medium bg-brand-light'
            : 'border-transparent text-warm-muted hover:text-warm-text hover:bg-brand-light/40'
        )
      }
    >
      <Icon size={16} />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-warm-muted">{count}</span>
      )}
    </NavLink>
  )
}

export default NavItem
