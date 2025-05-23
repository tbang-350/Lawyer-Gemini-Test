// This file is no longer needed for mock data and can be removed or kept for future Firebase integration.
// 'use server';
// import { db } from '@/lib/firebase';
// import {
//   collection,
//   addDoc,
//   getDocs,
//   doc,
//   updateDoc,
//   deleteDoc,
//   query,
//   orderBy,
//   getDoc
// } from 'firebase/firestore';
// import type { Lawyer } from '@/types';

// const lawyerFromFirestore = (docSnap: any): Lawyer => {
//   const data = docSnap.data();
//   return {
//     id: docSnap.id,
//     name: data.name,
//     email: data.email,
//   } as Lawyer;
// }

// export const getLawyers = async (): Promise<Lawyer[]> => {
//   try {
//     const lawyersCol = collection(db, 'lawyers');
//     const q = query(lawyersCol, orderBy('name', 'asc'));
//     const lawyerSnapshot = await getDocs(q);
//     return lawyerSnapshot.docs.map(docSnap => lawyerFromFirestore(docSnap));
//   } catch (error) {
//     console.error("Error fetching lawyers: ", error);
//     return [];
//   }
// };

// export const addLawyer = async (lawyerData: Omit<Lawyer, 'id'>): Promise<string> => {
//   try {
//     const docRef = await addDoc(collection(db, 'lawyers'), lawyerData);
//     return docRef.id;
//   } catch (error) {
//     console.error("Error adding lawyer: ", error);
//     throw error;
//   }
// };

// export const updateLawyer = async (id: string, lawyerData: Partial<Omit<Lawyer, 'id'>>): Promise<void> => {
//   try {
//     const lawyerRef = doc(db, 'lawyers', id);
//     await updateDoc(lawyerRef, lawyerData);
//   } catch (error) {
//     console.error("Error updating lawyer: ", error);
//     throw error;
//   }
// };

// export const deleteLawyer = async (id: string): Promise<void> => {
//   try {
//     const lawyerRef = doc(db, 'lawyers', id);
//     await deleteDoc(lawyerRef);
//   } catch (error) {
//     console.error("Error deleting lawyer: ", error);
//     throw error;
//   }
// };
