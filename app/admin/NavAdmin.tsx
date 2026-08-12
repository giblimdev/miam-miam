// @/components/admin/NavAdmin.tsx

"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navAdmin } from '@/app/admin/adminNav'

export default function NavAdmin() {
  const pathname = usePathname()

  return (
    <nav className="space-y-6">
      {navAdmin.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {category.categoryTitle}
          </h3>
          <div className="space-y-1">
            {category.items.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg
                    ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {item.description}
                    </p>
                  </div>
                  {item.badge && (
                    <span className={`
                      ml-2 px-2 py-0.5 text-xs font-medium rounded-full
                      ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}