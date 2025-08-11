import { StatCard } from "@/components/ui/stat-card"
import { DollarSign, ShoppingCart, Package } from "lucide-react"

export function TopKPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Total Amount"
        value="$76,243.20"
        change={{ value: "40%", type: "increase" }}
        subtitle="last month"
        className="bg-card shadow-card"
      />
      
      <StatCard
        title="Total Sales"
        value="$21,432.80"
        change={{ value: "40%", type: "decrease" }}
        subtitle="last month"
        className="bg-card shadow-card"
      />
      
      <StatCard
        title="Total Order"
        value="12,472.10"
        change={{ value: "40%", type: "increase" }}
        subtitle="last month"
        className="bg-card shadow-card"
      />
    </div>
  )
}