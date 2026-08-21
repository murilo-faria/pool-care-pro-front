import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  UserCog,
  Waves,
  ShoppingCart,
  Wrench,
  UserCheck,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { StatCard, StatusBadge } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { dataBR } from "@/data/mock";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Admin Pool" },
      {
        name: "description",
        content:
          "Indicadores de clientes, piscinas, pedidos de produtos e ordens de serviço da empresa de manutenção.",
      },
      { property: "og:title", content: "Dashboard — Admin Pool" },
      {
        property: "og:description",
        content: "Visão geral dos indicadores operacionais da sua empresa.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const {
    role,
    usuarioNome,
    funcionarios,
    clientesVisiveis,
    pedidosVisiveis,
    ordensVisiveis,
    nomeCliente,
    nomeFuncionario,
  } = useStore();

  const gestor = role === "gestor";
  const pedidosPendentes = pedidosVisiveis.filter((p) =>
    ["Pendente", "Em análise", "Aprovado", "Separado"].includes(p.status),
  ).length;
  const osPendentes = ordensVisiveis.filter(
    (o) => !["Concluída", "Cancelada"].includes(o.status),
  ).length;
  const clientesAtivos = clientesVisiveis.filter((c) => c.status === "Ativo").length;

  const porMes = [
    { mes: "Mar", pedidos: 9, os: 6 },
    { mes: "Abr", pedidos: 12, os: 8 },
    { mes: "Mai", pedidos: 15, os: 7 },
    { mes: "Jun", pedidos: 11, os: 10 },
    { mes: "Jul", pedidos: 18, os: 12 },
    { mes: "Ago", pedidos: 14, os: 9 },
  ];

  const statusOs = Object.entries(
    ordensVisiveis.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));
  const cores = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--warning)",
    "var(--destructive)",
  ];

  const ultimas = [
    ...pedidosVisiveis.map((p) => ({
      tipo: "Pedido" as const,
      numero: p.numero,
      clienteId: p.clienteId,
      funcionarioId: p.funcionarioId,
      data: p.data,
      status: p.status as string,
    })),
    ...ordensVisiveis.map((o) => ({
      tipo: "OS" as const,
      numero: o.numero,
      clienteId: o.clienteId,
      funcionarioId: o.funcionarioId,
      data: o.data,
      status: o.status as string,
    })),
  ]
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 8);

  return (
    <AppLayout>
      <PageHeader
        title={gestor ? "Dashboard do Gestor" : "Dashboard do Funcionário"}
        subtitle={
          gestor
            ? "Visão completa da operação de manutenção de piscinas."
            : `Suas atividades, ${usuarioNome}.`
        }
        action={
          <Button asChild variant="outline">
            <Link to="/clientes">Ver clientes</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label={gestor ? "Clientes" : "Meus clientes"}
          value={clientesVisiveis.length}
          hint={`${clientesAtivos} ativos`}
          icon={<Users className="size-5" />}
        />
        {gestor && (
          <StatCard
            label="Funcionários"
            value={funcionarios.length}
            hint={`${funcionarios.filter((f) => f.status === "Ativo").length} ativos`}
            icon={<UserCog className="size-5" />}
            tone="info"
          />
        )}
        {gestor && (
          <StatCard
            label="Piscinas atendidas"
            value={clientesVisiveis.length}
            hint={`${clientesVisiveis
              .reduce((a, c) => a + c.volume, 0)
              .toLocaleString("pt-BR")} litros`}
            icon={<Waves className="size-5" />}
            tone="info"
          />
        )}
        <StatCard
          label="Pedidos pendentes"
          value={pedidosPendentes}
          hint="Aguardando conclusão"
          icon={<ShoppingCart className="size-5" />}
          tone="warning"
        />
        <StatCard
          label="OS pendentes"
          value={osPendentes}
          hint="Em aberto ou andamento"
          icon={<Wrench className="size-5" />}
          tone="destructive"
        />
        <StatCard
          label="Clientes ativos"
          value={clientesAtivos}
          hint={`de ${clientesVisiveis.length} cadastrados`}
          icon={<UserCheck className="size-5" />}
          tone="success"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-4 sm:p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Pedidos e OS por mês</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Volume de solicitações nos últimos 6 meses
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="pedidos" name="Pedidos" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="os" name="OS" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-4 sm:p-5">
          <h3 className="text-sm font-semibold">Ordens de Serviço por status</h3>
          <p className="mb-4 text-xs text-muted-foreground">Distribuição atual</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusOs} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80}>
                  {statusOs.map((_, i) => (
                    <Cell key={i} fill={cores[i % cores.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {statusOs.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: cores[i % cores.length] }}
                  />
                  <span className="truncate text-muted-foreground">{s.name}</span>
                </span>
                <span className="font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-surface mt-6 overflow-hidden">
        <div className="border-b border-border p-4 sm:p-5">
          <h3 className="text-sm font-semibold">Últimas solicitações</h3>
          <p className="text-xs text-muted-foreground">
            Pedidos de produtos e ordens de serviço mais recentes
          </p>
        </div>
        <div className="divide-y divide-border">
          {ultimas.map((u) => (
            <div
              key={u.tipo + u.numero}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 sm:px-5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {u.numero} · {nomeCliente(u.clienteId)}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {u.tipo === "Pedido" ? "Pedido de produtos" : "Ordem de Serviço"} ·{" "}
                  {nomeFuncionario(u.funcionarioId)} · {dataBR(u.data)}
                </p>
              </div>
              <StatusBadge status={u.status} />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
