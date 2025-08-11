import { Navigation } from "@/components/navigation/Navigation"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { TopKPICards } from "@/components/dashboard/TopKPICards"
import { SalesStatistic } from "@/components/dashboard/SalesStatistic"
import { TrafficSources } from "@/components/dashboard/TrafficSources"
import { ProductList } from "@/components/dashboard/ProductList"
import { SalesDistribution } from "@/components/dashboard/SalesDistribution"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-6">
          {/* Header */}
          <DashboardHeader />
          
          {/* Top KPI Cards */}
          <TopKPICards />
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SalesStatistic />
            <TrafficSources />
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductList />
            <SalesDistribution />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
