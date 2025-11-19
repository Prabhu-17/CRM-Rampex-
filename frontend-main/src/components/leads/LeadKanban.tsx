import { Lead } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface LeadKanbanProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onRefresh: () => void;
}

const stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

export function LeadKanban({ leads, loading }: LeadKanbanProps) {
  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="grid grid-cols-7 gap-4">
      {stages.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage);
        return (
          <Card key={stage}>
            <CardHeader>
              <CardTitle className="text-sm">{stage.toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stageLeads.map((lead) => (
                <div key={lead.id} className="p-2 bg-muted rounded text-sm">
                  {lead.title}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
