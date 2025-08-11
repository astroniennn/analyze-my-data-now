import { Navigation } from "@/components/navigation/Navigation"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { KPIGrid } from "@/components/dashboard/KPIGrid"
import { ChartGrid } from "@/components/dashboard/ChartGrid"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-6 space-y-8">
          {/* Header */}
          <DashboardHeader />
          
          {/* KPI Grid */}
          <section>
            <h2 className="text-xl font-semibold mb-4">ตัวชี้วัดหลัก (KPIs)</h2>
            <KPIGrid />
          </section>

          {/* Charts Grid */}
          <section>
            <h2 className="text-xl font-semibold mb-4">การวิเคราะห์เชิงลึก</h2>
            <ChartGrid />
          </section>

          {/* Quick Actions */}
          <section className="bg-gradient-secondary rounded-lg p-6 border border-card-border">
            <h3 className="text-lg font-semibold mb-4">การดำเนินการด่วน</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-card rounded-lg border border-card-border shadow-card">
                <h4 className="font-medium mb-2">นำเข้าข้อมูลขาย</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  อัพโหลดไฟล์ Excel หรือ CSV เพื่อวิเคราะห์ข้อมูล
                </p>
                <button className="w-full px-4 py-2 bg-gradient-primary text-primary-foreground rounded-md text-sm font-medium hover:shadow-hover transition-all">
                  เลือกไฟล์
                </button>
              </div>
              
              <div className="p-4 bg-card rounded-lg border border-card-border shadow-card">
                <h4 className="font-medium mb-2">สร้างรายงาน</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  สร้างรายงานแบบกำหนดเองตามช่วงเวลา
                </p>
                <button className="w-full px-4 py-2 bg-gradient-success text-success-foreground rounded-md text-sm font-medium hover:shadow-hover transition-all">
                  สร้างรายงาน
                </button>
              </div>
              
              <div className="p-4 bg-card rounded-lg border border-card-border shadow-card">
                <h4 className="font-medium mb-2">AI Insights</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  รับคำแนะนำจาก AI เพื่อปรับปรุงการขาย
                </p>
                <button className="w-full px-4 py-2 bg-warning text-warning-foreground rounded-md text-sm font-medium hover:shadow-hover transition-all">
                  ดู Insights
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
