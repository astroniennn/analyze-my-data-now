import { StatCard } from "@/components/ui/stat-card";

interface TopKPICardsProps {
  totalSales: number;
  totalProfit: number;
}

export function TopKPICards({ totalSales, totalProfit }: TopKPICardsProps) {
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Sales"
        value={formatCurrency(totalSales)}
        subtitle="All time"
        className="bg-card shadow-card"
      />
      
      <StatCard
        title="Total Profit"
        value={formatCurrency(totalProfit)}
        subtitle="All time"
        className="bg-card shadow-card"
      />
      
      <StatCard
        title="Profit Margin"
        value={`${profitMargin.toFixed(2)}%`}
        subtitle="All time"
        className="bg-card shadow-card"
      />
    </div>
  );
}