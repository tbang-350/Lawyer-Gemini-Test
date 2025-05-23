
export interface Lawyer {
  id: string; // Can be mock ID or Firestore document ID
  name: string;
  email: string;
}

export interface LawFirm {
  id?: string; // Can be mock ID or Firestore document ID
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface AppointmentFormData {
  title: string;
  date: Date; // JS Date object
  time: string; // HH:mm format
  description: string; // Changed from description? to description
  courtName?: string;
  caseNumber?: string;
  clientName?: string;
  assignedLawyerId?: string; 
  remindBeforeDays?: number;
  remindOnDayAt?: string; 
}

export interface Appointment {
  id: string; // Can be mock ID or Firestore document ID
  title: string;
  dateTime: Date; // JS Date object
  description: string; // Changed from description? to description
  courtName?: string;
  caseNumber?: string;
  clientName?: string;
  assignedLawyerId?: string;
  formData: AppointmentFormData; 
}
