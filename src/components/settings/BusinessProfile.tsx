import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Camera, Building2, Save } from 'lucide-react';
import { toast } from 'sonner';

export function BusinessProfile() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Business profile updated successfully');
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Business Profile</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Update your company details, logo, and registration information.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground shadow-sm px-6">
          {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Profile</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="border-zinc-200/60 shadow-sm h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Company Logo</CardTitle>
              <CardDescription>
                This logo will appear on receipts and the main dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
              <Avatar className="h-32 w-32 border-4 border-white shadow-sm ring-1 ring-zinc-200">
                <AvatarImage src="https://ui-avatars.com/api/?name=Tareza&background=0D8ABC&color=fff&size=128" />
                <AvatarFallback className="bg-zinc-100 text-zinc-400">
                  <Camera className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center space-y-2 text-center">
                <Button variant="outline" size="sm" className="w-full">Choose new picture</Button>
                <p className="text-xs text-zinc-500">JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-zinc-200/60 shadow-sm">
            <CardHeader className="pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-zinc-400" />
                <CardTitle className="text-lg">General Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="font-semibold text-zinc-900">Company Name</Label>
                <Input id="companyName" defaultValue="Tareza Retail" className="h-11 bg-zinc-50/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vatNumber" className="font-semibold text-zinc-900">VAT / TIN Number</Label>
                  <Input id="vatNumber" placeholder="e.g. 123456789" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regNumber" className="font-semibold text-zinc-900">Company Registration</Label>
                  <Input id="regNumber" placeholder="e.g. 1234/2023" className="h-11" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-zinc-900">Contact Email</Label>
                  <Input id="email" type="email" defaultValue="admin@tareza.hq" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-semibold text-zinc-900">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+263 77 123 4567" className="h-11" />
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <Label className="font-semibold text-zinc-900">Invoice & Receipt Footer</Label>
                <p className="text-xs text-zinc-500 mb-2">Text to display at the bottom of customer receipts.</p>
                <Textarea placeholder="Thank you for your business!" className="min-h-[100px] resize-y" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
