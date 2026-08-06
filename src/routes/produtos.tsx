import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search, AlertTriangle } from "lucide-react";
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
import { brl, type Produto } from "@/data/mock";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos — Admin Pool" },
      {
        name: "description",
        content:
          "Catálogo de produtos químicos, equipamentos e acessórios com controle de estoque mínimo.",
      },
      { property: "og:title", content: "Produtos — Admin Pool" },
      {
        property: "og:description",
        content: "Controle o estoque e os preços dos produtos utilizados nas manutenções.",
      },
    ],
  }),
  component: ProdutosPage,
});

const vazio: Produto = {
  id: "",
  nome: "",
  categoria: "Químicos",
  unidade: "Unidade",
  estoque: 0,
  estoqueMinimo: 0,
  precoMedio: 0,
  ultimaCompra: 0,
  ultimaVenda: 0,
  status: "Ativo",
};

function ProdutosPage() {
  const { role, produtos, salvarProduto, excluirProduto } = useStore();
  const [busca, setBusca] = useState("");
  const [cat, setCat] = useState("todas");
  const [form, setForm] = useState<Produto | null>(null);

  if (role !== "gestor") {
    return (
      <AppLayout>
        <PageHeader title="Acesso restrito" />
        <EmptyState message="Somente o Gestor pode cadastrar e gerenciar produtos." />
      </AppLayout>
    );
  }

  const categorias = Array.from(new Set(produtos.map((p) => p.categoria)));
  const lista = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) &&
      (cat === "todas" || p.categoria === cat),
  );
  const set = (patch: Partial<Produto>) =>
    setForm((f) => (f ? { ...f, ...patch } : f));

  return (
    <AppLayout>
      <PageHeader
        title="Produtos"
        subtitle="Catálogo utilizado nos pedidos solicitados pelos funcionários."
        action={
          <Button onClick={() => setForm({ ...vazio })}>
            <Plus className="size-4" /> Novo produto
          </Button>
        }
      />

      <div className="card-surface mb-4 grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto"
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {categorias.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {lista.length === 0 ? (
        <EmptyState message="Nenhum produto encontrado." />
      ) : (
        <div className="card-surface overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="hidden md:table-cell">Unidade</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead className="hidden lg:table-cell">Preço médio</TableHead>
                <TableHead className="hidden lg:table-cell">Última compra</TableHead>
                <TableHead className="hidden xl:table-cell">Última venda</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-56">
                    <span className="block truncate font-medium">{p.nome}</span>
                    <span className="block text-xs text-muted-foreground">
                      {p.categoria}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {p.unidade}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="flex items-center gap-1.5">
                      {p.estoque}
                      {p.estoque < p.estoqueMinimo && (
                        <AlertTriangle className="size-3.5 text-warning-foreground" />
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      mín. {p.estoqueMinimo}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">
                    {brl(p.precoMedio)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {brl(p.ultimaCompra)}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                    {brl(p.ultimaVenda)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <Button size="icon" variant="ghost" onClick={() => setForm(p)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        excluirProduto(p.id);
                        toast.success("Produto excluído.");
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{form?.id ? "Editar produto" : "Novo produto"}</DialogTitle>
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
                <Label>Categoria</Label>
                <Input
                  className="mt-1.5"
                  value={form.categoria}
                  onChange={(e) => set({ categoria: e.target.value })}
                />
              </div>
              <div>
                <Label>Unidade</Label>
                <Input
                  className="mt-1.5"
                  value={form.unidade}
                  onChange={(e) => set({ unidade: e.target.value })}
                />
              </div>
              <div>
                <Label>Estoque</Label>
                <Input
                  type="number"
                  className="mt-1.5"
                  value={form.estoque}
                  onChange={(e) => set({ estoque: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Estoque mínimo</Label>
                <Input
                  type="number"
                  className="mt-1.5"
                  value={form.estoqueMinimo}
                  onChange={(e) => set({ estoqueMinimo: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Preço médio</Label>
                <Input
                  type="number"
                  className="mt-1.5"
                  value={form.precoMedio}
                  onChange={(e) => set({ precoMedio: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Valor da última compra</Label>
                <Input
                  type="number"
                  className="mt-1.5"
                  value={form.ultimaCompra}
                  onChange={(e) => set({ ultimaCompra: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Valor da última venda</Label>
                <Input
                  type="number"
                  className="mt-1.5"
                  value={form.ultimaVenda}
                  onChange={(e) => set({ ultimaVenda: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => set({ status: v as Produto["status"] })}
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
                  toast.error("Informe o nome do produto.");
                  return;
                }
                salvarProduto(form);
                toast.success("Produto salvo com sucesso.");
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
