import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security & Backups</h3>
        <p className="text-sm text-zinc-500">Manage 2FA, data retention, and system security policies.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Security Policies</CardTitle>
          <CardDescription>Configure password strength, IP allowances, and backups.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-zinc-500">Security configuration options will appear here.</div>
        </CardContent>
      </Card>
    </div>
  );
}
