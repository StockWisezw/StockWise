import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function LocalizationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Localization</h3>
        <p className="text-sm text-zinc-500">Configure language, timezones, and regional formatting.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Regional Preferences</CardTitle>
          <CardDescription>Set how dates, times, and numbers are displayed.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-zinc-500">Localization configuration options will appear here.</div>
        </CardContent>
      </Card>
    </div>
  );
}
