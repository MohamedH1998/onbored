import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatBoxProps {
  icon?: React.ReactNode;
  title: string;
  value: string | number;
}

export function StatBox({ icon, title, value }: StatBoxProps) {
  return (
    <Card className="w-full gap-6 p-4">
      <CardHeader className="flex flex-row items-center justify-start gap-2 p-0">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <span className="text-3xl font-bold">{value}</span>
      </CardContent>
    </Card>
  );
}

//
