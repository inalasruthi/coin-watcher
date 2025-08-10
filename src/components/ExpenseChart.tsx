import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { Expense, categories } from "./ExpenseForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ExpenseChartProps {
  expenses: Expense[];
}

export const ExpenseChart = ({ expenses }: ExpenseChartProps) => {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  // Prepare data for charts
  const categoryData = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category.value);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      name: category.label.split(' ')[1], // Remove emoji for cleaner chart
      value: total,
      color: getCategoryColor(category.color),
      count: categoryExpenses.length
    };
  }).filter(item => item.value > 0);

  // Get daily spending for bar chart
  const dailyData = expenses.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = Object.entries(dailyData)
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Last 7 days

  function getCategoryColor(colorName: string): string {
    const colorMap: Record<string, string> = {
      "finance-orange": "#f59e0b",
      "finance-blue": "#3b82f6",
      "finance-red": "#ef4444",
      "finance-purple": "#8b5cf6",
      "finance-green": "#10b981",
      "muted": "#6b7280"
    };
    return colorMap[colorName] || colorMap["muted"];
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (expenses.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">
            <PieChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No data to display</p>
            <p className="text-sm">Add some expenses to see your spending analytics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Spending Analytics
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={chartType === "pie" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("pie")}
            >
              Category
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("bar")}
            >
              Daily
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "pie" ? (
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => 
                    `${name}: $${value.toFixed(2)} (${(percent * 100).toFixed(1)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                />
              </PieChart>
            ) : (
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {chartType === "pie" && categoryData.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-card rounded-lg">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <p className="font-medium text-sm">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ${category.value.toFixed(2)} ({category.count} expenses)
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};