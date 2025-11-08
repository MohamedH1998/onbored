import { ColumnDef, DataTable } from "@/components/data-table";
import { columns } from "./_table";
import { baseTableSchema } from "@/components/data-table/base-table-schema";
import { getFunnelDropoffsByStep } from "@/utils/queries/funnels/funnel-metrics";
import { parseValidatedDateRange } from "@/utils/helpers";
import ClientLink from "@/components/client-link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string; funnelId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const filters = baseTableSchema.parse(await searchParams);
  const { projectId, funnelId } = await params;
  const { step } = await searchParams;
  if (!step) {
    return <div>No step ID provided</div>;
  }

  const { from, to } = parseValidatedDateRange(filters.dateRange);

  const { success, data } = await getFunnelDropoffsByStep({
    funnelId,
    projectId,
    from,
    to,
    stepId: step as string,
  });

  return (
    <div className="flex flex-col px-14">
      <div className="pt-4">
        <Button variant="outline" size="icon" asChild>
          <ClientLink href={`/project/${projectId}/funnel/${funnelId}`}>
            <ArrowLeftIcon className="w-4 h-4" />
          </ClientLink>
        </Button>
      </div>
      <div className="flex justify-between items-center gap-8 py-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your funnels
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <DataTable
          columns={columns as ColumnDef<any>[]}
          data={data || []}
          count={data.length || 0}
          filterFields={[]}
          hideSearch={true}
        />
      </div>
    </div>
  );
};

export default Page;
