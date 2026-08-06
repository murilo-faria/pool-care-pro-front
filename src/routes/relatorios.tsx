import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Printer, FileText, FileSpreadsheet, Eye } from "lucide-react";
import { toast } from "sonner";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState, StatusBadge } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { STATUS_OS, STATUS_PEDIDO, dataBR } from "@/data/mock";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Admin Pool" },
      {
        name: "description",
        content:
          "Relatórios de ordens de serviço e pedidos de produtos com filtros por cliente, funcionário, status e período.",
      },
      { property: "og:title", content: "Relatórios — Admin Pool" },
      {
        property: "og:description",
        content: "Gere relatórios gerenciais e exporte os resultados.",
      },
    ],
  }),
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const { role, pedidos, ordens, clientes, funcionarios, nomeCliente, nomeFuncionario } =
    useStore();
  const [tipo, setTipo] = useState<"os" | "pedidos">("os");
  const [cliente, setCliente] = useState("todos");
  const [func, setFunc] = useState("todos");
  const [status, setStatus] = useState("todos");
  const [de, setDe] = useState("2026-07-01");
  const [ate, setAte] = useState("2026-08-31");
  const [gerado, setGerado] = useState(true);

  if (role !== "gestor") {
    return (
      <AppLayout>
        <PageHeader title="Acesso restrito" />
        <EmptyState message="Somente o Gestor pode acessar os relatórios." />
      </AppLayout>
    );
  }

  const base = tipo === "os" ? ordens : pedidos;
  const resultados = base.filter(
    (r) =>
      (cliente === "todos" || r.clienteId === cliente) &&
      (func === "todos" || r.funcionarioId === func) &&
      (status === "todos" || r.status === status) &&
      r.data >= de &&
      r.data <= ate,
  );
  const statusList = tipo === "os" ? STATUS_OS : STATUS_PEDIDO;
  const porStatus = statusList
    .map((s) => ({ s, n: resultados.filter((r) => r.status === s).length }))
    .filter((x) => x.n > 0);

  const acao = (msg: string) => () => toast.success(msg);

  return (
    <AppLayout>
      <PageHeader
        title="Relatórios"
        subtitle="Gere relatórios de ordens de serviço e pedidos de produtos."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={acao("Impressão simulada enviada.")}>
              <Printer className="size-4" /> Imprimir
            </Button>
            <Button variant="outline" onClick={acao("Exportação em PDF simulada.")}>
              <FileText className="size-4" /> PDF
            </Button>
            <Button variant="outline" onClick={acao("Exportação em Excel simulada.")}>
              <FileSpreadsheet className="size-4" /> Excel
            </Button>
          </div>
        }
      />

      <Tabs
        value={tipo}
        onValueChange={(v) => {
          setTipo(v as "os" | "pedidos");
          setStatus("todos");
        }}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="os">Ordens de Serviço</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos de Produtos</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="card-surface mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label>Cliente</Label>
          <Select value={cliente} onValueChange={setCliente}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os clientes</SelectItem>
              {clientes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Funcionário</Label>
          <Select value={func} onValueChange={setFunc}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os funcionários</SelectItem>
              {funcionarios.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {statusList.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Data inicial</Label>
          <Input
            type="date"
            className="mt-1.5"
            value={de}
            onChange={(e) => setDe(e.target.value)}
          />
        </div>
        <div>
          <Label>Data final</Label>
          <Input
            type="date"
            className="mt-1.5"
            value={ate}
            onChange={(e) => setAte(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button
            className="w-full"
            onClick={() => {
              setGerado(true);
              toast.success("Relatório gerado com os filtros aplicados.");
            }}
          >
            <Eye className="size-4" /> Visualizar relatório
          </Button>
        </div>
      </div>

      {gerado && (
        <>
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-surface p-4">
              <p className="text-xs uppercase text-muted-foreground">Total de registros</p>
              <p className="font-display mt-1 text-2xl font-bold">{resultados.length}</p>
            </div>
            {porStatus.slice(0, 3).map((x) => (
              <div key={x.s} className="card-surface p-4">
                <p className="truncate text-xs uppercase text-muted-foreground">{x.s}</p>
                <p className="font-display mt-1 text-2xl font-bold">{x.n}</p>
              </div>
            ))}
          </div>

          {resultados.length === 0 ? (
            <EmptyState message="Nenhum registro encontrado para os filtros informados." />
          ) : (
            <div className="card-surface overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Funcionário responsável
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Data da solicitação
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultados.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.numero}</TableCell>
                      <TableCell className="max-w-52">
                        <span className="block truncate">{nomeCliente(r.clienteId)}</span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {nomeFuncionario(r.funcionarioId)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {dataBR(r.data)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="card-surface mt-4 p-4">
            <h3 className="mb-3 text-sm font-semibold">Resumo por status</h3>
            <div className="flex flex-wrap gap-2">
              {porStatus.map((x) => (
                <span key={x.s} className="flex items-center gap-2 text-sm">
                  <StatusBadge status={x.s} />
                  <span className="font-semibold">{x.n}</span>
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
