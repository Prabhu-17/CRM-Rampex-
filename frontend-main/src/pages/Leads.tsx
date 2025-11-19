import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Filter, Download, Grid, List } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadKanban } from '@/components/leads/LeadKanban';
import { LeadDialog } from '@/components/leads/LeadDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data as Lead[]);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = () => {
    setSelectedLead(undefined);
    setDialogOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setDialogOpen(true);
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Lead deleted successfully',
      });

      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete lead',
        variant: 'destructive',
      });
    }
  };

  const handleLeadSaved = () => {
    fetchLeads();
    setDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-muted-foreground">Manage your sales pipeline</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button onClick={handleCreateLead}>
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
          </div>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as 'table' | 'kanban')}>
          <TabsList>
            <TabsTrigger value="table">
              <List className="h-4 w-4 mr-2" />
              Table View
            </TabsTrigger>
            <TabsTrigger value="kanban">
              <Grid className="h-4 w-4 mr-2" />
              Kanban View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <LeadTable
                  leads={leads}
                  loading={loading}
                  onEdit={handleEditLead}
                  onDelete={handleDeleteLead}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kanban" className="mt-4">
            <LeadKanban
              leads={leads}
              loading={loading}
              onEdit={handleEditLead}
              onRefresh={fetchLeads}
            />
          </TabsContent>
        </Tabs>

        <LeadDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          lead={selectedLead}
          onSaved={handleLeadSaved}
        />
      </div>
    </DashboardLayout>
  );
}
