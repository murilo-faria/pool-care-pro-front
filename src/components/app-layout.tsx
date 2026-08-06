import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Package,
  ShoppingCart,
  Wrench,
  FileBarChart,
  Settings,
  UserCircle,
  Waves,
  Bell,
  Search,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store";
import type { ReactNode } from "react";

const menuGestor = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Funcionários", url: "/funcionarios", icon: UserCog },
  { title: "Produtos", url: "/produtos", icon: Package },
  { title: "Pedidos de Produtos", url: "/pedidos", icon: ShoppingCart },
  { title: "Ordens de Serviço", url: "/ordens-servico", icon: Wrench },
  { title: "Relatórios", url: "/relatorios", icon: FileBarChart },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

const menuFuncionario = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Meus Clientes", url: "/clientes", icon: Users },
  { title: "Meus Pedidos", url: "/pedidos", icon: ShoppingCart },
  { title: "Minhas Ordens de Serviço", url: "/ordens-servico", icon: Wrench },
  { title: "Meu Perfil", url: "/perfil", icon: UserCircle },
];

function AppSidebar() {
  const { role, usuarioNome } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = role === "gestor" ? menuGestor : menuFuncionario;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="brand-gradient grid size-9 shrink-0 place-items-center rounded-lg">
            <Waves className="size-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="font-display truncate text-sm font-bold text-sidebar-foreground">
              Admin Pool
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              Gestão de piscinas
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role === "gestor" ? "Administração" : "Minhas atividades"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === item.url || pathname.startsWith(item.url + "/")
                    }
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-sidebar-primary text-xs text-sidebar-primary-foreground">
              {usuarioNome
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-semibold text-sidebar-foreground">
              {usuarioNome}
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">
              {role === "gestor" ? "Gestor" : "Funcionário"}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function Topbar() {
  const { role, setRole, usuarioNome } = useStore();
  return (
    <header className="sticky top-0 z-20 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-border bg-card/90 px-3 py-2.5 backdrop-blur sm:gap-4 sm:px-6">
      <SidebarTrigger />
      <div className="relative hidden min-w-0 sm:block sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar cliente, pedido ou OS..." className="pl-9" />
      </div>
      <div className="col-start-3 flex items-center gap-1.5 sm:gap-3">
        <Badge variant="secondary" className="hidden md:inline-flex">
          Ambiente de demonstração
        </Badge>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Avatar className="size-6">
                <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
                  {usuarioNome
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-32 truncate sm:inline">
                {role === "gestor" ? "Gestor" : "Funcionário"}
              </span>
              <ChevronsUpDown className="size-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{usuarioNome}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Trocar perfil (demonstração)
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setRole("gestor")}>
              <UserCog className="size-4" /> Gestor
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("funcionario")}>
              <UserCircle className="size-4" /> Funcionário
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/">
                <LogOut className="size-4" /> Sair
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
