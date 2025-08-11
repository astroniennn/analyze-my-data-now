import { StatCard } from "@/components/ui/stat-card"
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Target,
  Award,
  Calendar,
  Percent
} from "lucide-react"

export function KPIGrid() {
  const kpiData = [
    {
      title: "ยอดขายรวม",
      value: "฿2,847,650",
      change: { value: "+12.5%", type: "increase" as const },
      icon: <DollarSign className="h-4 w-4" />,
      subtitle: "เดือนนี้"
    },
    {
      title: "จำนวนคำสั่งซื้อ",
      value: "1,247",
      change: { value: "+8.2%", type: "increase" as const },
      icon: <ShoppingCart className="h-4 w-4" />,
      subtitle: "คำสั่งซื้อใหม่"
    },
    {
      title: "ลูกค้าใหม่",
      value: "342",
      change: { value: "+15.3%", type: "increase" as const },
      icon: <Users className="h-4 w-4" />,
      subtitle: "เดือนนี้"
    },
    {
      title: "Profit Margin",
      value: "24.8%",
      change: { value: "+2.1%", type: "increase" as const },
      icon: <Percent className="h-4 w-4" />,
      subtitle: "กำไรขั้นต้น"
    },
    {
      title: "เป้าหมายการขาย",
      value: "94.2%",
      change: { value: "+5.8%", type: "increase" as const },
      icon: <Target className="h-4 w-4" />,
      subtitle: "ความสำเร็จ"
    },
    {
      title: "พนักงานยอดเยี่ยม",
      value: "สมชาย ใจดี",
      change: { value: "฿156,780", type: "neutral" as const },
      icon: <Award className="h-4 w-4" />,
      subtitle: "ยอดขายสูงสุด"
    },
    {
      title: "ยอดขายเฉลี่ย/วัน",
      value: "฿94,922",
      change: { value: "+7.4%", type: "increase" as const },
      icon: <Calendar className="h-4 w-4" />,
      subtitle: "30 วันที่ผ่านมา"
    },
    {
      title: "Growth Rate",
      value: "+18.6%",
      change: { value: "YoY", type: "neutral" as const },
      icon: <TrendingUp className="h-4 w-4" />,
      subtitle: "เทียบปีที่แล้ว"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, index) => (
        <StatCard
          key={index}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          icon={kpi.icon}
          subtitle={kpi.subtitle}
          className="hover:shadow-elegant"
        />
      ))}
    </div>
  )
}