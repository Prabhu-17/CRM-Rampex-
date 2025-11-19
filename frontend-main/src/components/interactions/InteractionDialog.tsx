import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export function InteractionDialog({ open, onOpenChange, onSaved }: any) {
  const { user } = useAuthStore();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await supabase.from('interactions').insert({ type: 'note', subject: formData.get('subject') as string, created_by: user?.id });
    onSaved();
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>New Interaction</DialogTitle></DialogHeader><form onSubmit={handleSubmit} className="space-y-4"><div><Label>Subject</Label><Input name="subject" required /></div><Button type="submit">Save</Button></form></DialogContent></Dialog>;
}
