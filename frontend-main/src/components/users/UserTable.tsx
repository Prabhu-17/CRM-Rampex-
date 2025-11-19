import { Profile } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function UserTable({ users, loading }: { users: Profile[]; loading: boolean; onRefresh: () => void }) {
  if (loading) return <div className="p-8">Loading...</div>;
  return (
    <Table>
      <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead></TableRow></TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.full_name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell><Badge>{user.role}</Badge></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
