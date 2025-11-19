import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Contract } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ContractTable } from '@/components/contracts/ContractTable';
import { ContractDialog } from '@/components/contracts/ContractDialog';

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data as Contract[]);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch contracts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContractSaved = () => {
    fetchContracts();
    setDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contracts</h1>
            <p className="text-muted-foreground">Manage all your business contracts</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <ContractTable contracts={contracts} loading={loading} />
          </CardContent>
        </Card>

        <ContractDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSaved={handleContractSaved}
        />
      </div>
    </DashboardLayout>
  );
}
