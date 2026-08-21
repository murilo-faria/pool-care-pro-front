import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Wrench,
  MapPin,
  Phone,
  Waves,
  Ruler,
  BadgeDollarSign,
  UserCog,
} from "lucide-react";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState, StatusBadge } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  NovaOSDialog,
  NovoPedidoDialog,
} from "@/components/solicitacao-dialogs";
import { useStore } from "@/lib/store";
import { brl, dataBR } from "@/data/mock";

export const Route = createFileRoute("/clientes/$id")({
  head: () => ({
    meta: [
      { title: "Ficha do cliente — Admin Pool" },
      {
        name: "description",
        content:
          "Dados completos do cliente, informações da piscina, histórico de pedidos e ordens de serviço.",
      },
      { property: "og:title", content: "Ficha do cliente — Admin Pool" },
      {
        property: "og:description",
        content: "Histórico completo do cliente e suas solicitações.",
      },
    ],
  }),
  component: ClienteDetalhe,
});

function ClienteDetalhe() {
  const { id } = useParams({ from: "/clientes/$id" });
  const {
    clientesVisiveis,
    nomeFuncionario,
    nomeProduto,
    pedidosVisiveis,
    ordensVisiveis,
  } = useStore();
  const [pedidoOpen, setPedidoOpen] = useState(false);
  const [osOpen, setOsOpen] = useState(false);

  const cliente = clientesVisiveis.find((c) => c.id === id);

  if (!cliente) {
    return (
      <AppLayout>
        <EmptyState message="Cliente não encontrado ou fora do seu escopo de acesso." />
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link to="/clientes">
              <ArrowLeft className="size-4" /> Voltar para clientes
            </Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const pedidosCliente = pedidosVisiveis.filter((p) => p.clienteId === cliente.id);
  const osCliente = ordensVisiveis.filter((o) => o.clienteId === cliente.id);

  const info = [
    { icon: Phone, label: "Telefone", value: cliente.telefone },
    {
      icon: MapPin,
      label: "Endereço",
      value: `${cliente.endereco} — ${cliente.bairro}, ${cliente.cidade}`,
    },
    { icon: Ruler, label: "Dimensões", value: cliente.dimensoes },
    {
      icon: Waves,
      label: "Volume",
      value: `${cliente.volume.toLocaleString("pt-BR")} litros`,
    },
    {
      icon: BadgeDollarSign,
      label: "Mensalidade",
      value: brl(cliente.mensalidade),
    },
    {
      icon: UserCog,
      label: "Responsável",
      value: nomeFuncionario(cliente.responsavelId),
    },
  ];

  return (
    <AppLayout>
      <Button asChild variant="ghost" size="sm" className="mb-3">
        <Link to="/clientes">
          <ArrowLeft className="size-4" /> Clientes
        </Link>
      </Button>
      <PageHeader
        title={cliente.nome}
        subtitle={`${cliente.bairro} · ${cliente.cidade}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setPedidoOpen(true)}>
              <ShoppingCart className="size-4" /> Solicitar Produto
            </Button>
            <Button variant="outline" onClick={() => setOsOpen(true)}>
              <Wrench className="size-4" /> Abrir Ordem de Serviço
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-4 sm:p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Dados do cliente e da piscina</h3>
            <StatusBadge status={cliente.status} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {info.map((i) => (
              <div key={i.label} className="flex min-w-0 items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <i.icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {i.label}
                  </p>
                  <p className="text-sm font-medium">{i.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card-surface p-4 sm:p-5">
          <h3 className="mb-2 text-sm font-semibold">Observações</h3>
          <p className="text-sm text-muted-foreground">
            {cliente.observacoes || "Nenhuma observação registrada."}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted p-3">
              <p className="font-display text-2xl font-bold">{pedidosCliente.length}</p>
              <p className="text-xs text-muted-foreground">Pedidos</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="font-display text-2xl font-bold">{osCliente.length}</p>
              <p className="text-xs text-muted-foreground">Ordens de Serviço</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pedidos" className="mt-6">
        <TabsList>
          <TabsTrigger value="pedidos">Histórico de pedidos</TabsTrigger>
          <TabsTrigger value="os">Histórico de OS</TabsTrigger>
        </TabsList>
        <TabsContent value="pedidos">
          {pedidosCliente.length === 0 ? (
            <EmptyState message="Nenhum pedido de produto para este cliente." />
          ) : (
            <div className="card-surface overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="hidden sm:table-cell">Solicitante</TableHead>
                    <TableHead className="hidden md:table-cell">Produtos</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidosCliente.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.numero}</TableCell>
                      <TableCell>{dataBR(p.data)}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {nomeFuncionario(p.funcionarioId)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-72 text-sm text-muted-foreground">
                        <span className="block truncate">
                          {p.itens
                            .map((i) => `${i.quantidade}x ${nomeProduto(i.produtoId)}`)
                            .join(", ")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        <TabsContent value="os">
          {osCliente.length === 0 ? (
            <EmptyState message="Nenhuma ordem de serviço para este cliente." />
          ) : (
            <div className="card-surface overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="hidden sm:table-cell">Prioridade</TableHead>
                    <TableHead className="hidden md:table-cell">Descrição</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {osCliente.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.numero}</TableCell>
                      <TableCell>{dataBR(o.data)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <StatusBadge status={o.prioridade} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-80 text-sm text-muted-foreground">
                        <span className="block truncate">{o.descricao}</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={o.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <NovoPedidoDialog
        clienteId={cliente.id}
        open={pedidoOpen}
        onOpenChange={setPedidoOpen}
      />
      <NovaOSDialog clienteId={cliente.id} open={osOpen} onOpenChange={setOsOpen} />
    </AppLayout>
  );
}
