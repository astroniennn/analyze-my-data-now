import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      {/* Left section - Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          Sales Analysis
        </h1>
      </div>

      {/* Right section - Search and Notifications */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search here" 
            className="pl-9 w-full sm:w-[300px] bg-card"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            ⌘+F
          </div>
        </div>

        {/* Notification */}
        <Button variant="outline" size="sm" className="relative bg-card">
          <Bell className="h-4 w-4" />
          <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></div>
        </Button>
      </div>
    </div>
  )
}