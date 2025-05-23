
export interface Lawyer {
  id: string;
  name: string;
  email: string;
}

export interface LawFirm {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface AppointmentFormData {
  title: string;
  date: Date;
  time: string; // HH:mm format
  description: string;
  courtName?: string;
  caseNumber?: string;
  clientName?: string;
  assignedLawyerId?: string; 
  // Reminder settings are conceptual for now, actual email sending is out of scope
  remindBeforeDays?: number; // e.g., 1, 3, 7
  remindOnDayAt?: string; // HH:mm format, optional
}

export interface Appointment {
  id: string;
  title: string;
  dateTime: Date;
  description: string;
  courtName?: string;
  caseNumber?: string;
  clientName?: string;
  assignedLawyerId?: string;
  // reminder settings from form can be stored if needed for backend processing
  formData?: AppointmentFormData;
}
