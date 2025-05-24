
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
import Link from 'next/link'; // For navigating back


// Mock Data - In a real app, this would come from a global state or context
const initialLawyers: Lawyer[] = [
  { id: 'lawyer1', name: 'Alice Wonderland', email: 'alice@example.com' },
  { id: 'lawyer2', name: 'Bob The Builder', email: 'bob@example.com' },
  { id: 'lawyer3', name: 'Charlie Brown', email: 'charlie@example.com' },
];

const initialFirmDetails: LawFirm = {
  id: 'firm1',
  name: 'Lexis Legal Associates',
  address: '123 Law St, Legaltown, LS 45678',
  phone: '555-0101',
  email: 'contact@lexislegal.com'
};


export default function SettingsPage() {
  const { toast } = useToast();
  const [firmDetails, setFirmDetails] = useState<LawFirm>(initialFirmDetails);
  const [lawyers, setLawyers] = useState<Lawyer[]>(initialLawyers);
  const [isClient, setIsClient] = useState(false);

  const [newLawyerName, setNewLawyerName] = useState('');
  const [newLawyerEmail, setNewLawyerEmail] = useState('');

  useEffect(() => {
    setIsClient(true); 
    // In a real app, fetch firmDetails and lawyers here if they are not in global state
  }, []);


  const handleFirmDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFirmDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveFirmDetails = async () => {
    toast({ title: "Firm Details Updated (Mock)", description: "Successfully saved firm information (locally)." });
  };

  const handleAddLawyer = async () => {
    if (!newLawyerName.trim() || !newLawyerEmail.trim()) {
      toast({ title: "Error", description: "Lawyer name and email cannot be empty.", variant: "destructive" });
      return;
    }
    if (!newLawyerEmail.includes('@')) {
       toast({ title: "Error", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    const newLawyer: Lawyer = {
      id: Date.now().toString(), 
      name: newLawyerName.trim(),
      email: newLawyerEmail.trim()
    };
    setLawyers(prev => [...prev, newLawyer]);
    setNewLawyerName('');
    setNewLawyerEmail('');
    toast({ title: "Lawyer Added (Mock)", description: `${newLawyer.name} has been added (locally).` });
  };

  const handleDeleteLawyer = async (lawyerId: string) => {
    setLawyers(prev => prev.filter(lawyer => lawyer.id !== lawyerId));
    toast({ title: "Lawyer Removed (Mock)", description: "Lawyer has been removed (locally)." });
  };
  
  const dummyAddAppointmentFromSettings = () => { 
    toast({ title: "Info", description: "Add appointments from the main dashboard. This button is non-functional here."});
  };

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader 
        firmName={firmDetails.name} 
        onAddAppointmentClick={dummyAddAppointmentFromSettings} 
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Settings</h1>
            <Link href="/dashboard" passHref>
                <Button variant="outline">Back to Dashboard</Button>
            </Link>
        </div>

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
      </div>
    </div>
  );
}
