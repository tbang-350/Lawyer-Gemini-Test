
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import type { AppointmentFormData, Lawyer } from '@/types';
import { Button } from '../ui/button'; // Added for dynamic button text

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAppointment: (data: AppointmentFormData, id?: string) => void;
  lawyers: Lawyer[];
  initialData?: AppointmentFormData;
  editingAppointmentId?: string;
}

export function AddAppointmentModal({ 
  isOpen, 
  onClose, 
  onSaveAppointment, 
  lawyers, 
  initialData, 
  editingAppointmentId 
}: AddAppointmentModalProps) {
  
  const handleSubmit = (data: AppointmentFormData) => {
    onSaveAppointment(data, editingAppointmentId);
    onClose(); 
  };

  const dialogTitle = editingAppointmentId ? "Edit Appointment" : "Add New Appointment";
  const dialogDescription = editingAppointmentId 
    ? "Update the details for this appointment."
    : "Fill in the details below to schedule a new court appointment.";
  const submitButtonText = editingAppointmentId ? "Update Appointment" : "Save Appointment";


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <AppointmentForm 
          onSubmit={handleSubmit} 
          onCancel={onClose} 
          lawyers={lawyers} 
          initialData={initialData}
          submitButtonText={submitButtonText} // Pass dynamic button text
        />
      </DialogContent>
    </Dialog>
  );
}
