import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

interface SalesStatisticProps {
  salesData: any[];
}

export function SalesStatistic({ salesData }: SalesStatisticProps) {
  const monthlySales = useMemo(() => {
    const salesByMonth: { [key: string]: number } = {};

    salesData.forEach(row => {
      // Data is already typed from the transformation step
      const date = new Date(row.doc_date);
      const sale = row.total_price;
      if (!isNaN(date.getTime()) && typeof sale === 'number') {
        const month = date.toLocaleString('default', { month: 'short' });
        salesByMonth[month] = (salesByMonth[month] || 0) + sale;
      }
    });

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return monthOrder.map(month => ({
      name: month,
      sales: salesByMonth[month] || 0,
    })).filter(item => item.sales > 0); // Only show months with sales

  }, [salesData]);

  return (
    <Card className="bg-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sales Statistic</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlySales}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}