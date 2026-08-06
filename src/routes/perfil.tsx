import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { StatCard } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Users, ShoppingCart, Wrench } from "lucide-react";
import { useStore } from "@/lib/store";
import { dataBR } from "@/data/mock";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu Perfil — Admin Pool" },
      {
        name: "description",
        content: "Dados do funcionário, carteira de clientes e resumo das solicitações.",
      },
      { property: "og:title", content: "Meu Perfil — Admin Pool" },
      {
        property: "og:description",
        content: "Consulte seus dados e o resumo das suas atividades.",
      },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  const {
    usuarioId,
    usuarioNome,
    role,
    funcionarios,
    clientesVisiveis,
    pedidosVisiveis,
    ordensVisiveis,
  } = useStore();
  const f = funcionarios.find((x) => x.id === usuarioId);

  return (
    <AppLayout>
      <PageHeader
        title="Meu Perfil"
        subtitle={role === "gestor" ? "Perfil do gestor" : "Dados do funcionário"}
        action={
          <Button onClick={() => toast.success("Perfil atualizado (simulação).")}>
            Salvar
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Dados pessoais</h3>
          <Separator className="my-4" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Nome</Label>
              <Input className="mt-1.5" defaultValue={usuarioNome} />
            </div>
            <div>
              <Label>Cargo</Label>
              <Input className="mt-1.5" defaultValue={f?.cargo ?? "Gestor"} />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input className="mt-1.5" defaultValue={f?.telefone ?? "(11) 3344-5566"} />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input className="mt-1.5" defaultValue={f?.email ?? "gestor@adminpool.com.br"} />
            </div>
            <div>
              <Label>Cidade</Label>
              <Input className="mt-1.5" defaultValue={f?.cidade ?? "São Paulo"} />
            </div>
            {f && (
              <div className="sm:col-span-2">
                <Label>Admissão</Label>
                <Input className="mt-1.5 bg-muted" readOnly value={dataBR(f.admissao)} />
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-4">
          <StatCard
            label="Meus clientes"
            value={clientesVisiveis.length}
            icon={<Users className="size-5" />}
          />
          <StatCard
            label="Meus pedidos"
            value={pedidosVisiveis.length}
            icon={<ShoppingCart className="size-5" />}
            tone="warning"
          />
          <StatCard
            label="Minhas OS"
            value={ordensVisiveis.length}
            icon={<Wrench className="size-5" />}
            tone="info"
          />
        </div>
      </div>
    </AppLayout>
  );
}
