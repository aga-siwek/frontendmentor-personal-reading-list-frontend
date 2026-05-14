import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/sidebar/Sidebar'

const Layout = () => {
  return (
    <div className="flex h-screen bg-main">
      <aside className="w-60 shrink-0">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
