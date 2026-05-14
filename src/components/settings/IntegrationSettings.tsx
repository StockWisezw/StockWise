import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integrations</h3>
        <p className="text-sm text-zinc-500">Connect third-party services, payment gateways, and accounting software.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Connected Services</CardTitle>
          <CardDescription>Manage active API integrations and webhooks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-zinc-500">Integration configuration options will appear here.</div>
        </CardContent>
      </Card>
    </div>
  );
}
