
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
import { BarChartBig, CalendarCheck, CalendarClock, ListChecks, Users } from 'lucide-react';
import { format, parse, startOfDay, isSameDay } from 'date-fns';

// Helper function to combine date and time string into a Date object
const combineDateAndTime = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const newDate = new Date(date); // Create a new Date object to avoid mutating the original
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

// Mock Data
const initialAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Case Hearing: Smith vs. Jones',
    dateTime: combineDateAndTime(new Date(new Date().setDate(new Date().getDate() + 2)), "10:30"),
    description: 'Pre-trial hearing for Smith vs. Jones regarding discovery motions.',
    courtName: 'District Court, Room 3B',
    caseNumber: 'CV-2023-00123',
    clientName: 'John Smith',
    assignedLawyerId: 'lawyer1',
    formData: { title: 'Case Hearing: Smith vs. Jones', date: new Date(new Date().setDate(new Date().getDate() + 2)), time: "10:30", description: 'Pre-trial hearing for Smith vs. Jones regarding discovery motions.', courtName: 'District Court, Room 3B', caseNumber: 'CV-2023-00123', clientName: 'John Smith', remindBeforeDays: 1, assignedLawyerId: 'lawyer1' }
  },
  {
    id: '2',
    title: 'Client Meeting: Doe Corp.',
    dateTime: combineDateAndTime(new Date(new Date().setDate(new Date().getDate() + 5)), "14:00"),
    description: 'Discussing upcoming merger agreement with Doe Corp. legal team.',
    clientName: 'Doe Corp.',
    assignedLawyerId: 'lawyer2',
    formData: { title: 'Client Meeting: Doe Corp.', date: new Date(new Date().setDate(new Date().getDate() + 5)), time: "14:00", description: 'Discussing upcoming merger agreement with Doe Corp. legal team.', clientName: 'Doe Corp.', remindOnDayAt: "09:00", assignedLawyerId: 'lawyer2' }
  },
  {
    id: '3',
    title: 'Filing Deadline: State vs. Roe',
    dateTime: combineDateAndTime(new Date(new Date().setDate(new Date().getDate() + 5)), "17:00"), 
    description: 'Final day to submit appellate brief for State vs. Roe.',
    caseNumber: 'CR-2022-00789',
    formData: { title: 'Filing Deadline: State vs. Roe', date: new Date(new Date().setDate(new Date().getDate() + 5)), time: "17:00", description: 'Final day to submit appellate brief for State vs. Roe.', caseNumber: 'CR-2022-00789', remindBeforeDays: 3, remindOnDayAt: "08:00" }
  },
  {
    id: '4',
    title: 'Past Appointment: Consultation',
    dateTime: combineDateAndTime(new Date(new Date().setDate(new Date().getDate() - 3)), "11:00"),
    description: 'Initial consultation with new client regarding property dispute.',
    clientName: 'Alice Wonderland',
    formData: { title: 'Past Appointment: Consultation', date: new Date(new Date().setDate(new Date().getDate() - 3)), time: "11:00", description: 'Initial consultation with new client regarding property dispute.', clientName: 'Alice Wonderland' }
  }
];

const mockLawyers: Lawyer[] = [
  { id: 'lawyer1', name: 'Alice Advocate', email: 'alice@examplefirm.com' },
  { id: 'lawyer2', name: 'Bob Barrister', email: 'bob@examplefirm.com' },
  { id: 'lawyer3', name: 'Carol Counselor', email: 'carol@examplefirm.com' },
];

const mockLawFirm: LawFirm = {
  name: 'Justice & Associates LLP',
  address: '123 Legal Lane, Lawsville, LS 45678',
  phone: '555-0123',
  email: 'contact@justiceassociates.com'
};

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [lawyers, setLawyers] = useState<Lawyer[]>(mockLawyers);
  const [lawFirmInfo, setLawFirmInfo] = useState<LawFirm>(mockLawFirm);

  const [selectedDateForCalendar, setSelectedDateForCalendar] = useState<Date | undefined>(undefined); // For calendar display
  const [dateForModal, setDateForModal] = useState<Date | undefined>(undefined); // For modal context
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { toast } = useToast();

  const appointmentsForSelectedDateModal = useMemo(() => {
    if (!dateForModal) return [];
    return appointments.filter(app => 
      isSameDay(app.dateTime, dateForModal)
    ).sort((a,b) => a.dateTime.getTime() - b.dateTime.getTime());
  }, [dateForModal, appointments]);

  const handleAddAppointment = (data: AppointmentFormData) => {
    const newAppointment: Appointment = {
      id: new Date().toISOString(), 
      title: data.title,
      dateTime: combineDateAndTime(data.date, data.time),
      description: data.description || '',
      courtName: data.courtName,
      caseNumber: data.caseNumber,
      clientName: data.clientName,
      assignedLawyerId: data.assignedLawyerId,
      formData: data, 
    };
    setAppointments(prev => [...prev, newAppointment].sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()));
    toast({
      title: "Appointment Added",
      description: `"${data.title}" scheduled successfully.`,
      variant: "default",
    });
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader 
        onAddAppointmentClick={() => setIsAddModalOpen(true)} 
        firmName={lawFirmInfo.name}
      />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <section className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Appointments" value={totalAppointments} icon={BarChartBig} description="All scheduled events" />
          <StatCard title="Upcoming Appointments" value={upcomingAppointmentsCount} icon={CalendarClock} description="Events yet to occur" />
          <StatCard title="Completed Appointments" value={pastAppointmentsCount} icon={CalendarCheck} description="Events that have passed" />
          <StatCard title="Attorneys Onboarded" value={lawyers.length} icon={Users} description="Ready to be assigned" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-primary mb-4">Appointment Calendar</h2>
            <Calendar
              mode="single"
              selected={selectedDateForCalendar}
              onSelect={handleDateSelectOnCalendar}
              className="rounded-md"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
                day_today: "bg-accent/20 text-accent-foreground",
                day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100", 
              }}
              modifiers={{ hasAppointmentMarker: daysWithAppointmentsForCalendarModifier }}
              components={{
                DayContent: (props) => {
                  const dayHasAppointment = daysWithAppointmentsForCalendarModifier.some(d => isSameDay(d, props.date));
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {props.date.getDate()}
                      {dayHasAppointment && !isSameDay(props.date, selectedDateForCalendar || new Date(0)) && (
                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full"></span>
                      )}
                    </div>
                  );
                }
              }}
            />
          </div>
          
          <div className="lg:col-span-1">
            <UpcomingAppointments appointments={appointments} onAppointmentClick={handleAppointmentClickFromList} />
          </div>
        </section>
      </div>

      <AddAppointmentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onAddAppointment={handleAddAppointment}
        lawyers={lawyers}
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
        />
      )}
    </div>
  );
}
