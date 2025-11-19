import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Interaction } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { InteractionTable } from '@/components/interactions/InteractionTable';
import { InteractionDialog } from '@/components/interactions/InteractionDialog';

export default function Interactions() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInteractions();
  }, []);

  const fetchInteractions = async () => {
    try {
      const { data, error } = await supabase
        .from('interactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInteractions(data as Interaction[]);
    } catch (error) {
      console.error('Error fetching interactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch interactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInteractionSaved = () => {
    fetchInteractions();
    setDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interactions</h1>
            <p className="text-muted-foreground">Track all customer communications</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Interaction
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <InteractionTable interactions={interactions} loading={loading} />
          </CardContent>
        </Card>

        <InteractionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSaved={handleInteractionSaved}
        />
      </div>
    </DashboardLayout>
  );
}
