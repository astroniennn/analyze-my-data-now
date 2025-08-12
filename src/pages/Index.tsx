import { useMemo } from "react";
import { Navigation } from "@/components/navigation/Navigation";
import { DataInput } from "@/components/dashboard/DataInput";
import { TopKPICards } from "@/components/dashboard/TopKPICards";
import { SalesStatistic } from "@/components/dashboard/SalesStatistic";
import { useData } from "@/context/DataContext";

const Index = () => {
  const { data } = useData();

  const { totalSales, totalProfit } = useMemo(() => {
    if (!data || data.length === 0) {
      return { totalSales: 0, totalProfit: 0 };
    }

    const sales = data.reduce((acc, row) => {
      const sale = parseFloat(row.Sales);
      return acc + (isNaN(sale) ? 0 : sale);
    }, 0);

    const profit = data.reduce((acc, row) => {
      const sale = parseFloat(row.Sales);
      const cost = parseFloat(row.Cost);
      if (!isNaN(sale) && !isNaN(cost)) {
        return acc + (sale - cost);
      }
      return acc;
    }, 0);

    return { totalSales: sales, totalProfit: profit };
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Sales Dashboard</h1>
          </div>

          <div className="space-y-6">
            <DataInput />

            {/* Render dashboard only if there is data */}
            {data && data.length > 0 ? (
              <>
                <TopKPICards
                  totalSales={totalSales}
                  totalProfit={totalProfit}
                />
                <SalesStatistic salesData={data} />
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
