import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type AppointmentFormData } from '@/types'; // Ensure type is imported if used here

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to combine date and time string into a Date object
export const combineDateAndTime = (date: Date, time: string): Date => {
  if (!date || !time) { // Basic guard
    // Consider throwing an error or returning a sensible default/error state
    // For now, returning the original date if time is missing, or a new Date if date is missing
    return date || new Date(); 
  }
  const [hours, minutes] = time.split(':').map(Number);
  const newDate = new Date(date); // Create a new Date object to avoid mutating the original
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};
