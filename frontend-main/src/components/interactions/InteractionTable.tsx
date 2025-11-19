import { Interaction } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function InteractionTable({ interactions, loading }: { interactions: Interaction[]; loading: boolean }) {
  if (loading) return <div className="p-8">Loading...</div>;
  return <Table><TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Subject</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>{interactions.map((i) => <TableRow key={i.id}><TableCell><Badge>{i.type}</Badge></TableCell><TableCell>{i.subject}</TableCell><TableCell>{new Date(i.created_at).toLocaleDateString()}</TableCell></TableRow>)}</TableBody></Table>;
}
