import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clientes as seedClientes,
  funcionarios as seedFuncionarios,
  ordens as seedOrdens,
  pedidos as seedPedidos,
  produtos as seedProdutos,
  type Cliente,
  type Funcionario,
  type OrdemServico,
  type Pedido,
  type Produto,
  type Role,
  type StatusOS,
  type StatusPedido,
} from "@/data/mock";

const FUNCIONARIO_LOGADO = "f2";

type Store = {
  role: Role;
  setRole: (r: Role) => void;
  usuarioId: string;
  usuarioNome: string;
  clientes: Cliente[];
  funcionarios: Funcionario[];
  produtos: Produto[];
  pedidos: Pedido[];
  ordens: OrdemServico[];
  /** clientes visíveis para o perfil atual */
  clientesVisiveis: Cliente[];
  pedidosVisiveis: Pedido[];
  ordensVisiveis: OrdemServico[];
  nomeCliente: (id: string) => string;
  nomeFuncionario: (id: string) => string;
  nomeProduto: (id: string) => string;
  salvarCliente: (c: Cliente) => void;
  excluirCliente: (id: string) => void;
  salvarFuncionario: (f: Funcionario) => void;
  excluirFuncionario: (id: string) => void;
  salvarProduto: (p: Produto) => void;
  excluirProduto: (id: string) => void;
  criarPedido: (p: Omit<Pedido, "id" | "numero" | "data" | "status">) => void;
  statusPedido: (id: string, s: StatusPedido) => void;
  criarOrdem: (
    o: Omit<OrdemServico, "id" | "numero" | "data" | "status">,
  ) => void;
  statusOrdem: (id: string, s: StatusOS) => void;
};

const Ctx = createContext<Store | null>(null);

const hoje = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 9);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("gestor");
  const [clientes, setClientes] = useState(seedClientes);
  const [funcionarios, setFuncionarios] = useState(seedFuncionarios);
  const [produtos, setProdutos] = useState(seedProdutos);
  const [pedidos, setPedidos] = useState(seedPedidos);
  const [ordens, setOrdens] = useState(seedOrdens);

  const value = useMemo<Store>(() => {
    const usuarioId = role === "gestor" ? "gestor" : FUNCIONARIO_LOGADO;
    const usuarioNome =
      role === "gestor"
        ? "Eduardo Martins"
        : (funcionarios.find((f) => f.id === FUNCIONARIO_LOGADO)?.nome ?? "");

    const clientesVisiveis =
      role === "gestor"
        ? clientes
        : clientes.filter((c) => c.responsavelId === FUNCIONARIO_LOGADO);
    const pedidosVisiveis =
      role === "gestor"
        ? pedidos
        : pedidos.filter((p) => p.funcionarioId === FUNCIONARIO_LOGADO);
    const ordensVisiveis =
      role === "gestor"
        ? ordens
        : ordens.filter((o) => o.funcionarioId === FUNCIONARIO_LOGADO);

    const proximoNumero = (prefixo: string, atual: string[]) => {
      const max = atual.reduce((acc, n) => {
        const num = Number(n.split("-").pop());
        return Number.isFinite(num) && num > acc ? num : acc;
      }, 0);
      return `${prefixo}-2026-${String(max + 1).padStart(4, "0")}`;
    };

    return {
      role,
      setRole,
      usuarioId,
      usuarioNome,
      clientes,
      funcionarios,
      produtos,
      pedidos,
      ordens,
      clientesVisiveis,
      pedidosVisiveis,
      ordensVisiveis,
      nomeCliente: (id) => clientes.find((c) => c.id === id)?.nome ?? "—",
      nomeFuncionario: (id) => funcionarios.find((f) => f.id === id)?.nome ?? "—",
      nomeProduto: (id) => produtos.find((p) => p.id === id)?.nome ?? "—",
      salvarCliente: (c) =>
        setClientes((prev) =>
          prev.some((x) => x.id === c.id)
            ? prev.map((x) => (x.id === c.id ? c : x))
            : [{ ...c, id: uid() }, ...prev],
        ),
      excluirCliente: (id) =>
        setClientes((prev) => prev.filter((c) => c.id !== id)),
      salvarFuncionario: (f) =>
        setFuncionarios((prev) =>
          prev.some((x) => x.id === f.id)
            ? prev.map((x) => (x.id === f.id ? f : x))
            : [{ ...f, id: uid() }, ...prev],
        ),
      excluirFuncionario: (id) =>
        setFuncionarios((prev) => prev.filter((f) => f.id !== id)),
      salvarProduto: (p) =>
        setProdutos((prev) =>
          prev.some((x) => x.id === p.id)
            ? prev.map((x) => (x.id === p.id ? p : x))
            : [{ ...p, id: uid() }, ...prev],
        ),
      excluirProduto: (id) =>
        setProdutos((prev) => prev.filter((p) => p.id !== id)),
      criarPedido: (p) =>
        setPedidos((prev) => [
          {
            ...p,
            id: uid(),
            numero: proximoNumero(
              "PD",
              prev.map((x) => x.numero),
            ),
            data: hoje(),
            status: "Pendente",
          },
          ...prev,
        ]),
      statusPedido: (id, s) =>
        setPedidos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: s } : p)),
        ),
      criarOrdem: (o) =>
        setOrdens((prev) => [
          {
            ...o,
            id: uid(),
            numero: proximoNumero(
              "OS",
              prev.map((x) => x.numero),
            ),
            data: hoje(),
            status: "Aberta",
          },
          ...prev,
        ]),
      statusOrdem: (id, s) =>
        setOrdens((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: s } : o)),
        ),
    };
  }, [role, clientes, funcionarios, produtos, pedidos, ordens]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore deve ser usado dentro de AppStoreProvider");
  return ctx;
}
