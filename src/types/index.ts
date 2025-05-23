
export interface Lawyer {
  id: string; // Firestore document ID
  name: string;
  email: string;
}

export interface LawFirm {
  id?: string; // Firestore document ID (if we decide to make it a doc, e.g. "main")
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface AppointmentFormData {
  title: string;
  date: Date; // JS Date object
  time: string; // HH:mm format
  description: string;
  courtName?: string;
  caseNumber?: string;
  clientName?: string;
  assignedLawyerId?: string; 
  remindBeforeDays?: number;
  remindOnDayAt?: string; 
}

export interface Appointment {
  id: string; // Firestore document ID
  title: string;
  dateTime: Date; // JS Date object (converted from Firestore Timestamp)
  description: string;
  courtName?: string;
  caseNumber?: string;
  clientName?: string;
  assignedLawyerId?: string;
  formData: AppointmentFormData; // Store the original form data, its 'date' field is a JS Date
                                // Firestore will convert formData.date to Timestamp automatically on save
                                // and we'll convert it back to JS Date on fetch.
}
