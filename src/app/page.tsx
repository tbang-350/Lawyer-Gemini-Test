
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Appointment, AppointmentFormData, Lawyer, LawFirm } from '@/types';
import { AppHeader } from '@/components/common/AppHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { Calendar } from '@/components/ui/calendar';
import { AddAppointmentModal } from '@/components/modals/AddAppointmentModal';
import { AppointmentDetailsModal } from '@/components/modals/AppointmentDetailsModal';
import { useToast } from "@/hooks/use-toast";
import { BarChartBig, CalendarCheck, CalendarClock, Users, Loader2 } from 'lucide-react';
import { format, parse, startOfDay, isSameDay } from 'date-fns';

import { getAppointments, addAppointment, updateAppointment, deleteAppointment } from '@/services/appointmentService';
import { getLawyers } from '@/services/lawyerService';
import { getFirmDetails } from '@/services/firmService';
import { combineDateAndTime } from '@/lib/utils';


export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [lawFirmInfo, setLawFirmInfo] = useState<LawFirm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDateForCalendar, setSelectedDateForCalendar] = useState<Date | undefined>(undefined);
  const [dateForModal, setDateForModal] = useState<Date | undefined>(undefined);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedAppointments, fetchedLawyers, fetchedFirmDetails] = await Promise.all([
        getAppointments(),
        getLawyers(),
        getFirmDetails(),
      ]);
      setAppointments(fetchedAppointments);
      setLawyers(fetchedLawyers);
      setLawFirmInfo(fetchedFirmDetails);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({ title: "Error", description: "Could not load data. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const appointmentsForSelectedDateModal = useMemo(() => {
    if (!dateForModal) return [];
    return appointments.filter(app => 
      isSameDay(app.dateTime, dateForModal)
    ).sort((a,b) => a.dateTime.getTime() - b.dateTime.getTime());
  }, [dateForModal, appointments]);

  const handleSaveAppointment = async (data: AppointmentFormData, id?: string) => {
    try {
      if (id) { // Editing existing appointment
        await updateAppointment(id, data);
        toast({
          title: "Appointment Updated",
          description: `"${data.title}" updated successfully.`,
        });
      } else { // Adding new appointment
        await addAppointment(data);
        toast({
          title: "Appointment Added",
          description: `"${data.title}" scheduled successfully.`,
        });
      }
      fetchData(); // Re-fetch all appointments to reflect changes
      setEditingAppointment(null); 
    } catch (error) {
      console.error("Failed to save appointment:", error);
      toast({ title: "Save Error", description: "Could not save appointment.", variant: "destructive"})
    }
  };

  const handleOpenEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsDetailsModalOpen(false);
    setIsAddModalOpen(true); 
  };
  
  const handleDeleteAppointment = async (appointmentId: string) => {
    const appointmentToDelete = appointments.find(app => app.id === appointmentId);
    if (!appointmentToDelete) return;

    try {
      await deleteAppointment(appointmentId);
      toast({
        title: "Appointment Deleted",
        description: `"${appointmentToDelete.title}" has been removed.`,
        variant: "destructive",
      });
      fetchData(); // Re-fetch to update list
      setIsDetailsModalOpen(false); 
      setDateForModal(undefined); 
      setSelectedDateForCalendar(undefined);
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      toast({ title: "Delete Error", description: "Could not delete appointment.", variant: "destructive"})
    }
  };


  const handleDateSelectOnCalendar = (date: Date | undefined) => {
    if (!date) {
      setSelectedDateForCalendar(undefined);
      return;
    }
    const normalizedDate = startOfDay(date); 
    setSelectedDateForCalendar(normalizedDate);
    setDateForModal(normalizedDate);
    
    const appsOnDay = appointments.filter(app => isSameDay(app.dateTime, normalizedDate));
    if (appsOnDay.length > 0) {
      setIsDetailsModalOpen(true);
    } else {
      toast({
        title: "No Appointments",
        description: `No appointments scheduled for ${format(normalizedDate, 'PPP')}.`,
      });
      setIsDetailsModalOpen(false); 
    }
  };
  
  const handleAppointmentClickFromList = (appointment: Appointment) => {
    const appointmentDate = startOfDay(appointment.dateTime);
    setSelectedDateForCalendar(appointmentDate); 
    setDateForModal(appointmentDate);
    setIsDetailsModalOpen(true);
  };

  const totalAppointments = appointments.length;
  const upcomingAppointmentsCount = appointments.filter(app => app.dateTime >= new Date()).length;
  const pastAppointmentsCount = totalAppointments - upcomingAppointmentsCount;

  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    appointments.forEach(app => {
      const dayKey = format(startOfDay(app.dateTime), 'yyyy-MM-dd');
      if (!map.has(dayKey)) {
        map.set(dayKey, []);
      }
      map.get(dayKey)!.push(app);
    });
    return map;
  }, [appointments]);
  
  const daysWithAppointmentsForCalendarModifier = useMemo(() => {
    return Array.from(appointmentsByDay.keys()).map(dateStr => parse(dateStr, 'yyyy-MM-dd', new Date()));
  }, [appointmentsByDay]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader 
        onAddAppointmentClick={() => {
          setEditingAppointment(null); 
          setIsAddModalOpen(true);
        }} 
        firmName={lawFirmInfo?.name || "Lexis Reminder"}
      />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <section className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Appointments" value={totalAppointments} icon={BarChartBig} description="All scheduled events" />
          <StatCard title="Upcoming Appointments" value={upcomingAppointmentsCount} icon={CalendarClock} description="Events yet to occur" />
          <StatCard title="Completed Appointments" value={pastAppointmentsCount} icon={CalendarCheck} description="Events that have passed" />
          <StatCard title="Attorneys Onboarded" value={lawyers.length} icon={Users} description="Managed in settings" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-lg flex flex-col">
            <h2 className="text-xl font-semibold text-primary mb-4">Appointment Calendar</h2>
            <div className="flex-grow">
              <Calendar
                mode="single"
                selected={selectedDateForCalendar}
                onSelect={handleDateSelectOnCalendar}
                className="rounded-md w-full h-full"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                  month: "space-y-4 w-full flex-grow flex flex-col", 
                  table: "w-full border-collapse flex-grow", 
                  head_row: "flex w-full",
                  head_cell: "text-muted-foreground rounded-md font-normal text-[0.8rem] flex-1 text-center",
                  row: "flex w-full mt-1 space-x-1 flex-grow", 
                  cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20 flex-1 rounded-md aspect-square", 
                  day: "h-full w-full p-0 font-normal aria-selected:opacity-100 rounded-md",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
                  day_today: "bg-accent/20 text-accent-foreground",
                }}
                modifiers={{ hasAppointmentMarker: daysWithAppointmentsForCalendarModifier }}
                components={{
                  DayContent: (props) => {
                    const dayHasAppointment = daysWithAppointmentsForCalendarModifier.some(d => isSameDay(d, props.date));
                    const isSelected = selectedDateForCalendar && isSameDay(props.date, selectedDateForCalendar);
                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {props.date.getDate()}
                        {dayHasAppointment && !isSelected && (
                          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-accent rounded-full border-2 border-card"></span>
                        )}
                      </div>
                    );
                  }
                }}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <UpcomingAppointments appointments={appointments} onAppointmentClick={handleAppointmentClickFromList} />
          </div>
        </section>
      </div>

      <AddAppointmentModal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAppointment(null);
        }}
        onSaveAppointment={handleSaveAppointment}
        lawyers={lawyers}
        initialData={editingAppointment?.formData}
        editingAppointmentId={editingAppointment?.id}
      />
      {dateForModal && (
        <AppointmentDetailsModal 
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
          }}
          appointments={appointmentsForSelectedDateModal}
          selectedDate={dateForModal}
          lawyers={lawyers}
          onEdit={handleOpenEditModal}
          onDeleteConfirmation={handleDeleteAppointment}
        />
      )}
    </div>
  );
}
