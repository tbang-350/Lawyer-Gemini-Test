
'use server';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
  getDoc,
} from 'firebase/firestore';
import type { Appointment, AppointmentFormData } from '@/types';
import { combineDateAndTime } from '@/lib/utils';

// Helper to convert Firestore Timestamps in appointment data to JS Dates
const appointmentFromFirestore = (docSnap: any): Appointment => {
  const data = docSnap.data();
  
  // Ensure formData.date is converted from Timestamp to JS Date
  const formDataWithDate = data.formData ? {
    ...data.formData,
    date: data.formData.date && data.formData.date.toDate ? data.formData.date.toDate() : new Date(data.formData.date)
  } : undefined;

  return {
    id: docSnap.id,
    ...data,
    dateTime: (data.dateTime as Timestamp).toDate(), // Convert main dateTime
    formData: formDataWithDate,
  } as Appointment;
};

export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const appointmentsCol = collection(db, 'appointments');
    const q = query(appointmentsCol, orderBy('dateTime', 'asc'));
    const appointmentSnapshot = await getDocs(q);
    return appointmentSnapshot.docs.map(docSnap => appointmentFromFirestore(docSnap));
  } catch (error) {
    console.error("Error fetching appointments: ", error);
    return [];
  }
};

export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  try {
    const appointmentRef = doc(db, 'appointments', id);
    const docSnap = await getDoc(appointmentRef);
    if (docSnap.exists()) {
      return appointmentFromFirestore(docSnap);
    }
    return null;
  } catch (error) {
    console.error("Error fetching appointment by ID: ", error);
    return null;
  }
}

export const addAppointment = async (formData: AppointmentFormData): Promise<string> => {
  try {
    const appointmentDateTime = combineDateAndTime(formData.date, formData.time);
    const newAppointmentData = {
      title: formData.title,
      dateTime: Timestamp.fromDate(appointmentDateTime),
      description: formData.description || '',
      courtName: formData.courtName,
      caseNumber: formData.caseNumber,
      clientName: formData.clientName,
      assignedLawyerId: formData.assignedLawyerId,
      formData: { // Store the form data; Firestore converts formData.date (JS Date) to Timestamp
        ...formData,
        date: formData.date, // Ensure this is a JS Date object
      },
    };
    const docRef = await addDoc(collection(db, 'appointments'), newAppointmentData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding appointment: ", error);
    throw error; // Re-throw to be caught by caller
  }
};

export const updateAppointment = async (id: string, formData: AppointmentFormData): Promise<void> => {
  try {
    const appointmentRef = doc(db, 'appointments', id);
    const appointmentDateTime = combineDateAndTime(formData.date, formData.time);
    const updatedAppointmentData = {
      title: formData.title,
      dateTime: Timestamp.fromDate(appointmentDateTime),
      description: formData.description || '',
      courtName: formData.courtName,
      caseNumber: formData.caseNumber,
      clientName: formData.clientName,
      assignedLawyerId: formData.assignedLawyerId,
      formData: {
        ...formData,
        date: formData.date, // JS Date
      },
    };
    await updateDoc(appointmentRef, updatedAppointmentData);
  } catch (error) {
    console.error("Error updating appointment: ", error);
    throw error;
  }
};

export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    const appointmentRef = doc(db, 'appointments', id);
    await deleteDoc(appointmentRef);
  } catch (error) {
    console.error("Error deleting appointment: ", error);
    throw error;
  }
};
