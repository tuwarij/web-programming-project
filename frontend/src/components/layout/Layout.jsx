import { Outlet, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/food', label: 'Food Log', icon: '🍎' },
  { to: '/workout', label: 'Workout', icon: '💪' },
  { to: '/weight', label: 'Weight', icon: '⚖️' },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-orange-50 ">
      {/* Sidebar */}
      <aside className="hidden md:flex w-80 bg-white border-r border-orange-100 flex-col shadow-[0_0_20px_rgba(255,107,53,0.05)]">
        <div className="p-9 border-b border-orange-100">
          <h1 className="font-sriracha text-5xl text-primary-500">FitPhung</h1>
          <div className="text-md text-gray-500 mt-1">Hi, My trainee 👋</div>
        </div>

        <nav className="flex-1 p-4 space-y-1 ">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-md font-medium  ${isActive
                  ? 'bg-primary-500/10 text-primary-600 border border-primary-500/20'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-orange-100'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>      
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0 pt-16 md:pt-0">
        <div className="mx-5 p-8 ">
          <Outlet />
        </div>
      </main>
      <div className="flex px-9 py-3 border-b border-orange-100 md:hidden justify-between bg-white fixed top-0 left-0 right-0 z-50 ">
          <h1 className="font-sriracha text-3xl text-primary-500">FitPhung</h1>
          <p className="text-sm text-gray-500 mt-1">Hi, My trainee 👋</p>
      </div>
      {/* Bottom Nav — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-100 flex md:hidden">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium transition-all ${
                isActive ? 'text-primary-500' : 'text-gray-400'
              }`
            }
          >
            <span className="text-xl mb-1">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
