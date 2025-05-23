
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

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (data: AppointmentFormData) => void;
  lawyers: Lawyer[];
}

export function AddAppointmentModal({ isOpen, onClose, onAddAppointment, lawyers }: AddAppointmentModalProps) {
  const handleSubmit = (data: AppointmentFormData) => {
    onAddAppointment(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">Add New Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details below to schedule a new court appointment.
          </DialogDescription>
        </DialogHeader>
        <AppointmentForm 
          onSubmit={handleSubmit} 
          onCancel={onClose} 
          lawyers={lawyers} 
        />
      </DialogContent>
    </Dialog>
  );
}
