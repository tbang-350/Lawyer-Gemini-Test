import type { Appointment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { CalendarDays, Clock } from 'lucide-react';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

export function UpcomingAppointments({ appointments, onAppointmentClick }: UpcomingAppointmentsProps) {
  const upcoming = appointments
    .filter(app => app.dateTime >= new Date())
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
    .slice(0, 5); // Show next 5

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-lg text-primary">Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground">No upcoming appointments.</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4"> {/* Adjust height as needed */}
            <ul className="space-y-3">
              {upcoming.map((app) => (
                <li key={app.id} 
                    className="p-3 border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                    onClick={() => onAppointmentClick(app)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onAppointmentClick(app)}
                >
                  <h3 className="font-semibold text-foreground">{app.title}</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>{format(app.dateTime, 'EEE, MMM d, yyyy')}</span>
                    <Clock className="h-4 w-4" />
                    <span>{format(app.dateTime, 'p')}</span>
                  </div>
                  {app.courtName && <p className="text-xs text-muted-foreground mt-1">Court: {app.courtName}</p>}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
