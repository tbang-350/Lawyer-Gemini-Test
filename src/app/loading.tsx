
import { Scale } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background text-primary p-4">
      <Scale className="h-20 w-20 animate-pulse text-primary mb-6" />
      <p className="text-2xl font-semibold text-primary">Loading Page</p>
      <p className="text-md text-muted-foreground mt-1">Please wait a moment while we prepare things for you.</p>
    </div>
  );
}
