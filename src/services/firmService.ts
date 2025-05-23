
'use server';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import type { LawFirm } from '@/types';

const FIRM_DETAILS_COLLECTION = 'firmInfo';
const FIRM_DETAILS_DOC_ID = 'mainDetails'; // Using a fixed ID for the single firm details document

export const getFirmDetails = async (): Promise<LawFirm | null> => {
  try {
    const firmRef = doc(db, FIRM_DETAILS_COLLECTION, FIRM_DETAILS_DOC_ID);
    const docSnap = await getDoc(firmRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LawFirm;
    }
    // If no details exist, return a default or null
    return { name: "Your Law Firm Name" }; // Default if not found
  } catch (error) {
    console.error("Error fetching firm details: ", error);
    return { name: "Error Loading Firm Name" }; // Fallback
  }
};

export const saveFirmDetails = async (firmData: Omit<LawFirm, 'id'>): Promise<void> => {
  try {
    const firmRef = doc(db, FIRM_DETAILS_COLLECTION, FIRM_DETAILS_DOC_ID);
    // Use setDoc with merge:true to create or update, or just updateDoc if sure it exists
    await setDoc(firmRef, firmData, { merge: true }); 
  } catch (error) {
    console.error("Error saving firm details: ", error);
    throw error;
  }
};
