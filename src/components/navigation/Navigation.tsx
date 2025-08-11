import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Brain,
  FileText,
  Settings,
  Home,
  Menu,
  X
} from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      title: "ภาพรวม",
      href: "/",
      icon: <Home className="h-4 w-4" />,
      active: true
    },
    {
      title: "วิเคราะห์สินค้า",
      href: "/products",
      icon: <Package className="h-4 w-4" />,
      badge: "New"
    },
    {
      title: "วิเคราะห์ลูกค้า",
      href: "/customers",
      icon: <Users className="h-4 w-4" />
    },
    {
      title: "วิเคราะห์กำไร",
      href: "/profitability",
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      title: "ประสิทธิภาพทีม",
      href: "/performance",
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      title: "การคาดการณ์",
      href: "/forecasting",
      icon: <TrendingUp className="h-4 w-4" />,
      badge: "AI"
    },
    {
      title: "AI Insights",
      href: "/ai-insights",
      icon: <Brain className="h-4 w-4" />,
      badge: "Beta"
    },
    {
      title: "รายงาน",
      href: "/reports",
      icon: <FileText className="h-4 w-4" />
    },
    {
      title: "ตั้งค่า",
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
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Analytics</h2>
              <p className="text-xs text-muted-foreground">Sales Dashboard</p>
            </div>
          </div>

          {/* Navigation items */}
          <div className="space-y-2">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant={item.active ? "default" : "ghost"}
                className={`
                  w-full justify-start gap-3 h-10
                  ${item.active ? 'bg-gradient-primary text-primary-foreground' : 'hover:bg-muted'}
                `}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && (
                  <Badge 
                    variant={item.badge === "AI" ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Bottom section */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 rounded-lg bg-gradient-secondary border border-card-border">
              <h4 className="font-medium text-sm mb-1">ขยายฟีเจอร์</h4>
              <p className="text-xs text-muted-foreground mb-3">
                อัพเกรดเพื่อใช้ AI Analytics เต็มรูปแบบ
              </p>
              <Button size="sm" className="w-full bg-gradient-primary">
                อัพเกรด
              </Button>
            </div>
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