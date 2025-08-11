import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3,
  CreditCard,
  Users, 
  MessageSquare,
  Package,
  TrendingUp,
  Shield,
  Settings,
  Menu,
  X
} from "lucide-react"
import { UpgradeCard } from "@/components/dashboard/UpgradeCard"
import { UserProfile } from "@/components/dashboard/UserProfile"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <BarChart3 className="h-4 w-4" />,
      active: true
    },
    {
      title: "Payment",
      href: "/payment",
      icon: <CreditCard className="h-4 w-4" />
    },
    {
      title: "Customers",
      href: "/customers",
      icon: <Users className="h-4 w-4" />
    },
    {
      title: "Message",
      href: "/message",
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      title: "Product",
      href: "/product",
      icon: <Package className="h-4 w-4" />
    },
    {
      title: "Analysis",
      href: "/analysis",
      icon: <TrendingUp className="h-4 w-4" />
    }
  ]

  const accountItems = [
    {
      title: "Security",
      href: "/security",
      icon: <Shield className="h-4 w-4" />
    },
    {
      title: "Setting",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />
    }
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-card shadow-card"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation sidebar */}
      <nav className={`
        fixed top-0 left-0 h-full w-64 bg-card border-r border-card-border shadow-elegant z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Sales UI</h2>
              </div>
            </div>
          </div>

          {/* Main Menu */}
          <div className="px-6 flex-1">
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Main Menu
              </h3>
              {navigationItems.map((item, index) => (
                <Button
                  key={index}
                  variant={item.active ? "default" : "ghost"}
                  className={`
                    w-full justify-start gap-3 h-10 text-left
                    ${item.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Button>
              ))}
            </div>

            {/* Account Section */}
            <div className="space-y-1 mt-8">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Account
              </h3>
              {accountItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10 text-left text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Button>
              ))}
            </div>

            {/* Upgrade Card */}
            <div className="mt-8">
              <UpgradeCard />
            </div>
          </div>

          {/* User Profile */}
          <div className="border-t border-card-border">
            <UserProfile />
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}