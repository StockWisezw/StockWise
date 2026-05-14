import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-zinc-500">Manage alerts and automated communication channels.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Alert Preferences</CardTitle>
          <CardDescription>Configure email, SMS, and WhatsApp alerts for system events.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-zinc-500">Notification preferences will appear here.</div>
        </CardContent>
      </Card>
    </div>
  );
}
