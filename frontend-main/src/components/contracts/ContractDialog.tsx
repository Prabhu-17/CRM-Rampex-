import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export function ContractDialog({ open, onOpenChange, onSaved }: any) {
  const { user } = useAuthStore();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await supabase.from('contracts').insert({ title: formData.get('title') as string, value: Number(formData.get('value')), status: 'draft', created_by: user?.id });
    onSaved();
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>New Contract</DialogTitle></DialogHeader><form onSubmit={handleSubmit} className="space-y-4"><div><Label>Title</Label><Input name="title" required /></div><div><Label>Value</Label><Input name="value" type="number" /></div><Button type="submit">Save</Button></form></DialogContent></Dialog>;
}
