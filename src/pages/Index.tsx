import { useMemo } from "react";
import { Navigation } from "@/components/navigation/Navigation";
import { DataInput } from "@/components/dashboard/DataInput";
import { TopKPICards } from "@/components/dashboard/TopKPICards";
import { SalesStatistic } from "@/components/dashboard/SalesStatistic";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { useData } from "@/context/DataContext";

const Index = () => {
  const { rawData, filteredData } = useData();

  const { totalSales, totalProfit } = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return { totalSales: 0, totalProfit: 0 };
    }

    const sales = filteredData.reduce((acc, row) => {
      // Data is already a number from the transformation step
      const sale = row.total_price || 0;
      return acc + sale;
    }, 0);

    const profit = filteredData.reduce((acc, row) => {
      const sale = row.total_price || 0;
      const cost = row.cost || 0;
      return acc + (sale - cost);
    }, 0);

    return { totalSales: sales, totalProfit: profit };
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <div className="lg:ml-64 min-h-screen">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Sales Dashboard</h1>
          </div>

          <div className="space-y-6">
            <DataInput />

            {/* Render dashboard only if there is raw data */}
            {rawData && rawData.length > 0 ? (
              <>
                <DashboardFilters />
                <TopKPICards
                  totalSales={totalSales}
                  totalProfit={totalProfit}
                />
                <SalesStatistic salesData={filteredData} />
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Upload a file to see your dashboard.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
