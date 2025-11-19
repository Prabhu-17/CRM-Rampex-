import { Contract } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function ContractTable({ contracts, loading }: { contracts: Contract[]; loading: boolean }) {
  if (loading) return <div className="p-8">Loading...</div>;
  return <Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Value</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{contracts.map((c) => <TableRow key={c.id}><TableCell>{c.title}</TableCell><TableCell>${c.value?.toLocaleString()}</TableCell><TableCell><Badge>{c.status}</Badge></TableCell></TableRow>)}</TableBody></Table>;
}
