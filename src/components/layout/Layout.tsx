import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="flex h-screen">
      <aside className="w-60 shrink-0 border-r">Sidebar</aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
