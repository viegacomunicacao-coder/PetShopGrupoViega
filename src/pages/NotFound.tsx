import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PawPrint, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 pb-16">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-sm p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <PawPrint className="text-white" size={28} />
        </div>
        <h1 className="mt-6 text-5xl font-black text-slate-900">404</h1>
        <p className="mt-2 text-slate-500">
          Essa página não existe: <span className="font-semibold text-slate-700">{location.pathname}</span>
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" className="rounded-full bg-white">
            <ArrowLeft size={18} className="mr-2" /> Voltar
          </Button>
          <Button onClick={() => navigate("/")} className="rounded-full">
            Ir para Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;