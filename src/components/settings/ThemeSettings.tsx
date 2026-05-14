import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function ThemeSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Themes & Branding</h3>
        <p className="text-sm text-zinc-500">Customize the look and feel of your workspace.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Select light, dark, or system theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-zinc-500">Theme configuration options will appear here.</div>
        </CardContent>
      </Card>
    </div>
  );
}
