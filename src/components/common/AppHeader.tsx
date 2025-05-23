
import { Scale, PlusCircle, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  onAddAppointmentClick: () => void;
  firmName?: string;
}

export function AppHeader({ onAddAppointmentClick, firmName }: AppHeaderProps) {
  return (
    <header className="bg-card shadow-md p-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
        <div className="flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Lexis Reminder</h1>
          </div>
          {firmName && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Building className="h-3 w-3" />
              <span>{firmName}</span>
            </div>
          )}
        </div>
        <Button onClick={onAddAppointmentClick} variant="default">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Appointment
        </Button>
      </div>
    </header>
  );
}
