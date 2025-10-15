import { useEffect, useState } from "react";
import { Package, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  todayEntries: number;
  todayExits: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    todayEntries: 0,
    todayExits: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    // Fetch total products
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Fetch low stock products (products where current_stock <= min_stock)
    const { data: allProducts } = await supabase
      .from('products')
      .select('*')
      .order('current_stock', { ascending: true });
    
    const lowStock = allProducts?.filter(p => 
      Number(p.current_stock) <= Number(p.min_stock)
    ).slice(0, 5) || [];

    // Fetch today's movements
    const today = new Date().toISOString().split('T')[0];
    
    const { data: entries } = await supabase
      .from('stock_movements')
      .select('quantity')
      .eq('type', 'entry')
      .gte('created_at', today);

    const { data: exits } = await supabase
      .from('stock_movements')
      .select('quantity')
      .eq('type', 'exit')
      .gte('created_at', today);

    const todayEntries = entries?.reduce((sum, m) => sum + Number(m.quantity), 0) || 0;
    const todayExits = exits?.reduce((sum, m) => sum + Number(m.quantity), 0) || 0;

    setStats({
      totalProducts: totalProducts || 0,
      lowStockProducts: lowStock?.length || 0,
      todayEntries: Math.round(todayEntries),
      todayExits: Math.round(todayExits),
    });

    setLowStockProducts(lowStock || []);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu estoque</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Produtos"
          value={stats.totalProducts}
          icon={Package}
          className="bg-gradient-card"
        />
        <StatsCard
          title="Estoque Baixo"
          value={stats.lowStockProducts}
          icon={AlertTriangle}
          className="bg-gradient-card"
        />
        <StatsCard
          title="Entradas Hoje"
          value={stats.todayEntries}
          icon={TrendingUp}
          className="bg-gradient-card"
        />
        <StatsCard
          title="Saídas Hoje"
          value={stats.todayExits}
          icon={TrendingDown}
          className="bg-gradient-card"
        />
      </div>

      {lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Produtos com Estoque Baixo
            </CardTitle>
            <CardDescription>
              Produtos que estão abaixo do estoque mínimo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">Código: {product.code}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="mb-1">
                      Estoque: {product.current_stock}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Mínimo: {product.min_stock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
