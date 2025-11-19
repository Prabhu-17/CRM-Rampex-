import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lead } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
  onSaved: () => void;
}

export function LeadDialog({ open, onOpenChange, lead, onSaved }: LeadDialogProps) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      value: Number(formData.get('value')),
      stage: formData.get('stage') as any,
      created_by: user?.id,
      assigned_to: user?.id,
    };

    try {
      if (lead) {
        await supabase.from('leads').update(data).eq('id', lead.id);
      } else {
        await supabase.from('leads').insert(data);
      }
      onSaved();
    } catch (error) {
      console.error('Error saving lead:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lead ? 'Edit Lead' : 'New Lead'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={lead?.title} required />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" defaultValue={lead?.company} />
          </div>
          <div>
            <Label htmlFor="value">Value</Label>
            <Input id="value" name="value" type="number" defaultValue={lead?.value} />
          </div>
          <div>
            <Label htmlFor="stage">Stage</Label>
            <Input id="stage" name="stage" defaultValue={lead?.stage || 'new'} />
          </div>
          <Button type="submit" disabled={loading}>Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
