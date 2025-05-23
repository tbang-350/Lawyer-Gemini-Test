import { Scale, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  onAddAppointmentClick: () => void;
}

export function AppHeader({ onAddAppointmentClick }: AppHeaderProps) {
  return (
    <header className="bg-card shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Scale className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Lexis Reminder</h1>
        </div>
        <Button onClick={onAddAppointmentClick} variant="default">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Appointment
        </Button>
      </div>
    </header>
  );
}
