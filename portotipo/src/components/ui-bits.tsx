import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const map: Record<string, string> = {
  Pendente: "bg-warning/15 text-warning-foreground border-warning/40",
  "Em análise": "bg-info/15 text-info border-info/40",
  Aprovado: "bg-primary/10 text-primary border-primary/30",
  Separado: "bg-accent text-accent-foreground border-border",
  Entregue: "bg-success/15 text-success border-success/40",
  Cancelado: "bg-destructive/10 text-destructive border-destructive/30",
  Aberta: "bg-warning/15 text-warning-foreground border-warning/40",
  Agendada: "bg-primary/10 text-primary border-primary/30",
  "Em andamento": "bg-info/15 text-info border-info/40",
  "Aguardando peças": "bg-accent text-accent-foreground border-border",
  Concluída: "bg-success/15 text-success border-success/40",
  Cancelada: "bg-destructive/10 text-destructive border-destructive/30",
  Ativo: "bg-success/15 text-success border-success/40",
  Inativo: "bg-muted text-muted-foreground border-border",
  Baixa: "bg-muted text-muted-foreground border-border",
  Média: "bg-info/15 text-info border-info/40",
  Alta: "bg-warning/15 text-warning-foreground border-warning/40",
  Urgente: "bg-destructive/10 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", map[status])}>
      {status}
    </Badge>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: ReactNode;
  tone?: "primary" | "success" | "warning" | "info" | "destructive";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    info: "bg-info/15 text-info",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <div className="card-surface p-4 sm:p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="font-display mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            {value}
          </p>
          {hint && (
            <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
        <div className={cn("grid size-10 shrink-0 place-items-center rounded-lg", tones[tone])}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="card-surface p-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
