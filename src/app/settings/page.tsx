
// src/app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Lawyer, LawFirm } from '@/types';
import { AppHeader } from '@/components/common/AppHeader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Save, Trash2, Loader2 } from 'lucide-react';

// Initial mock data - in a real app, this would come from a data store or API
const initialMockLawFirm: LawFirm = {
  name: 'Justice & Associates LLP',
  address: '123 Legal Lane, Lawsville, LS 45678',
  phone: '555-0123',
  email: 'contact@justiceassociates.com'
};

const initialMockLawyers: Lawyer[] = [
  { id: 'lawyer1', name: 'Alice Advocate', email: 'alice@examplefirm.com' },
  { id: 'lawyer2', name: 'Bob Barrister', email: 'bob@examplefirm.com' },
  { id: 'lawyer3', name: 'Carol Counselor', email: 'carol@examplefirm.com' },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [firmDetails, setFirmDetails] = useState<LawFirm>(initialMockLawFirm);
  const [lawyers, setLawyers] = useState<Lawyer[]>(initialMockLawyers);

  const [newLawyerName, setNewLawyerName] = useState('');
  const [newLawyerEmail, setNewLawyerEmail] = useState('');

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFirmDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFirmDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveFirmDetails = () => {
    // In a real app, send this to a backend
    console.log("Firm details saved:", firmDetails);
    toast({ title: "Firm Details Updated", description: "Successfully saved firm information." });
  };

  const handleAddLawyer = () => {
    if (!newLawyerName.trim() || !newLawyerEmail.trim()) {
      toast({ title: "Error", description: "Lawyer name and email cannot be empty.", variant: "destructive" });
      return;
    }
    if (!newLawyerEmail.includes('@')) {
       toast({ title: "Error", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    const newLawyer: Lawyer = {
      id: `lawyer${new Date().getTime()}`, 
      name: newLawyerName.trim(),
      email: newLawyerEmail.trim(),
    };
    setLawyers(prev => [...prev, newLawyer]);
    setNewLawyerName('');
    setNewLawyerEmail('');
    toast({ title: "Lawyer Added", description: `${newLawyer.name} has been added.` });
  };

  const handleDeleteLawyer = (lawyerId: string) => {
    setLawyers(prev => prev.filter(lawyer => lawyer.id !== lawyerId));
    toast({ title: "Lawyer Removed", description: "Lawyer has been removed." });
  };
  
  const dummyAddAppointment = () => { console.log("Add appointment clicked from settings - no-op"); };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader firmName={firmDetails.name} onAddAppointmentClick={dummyAddAppointment} />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-primary mb-8">Settings</h1>

        {!isClient && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Loading settings...</p>
          </div>
        )}

        {isClient && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Firm Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Firm Details</CardTitle>
                <CardDescription>Manage your law firm's information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="firmName">Firm Name</Label>
                  <Input id="firmName" name="name" value={firmDetails.name} onChange={handleFirmDetailsChange} />
                </div>
                <div>
                  <Label htmlFor="firmAddress">Address</Label>
                  <Input id="firmAddress" name="address" value={firmDetails.address || ''} onChange={handleFirmDetailsChange} />
                </div>
                <div>
                  <Label htmlFor="firmPhone">Phone</Label>
                  <Input id="firmPhone" name="phone" value={firmDetails.phone || ''} onChange={handleFirmDetailsChange} />
                </div>
                <div>
                  <Label htmlFor="firmEmail">Email</Label>
                  <Input id="firmEmail" name="email" type="email" value={firmDetails.email || ''} onChange={handleFirmDetailsChange} />
                </div>
                <Button onClick={handleSaveFirmDetails} className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Save Firm Details
                </Button>
              </CardContent>
            </Card>

            {/* Lawyer Management Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Manage Lawyers</CardTitle>
                <CardDescription>Onboard new lawyers and view existing ones.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6 p-4 border rounded-md">
                  <h3 className="text-lg font-semibold">Add New Lawyer</h3>
                  <div>
                    <Label htmlFor="newLawyerName">Name</Label>
                    <Input id="newLawyerName" value={newLawyerName} onChange={(e) => setNewLawyerName(e.target.value)} placeholder="e.g., Jane Doe" />
                  </div>
                  <div>
                    <Label htmlFor="newLawyerEmail">Email</Label>
                    <Input id="newLawyerEmail" type="email" value={newLawyerEmail} onChange={(e) => setNewLawyerEmail(e.target.value)} placeholder="e.g., jane.doe@example.com" />
                  </div>
                  <Button onClick={handleAddLawyer} className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Lawyer
                  </Button>
                </div>

                <h3 className="text-lg font-semibold mb-2">Current Lawyers ({lawyers.length})</h3>
                {lawyers.length > 0 ? (
                  <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {lawyers.map(lawyer => (
                      <li key={lawyer.id} className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
                        <div>
                          <p className="font-medium">{lawyer.name}</p>
                          <p className="text-sm text-muted-foreground">{lawyer.email}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteLawyer(lawyer.id)} aria-label={`Remove ${lawyer.name}`}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No lawyers onboarded yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
