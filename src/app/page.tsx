
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Briefcase, CalendarCheck, ShieldCheck, Users } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-stone-200">
      {/* Header */}
      <header className="py-4 px-6 md:px-12 shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Lexis Reminder</h1>
          </div>
          <nav className="space-x-2">
            <Link href="/dashboard" passHref>
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/dashboard" passHref> {/* Sign-up would eventually go to a different flow */}
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="container mx-auto px-6 py-16 md:py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Never Miss a Court Date Again.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Lexis Reminder is the smart, intuitive platform designed for law firms to effortlessly track court appointments, manage lawyer schedules, and stay ahead of deadlines.
          </p>
          <Link href="/dashboard" passHref>
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-primary/30 transition-shadow">
              Access Your Dashboard
            </Button>
          </Link>
          <div className="mt-12 md:mt-16 relative aspect-[16/9] max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden">
            <Image 
              src="https://placehold.co/1200x675.png" 
              alt="Lexis Reminder Dashboard Mockup" 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="dashboard app interface"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Lexis Reminder?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <CalendarCheck className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Smart Scheduling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Easily add, view, and manage all court appointments in one centralized calendar. Assign lawyers and track case details effortlessly.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Lawyer Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Onboard your legal team, assign appointments, and get insights into lawyer workloads with our upcoming analytics.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Key Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Visualize your firm's activity with at-a-glance statistics on appointments, lawyer assignments, and more.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 md:py-24 bg-primary/5">
           <div className="container mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Ready to Streamline Your Firm's Scheduling?</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join law firms that are taking control of their calendars and focusing on what matters most - their clients.
            </p>
            <Link href="/dashboard" passHref>
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-primary/30 transition-shadow">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center bg-slate-200">
        <p className="text-gray-600">&copy; {new Date().getFullYear()} Lexis Reminder. All rights reserved.</p>
      </footer>
    </div>
  );
}
