import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Users, Shield, Building2, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

export function UserManagement() {
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = () => {
    setIsInviting(true);
    setTimeout(() => {
      setIsInviting(false);
      toast.info('Invite functionality will open a modal setting roles and branches.');
    }, 400);
  };

  const users = [
    { id: '1', name: 'System Admin', email: 'admin@tareza.hq', role: 'Super Admin', branch: 'All Branches', status: 'active', avatar: 'SA' },
    { id: '2', name: 'Jane Doe', email: 'jane.manager@tareza.hq', role: 'Store Manager', branch: 'Harare CBD', status: 'active', avatar: 'JD' },
    { id: '3', name: 'Peter Cash', email: 'peter@tareza.hq', role: 'Cashier', branch: 'Harare CBD', status: 'invited', avatar: 'PC' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Users & Staff</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your team, invite users, and control their access levels.
          </p>
        </div>
        <Button onClick={handleInvite} disabled={isInviting} size="sm" className="bg-primary text-primary-foreground shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Invite User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-zinc-200/60 shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Total Users</p>
            <h4 className="text-2xl font-bold">12</h4>
          </div>
        </Card>
        <Card className="border-zinc-200/60 shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Shield className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Admins</p>
            <h4 className="text-2xl font-bold">3</h4>
          </div>
        </Card>
        <Card className="border-zinc-200/60 shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Building2 className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Active Cashiers</p>
            <h4 className="text-2xl font-bold">7</h4>
          </div>
        </Card>
      </div>

      <Card className="border-zinc-200/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Team Members</CardTitle>
            <Badge variant="outline" className="bg-white">3 / 25 Seats Used</Badge>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow>
                <TableHead className="w-[300px]">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Branch / Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-zinc-200 shadow-sm">
                        <AvatarFallback className="bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-600 font-semibold">{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 group-hover:text-primary transition-colors">{user.name}</span>
                        <span className="text-xs text-zinc-500 font-medium">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-zinc-700 flex items-center gap-1.5">
                      {user.role === 'Super Admin' && <Shield className="w-3.5 h-3.5 text-purple-500" />}
                      {user.role}
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-600">{user.branch}</TableCell>
                  <TableCell>
                    {user.status === 'active' ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending Invite</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900">
                        <MoreHorizontal className="w-4 h-4" />
                     </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
