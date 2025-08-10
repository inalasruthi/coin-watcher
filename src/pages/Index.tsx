import { useState, useEffect } from "react";
import { ExpenseForm, Expense } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseChart } from "@/components/ExpenseChart";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-image.jpg";
import { Wallet, TrendingUp, DollarSign } from "lucide-react";

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { toast } = useToast();

  // Load expenses from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString()
    };
    setExpenses(prev => [...prev, newExpense]);
    toast({
      title: "Expense Added",
      description: `${expenseData.title} - $${expenseData.amount.toFixed(2)} added successfully.`,
    });
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    setExpenses(prev => prev.filter(e => e.id !== id));
    if (expense) {
      toast({
        title: "Expense Deleted",
        description: `${expense.title} has been removed.`,
        variant: "destructive",
      });
    }
  };

  const totalThisMonth = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const totalAllTime = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-primary">
        <div className="absolute inset-0 bg-black/20" />
        <div 
          className="relative bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90" />
          <div className="relative container mx-auto px-6 py-16 lg:py-24">
            <div className="max-w-3xl text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Take Control of Your Finances
              </h1>
              <p className="text-lg lg:text-xl mb-8 opacity-90">
                Track your daily expenses, visualize spending patterns, and make smarter financial decisions with our beautiful expense tracker.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-6 text-center">
                    <Wallet className="h-8 w-8 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Track Expenses</h3>
                    <p className="text-sm opacity-90">Easy expense logging with categories</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Visual Analytics</h3>
                    <p className="text-sm opacity-90">Beautiful charts and insights</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Smart Budgeting</h3>
                    <p className="text-sm opacity-90">Monitor spending patterns</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-foreground">${totalAllTime.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-foreground">${totalThisMonth.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold text-foreground">{expenses.length}</p>
                </div>
                <div className="p-3 bg-finance-green/10 rounded-lg">
                  <Wallet className="h-6 w-6 text-finance-green" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense Form */}
        <div className="mb-12">
          <ExpenseForm onAddExpense={addExpense} />
        </div>

        {/* Analytics Chart */}
        <div className="mb-12">
          <ExpenseChart expenses={expenses} />
        </div>

        {/* Expense List */}
        <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
      </div>
    </div>
  );
};

export default Index;