import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react"

export function ChartGrid() {
  const chartSections = [
    {
      title: "ยอดขายตามเวลา",
      description: "กราฟแสดงยอดขายในช่วง 12 เดือนที่ผ่านมา",
      icon: <LineChart className="h-5 w-5" />,
      badge: "Trending",
      content: "กราฟเส้นแสดงแนวโน้มการขายที่เพิ่มขึ้นอย่างต่อเนื่อง"
    },
    {
      title: "การขายตามประเภทสินค้า",
      description: "สัดส่วนยอดขายแบ่งตามหมวดหมู่สินค้า",
      icon: <PieChart className="h-5 w-5" />,
      badge: "Categories",
      content: "อิเล็กทรอนิกส์ครองส่วนแบ่งสูงสุด 35% ตามด้วยเสื้อผ้า 28%"
    },
    {
      title: "ประสิทธิภาพทีมขาย",
      description: "เปรียบเทียบยอดขายของพนักงานแต่ละคน",
      icon: <BarChart3 className="h-5 w-5" />,
      badge: "Performance",
      content: "สมชาย ใจดี นำหน้าด้วยยอดขาย ฿156,780 ในเดือนนี้"
    },
    {
      title: "การคาดการณ์ยอดขาย",
      description: "ประเมินยอดขายในอนาคต 3 เดือนข้างหน้า",
      icon: <TrendingUp className="h-5 w-5" />,
      badge: "Forecast",
      content: "คาดการณ์การเติบโต 22% ในไตรมาสถัดไป"
    }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {chartSections.map((section, index) => (
        <Card key={index} className="shadow-card hover:shadow-hover transition-all duration-300 hover:scale-[1.01]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground">
                  {section.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {section.description}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-background">
                {section.badge}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Chart placeholder */}
            <div className="h-[200px] w-full rounded-md bg-muted/30 flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground">
                  {section.icon}
                </div>
                <p className="text-sm text-muted-foreground">
                  กราฟจะแสดงที่นี่
                </p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  {section.content}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}