"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Package01Icon, BarChartIcon, WorkHistoryIcon, BarCode01Icon, Image01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Products",
    href: "/products",
    icon: Package01Icon,
  },
  {
    title: "Print Barcode",
    href: "/products/print-barcode",
    icon: BarCode01Icon,
  },
  {
    title: "Product History",
    href: "/products/history",
    icon: WorkHistoryIcon,
  },
  {
    title: "Gallery Upload",
    href: "/products/gallery",
    icon: Image01Icon,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChartIcon,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/products" className="flex items-center space-x-2">
          <HugeiconsIcon icon={Package01Icon} strokeWidth={2} className="h-6 w-6" />
          <span className="text-lg font-semibold">Product Manager</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <HugeiconsIcon icon={Icon} strokeWidth={2} className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
