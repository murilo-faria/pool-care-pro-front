import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState, StatusBadge } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { STATUS_PEDIDO, brl, dataBR, type Pedido, type StatusPedido } from "@/data/mock";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Pedidos de Produtos — Admin Pool" },
      {
        name: "description",
        content:
          "Acompanhe os pedidos de produtos solicitados pelos funcionários para cada cliente.",
      },
      { property: "og:title", content: "Pedidos de Produtos — Admin Pool" },
      {
        property: "og:description",
        content: "Fluxo de aprovação, separação e entrega dos pedidos de produtos.",
      },
    ],
  }),
  component: PedidosPage,
});

function PedidosPage() {
  const {
    role,
    pedidosVisiveis,
    nomeCliente,
    nomeFuncionario,
    nomeProduto,
    produtos,
    statusPedido,
    funcionarios,
  } = useStore();
  const gestor = role === "gestor";
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("todos");
  const [func, setFunc] = useState("todos");
  const [detalhe, setDetalhe] = useState<Pedido | null>(null);

  const lista = pedidosVisiveis.filter(
    (p) =>
      (p.numero.toLowerCase().includes(busca.toLowerCase()) ||
        nomeCliente(p.clienteId).toLowerCase().includes(busca.toLowerCase())) &&
      (status === "todos" || p.status === status) &&
      (func === "todos" || p.funcionarioId === func),
  );

  const total = (p: Pedido) =>
    p.itens.reduce((acc, i) => {
      const prod = produtos.find((x) => x.id === i.produtoId);
      return acc + (prod?.ultimaVenda ?? 0) * i.quantidade;
    }, 0);

  return (
    <AppLayout>
      <PageHeader
        title={gestor ? "Pedidos de Produtos" : "Meus Pedidos"}
        subtitle={
          gestor
            ? "Todos os pedidos criados pela equipe, com alteração de status."
            : "Pedidos que você solicitou e o andamento de cada um."
        }
      />

      <div className="card-surface mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por número ou cliente"
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {STATUS_PEDIDO.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {gestor && (
          <Select value={func} onValueChange={setFunc}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os solicitantes</SelectItem>
              {funcionarios.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {lista.length === 0 ? (
        <EmptyState message="Nenhum pedido encontrado. Pedidos são criados a partir da ficha do cliente." />
      ) : (
        <div className="card-surface overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden lg:table-cell">Solicitante</TableHead>
                <TableHead className="hidden sm:table-cell">Data</TableHead>
                <TableHead className="hidden md:table-cell">Itens</TableHead>
                <TableHead className="hidden xl:table-cell">Valor estimado</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.numero}</TableCell>
                  <TableCell className="max-w-48">
                    <Link
                      to="/clientes/$id"
                      params={{ id: p.clienteId }}
                      className="block truncate text-primary hover:underline"
                    >
                      {nomeCliente(p.clienteId)}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {nomeFuncionario(p.funcionarioId)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">
                    {dataBR(p.data)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {p.itens.length}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-sm">
                    {brl(total(p))}
                  </TableCell>
                  <TableCell>
                    {gestor ? (
                      <Select
                        value={p.status}
                        onValueChange={(v) => {
                          statusPedido(p.id, v as StatusPedido);
                          toast.success(`Pedido ${p.numero} atualizado para ${v}.`);
                        }}
                      >
                        <SelectTrigger className="h-8 w-36 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_PEDIDO.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <StatusBadge status={p.status} />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => setDetalhe(p)}>
                      <Eye className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!detalhe} onOpenChange={(v) => !v && setDetalhe(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Pedido {detalhe?.numero}</DialogTitle>
          </DialogHeader>
          {detalhe && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Cliente</p>
                  <p className="font-medium">{nomeCliente(detalhe.clienteId)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Solicitante</p>
                  <p className="font-medium">{nomeFuncionario(detalhe.funcionarioId)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Data</p>
                  <p className="font-medium">{dataBR(detalhe.data)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <StatusBadge status={detalhe.status} />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs text-muted-foreground">Produtos</p>
                <div className="divide-y divide-border rounded-lg border border-border">
                  {detalhe.itens.map((i) => (
                    <div
                      key={i.produtoId}
                      className="flex items-center justify-between p-2.5"
                    >
                      <span className="min-w-0 truncate">{nomeProduto(i.produtoId)}</span>
                      <span className="shrink-0 font-medium">{i.quantidade}x</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Observações</p>
                <p>{detalhe.observacoes || "—"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
