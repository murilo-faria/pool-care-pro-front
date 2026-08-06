import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Waves, UserCog, UserCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import type { Role } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar — Admin Pool | Gestão de piscinas" },
      {
        name: "description",
        content:
          "Acesse o Admin Pool e gerencie clientes, pedidos de produtos e ordens de serviço da sua empresa de manutenção de piscinas.",
      },
      { property: "og:title", content: "Entrar — Admin Pool" },
      {
        property: "og:description",
        content: "Sistema de gestão para empresas de manutenção de piscinas.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const { setRole } = useStore();
  const navigate = useNavigate();

  const entrar = (role: Role) => {
    setRole(role);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="brand-gradient relative hidden flex-col justify-between p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary-foreground/15">
            <Waves className="size-6 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-primary-foreground">
            Admin Pool
          </span>
        </div>
        <div className="max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight text-primary-foreground">
            O cliente no centro da sua operação de piscinas.
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Controle clientes, equipe, produtos, pedidos e ordens de serviço em um
            único painel — com relatórios prontos para a gestão.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-primary-foreground/90">
            {[
              "Dashboard com indicadores em tempo real",
              "Pedidos e OS criados direto do cadastro do cliente",
              "Permissões separadas para gestor e funcionário",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <ShieldCheck className="size-4 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/60">
          Trabalho de Conclusão de Curso · Protótipo com dados fictícios
        </p>
      </div>

      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="brand-gradient grid size-9 place-items-center rounded-lg">
              <Waves className="size-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">Admin Pool</span>
          </div>
          <h1 className="text-2xl font-bold">Acessar o sistema</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Selecione um perfil de demonstração para continuar.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              entrar("gestor");
            }}
          >
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                className="mt-1.5"
                defaultValue="gestor@adminpool.com.br"
              />
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                className="mt-1.5"
                defaultValue="123456"
              />
            </div>
            <div className="space-y-2 pt-2">
              <Button type="submit" className="w-full">
                <UserCog className="size-4" /> Entrar como Gestor
                <ArrowRight className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => entrar("funcionario")}
              >
                <UserCircle className="size-4" /> Entrar como Funcionário
              </Button>
            </div>
          </form>
          <p className="mt-6 text-xs text-muted-foreground">
            Protótipo front-end sem back-end: todos os dados são fictícios e
            reiniciam ao recarregar a página.
          </p>
        </div>
      </div>
    </div>
  );
}
