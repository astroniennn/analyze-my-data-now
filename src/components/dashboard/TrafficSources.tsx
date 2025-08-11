import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TrafficSources() {
  return (
    <Card className="bg-card shadow-card border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Traffic Sources</CardTitle>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {/* Chart placeholder with radar/area chart visualization */}
        <div className="h-[250px] w-full flex items-center justify-center">
          <div className="relative w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border-2 border-dashed border-primary/20 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">Traffic Chart</div>
              <p className="text-sm text-muted-foreground">Radar chart showing traffic sources</p>
            </div>
            
            {/* Day labels positioned around like in the image */}
            <div className="absolute top-4 right-8 text-xs text-muted-foreground">Tue</div>
            <div className="absolute top-12 right-4 text-xs text-muted-foreground">Mon</div>
            <div className="absolute bottom-12 right-4 text-xs text-muted-foreground">Wed</div>
            <div className="absolute bottom-4 right-8 text-xs text-muted-foreground">Thu</div>
            <div className="absolute bottom-4 left-8 text-xs text-muted-foreground">Fri</div>
            <div className="absolute bottom-12 left-4 text-xs text-muted-foreground">Sat</div>
            <div className="absolute top-12 left-4 text-xs text-muted-foreground">Sun</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}