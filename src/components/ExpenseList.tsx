import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Trash2, Calendar, DollarSign, Filter } from "lucide-react";
import { Expense, categories } from "./ExpenseForm";
import { useState } from "react";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export const ExpenseList = ({ expenses, onDeleteExpense }: ExpenseListProps) => {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = filterCategory === "all" || expense.category === filterCategory;
    const matchesDate = !filterDate || expense.date === filterDate;
    return matchesCategory && matchesDate;
  });

  const getCategoryInfo = (categoryValue: string) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category || { label: categoryValue, color: "muted" };
  };

  const getCategoryColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      "finance-orange": "bg-finance-orange-light text-finance-orange border-finance-orange/20",
      "finance-blue": "bg-finance-blue-light text-finance-blue border-finance-blue/20",
      "finance-red": "bg-finance-red-light text-finance-red border-finance-red/20",
      "finance-purple": "bg-finance-purple-light text-finance-purple border-finance-purple/20",
      "finance-green": "bg-finance-green-light text-finance-green border-finance-green/20",
      "muted": "bg-muted text-muted-foreground"
    };
    return colorMap[color] || colorMap["muted"];
  };

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Filter className="h-5 w-5 text-primary" />
            Filter Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Filter by date"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterCategory("all");
                  setFilterDate("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Summary */}
      <Card className="bg-gradient-expense shadow-elevated border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8" />
              <div>
                <h3 className="text-lg font-semibold">Total Expenses</h3>
                <p className="text-sm opacity-90">
                  {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No expenses found.</p>
              <p className="text-sm">Add your first expense to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExpenses
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((expense) => {
                  const categoryInfo = getCategoryInfo(expense.category);
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="secondary"
                          className={getCategoryColorClass(categoryInfo.color)}
                        >
                          {categoryInfo.label}
                        </Badge>
                        <div>
                          <h4 className="font-medium text-foreground">{expense.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-lg text-foreground">
                          ${expense.amount.toFixed(2)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteExpense(expense.id)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};