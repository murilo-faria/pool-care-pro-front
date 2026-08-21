import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Eye, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState, StatusBadge } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { STATUS_OS, dataBR, type OrdemServico, type StatusOS } from "@/data/mock";

export const Route = createFileRoute("/ordens-servico")({
  head: () => ({
    meta: [
      { title: "Ordens de Serviço — Admin Pool" },
      {
        name: "description",
        content:
          "Controle das ordens de serviço abertas para manutenção e reparo de piscinas.",
      },
      { property: "og:title", content: "Ordens de Serviço — Admin Pool" },
      {
        property: "og:description",
        content: "Prioridade, descrição, anexos e status de cada ordem de serviço.",
      },
    ],
  }),
  component: OrdensPage,
});

function OrdensPage() {
  const {
    role,
    ordensVisiveis,
    nomeCliente,
    nomeFuncionario,
    statusOrdem,
    funcionarios,
  } = useStore();
  const gestor = role === "gestor";
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("todos");
  const [func, setFunc] = useState("todos");
  const [detalhe, setDetalhe] = useState<OrdemServico | null>(null);

  const lista = ordensVisiveis.filter(
    (o) =>
      (o.numero.toLowerCase().includes(busca.toLowerCase()) ||
        nomeCliente(o.clienteId).toLowerCase().includes(busca.toLowerCase())) &&
      (status === "todos" || o.status === status) &&
      (func === "todos" || o.funcionarioId === func),
  );

  return (
    <AppLayout>
      <PageHeader
        title={gestor ? "Ordens de Serviço" : "Minhas Ordens de Serviço"}
        subtitle={
          gestor
            ? "Todas as OS da empresa, com alteração de status."
            : "Ordens de serviço abertas por você e seu andamento."
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
            {STATUS_OS.map((s) => (
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
        <EmptyState message="Nenhuma OS encontrada. Ordens de serviço são abertas a partir da ficha do cliente." />
      ) : (
        <div className="card-surface overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden lg:table-cell">Solicitante</TableHead>
                <TableHead className="hidden sm:table-cell">Data</TableHead>
                <TableHead className="hidden md:table-cell">Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.numero}</TableCell>
                  <TableCell className="max-w-48">
                    <Link
                      to="/clientes/$id"
                      params={{ id: o.clienteId }}
                      className="block truncate text-primary hover:underline"
                    >
                      {nomeCliente(o.clienteId)}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {nomeFuncionario(o.funcionarioId)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">
                    {dataBR(o.data)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <StatusBadge status={o.prioridade} />
                  </TableCell>
                  <TableCell>
                    {gestor ? (
                      <Select
                        value={o.status}
                        onValueChange={(v) => {
                          statusOrdem(o.id, v as StatusOS);
                          toast.success(`OS ${o.numero} atualizada para ${v}.`);
                        }}
                      >
                        <SelectTrigger className="h-8 w-40 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <StatusBadge status={o.status} />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => setDetalhe(o)}>
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ordem de Serviço {detalhe?.numero}</DialogTitle>
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
                  <p className="text-xs text-muted-foreground">Prioridade</p>
                  <StatusBadge status={detalhe.prioridade} />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Descrição</p>
                <p>{detalhe.descricao}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Observações</p>
                <p>{detalhe.observacoes || "—"}</p>
              </div>
              <div>
                <p className="mb-1.5 text-xs text-muted-foreground">Imagens anexadas</p>
                {detalhe.imagens.length === 0 ? (
                  <p className="text-muted-foreground">Nenhuma imagem anexada.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {detalhe.imagens.map((img) => (
                      <Badge key={img} variant="secondary" className="gap-1">
                        <ImageIcon className="size-3" />
                        {img}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status atual</p>
                <StatusBadge status={detalhe.status} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
