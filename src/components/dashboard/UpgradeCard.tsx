import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function UpgradeCard() {
  return (
    <Card className="bg-gradient-primary shadow-card border-0 text-primary-foreground">
      <CardContent className="p-6 space-y-4">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          <RefreshCw className="h-6 w-6" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">Get detailed analytics for help you, upgrade pro</h3>
        </div>
        
        <Button 
          className="w-full bg-white text-primary hover:bg-white/90" 
          size="sm"
        >
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  )
}