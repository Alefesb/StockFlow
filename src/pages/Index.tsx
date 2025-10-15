import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Package, BarChart3, TrendingUp, Shield } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-primary p-4 rounded-2xl mb-6">
            <Package className="h-16 w-16 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            StockFlow
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sistema completo de gestão de estoque para empresas de embalagens
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              Começar Agora
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-4">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Controle Total</h3>
            <p className="text-muted-foreground">
              Gerencie entradas, saídas e estoque em tempo real com alertas automáticos
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-success p-3 rounded-lg w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-success-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Relatórios Inteligentes</h3>
            <p className="text-muted-foreground">
              Análises detalhadas e gráficos para tomada de decisões estratégicas
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-primary p-3 rounded-lg w-fit mb-4">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Seguro e Confiável</h3>
            <p className="text-muted-foreground">
              Controle de permissões por usuário e backup automático dos dados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
