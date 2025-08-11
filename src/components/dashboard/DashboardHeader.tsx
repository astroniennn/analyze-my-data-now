import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, Calendar, Bell } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Left section - Title and breadcrumb */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Sales Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          ภาพรวมและวิเคราะห์ข้อมูลการขายแบบเรียลไทม์
        </p>
      </div>

      {/* Right section - Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="ค้นหาข้อมูล..." 
            className="pl-9 w-full sm:w-[200px]"
          />
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            เลือกช่วงเวลา
          </Button>
          
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            ตัวกรอง
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          {/* Notification indicator */}
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
            >
              3
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  )
}