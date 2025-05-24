
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppHeader } from '@/components/common/AppHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firmName, setFirmName] = useState("Lexis Reminder");
  const [actualAddHandler, setActualAddHandler] = useState<(() => void) | null>(null);

  useEffect(() => {
    let mounted = true;

    const updateStatesFromWindow = () => {
      if (!mounted) return;

      if (typeof window !== 'undefined') {
        // Firm Name
        if ((window as any).getFirmNameForHeader) {
          const newFirmName = (window as any).getFirmNameForHeader();
          setFirmName(prev => (prev === newFirmName ? prev : newFirmName));
        }

        // Add Appointment Handler
        if ((window as any).getAddAppointmentClickHandlerForHeader) {
          const handlerFromWindow = (window as any).getAddAppointmentClickHandlerForHeader as (() => void);
          // Only update state if the handler reference has actually changed
          setActualAddHandler(prevHandler => {
            if (prevHandler !== handlerFromWindow) {
              return handlerFromWindow;
            }
            return prevHandler;
          });
        }
      }
    };

    updateStatesFromWindow(); // Initial call to set states

    const intervalId = setInterval(updateStatesFromWindow, 300); // Periodically check for updates

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount.
         // The interval handles polling for changes from the window object.

  const handleAddAppointmentClick = useCallback(() => {
    if (actualAddHandler && typeof actualAddHandler === 'function') {
      actualAddHandler();
    }
  }, [actualAddHandler]); // This callback is memoized and updates if actualAddHandler changes.

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

    