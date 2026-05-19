import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/sidebar/Sidebar'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'

const Layout = () => {
  return (
    <div className="flex h-screen bg-main">
      <aside className="hidden md:flex w-60 shrink-0">
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

export default Layout
