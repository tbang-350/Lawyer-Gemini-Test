
'use client';

import { useState, useEffect } from 'react';
import type { Appointment, Lawyer } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { CalendarDays, Clock, Briefcase, User, Building, UserCheck, BellRing, Edit3, Trash2 } from 'lucide-react';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  selectedDate: Date | undefined;
  lawyers: Lawyer[];
  onEdit: (appointment: Appointment) => void;
  onDeleteConfirmation: (appointmentId: string) => void;
}

export function AppointmentDetailsModal({ 
  isOpen, 
  onClose, 
  appointments, 
  selectedDate, 
  lawyers,
  onEdit,
  onDeleteConfirmation
}: AppointmentDetailsModalProps) {
  const [detailedAppointment, setDetailedAppointment] = useState<Appointment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (appointments.length === 1) {
        setDetailedAppointment(appointments[0]);
      } else {
        // If multiple appointments, initially show list unless one was already detailed
        // This part can be tricky if the modal re-opens for the same date
        // For simplicity, if it's a new open or date change, reset detailedAppointment
        // if (!detailedAppointment || (detailedAppointment && !appointments.find(app => app.id === detailedAppointment.id))) {
        //    setDetailedAppointment(null);
        // }
      }
    } else {
      setDetailedAppointment(null); // Reset when modal closes
    }
  }, [isOpen, appointments]); // Removed detailedAppointment from dep array to avoid loops on selection
  
  // Explicitly set detailed appointment if only one
  useEffect(() => {
    if (isOpen && appointments.length === 1) {
        setDetailedAppointment(appointments[0]);
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
    setDetailedAppointment(null); // Ensure detailed view is reset
    onClose();
  }

  const handleEditClick = () => {
    if (currentAppointmentToDisplay) {
      onEdit(currentAppointmentToDisplay);
      // No need to call onClose() here, as the parent will close this modal
      // and open the edit modal.
    }
  };

  const handleDeleteConfirm = () => {
    if (currentAppointmentToDisplay) {
      onDeleteConfirmation(currentAppointmentToDisplay.id);
    }
    setIsDeleteDialogOpen(false); // Close alert dialog
    // onClose(); // Parent will handle closing this modal if needed after delete
  };


  const getAssignedLawyer = (lawyerId?: string): Lawyer | undefined => {
    return lawyers.find(l => l.id === lawyerId);
  }

  const assignedLawyer = currentAppointmentToDisplay ? getAssignedLawyer(currentAppointmentToDisplay.assignedLawyerId) : undefined;

  const reminderText = () => {
    if (!currentAppointmentToDisplay || !currentAppointmentToDisplay.formData) return null;
    
    const { remindBeforeDays, remindOnDayAt } = currentAppointmentToDisplay.formData;
    if (!remindBeforeDays && !remindOnDayAt) return null;

    let reminders = [];
    if (remindBeforeDays) {
      reminders.push(`Set for ${remindBeforeDays} day(s) before.`);
    }
    if (remindOnDayAt) {
      reminders.push(`Set for appointment day at ${remindOnDayAt}.`);
    }
    return reminders.join(' ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">
            {selectedDate ? `Appointments for ${format(selectedDate, 'PPP')}` : 'Appointment Details'}
          </DialogTitle>
          {showList && <DialogDescription>Select an appointment to view details.</DialogDescription>}
          {!showList && !currentAppointmentToDisplay && <DialogDescription>No appointment selected.</DialogDescription>}
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
                 <Button variant="ghost" onClick={handleBackToList} className="mb-0 text-sm h-auto py-1 px-2">
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
              
              {reminderText() && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-start gap-2">
                    <BellRing className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <div>
                        <h3 className="font-semibold text-md text-foreground leading-tight">Reminder:</h3>
                        <p className="text-sm text-muted-foreground">Scheduled. {reminderText()}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
             !showList && <p className="py-4 text-muted-foreground">Select an appointment to see details or no appointments for this day.</p>
          )}
        </ScrollArea>
        <DialogFooter className="pt-4 border-t mt-auto flex flex-row justify-between w-full">
            {currentAppointmentToDisplay && (
              <div className="flex gap-2">
                 <Button variant="outline" onClick={handleEditClick}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Button>
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the appointment
                        "{currentAppointmentToDisplay?.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
            <Button variant="outline" onClick={handleClose} className={!currentAppointmentToDisplay ? 'w-full' : ''}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
