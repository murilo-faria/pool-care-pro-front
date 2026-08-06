import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/lib/store";
import { EmptyState } from "@/components/ui-bits";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Admin Pool" },
      {
        name: "description",
        content:
          "Dados da empresa, preferências de notificação e parâmetros operacionais do sistema.",
      },
      { property: "og:title", content: "Configurações — Admin Pool" },
      {
        property: "og:description",
        content: "Ajuste dados da empresa e preferências do sistema.",
      },
    ],
  }),
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const { role } = useStore();
  if (role !== "gestor") {
    return (
      <AppLayout>
        <PageHeader title="Acesso restrito" />
        <EmptyState message="Somente o Gestor pode acessar as configurações." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Configurações"
        subtitle="Dados da empresa e preferências do sistema."
        action={
          <Button onClick={() => toast.success("Configurações salvas (simulação).")}>
            Salvar alterações
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold">Dados da empresa</h3>
          <Separator className="my-4" />
          <div className="grid gap-4">
            <div>
              <Label>Razão social</Label>
              <Input className="mt-1.5" defaultValue="Admin Pool Manutenção de Piscinas LTDA" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>CNPJ</Label>
                <Input className="mt-1.5" defaultValue="12.345.678/0001-90" />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input className="mt-1.5" defaultValue="(11) 3344-5566" />
              </div>
            </div>
            <div>
              <Label>Endereço</Label>
              <Input className="mt-1.5" defaultValue="Av. das Nações, 1200 — São Paulo/SP" />
            </div>
          </div>
        </div>
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold">Preferências</h3>
          <Separator className="my-4" />
          <div className="space-y-5">
            {[
              ["Notificar novos pedidos", "Aviso ao receber pedidos da equipe"],
              ["Notificar OS urgentes", "Alerta imediato para prioridade urgente"],
              ["Alerta de estoque mínimo", "Avisar quando produtos atingirem o mínimo"],
              ["Resumo semanal por e-mail", "Enviar indicadores toda segunda-feira"],
            ].map(([t, d], i) => (
              <div key={t} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{t}</p>
                  <p className="text-xs text-muted-foreground">{d}</p>
                </div>
                <Switch defaultChecked={i < 3} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
