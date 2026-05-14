import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

export function RolesPermissions() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Roles & Permissions</h3>
          <p className="text-sm text-zinc-500">
            Configure access control limits and RBAC profiles.
          </p>
        </div>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Create Role</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Roles</CardTitle>
          <CardDescription>Default and custom roles available in your tenant.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>System Role</TableHead>
                <TableHead>Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">System Admin</TableCell>
                <TableCell><Badge variant="secondary">Yes</Badge></TableCell>
                <TableCell>1</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" disabled>Protected</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cashier</TableCell>
                <TableCell><Badge variant="secondary">Yes</Badge></TableCell>
                <TableCell>4</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit Permissions</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
