import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RISK_TIER_CONFIG,
  TREND_DIRECTION_CONFIG,
  type AccountHealthScore,
} from "@/typings";
import { formatDistanceToNow } from "date-fns";

interface HealthAccountsTableProps {
  accounts: AccountHealthScore[];
  projectId: string;
}

export function HealthAccountsTable({
  accounts,
  projectId,
}: HealthAccountsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account ID</TableHead>
            <TableHead>Health Score</TableHead>
            <TableHead>Risk Tier</TableHead>
            <TableHead>Trend</TableHead>
            <TableHead>Primary Blocker</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => {
            const riskConfig = RISK_TIER_CONFIG[account.risk_tier];
            const trendConfig = TREND_DIRECTION_CONFIG[account.trend_direction];

            return (
              <TableRow key={account.account_id}>
                <TableCell className="font-medium">
                  {account.account_id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      {account.health_score}
                    </span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={riskConfig.badgeColor}>
                    {riskConfig.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={trendConfig.color}>{trendConfig.label}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {account.primary_blocker || "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {formatDistanceToNow(new Date(account.last_activity_at), {
                      addSuffix: true,
                    })}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/project/${projectId}/account/${account.account_id}`}
                  >
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
