import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, AlertTriangle, CreditCard } from 'lucide-react';

export function BillingSettings() {
  // In a real app we would load the current plan from supabase' businesses table 
  // Let's implement the UI for them to see what it requires
  
  const planStatus = 'GRACE_PERIOD';
  const expiresAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
  const gracePeriodEnd = new Date(expiresAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  const daysLeftInGrace = Math.floor((gracePeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing & Subscription</h3>
        <p className="text-sm text-zinc-500">Manage your subscription plan, branches, and user limits.</p>
      </div>

      <Card className={planStatus === 'GRACE_PERIOD' ? 'border-amber-300 bg-amber-50' : ''}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                Current Status: <Badge variant={planStatus === 'ACTIVE' ? 'default' : 'destructive'} className="uppercase">{'STARTER - OVERDUE'}</Badge>
              </CardTitle>
              <CardDescription className={planStatus === 'GRACE_PERIOD' ? "text-amber-700 mt-2" : "mt-2"}>
                {planStatus === 'GRACE_PERIOD' ? (
                  <span className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="h-4 w-4" /> You are in a 7-day grace period. {daysLeftInGrace} days left before account is locked.
                  </span>
                ) : (
                  `Your subscription is active.`
                )}
              </CardDescription>
            </div>
            <Button variant="outline"><CreditCard className="w-4 h-4 mr-2" /> Update Payment Method</Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <Card className="relative overflow-hidden border-zinc-200">
          <CardHeader>
            <CardTitle>Starter</CardTitle>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold">
              $15
              <span className="ml-1 text-xl font-medium text-zinc-500">/mo</span>
            </div>
            <CardDescription className="pt-2">Perfect for small, single-location shops.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 shrink-0">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 1 Branch / Warehouse</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 2 User Accounts</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> All Core Modules</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Standard Support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Upgrade to Starter</Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="relative overflow-hidden border-primary shadow-lg scale-[1.02]">
          <div className="absolute top-0 right-[-2.5rem] bg-primary text-primary-foreground text-xs font-bold px-10 py-1 rotate-45">
            POPULAR
          </div>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold">
              $45
              <span className="ml-1 text-xl font-medium text-zinc-500">/mo</span>
            </div>
            <CardDescription className="pt-2">For growing multi-location retailers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 shrink-0">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 3 Branches</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> up to 10 User Accounts</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> All Core Modules</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> ZIMRA Fiscalisation</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Upgrade to Pro</Button>
          </CardFooter>
        </Card>

        {/* Enterprise Plan */}
        <Card className="relative overflow-hidden border-zinc-200">
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold">
              $99
              <span className="ml-1 text-xl font-medium text-zinc-500">/mo</span>
            </div>
            <CardDescription className="pt-2">Unlimited power for huge operations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 shrink-0">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Branches</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Users</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Custom API Access</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority 24/7 Support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Upgrade to Enterprise</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
