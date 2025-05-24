
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Appointment, AppointmentFormData, Lawyer, LawFirm } from '@/types';
import { StatCard } from '@/components/dashboard/StatCard';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { Calendar } from '@/components/ui/calendar';
import { AddAppointmentModal } from '@/components/modals/AddAppointmentModal';
import { AppointmentDetailsModal } from '@/components/modals/AppointmentDetailsModal';
import { useToast } from "@/hooks/use-toast";
import { BarChartBig, CalendarCheck, CalendarClock, Users, Loader2, UserCheck as UserCheckIcon, CalendarDays, LineChart as LineChartIcon } from 'lucide-react';
import { format, parse, startOfDay, isSameDay, addDays, subDays, isFuture, eachDayOfInterval } from 'date-fns';
import { combineDateAndTime } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

// Mock Data
const initialLawyers: Lawyer[] = [
  { id: 'lawyer1', name: 'Alice Wonderland', email: 'alice@example.com' },
  { id: 'lawyer2', name: 'Bob The Builder', email: 'bob@example.com' },
  { id: 'lawyer3', name: 'Charlie Brown', email: 'charlie@example.com' },
  { id: 'lawyer4', name: 'Diana Prince', email: 'diana@example.com' },
];

const today = new Date();
const initialAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Initial Consultation with Client X',
    dateTime: combineDateAndTime(today, '10:00'),
    description: 'Discussing the preliminary details of the case.',
    courtName: 'District Court Room 3',
    caseNumber: 'CV-2024-001',
    clientName: 'Client X',
    assignedLawyerId: 'lawyer1',
    formData: {
      title: 'Initial Consultation with Client X',
      date: today,
      time: '10:00',
      description: 'Discussing the preliminary details of the case.',
      courtName: 'District Court Room 3',
      caseNumber: 'CV-2024-001',
      clientName: 'Client X',
      assignedLawyerId: 'lawyer1',
      remindBeforeDays: 2,
      remindOnDayAt: '08:00',
    }
  },
  {
    id: '2',
    title: 'Hearing for Case Y',
    dateTime: combineDateAndTime(addDays(today, 3), '14:30'),
    description: 'Presenting evidence and arguments.',
    courtName: 'Supreme Court',
    caseNumber: 'SC-2024-005',
    clientName: 'Client Y',
    assignedLawyerId: 'lawyer2',
    formData: {
      title: 'Hearing for Case Y',
      date: addDays(today, 3),
      time: '14:30',
      description: 'Presenting evidence and arguments.',
      courtName: 'Supreme Court',
      caseNumber: 'SC-2024-005',
      clientName: 'Client Y',
      assignedLawyerId: 'lawyer2',
    }
  },
  {
    id: '3',
    title: 'Review Meeting - Client Z',
    dateTime: combineDateAndTime(subDays(today, 2), '09:00'),
    description: 'Review of contract documents.',
    clientName: 'Client Z',
    assignedLawyerId: 'lawyer1',
    formData: {
      title: 'Review Meeting - Client Z',
      date: subDays(today, 2),
      time: '09:00',
      description: 'Review of contract documents.',
      clientName: 'Client Z',
      assignedLawyerId: 'lawyer1',
      remindOnDayAt: '07:00',
    }
  },
  {
    id: '4',
    title: 'Deposition Prep - Client A',
    dateTime: combineDateAndTime(addDays(today, 1), '11:00'),
    description: 'Preparing for deposition.',
    clientName: 'Client A',
    assignedLawyerId: 'lawyer1',
    formData: {
        title: 'Deposition Prep - Client A',
        date: addDays(today, 1),
        time: '11:00',
        description: 'Preparing for deposition.',
        clientName: 'Client A',
        assignedLawyerId: 'lawyer1',
    }
  },
    {
    id: '4b',
    title: 'Another Deposition - Client A2',
    dateTime: combineDateAndTime(addDays(today, 1), '15:00'),
    description: 'Second deposition prep.',
    clientName: 'Client A2',
    assignedLawyerId: 'lawyer1',
    formData: {
        title: 'Another Deposition - Client A2',
        date: addDays(today, 1),
        time: '15:00',
        description: 'Second deposition prep.',
        clientName: 'Client A2',
        assignedLawyerId: 'lawyer1',
    }
  },
  {
    id: '5',
    title: 'Mediation Session - Client B',
    dateTime: combineDateAndTime(addDays(today, 5), '09:30'),
    description: 'Mediation with opposing counsel.',
    courtName: 'Mediation Center Downtown',
    clientName: 'Client B',
    assignedLawyerId: 'lawyer3',
    formData: {
        title: 'Mediation Session - Client B',
        date: addDays(today, 5),
        time: '09:30',
        description: 'Mediation with opposing counsel.',
        courtName: 'Mediation Center Downtown',
        clientName: 'Client B',
        assignedLawyerId: 'lawyer3',
    }
  },
  {
    id: '6',
    title: 'Client Follow-up Call',
    dateTime: combineDateAndTime(addDays(today, 2), '16:00'),
    description: 'Discuss progress and next steps.',
    clientName: 'Client X',
    assignedLawyerId: 'lawyer1',
     formData: {
        title: 'Client Follow-up Call',
        date: addDays(today, 2),
        time: '16:00',
        description: 'Discuss progress and next steps.',
        clientName: 'Client X',
        assignedLawyerId: 'lawyer1',
    }
  },
    {
    id: '6b',
    title: 'Internal Case Review',
    dateTime: combineDateAndTime(addDays(today, 2), '09:00'),
    description: 'Review case files with paralegal.',
    assignedLawyerId: 'lawyer4',
     formData: {
        title: 'Internal Case Review',
        date: addDays(today, 2),
        time: '09:00',
        description: 'Review case files with paralegal.',
        assignedLawyerId: 'lawyer4',
    }
  },
  {
    id: '7',
    title: 'Strategy Meeting with Team',
    dateTime: combineDateAndTime(addDays(today, 4), '10:00'),
    description: 'Internal strategy session for upcoming trial.',
    assignedLawyerId: 'lawyer2',
     formData: {
        title: 'Strategy Meeting with Team',
        date: addDays(today, 4),
        time: '10:00',
        description: 'Internal strategy session for upcoming trial.',
        assignedLawyerId: 'lawyer2',
    }
  },
   {
    id: '8',
    title: 'Contract Review with Client D',
    dateTime: combineDateAndTime(addDays(today, 3), '10:00'), // Same day as another appointment
    description: 'Final review of the service agreement.',
    clientName: 'Client D',
    assignedLawyerId: 'lawyer4',
    formData: {
      title: 'Contract Review with Client D',
      date: addDays(today, 3),
      time: '10:00',
      description: 'Final review of the service agreement.',
      clientName: 'Client D',
      assignedLawyerId: 'lawyer4',
    }
  },
  {
    id: '9',
    title: 'Court Filing Deadline Prep',
    dateTime: combineDateAndTime(addDays(today, 6), '11:00'),
    description: 'Prepare documents for e-filing.',
    assignedLawyerId: 'lawyer3',
    formData: {
      title: 'Court Filing Deadline Prep',
      date: addDays(today, 6),
      time: '11:00',
      description: 'Prepare documents for e-filing.',
      assignedLawyerId: 'lawyer3',
    }
  },
];

const initialFirmInfo: LawFirm = {
  id: 'firm1',
  name: 'Lexis Legal Associates',
  address: '123 Law St, Legaltown, LS 45678',
  phone: '555-0101',
  email: 'contact@lexislegal.com'
};


export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [lawyers, setLawyers] = useState<Lawyer[]>(initialLawyers);
  const [lawFirmInfo, setLawFirmInfo] = useState<LawFirm | null>(initialFirmInfo);
  const [isLoading, setIsLoading] = useState(false); 

  const [selectedDateForCalendar, setSelectedDateForCalendar] = useState<Date | undefined>(undefined);
  const [dateForModal, setDateForModal] = useState<Date | undefined>(undefined);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const { toast } = useToast();

  const openAddAppointmentModal = useCallback(() => {
    setEditingAppointment(null);
    setIsAddModalOpen(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).getFirmNameForHeader = () => lawFirmInfo?.name || "Lexis Reminder";
      (window as any).getAddAppointmentClickHandlerForHeader = openAddAppointmentModal;
    }
    return () => {
        if (typeof window !== 'undefined') {
            delete (window as any).getFirmNameForHeader;
            delete (window as any).getAddAppointmentClickHandlerForHeader;
        }
    };
  }, [lawFirmInfo, openAddAppointmentModal]);


  const appointmentsForSelectedDateModal = useMemo(() => {
    if (!dateForModal) return [];
    return appointments.filter(app =>
      isSameDay(app.dateTime, dateForModal)
    ).sort((a,b) => a.dateTime.getTime() - b.dateTime.getTime());
  }, [dateForModal, appointments]);

  const handleSaveAppointment = async (data: AppointmentFormData, id?: string) => {
    setIsLoading(true); 
    try {
      const appointmentDateTime = combineDateAndTime(data.date, data.time);
      const appointmentToSave: Omit<Appointment, 'id'> = {
        title: data.title,
        dateTime: appointmentDateTime,
        description: data.description || '',
        courtName: data.courtName,
        caseNumber: data.caseNumber,
        clientName: data.clientName,
        assignedLawyerId: data.assignedLawyerId,
        formData: data,
      };

      if (id) {
        setAppointments(prev => prev.map(app => app.id === id ? { ...appointmentToSave, id } : app));
        toast({
          title: "Appointment Updated",
          description: `"${data.title}" updated successfully.`,
        });
      } else {
        const newId = Date.now().toString();
        setAppointments(prev => [...prev, { ...appointmentToSave, id: newId }]);
        toast({
          title: "Appointment Added",
          description: `"${data.title}" scheduled successfully.`,
        });
      }
      setEditingAppointment(null);
    } catch (error) {
      console.error("Failed to save appointment:", error);
      toast({ title: "Save Error", description: "Could not save appointment.", variant: "destructive"})
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsDetailsModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    setIsLoading(true);
    const appointmentToDelete = appointments.find(app => app.id === appointmentId);
    if (!appointmentToDelete) {
        setIsLoading(false);
        return;
    }

    try {
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
      toast({
        title: "Appointment Deleted",
        description: `"${appointmentToDelete.title}" has been removed.`,
        variant: "default",
      });
      setIsDetailsModalOpen(false);
      setDateForModal(undefined);
      setSelectedDateForCalendar(undefined);
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      toast({ title: "Delete Error", description: "Could not delete appointment.", variant: "destructive"})
    } finally {
      setIsLoading(false);
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

  const lawyerAppointmentCounts = useMemo(() => {
    const counts: { [key: string]: { name: string; appointments: number } } = {};
    lawyers.forEach(lawyer => {
        counts[lawyer.id] = { name: lawyer.name, appointments: 0 };
    });
    appointments.forEach(app => {
        if (app.assignedLawyerId && counts[app.assignedLawyerId]) {
            counts[app.assignedLawyerId].appointments++;
        }
    });
    return Object.values(counts).filter(c => c.appointments >= 0); // Keep all lawyers for chart
  }, [appointments, lawyers]);

  const barChartConfig = {
    appointments: {
        label: "Appointments",
        color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  const appointmentStatusData = useMemo(() => [
    { name: 'Upcoming', value: upcomingAppointmentsCount, fill: 'hsl(var(--chart-2))' }, 
    { name: 'Completed', value: pastAppointmentsCount, fill: 'hsl(var(--chart-5))' }, 
  ], [upcomingAppointmentsCount, pastAppointmentsCount]);

  const pieChartConfig = {
    upcoming: { label: 'Upcoming', color: 'hsl(var(--chart-2))' },
    completed: { label: 'Completed', color: 'hsl(var(--chart-5))' },
  } satisfies ChartConfig;


  const appointmentsNext7DaysData = useMemo(() => {
    const next7Days = eachDayOfInterval({
      start: startOfDay(new Date()),
      end: addDays(startOfDay(new Date()), 6),
    });

    return next7Days.map(day => {
      const count = appointments.filter(app => isSameDay(app.dateTime, day)).length;
      return {
        date: format(day, 'MMM d'), // Format like "May 23"
        shortDate: format(day, 'E'), // Format like "Mon" for XAxis
        count: count,
      };
    });
  }, [appointments]);

  const lineChartConfig = {
    count: {
      label: 'Appointments',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;


  if (isLoading) {
    return (
      <div className="flex flex-col flex-grow items-center justify-center p-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Processing your request...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow bg-background">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <section className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Appointments" value={totalAppointments} icon={BarChartBig} description="All scheduled events" />
          <StatCard title="Upcoming Appointments" value={upcomingAppointmentsCount} icon={CalendarClock} description="Events yet to occur" />
          <StatCard title="Completed Appointments" value={pastAppointmentsCount} icon={CalendarCheck} description="Events that have passed" />
          <StatCard title="Attorneys Onboarded" value={lawyers.length} icon={Users} description="Managed in settings" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
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
                  day_today: "bg-accent/20 text-accent",
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

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <Card className="shadow-lg col-span-1">
            <CardHeader>
              <CardTitle className="text-md text-primary">Lawyer Assignments</CardTitle>
              <CardDescription className="text-xs">Appts. per lawyer.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 px-1 pb-2 min-h-[180px] sm:min-h-[200px]">
              {lawyerAppointmentCounts.length > 0 ? (
                <ChartContainer config={barChartConfig} className="min-h-[150px] sm:min-h-[170px] w-full h-full">
                  <BarChart accessibilityLayer data={lawyerAppointmentCounts} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="2 2" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={5}
                      axisLine={false}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={9}
                      interval={0} 
                      angle={-25}
                      textAnchor="end"
                      height={35}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                      width={20}
                    />
                    <ChartTooltip
                      cursor={{ fill: "hsl(var(--secondary))", radius: 3}}
                      content={<ChartTooltipContent hideLabel indicator="dot" className="text-xs p-1.5"/>}
                    />
                    <Bar dataKey="appointments" fill="var(--color-appointments)" radius={[3, 3, 0, 0]} barSize={12} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-6 text-sm">No assignments.</p>
              )}
            </CardContent>
          </Card>
           <Card className="shadow-lg col-span-1">
            <CardHeader>
              <CardTitle className="text-md text-primary">Appointment Status</CardTitle>
              <CardDescription className="text-xs">Upcoming vs. completed.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex justify-center items-center pb-2 min-h-[180px] sm:min-h-[200px]">
              {totalAppointments > 0 ? (
                <ChartContainer config={pieChartConfig} className="min-h-[150px] sm:min-h-[170px] w-full h-full aspect-square">
                  <PieChart accessibilityLayer margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" className="text-xs p-1.5"/>} />
                    <Pie
                      data={appointmentStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      innerRadius={30}
                      labelLine={false}
                      label={({ percent, name }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {appointmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Legend 
                      wrapperStyle={{fontSize: '10px', marginTop: '0px'}} 
                      iconSize={8} 
                      payload={
                        appointmentStatusData.map(entry => ({
                          value: `${entry.name} (${entry.value})`,
                          type: 'square',
                          color: entry.fill
                        }))
                      }
                    />
                  </PieChart>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-6 text-sm">No appointments.</p>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-lg col-span-1 sm:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-md text-primary flex items-center">
                <LineChartIcon className="mr-2 h-5 w-5"/> Appointments - Next 7 Days
              </CardTitle>
              <CardDescription className="text-xs">Trend for the upcoming week.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 px-1 pb-2 min-h-[180px] sm:min-h-[200px]">
              {appointmentsNext7DaysData.some(d => d.count > 0) ? (
                 <ChartContainer config={lineChartConfig} className="min-h-[150px] sm:min-h-[170px] w-full h-full">
                   <LineChart
                     accessibilityLayer
                     data={appointmentsNext7DaysData}
                     margin={{ top: 15, right: 20, left: -10, bottom: 0 }}
                   >
                     <CartesianGrid vertical={false} strokeDasharray="2 2" />
                     <XAxis
                       dataKey="shortDate" // Use short day name for X-axis
                       tickLine={false}
                       axisLine={false}
                       tickMargin={8}
                       stroke="hsl(var(--muted-foreground))"
                       fontSize={10}
                     />
                     <YAxis
                       tickLine={false}
                       axisLine={false}
                       stroke="hsl(var(--muted-foreground))"
                       fontSize={10}
                       allowDecimals={false}
                       width={20}
                     />
                     <ChartTooltip
                       cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "3 3" }}
                       content={<ChartTooltipContent 
                                  indicator="dot" 
                                  className="text-xs p-1.5" 
                                  formatter={(value, name, props) => {
                                    // props.payload contains the full data item, like {date: "May 23", count: 2}
                                    return [`${props.payload.date}: ${value}`, null]; 
                                  }}
                                />}
                     />
                     <Line
                       dataKey="count"
                       type="monotone"
                       stroke="var(--color-count)"
                       strokeWidth={2}
                       dot={{
                         fill: "var(--color-count)",
                         r: 4,
                       }}
                       activeDot={{
                         r: 6,
                       }}
                     />
                   </LineChart>
                 </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-6 text-sm">No upcoming appointments in the next 7 days.</p>
              )}
            </CardContent>
          </Card>

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

