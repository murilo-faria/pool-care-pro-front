export type Role = "gestor" | "funcionario";

export type Funcionario = {
  id: string;
  nome: string;
  cargo: string;
  telefone: string;
  email: string;
  cidade: string;
  admissao: string;
  status: "Ativo" | "Inativo";
};

export type Cliente = {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  dimensoes: string;
  volume: number;
  mensalidade: number;
  responsavelId: string;
  observacoes: string;
  status: "Ativo" | "Inativo";
};

export type Produto = {
  id: string;
  nome: string;
  categoria: string;
  unidade: string;
  estoque: number;
  estoqueMinimo: number;
  precoMedio: number;
  ultimaCompra: number;
  ultimaVenda: number;
  status: "Ativo" | "Inativo";
};

export const STATUS_PEDIDO = [
  "Pendente",
  "Em análise",
  "Aprovado",
  "Separado",
  "Entregue",
  "Cancelado",
] as const;
export type StatusPedido = (typeof STATUS_PEDIDO)[number];

export const STATUS_OS = [
  "Aberta",
  "Em análise",
  "Agendada",
  "Em andamento",
  "Aguardando peças",
  "Concluída",
  "Cancelada",
] as const;
export type StatusOS = (typeof STATUS_OS)[number];

export const PRIORIDADES = ["Baixa", "Média", "Alta", "Urgente"] as const;
export type Prioridade = (typeof PRIORIDADES)[number];

export type ItemPedido = { produtoId: string; quantidade: number };

export type Pedido = {
  id: string;
  numero: string;
  clienteId: string;
  funcionarioId: string;
  data: string;
  itens: ItemPedido[];
  observacoes: string;
  status: StatusPedido;
};

export type OrdemServico = {
  id: string;
  numero: string;
  clienteId: string;
  funcionarioId: string;
  data: string;
  prioridade: Prioridade;
  descricao: string;
  observacoes: string;
  imagens: string[];
  status: StatusOS;
};

export const funcionarios: Funcionario[] = [
  {
    id: "f1",
    nome: "Carlos Almeida",
    cargo: "Técnico de Piscinas",
    telefone: "(11) 98812-4455",
    email: "carlos@adminpool.com.br",
    cidade: "São Paulo",
    admissao: "2022-03-14",
    status: "Ativo",
  },
  {
    id: "f2",
    nome: "Marina Duarte",
    cargo: "Técnica de Piscinas",
    telefone: "(11) 99730-2211",
    email: "marina@adminpool.com.br",
    cidade: "São Paulo",
    admissao: "2023-01-09",
    status: "Ativo",
  },
  {
    id: "f3",
    nome: "Rafael Nogueira",
    cargo: "Auxiliar Técnico",
    telefone: "(11) 99120-7788",
    email: "rafael@adminpool.com.br",
    cidade: "Guarulhos",
    admissao: "2024-06-02",
    status: "Ativo",
  },
  {
    id: "f4",
    nome: "Juliana Prado",
    cargo: "Técnica de Piscinas",
    telefone: "(11) 98455-1200",
    email: "juliana@adminpool.com.br",
    cidade: "Osasco",
    admissao: "2021-11-22",
    status: "Inativo",
  },
];

export const clientes: Cliente[] = [
  {
    id: "c1",
    nome: "Condomínio Águas Claras",
    telefone: "(11) 3322-8890",
    endereco: "Rua das Palmeiras, 420",
    bairro: "Jardim Europa",
    cidade: "São Paulo",
    dimensoes: "12m x 6m x 1,60m",
    volume: 115000,
    mensalidade: 1850,
    responsavelId: "f2",
    observacoes: "Portaria libera acesso das 8h às 17h. Bomba trocada em 2024.",
    status: "Ativo",
  },
  {
    id: "c2",
    nome: "Residência Souza",
    telefone: "(11) 99881-2210",
    endereco: "Av. Brasil, 1180",
    bairro: "Moema",
    cidade: "São Paulo",
    dimensoes: "8m x 4m x 1,40m",
    volume: 44800,
    mensalidade: 620,
    responsavelId: "f2",
    observacoes: "Cliente prefere visitas nas terças pela manhã.",
    status: "Ativo",
  },
  {
    id: "c3",
    nome: "Academia BlueFit",
    telefone: "(11) 3011-4477",
    endereco: "Rua Curitiba, 77",
    bairro: "Centro",
    cidade: "Guarulhos",
    dimensoes: "25m x 12m x 1,80m",
    volume: 540000,
    mensalidade: 4200,
    responsavelId: "f1",
    observacoes: "Piscina semiolímpica aquecida. Análise química semanal.",
    status: "Ativo",
  },
  {
    id: "c4",
    nome: "Hotel Mar Azul",
    telefone: "(13) 3245-9090",
    endereco: "Av. Beira Mar, 3000",
    bairro: "Enseada",
    cidade: "Guarujá",
    dimensoes: "18m x 9m x 1,50m",
    volume: 243000,
    mensalidade: 3100,
    responsavelId: "f1",
    observacoes: "Alta temporada exige duas visitas por semana.",
    status: "Ativo",
  },
  {
    id: "c5",
    nome: "Residência Toledo",
    telefone: "(11) 97788-1122",
    endereco: "Rua dos Ipês, 55",
    bairro: "Alphaville",
    cidade: "Barueri",
    dimensoes: "10m x 5m x 1,50m",
    volume: 75000,
    mensalidade: 890,
    responsavelId: "f3",
    observacoes: "Cachorro solto no quintal, avisar antes de chegar.",
    status: "Ativo",
  },
  {
    id: "c6",
    nome: "Clube Recreativo Vila Nova",
    telefone: "(11) 3566-1010",
    endereco: "Rua Nova Esperança, 900",
    bairro: "Vila Nova",
    cidade: "Osasco",
    dimensoes: "20m x 10m x 1,70m",
    volume: 340000,
    mensalidade: 2750,
    responsavelId: "f2",
    observacoes: "Três piscinas: adulto, infantil e hidromassagem.",
    status: "Inativo",
  },
  {
    id: "c7",
    nome: "Residência Bianchi",
    telefone: "(11) 96622-3311",
    endereco: "Rua Amazonas, 240",
    bairro: "Santana",
    cidade: "São Paulo",
    dimensoes: "6m x 3m x 1,30m",
    volume: 23400,
    mensalidade: 480,
    responsavelId: "f3",
    observacoes: "Piscina de fibra, evitar escova de aço.",
    status: "Ativo",
  },
  {
    id: "c8",
    nome: "Spa Bem Viver",
    telefone: "(11) 3777-2020",
    endereco: "Alameda Santos, 1500",
    bairro: "Jardins",
    cidade: "São Paulo",
    dimensoes: "9m x 5m x 1,40m",
    volume: 63000,
    mensalidade: 1600,
    responsavelId: "f2",
    observacoes: "Água aquecida a 30°C, controle de pH diário.",
    status: "Ativo",
  },
];

export const produtos: Produto[] = [
  {
    id: "p1",
    nome: "Cloro Granulado 10kg",
    categoria: "Químicos",
    unidade: "Balde",
    estoque: 42,
    estoqueMinimo: 15,
    precoMedio: 189.9,
    ultimaCompra: 175.0,
    ultimaVenda: 229.9,
    status: "Ativo",
  },
  {
    id: "p2",
    nome: "Algicida de Choque 5L",
    categoria: "Químicos",
    unidade: "Galão",
    estoque: 12,
    estoqueMinimo: 14,
    precoMedio: 96.5,
    ultimaCompra: 92.0,
    ultimaVenda: 139.0,
    status: "Ativo",
  },
  {
    id: "p3",
    nome: "Clarificante 1L",
    categoria: "Químicos",
    unidade: "Frasco",
    estoque: 68,
    estoqueMinimo: 20,
    precoMedio: 32.4,
    ultimaCompra: 29.9,
    ultimaVenda: 54.9,
    status: "Ativo",
  },
  {
    id: "p4",
    nome: "Barrilha Leve 5kg",
    categoria: "Químicos",
    unidade: "Saco",
    estoque: 8,
    estoqueMinimo: 10,
    precoMedio: 44.0,
    ultimaCompra: 41.5,
    ultimaVenda: 69.9,
    status: "Ativo",
  },
  {
    id: "p5",
    nome: "Aspirador de Fundo",
    categoria: "Equipamentos",
    unidade: "Unidade",
    estoque: 6,
    estoqueMinimo: 3,
    precoMedio: 310.0,
    ultimaCompra: 289.0,
    ultimaVenda: 459.0,
    status: "Ativo",
  },
  {
    id: "p6",
    nome: "Bomba 1/2 CV",
    categoria: "Equipamentos",
    unidade: "Unidade",
    estoque: 3,
    estoqueMinimo: 2,
    precoMedio: 890.0,
    ultimaCompra: 845.0,
    ultimaVenda: 1290.0,
    status: "Ativo",
  },
  {
    id: "p7",
    nome: "Peneira Telescópica",
    categoria: "Acessórios",
    unidade: "Unidade",
    estoque: 21,
    estoqueMinimo: 8,
    precoMedio: 78.0,
    ultimaCompra: 72.0,
    ultimaVenda: 119.0,
    status: "Ativo",
  },
  {
    id: "p8",
    nome: "Areia para Filtro 20kg",
    categoria: "Filtragem",
    unidade: "Saco",
    estoque: 17,
    estoqueMinimo: 6,
    precoMedio: 58.0,
    ultimaCompra: 54.0,
    ultimaVenda: 89.0,
    status: "Ativo",
  },
  {
    id: "p9",
    nome: "Kit Teste pH e Cloro",
    categoria: "Acessórios",
    unidade: "Kit",
    estoque: 30,
    estoqueMinimo: 10,
    precoMedio: 41.0,
    ultimaCompra: 38.0,
    ultimaVenda: 65.0,
    status: "Inativo",
  },
];

export const pedidos: Pedido[] = [
  {
    id: "pd1",
    numero: "PD-2026-0148",
    clienteId: "c1",
    funcionarioId: "f2",
    data: "2026-08-03",
    itens: [
      { produtoId: "p1", quantidade: 2 },
      { produtoId: "p3", quantidade: 4 },
    ],
    observacoes: "Entregar na portaria do condomínio.",
    status: "Pendente",
  },
  {
    id: "pd2",
    numero: "PD-2026-0147",
    clienteId: "c2",
    funcionarioId: "f2",
    data: "2026-08-01",
    itens: [{ produtoId: "p2", quantidade: 1 }],
    observacoes: "Água esverdeada após chuva forte.",
    status: "Aprovado",
  },
  {
    id: "pd3",
    numero: "PD-2026-0146",
    clienteId: "c3",
    funcionarioId: "f1",
    data: "2026-07-29",
    itens: [
      { produtoId: "p1", quantidade: 5 },
      { produtoId: "p8", quantidade: 3 },
    ],
    observacoes: "Troca de areia do filtro programada.",
    status: "Separado",
  },
  {
    id: "pd4",
    numero: "PD-2026-0145",
    clienteId: "c4",
    funcionarioId: "f1",
    data: "2026-07-25",
    itens: [{ produtoId: "p6", quantidade: 1 }],
    observacoes: "Bomba antiga com ruído excessivo.",
    status: "Entregue",
  },
  {
    id: "pd5",
    numero: "PD-2026-0144",
    clienteId: "c5",
    funcionarioId: "f3",
    data: "2026-07-22",
    itens: [{ produtoId: "p7", quantidade: 2 }],
    observacoes: "",
    status: "Em análise",
  },
  {
    id: "pd6",
    numero: "PD-2026-0143",
    clienteId: "c8",
    funcionarioId: "f2",
    data: "2026-07-18",
    itens: [
      { produtoId: "p4", quantidade: 2 },
      { produtoId: "p3", quantidade: 2 },
    ],
    observacoes: "Correção de alcalinidade.",
    status: "Entregue",
  },
  {
    id: "pd7",
    numero: "PD-2026-0142",
    clienteId: "c7",
    funcionarioId: "f3",
    data: "2026-07-12",
    itens: [{ produtoId: "p1", quantidade: 1 }],
    observacoes: "Cliente cancelou a solicitação.",
    status: "Cancelado",
  },
];

export const ordens: OrdemServico[] = [
  {
    id: "os1",
    numero: "OS-2026-0091",
    clienteId: "c1",
    funcionarioId: "f2",
    data: "2026-08-05",
    prioridade: "Alta",
    descricao:
      "Vazamento identificado próximo ao skimmer. Nível da piscina cai cerca de 4cm por dia.",
    observacoes: "Necessário avaliar tubulação de retorno.",
    imagens: ["vazamento-skimmer.jpg", "nivel-agua.jpg"],
    status: "Aberta",
  },
  {
    id: "os2",
    numero: "OS-2026-0090",
    clienteId: "c2",
    funcionarioId: "f2",
    data: "2026-08-02",
    prioridade: "Média",
    descricao: "Iluminação subaquática queimada em dois pontos.",
    observacoes: "Cliente solicitou troca por LED.",
    imagens: ["luz-piscina.jpg"],
    status: "Agendada",
  },
  {
    id: "os3",
    numero: "OS-2026-0089",
    clienteId: "c3",
    funcionarioId: "f1",
    data: "2026-07-30",
    prioridade: "Urgente",
    descricao: "Motobomba principal desligando sozinha e superaquecendo.",
    observacoes: "Aula de natação suspensa até reparo.",
    imagens: ["motobomba.jpg"],
    status: "Aguardando peças",
  },
  {
    id: "os4",
    numero: "OS-2026-0088",
    clienteId: "c4",
    funcionarioId: "f1",
    data: "2026-07-27",
    prioridade: "Baixa",
    descricao: "Rejunte das bordas com desgaste em três trechos.",
    observacoes: "",
    imagens: [],
    status: "Em andamento",
  },
  {
    id: "os5",
    numero: "OS-2026-0087",
    clienteId: "c5",
    funcionarioId: "f3",
    data: "2026-07-20",
    prioridade: "Média",
    descricao: "Filtro com pressão acima do normal, possível entupimento.",
    observacoes: "Realizada retrolavagem completa.",
    imagens: ["manometro.jpg"],
    status: "Concluída",
  },
  {
    id: "os6",
    numero: "OS-2026-0086",
    clienteId: "c8",
    funcionarioId: "f2",
    data: "2026-07-15",
    prioridade: "Alta",
    descricao: "Aquecedor não mantém temperatura configurada.",
    observacoes: "Trocado sensor térmico.",
    imagens: [],
    status: "Concluída",
  },
  {
    id: "os7",
    numero: "OS-2026-0085",
    clienteId: "c7",
    funcionarioId: "f3",
    data: "2026-07-08",
    prioridade: "Baixa",
    descricao: "Mancha escura no fundo da piscina de fibra.",
    observacoes: "Cliente optou por reagendar.",
    imagens: [],
    status: "Cancelada",
  },
  {
    id: "os8",
    numero: "OS-2026-0084",
    clienteId: "c6",
    funcionarioId: "f2",
    data: "2026-07-02",
    prioridade: "Média",
    descricao: "Hidromassagem sem pressão nos jatos laterais.",
    observacoes: "",
    imagens: [],
    status: "Em análise",
  },
];

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const dataBR = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
