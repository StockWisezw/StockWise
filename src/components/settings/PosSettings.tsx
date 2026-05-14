import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export function PosSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">POS Operational Settings</h3>
        <p className="text-sm text-zinc-500">
          Control point of sale behaviors, receipt printing, and cashier restrictions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Till Management</CardTitle>
          <CardDescription>Configure how shifts and cash drawers operate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label>Require Till Opening Float</Label>
              <span className="text-sm text-zinc-500">
                Cashiers must declare their opening drawer balance before starting a shift.
              </span>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label>Blind Closeout</Label>
              <span className="text-sm text-zinc-500">
                Hide system totals when closing till, forcing a manual cash count.
              </span>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Checkout Behavior</CardTitle>
          <CardDescription>Rules for scanning, pricing, and completing sales.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label>Enable Price Overrides at POS</Label>
              <span className="text-sm text-zinc-500">
                Allow authorized cashiers to manually change item prices during checkout.
              </span>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label>Auto-Print Receipts</Label>
              <span className="text-sm text-zinc-500">
                Automatically fire the receipt printer when a transaction is completed.
              </span>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
