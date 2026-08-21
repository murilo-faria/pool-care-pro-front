import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState, StatusBadge } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { dataBR, type Funcionario } from "@/data/mock";

export const Route = createFileRoute("/funcionarios")({
  head: () => ({
    meta: [
      { title: "Funcionários — Admin Pool" },
      {
        name: "description",
        content:
          "Cadastro da equipe técnica responsável pelo atendimento dos clientes de piscina.",
      },
      { property: "og:title", content: "Funcionários — Admin Pool" },
      {
        property: "og:description",
        content: "Gerencie a equipe técnica e os clientes atribuídos a cada funcionário.",
      },
    ],
  }),
  component: FuncionariosPage,
});

const vazio: Funcionario = {
  id: "",
  nome: "",
  cargo: "",
  telefone: "",
  email: "",
  cidade: "",
  admissao: new Date().toISOString().slice(0, 10),
  status: "Ativo",
};

function FuncionariosPage() {
  const { role, funcionarios, clientes, salvarFuncionario, excluirFuncionario } =
    useStore();
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState<Funcionario | null>(null);

  if (role !== "gestor") {
    return (
      <AppLayout>
        <PageHeader title="Acesso restrito" />
        <EmptyState message="Somente o Gestor pode acessar o cadastro de funcionários." />
      </AppLayout>
    );
  }

  const lista = funcionarios.filter(
    (f) =>
      f.nome.toLowerCase().includes(busca.toLowerCase()) ||
      f.cargo.toLowerCase().includes(busca.toLowerCase()),
  );
  const set = (patch: Partial<Funcionario>) =>
    setForm((f) => (f ? { ...f, ...patch } : f));

  return (
    <AppLayout>
      <PageHeader
        title="Funcionários"
        subtitle="Equipe técnica e carteira de clientes de cada funcionário."
        action={
          <Button onClick={() => setForm({ ...vazio })}>
            <Plus className="size-4" /> Novo funcionário
          </Button>
        }
      />

      <div className="card-surface mb-4 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou cargo"
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {lista.length === 0 ? (
        <EmptyState message="Nenhum funcionário encontrado." />
      ) : (
        <div className="card-surface overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead className="hidden md:table-cell">Contato</TableHead>
                <TableHead className="hidden lg:table-cell">Cidade</TableHead>
                <TableHead className="hidden sm:table-cell">Clientes</TableHead>
                <TableHead className="hidden lg:table-cell">Admissão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="max-w-56">
                    <span className="block truncate font-medium">{f.nome}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {f.cargo}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {f.telefone}
                    <span className="block truncate text-xs">{f.email}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {f.cidade}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">
                    {clientes.filter((c) => c.responsavelId === f.id).length}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {dataBR(f.admissao)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={f.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <Button size="icon" variant="ghost" onClick={() => setForm(f)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        excluirFuncionario(f.id);
                        toast.success("Funcionário excluído.");
                      }}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!form} onOpenChange={(v) => !v && setForm(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {form?.id ? "Editar funcionário" : "Novo funcionário"}
            </DialogTitle>
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
                <Label>Cargo</Label>
                <Input
                  className="mt-1.5"
                  value={form.cargo}
                  onChange={(e) => set({ cargo: e.target.value })}
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
              <div className="sm:col-span-2">
                <Label>E-mail</Label>
                <Input
                  className="mt-1.5"
                  value={form.email}
                  onChange={(e) => set({ email: e.target.value })}
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
                <Label>Admissão</Label>
                <Input
                  type="date"
                  className="mt-1.5"
                  value={form.admissao}
                  onChange={(e) => set({ admissao: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => set({ status: v as Funcionario["status"] })}
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
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setForm(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (!form?.nome.trim()) {
                  toast.error("Informe o nome do funcionário.");
                  return;
                }
                salvarFuncionario(form);
                toast.success("Funcionário salvo com sucesso.");
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
