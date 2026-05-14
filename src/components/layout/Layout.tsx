import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/sidebar/Sidebar'
import Header from '@/components/layout/Header'

const Layout = () => {
  return (
    <div className="flex h-screen bg-main">
      <aside className="w-60 shrink-0">
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
