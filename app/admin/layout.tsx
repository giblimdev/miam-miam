// @/app/admin/layout.tsx

import React from 'react'
import NavAdmin from '@/app/admin/NavAdmin'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-72">
            <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  🛠 Administration
                </h2>
              </div>
              <div className="flex-grow px-4">
                <NavAdmin />
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex flex-col min-w-0 flex-1 overflow-hidden">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}