import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProblemDescriptionCardProps {
  title: string;
  description: string;
}

export function ProblemDescriptionCard({ title, description }: ProblemDescriptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: description.replace(/`([^`]+)`/g, '<code class="font-code bg-muted px-1 py-0.5 rounded-sm text-foreground">$1</code>') }} />
      </CardContent>
    </Card>
  );
}
