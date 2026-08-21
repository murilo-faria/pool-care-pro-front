import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { PRIORIDADES, brl, type Prioridade } from "@/data/mock";
import { ImagePlus, Trash2 } from "lucide-react";

export function NovoPedidoDialog({
  clienteId,
  open,
  onOpenChange,
}: {
  clienteId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { produtos, nomeCliente, criarPedido, usuarioId, role, funcionarios } =
    useStore();
  const [sel, setSel] = useState<Record<string, number>>({});
  const [obs, setObs] = useState("");
  const ativos = produtos.filter((p) => p.status === "Ativo");

  const toggle = (id: string) =>
    setSel((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = 1;
      return next;
    });

  const enviar = () => {
    const itens = Object.entries(sel).map(([produtoId, quantidade]) => ({
      produtoId,
      quantidade,
    }));
    if (itens.length === 0) {
      toast.error("Selecione pelo menos um produto.");
      return;
    }
    criarPedido({
      clienteId,
      funcionarioId: role === "gestor" ? (funcionarios[0]?.id ?? "f1") : usuarioId,
      itens,
      observacoes: obs,
    });
    toast.success("Pedido de produtos enviado com status Pendente.");
    setSel({});
    setObs("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Solicitar Produto</DialogTitle>
          <DialogDescription>
            A solicitação é criada a partir do cadastro do cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Cliente</Label>
            <Input value={nomeCliente(clienteId)} readOnly className="mt-1.5 bg-muted" />
          </div>
          <div>
            <Label>Produtos</Label>
            <div className="mt-1.5 max-h-72 space-y-2 overflow-y-auto rounded-lg border border-border p-2">
              {ativos.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md p-2 hover:bg-muted/60"
                >
                  <Checkbox
                    checked={!!sel[p.id]}
                    onCheckedChange={() => toggle(p.id)}
                    id={`prod-${p.id}`}
                  />
                  <label htmlFor={`prod-${p.id}`} className="min-w-0 cursor-pointer">
                    <span className="block truncate text-sm font-medium">{p.nome}</span>
                    <span className="text-xs text-muted-foreground">
                      {p.categoria} · {p.unidade} · {brl(p.ultimaVenda)}
                    </span>
                  </label>
                  <Input
                    type="number"
                    min={1}
                    disabled={!sel[p.id]}
                    value={sel[p.id] ?? ""}
                    onChange={(e) =>
                      setSel((prev) => ({
                        ...prev,
                        [p.id]: Math.max(1, Number(e.target.value) || 1),
                      }))
                    }
                    className="w-20"
                    placeholder="Qtd"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="obs-pedido">Observações</Label>
            <Textarea
              id="obs-pedido"
              className="mt-1.5"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Informações adicionais para o gestor..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={enviar}>Enviar solicitação</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NovaOSDialog({
  clienteId,
  open,
  onOpenChange,
}: {
  clienteId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { nomeCliente, criarOrdem, usuarioId, role, funcionarios } = useStore();
  const [prioridade, setPrioridade] = useState<Prioridade>("Média");
  const [descricao, setDescricao] = useState("");
  const [obs, setObs] = useState("");
  const [imagens, setImagens] = useState<string[]>([]);

  const enviar = () => {
    if (descricao.trim().length < 10) {
      toast.error("Descreva o problema com mais detalhes.");
      return;
    }
    criarOrdem({
      clienteId,
      funcionarioId: role === "gestor" ? (funcionarios[0]?.id ?? "f1") : usuarioId,
      prioridade,
      descricao,
      observacoes: obs,
      imagens,
    });
    toast.success("Ordem de Serviço aberta com sucesso.");
    setDescricao("");
    setObs("");
    setImagens([]);
    setPrioridade("Média");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Abrir Ordem de Serviço</DialogTitle>
          <DialogDescription>
            A OS é vinculada automaticamente ao cliente selecionado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Cliente</Label>
              <Input value={nomeCliente(clienteId)} readOnly className="mt-1.5 bg-muted" />
            </div>
            <div>
              <Label>Prioridade</Label>
              <Select
                value={prioridade}
                onValueChange={(v) => setPrioridade(v as Prioridade)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORIDADES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="desc-os">Descrição detalhada do problema</Label>
            <Textarea
              id="desc-os"
              rows={4}
              className="mt-1.5"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex.: bomba desligando sozinha, vazamento na borda..."
            />
          </div>
          <div>
            <Label htmlFor="obs-os">Observações</Label>
            <Textarea
              id="obs-os"
              className="mt-1.5"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </div>
          <div>
            <Label>Anexar imagens (simulação)</Label>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setImagens((prev) => [...prev, `foto-${prev.length + 1}.jpg`])
                }
              >
                <ImagePlus className="size-4" /> Adicionar imagem
              </Button>
              {imagens.map((img) => (
                <Badge key={img} variant="secondary" className="gap-1">
                  {img}
                  <button
                    type="button"
                    onClick={() => setImagens((prev) => prev.filter((i) => i !== img))}
                  >
                    <Trash2 className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={enviar}>Abrir OS</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
