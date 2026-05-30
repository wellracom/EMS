'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TabNav() {
  const pathname = usePathname()

  const tabs = [
    {
      label: 'MTCP',
      href: '/menu/tagStatus/mtcp',
    },
    {
      label: 'MQTT',
      href: '/menu/tagStatus/mqtt',
    },
    {
      label: 'OPC UA',
      href: '/menu/tagStatus/opcua',
    },
  ]

  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-4 py-3 transition
            ${
              pathname === tab.href
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-black'
            }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}