
'use client'; // Added 'use client' as it uses Link and event handlers

import Link from 'next/link';
import { Scale, PlusCircle, Building, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation'; // To hide buttons on settings page

interface AppHeaderProps {
  onAddAppointmentClick: () => void;
  firmName?: string | null;
}

export function AppHeader({ onAddAppointmentClick, firmName }: AppHeaderProps) {
  const pathname = usePathname();
  const isSettingsPage = pathname === '/settings';

  return (
    <header className="bg-card shadow-md p-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
        <div className="flex flex-col items-center sm:items-start">
          <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer" aria-label="Go to Dashboard">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Lexis Reminder</h1>
          </Link>
          {firmName && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Building className="h-3 w-3" />
              <span>{firmName}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isSettingsPage && (
            <Button onClick={onAddAppointmentClick} variant="default">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Appointment
            </Button>
          )}
          <Link href="/settings" passHref>
            <Button variant="outline" size="icon" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
