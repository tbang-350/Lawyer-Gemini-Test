// This file is no longer needed for mock data and can be removed or kept for future Firebase integration.
// 'use server';
// import { db } from '@/lib/firebase';
// import {
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
// } from 'firebase/firestore';
// import type { LawFirm } from '@/types';

// const FIRM_DETAILS_COLLECTION = 'firmInfo';
// const FIRM_DETAILS_DOC_ID = 'mainDetails'; 

// export const getFirmDetails = async (): Promise<LawFirm | null> => {
//   try {
//     const firmRef = doc(db, FIRM_DETAILS_COLLECTION, FIRM_DETAILS_DOC_ID);
//     const docSnap = await getDoc(firmRef);
//     if (docSnap.exists()) {
//       return { id: docSnap.id, ...docSnap.data() } as LawFirm;
//     }
//     return { name: "Your Law Firm Name" }; 
//   } catch (error) {
//     console.error("Error fetching firm details: ", error);
//     return { name: "Error Loading Firm Name" }; 
//   }
// };

// export const saveFirmDetails = async (firmData: Omit<LawFirm, 'id'>): Promise<void> => {
//   try {
//     const firmRef = doc(db, FIRM_DETAILS_COLLECTION, FIRM_DETAILS_DOC_ID);
//     await setDoc(firmRef, firmData, { merge: true }); 
//   } catch (error) {
//     console.error("Error saving firm details: ", error);
//     throw error;
//   }
// };
