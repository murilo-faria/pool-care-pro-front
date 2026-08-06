import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState, StatusBadge } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
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
import { brl, type Cliente } from "@/data/mock";

export const Route = createFileRoute("/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes — Admin Pool" },
      {
        name: "description",
        content:
          "Cadastro de clientes com dados da piscina, mensalidade e funcionário responsável.",
      },
      { property: "og:title", content: "Clientes — Admin Pool" },
      {
        property: "og:description",
        content: "Gerencie os clientes atendidos pela sua empresa de piscinas.",
      },
    ],
  }),
  component: ClientesPage,
});

const vazio: Cliente = {
  id: "",
  nome: "",
  telefone: "",
  endereco: "",
  bairro: "",
  cidade: "",
  dimensoes: "",
  volume: 0,
  mensalidade: 0,
  responsavelId: "f1",
  observacoes: "",
  status: "Ativo",
};

function ClientesPage() {
  const {
    role,
    clientesVisiveis,
    funcionarios,
    nomeFuncionario,
    salvarCliente,
    excluirCliente,
  } = useStore();
  const gestor = role === "gestor";
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("todos");
  const [resp, setResp] = useState("todos");
  const [form, setForm] = useState<Cliente | null>(null);

  const lista = useMemo(
    () =>
      clientesVisiveis.filter(
        (c) =>
          (c.nome.toLowerCase().includes(busca.toLowerCase()) ||
            c.cidade.toLowerCase().includes(busca.toLowerCase()) ||
            c.bairro.toLowerCase().includes(busca.toLowerCase())) &&
          (status === "todos" || c.status === status) &&
          (resp === "todos" || c.responsavelId === resp),
      ),
    [clientesVisiveis, busca, status, resp],
  );

  const set = (patch: Partial<Cliente>) =>
    setForm((f) => (f ? { ...f, ...patch } : f));

  return (
    <AppLayout>
      <PageHeader
        title={gestor ? "Clientes" : "Meus Clientes"}
        subtitle={
          gestor
            ? "Todos os clientes da empresa e seus responsáveis."
            : "Clientes sob sua responsabilidade."
        }
        action={
          gestor ? (
            <Button onClick={() => setForm({ ...vazio })}>
              <Plus className="size-4" /> Novo cliente
            </Button>
          ) : undefined
        }
      />

      <div className="card-surface mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, bairro ou cidade"
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
        {gestor && (
          <Select value={resp} onValueChange={setResp}>
            <SelectTrigger>
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os responsáveis</SelectItem>
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
        <EmptyState message="Nenhum cliente encontrado com os filtros aplicados." />
      ) : (
        <div className="card-surface overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Local</TableHead>
                <TableHead className="hidden lg:table-cell">Piscina</TableHead>
                <TableHead className="hidden sm:table-cell">Mensalidade</TableHead>
                <TableHead className="hidden lg:table-cell">Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="max-w-56">
                    <span className="block truncate font-medium">{c.nome}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {c.telefone}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {c.bairro} · {c.cidade}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {c.dimensoes}
                    <span className="block text-xs">
                      {c.volume.toLocaleString("pt-BR")} L
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">
                    {brl(c.mensalidade)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {nomeFuncionario(c.responsavelId)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button asChild size="icon" variant="ghost" title="Ver cliente">
                      <Link to="/clientes/$id" params={{ id: c.id }}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    {gestor && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Editar"
                          onClick={() => setForm(c)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Excluir"
                          onClick={() => {
                            excluirCliente(c.id);
                            toast.success("Cliente excluído.");
                          }}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!form} onOpenChange={(v) => !v && setForm(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{form?.id ? "Editar cliente" : "Novo cliente"}</DialogTitle>
            <DialogDescription>
              Dados cadastrais, informações da piscina e responsável técnico.
            </DialogDescription>
          </DialogHeader>
          {form && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Nome</Label>
                <Input
                  className="mt-1.5"
                  value={form.nome}
                  onChange={(e) => set({ nome: e.target.value })}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  className="mt-1.5"
                  value={form.telefone}
                  onChange={(e) => set({ telefone: e.target.value })}
                />
              </div>
              <div>
                <Label>Endereço</Label>
                <Input
                  className="mt-1.5"
                  value={form.endereco}
                  onChange={(e) => set({ endereco: e.target.value })}
                />
              </div>
              <div>
                <Label>Bairro</Label>
                <Input
                  className="mt-1.5"
                  value={form.bairro}
                  onChange={(e) => set({ bairro: e.target.value })}
                />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input
                  className="mt-1.5"
                  value={form.cidade}
                  onChange={(e) => set({ cidade: e.target.value })}
                />
              </div>
              <div>
                <Label>Dimensões da piscina</Label>
                <Input
                  className="mt-1.5"
                  placeholder="10m x 5m x 1,50m"
                  value={form.dimensoes}
                  onChange={(e) => set({ dimensoes: e.target.value })}
                />
              </div>
              <div>
                <Label>Volume (litros)</Label>
                <Input
                  type="number"
                  className="mt-1.5"
                  value={form.volume}
                  onChange={(e) => set({ volume: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Mensalidade (R$)</Label>
                <Input
                  type="number"
                  className="mt-1.5"
                  value={form.mensalidade}
                  onChange={(e) => set({ mensalidade: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Funcionário responsável</Label>
                <Select
                  value={form.responsavelId}
                  onValueChange={(v) => set({ responsavelId: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {funcionarios.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nome} — {f.cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => set({ status: v as Cliente["status"] })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>Observações</Label>
                <Textarea
                  className="mt-1.5"
                  value={form.observacoes}
                  onChange={(e) => set({ observacoes: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setForm(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (!form?.nome.trim()) {
                  toast.error("Informe o nome do cliente.");
                  return;
                }
                salvarCliente(form);
                toast.success("Cliente salvo com sucesso.");
                setForm(null);
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
