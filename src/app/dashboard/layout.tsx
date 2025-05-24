
'use client';

import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/components/common/AppHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firmName, setFirmName] = useState("Lexis Reminder");
  const [addAppointmentHandler, setAddAppointmentHandler] = useState<() => void>(() => () => {});

  useEffect(() => {
    // This is a mechanism to get props from the child page (DashboardPage)
    // In a real app with auth/global state, this would be handled more centrally.
    if (typeof window !== 'undefined' && (window as any).getFirmNameForHeader) {
      setFirmName((window as any).getFirmNameForHeader());
    }
    if (typeof window !== 'undefined' && (window as any).getAddAppointmentClickHandlerForHeader) {
      setAddAppointmentHandler(() => (window as any).getAddAppointmentClickHandlerForHeader());
    }
    // Re-check if the page re-renders and these become available
    const interval = setInterval(() => {
        if (typeof window !== 'undefined' && (window as any).getFirmNameForHeader && firmName !== (window as any).getFirmNameForHeader()) {
            setFirmName((window as any).getFirmNameForHeader());
        }
         if (typeof window !== 'undefined' && (window as any).getAddAppointmentClickHandlerForHeader && !addAppointmentHandler) {
             setAddAppointmentHandler(() => (window as any).getAddAppointmentClickHandlerForHeader());
        }
    }, 200);
    return () => clearInterval(interval);
  }, [firmName, addAppointmentHandler]);
  

  const handleAddAppointmentClick = () => {
    if(addAppointmentHandler){
        const handler = addAppointmentHandler as any; // type cast
        if(typeof handler === 'function') {
             handler();
        } else if (typeof handler.call === 'function'){ // check if it's a function that can be called with .call
            handler.call(null);
        }
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader 
        onAddAppointmentClick={handleAddAppointmentClick} 
        firmName={firmName}
      />
      <main className="flex-grow flex flex-col">{children}</main>
    </div>
  );
}
