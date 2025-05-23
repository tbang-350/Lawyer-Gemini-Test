
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ClockIcon, UserCheck } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { AppointmentFormData, Lawyer } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const appointmentFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }).max(100),
  date: z.date({ required_error: 'A date is required.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:MM).' }),
  description: z.string().max(500).optional(),
  courtName: z.string().max(100).optional(),
  caseNumber: z.string().max(50).optional(),
  clientName: z.string().max(100).optional(),
  assignedLawyerId: z.string().optional().or(z.literal('')), 
  remindBeforeDays: z.coerce.number().int().min(1).optional(),
  remindOnDayAt: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:MM).' }).optional().or(z.literal('')),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<AppointmentFormData>;
  lawyers: Lawyer[];
  submitButtonText?: string;
}

export function AppointmentForm({ onSubmit, onCancel, initialData, lawyers, submitButtonText = "Save Appointment" }: AppointmentFormProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      date: initialData?.date || new Date(),
      time: initialData?.time || format(new Date(), 'HH:mm'),
      description: initialData?.description || '',
      courtName: initialData?.courtName || '',
      caseNumber: initialData?.caseNumber || '',
      clientName: initialData?.clientName || '',
      assignedLawyerId: initialData?.assignedLawyerId || '',
      remindBeforeDays: initialData?.remindBeforeDays || undefined,
      remindOnDayAt: initialData?.remindOnDayAt || '',
    },
  });

  // Watch for changes in initialData to reset form if it changes (e.g., when switching from add to edit)
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || '',
        date: initialData.date || new Date(),
        time: initialData.time || format(new Date(), 'HH:mm'),
        description: initialData.description || '',
        courtName: initialData.courtName || '',
        caseNumber: initialData.caseNumber || '',
        clientName: initialData.clientName || '',
        assignedLawyerId: initialData.assignedLawyerId || '',
        remindBeforeDays: initialData.remindBeforeDays || undefined,
        remindOnDayAt: initialData.remindOnDayAt || '',
      });
    } else {
        // Reset to default for new appointment
        form.reset({
            title: '',
            date: new Date(),
            time: format(new Date(), 'HH:mm'),
            description: '',
            courtName: '',
            caseNumber: '',
            clientName: '',
            assignedLawyerId: '',
            remindBeforeDays: undefined,
            remindOnDayAt: '',
        });
    }
  }, [initialData, form]);


  const processSubmit = (values: AppointmentFormValues) => {
    const processedValues = {
      ...values,
      assignedLawyerId: values.assignedLawyerId === "" ? undefined : values.assignedLawyerId,
      remindOnDayAt: values.remindOnDayAt === "" ? undefined : values.remindOnDayAt,
      remindBeforeDays: values.remindBeforeDays === 0 ? undefined : values.remindBeforeDays, // ensure 0 is treated as undefined if that's the intent
    };
    onSubmit(processedValues as AppointmentFormData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Hearing for Case X" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="time" {...field} className="pr-8" />
                    <ClockIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed description of the appointment..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="assignedLawyerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign Lawyer (Optional)</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === "__NONE__" ? "" : value)} 
                  value={field.value === "" || field.value === undefined ? "__NONE__" : field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <UserCheck className="mr-2 h-4 w-4 opacity-50" />
                      <SelectValue placeholder="Select a lawyer to notify" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     <SelectItem value="__NONE__">None</SelectItem>
                    {lawyers.map(lawyer => (
                      <SelectItem key={lawyer.id} value={lawyer.id}>
                        {lawyer.name} ({lawyer.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The selected lawyer will be associated with this appointment.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="courtName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Court Name / Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Supreme Court, Room 101" {...field} value={field.value || ''}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="caseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., CV-2024-123" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe" {...field} value={field.value || ''}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <h3 className="text-md font-semibold pt-2 border-t mt-4">Reminder Settings (Conceptual)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="remindBeforeDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remind Before (Days)</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === "__NONE__" ? undefined : parseInt(value))} 
                  value={field.value === undefined || field.value === null ? "__NONE__" : field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="__NONE__">None</SelectItem>
                    <SelectItem value="1">1 day before</SelectItem>
                    <SelectItem value="2">2 days before</SelectItem>
                    <SelectItem value="3">3 days before</SelectItem>
                    <SelectItem value="7">7 days before</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Email reminder X days before the appointment.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remindOnDayAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remind on Day At (Time)</FormLabel>
                <FormControl>
                   <div className="relative">
                    <Input type="time" {...field} className="pr-8" value={field.value || ''} />
                    <ClockIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                  </div>
                </FormControl>
                 <FormDescription>Email reminder on the appointment day at this time.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="default">
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
