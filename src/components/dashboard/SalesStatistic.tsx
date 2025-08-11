import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SalesStatistic() {
  return (
    <Card className="bg-card shadow-card border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Sales Statistic</CardTitle>
        <Select defaultValue="12month">
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12month">12 month</SelectItem>
            <SelectItem value="6month">6 month</SelectItem>
            <SelectItem value="3month">3 month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {/* Chart placeholder with data point badge */}
        <div className="relative h-[250px] w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border-2 border-dashed border-primary/20 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">Sales Chart</div>
                <p className="text-sm text-muted-foreground">Interactive line chart will display here</p>
              </div>
            </div>
          </div>
          
          {/* Data point badge positioned like in the image */}
          <div className="absolute top-16 right-20">
            <Badge className="bg-gray-800 text-white px-3 py-1">
              <span className="text-xs">Sales</span>
              <br />
              <span className="font-bold">2,678</span>
            </Badge>
          </div>
        </div>
        
        {/* Month labels */}
        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
        </div>
      </CardContent>
    </Card>
  )
}