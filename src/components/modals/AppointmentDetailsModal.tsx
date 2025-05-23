
'use client';

import { useState, useEffect } from 'react';
import type { Appointment, Lawyer } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { CalendarDays, Clock, Briefcase, User, Building, UserCheck, BellRing } from 'lucide-react';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  selectedDate: Date | undefined;
  lawyers: Lawyer[];
}

export function AppointmentDetailsModal({ isOpen, onClose, appointments, selectedDate, lawyers }: AppointmentDetailsModalProps) {
  const [detailedAppointment, setDetailedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (appointments.length === 1) {
        setDetailedAppointment(appointments[0]);
      } else {
        setDetailedAppointment(null);
      }
    } else {
      setDetailedAppointment(null);
    }
  }, [isOpen, appointments]);
  
  const showList = appointments.length > 1 && !detailedAppointment;
  const currentAppointmentToDisplay = detailedAppointment || (appointments.length === 1 ? appointments[0] : null);
  
  const handleSelectAppointment = (app: Appointment) => {
    setDetailedAppointment(app);
  };

  const handleBackToList = () => {
    setDetailedAppointment(null);
  };
  
  const handleClose = () => {
    onClose();
  }

  const getAssignedLawyer = (lawyerId?: string): Lawyer | undefined => {
    return lawyers.find(l => l.id === lawyerId);
  }

  const assignedLawyer = currentAppointmentToDisplay ? getAssignedLawyer(currentAppointmentToDisplay.assignedLawyerId) : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">
            {selectedDate ? `Appointments for ${format(selectedDate, 'PPP')}` : 'Appointment Details'}
          </DialogTitle>
          {showList && <DialogDescription>Select an appointment to view details.</DialogDescription>}
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-2">
          {showList ? (
            <ul className="space-y-2 py-4">
              {appointments.map((app) => (
                <li key={app.id}>
                  <Button variant="outline" className="w-full justify-start text-left h-auto py-2" onClick={() => handleSelectAppointment(app)}>
                    <div className="flex flex-col">
                      <span className="font-semibold">{app.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(app.dateTime, 'p')}
                        {app.courtName && ` - ${app.courtName}`}
                      </span>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          ) : currentAppointmentToDisplay ? (
            <div className="space-y-4 py-4">
              {appointments.length > 1 && detailedAppointment && (
                 <Button variant="ghost" onClick={handleBackToList} className="mb-2 text-sm">
                   &larr; Back to list
                 </Button>
              )}
              <h2 className="text-2xl font-semibold text-primary">{currentAppointmentToDisplay.title}</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-accent" />
                  <span>{format(currentAppointmentToDisplay.dateTime, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <span>{format(currentAppointmentToDisplay.dateTime, 'p')} (local time)</span>
                </div>
                {currentAppointmentToDisplay.courtName && (
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-accent" />
                    <span>Court: {currentAppointmentToDisplay.courtName}</span>
                  </div>
                )}
                {currentAppointmentToDisplay.caseNumber && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-accent" />
                    <span>Case No: {currentAppointmentToDisplay.caseNumber}</span>
                  </div>
                )}
                {currentAppointmentToDisplay.clientName && (
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    <span>Client: {currentAppointmentToDisplay.clientName}</span>
                  </div>
                )}
                {assignedLawyer && (
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-accent" />
                    <span>Assigned Lawyer: {assignedLawyer.name} ({assignedLawyer.email})</span>
                  </div>
                )}
              </div>

              {currentAppointmentToDisplay.description && (
                <div>
                  <h3 className="font-semibold text-md text-foreground mb-1 mt-3">Details:</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-secondary/30 p-3 rounded-md">
                    {currentAppointmentToDisplay.description}
                  </p>
                </div>
              )}
              {currentAppointmentToDisplay.formData && (currentAppointmentToDisplay.formData.remindBeforeDays || currentAppointmentToDisplay.formData.remindOnDayAt) && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <BellRing className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold text-md text-foreground">Reminder Settings:</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground list-disc list-inside pl-5 space-y-1">
                    {currentAppointmentToDisplay.formData.remindBeforeDays && (
                      <li>
                        Email reminder set for {currentAppointmentToDisplay.formData.remindBeforeDays} day(s) before the appointment.
                      </li>
                    )}
                    {currentAppointmentToDisplay.formData.remindOnDayAt && (
                      <li>
                        Email reminder set for the day of the appointment at {currentAppointmentToDisplay.formData.remindOnDayAt}.
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="py-4 text-muted-foreground">No appointments for this day, or no appointment selected.</p>
          )}
        </ScrollArea>
        <div className="pt-4 border-t mt-auto">
            <Button variant="outline" onClick={handleClose} className="w-full">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
