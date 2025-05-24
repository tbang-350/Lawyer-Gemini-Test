
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginModal } from '@/components/modals/LoginModal'; // Import the modal
import { Scale, Briefcase, CalendarCheck, ShieldCheck, Users, CheckCircle, Zap, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    router.push('/dashboard');
  };

  const openLoginModal = () => setIsLoginModalOpen(true);

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100">
        {/* Header */}
        <header className="py-4 px-6 md:px-12 shadow-sm bg-white/90 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" passHref className="flex items-center gap-2">
              <Scale className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Lexis Reminder</h1>
            </Link>
            <nav className="space-x-2">
              <Button variant="outline" onClick={openLoginModal}>Login</Button>
              <Button onClick={openLoginModal}>Get Started</Button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-grow">
          <section className="container mx-auto px-6 py-16 md:py-24 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Never Miss a Court Date Again.
              <br className="hidden md:block" />
              <span className="text-primary">Streamline Your Legal Practice.</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Lexis Reminder is the smart, intuitive SaaS platform designed for law firms to effortlessly track court appointments, manage lawyer schedules, and stay ahead of crucial deadlines.
            </p>
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-primary/30 transition-shadow" onClick={openLoginModal}>
              Access Your Dashboard
            </Button>
            <div className="mt-12 md:mt-20 relative aspect-[16/9] max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden border-4 border-white/50">
              <Image
                src="https://placehold.co/1200x675.png"
                alt="Lexis Reminder Dashboard Mockup"
                layout="fill"
                objectFit="cover"
                priority
                data-ai-hint="dashboard app interface"
              />
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6">
              <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">Why Choose Lexis Reminder?</h3>
              <p className="text-center text-gray-600 mb-12 md:mb-16 max-w-2xl mx-auto">
                Empower your firm with tools built for precision, efficiency, and peace of mind.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                      <CalendarCheck className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Smart Scheduling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center text-sm">
                      Centralized calendar for all court appointments. Assign lawyers, track cases, and manage details effortlessly.
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Lawyer Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center text-sm">
                      Onboard your legal team, assign cases, and (soon!) get insights into lawyer workloads and availability.
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                      <TrendingUp className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Key Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center text-sm">
                      Visualize your firm's activity with at-a-glance statistics on appointments and lawyer assignments.
                    </p>
                  </CardContent>
                </Card>
                 <Card className="shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                      <Zap className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Automated Reminders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center text-sm">
                      (Conceptual) Set up email reminders for lawyers about upcoming court dates and critical deadlines.
                    </p>
                  </CardContent>
                </Card>
                 <Card className="shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                      <ShieldCheck className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Secure & Reliable</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center text-sm">
                      Built for SaaS, designed to be secure, reliable, and ready to scale with your firm's needs.
                    </p>
                  </CardContent>
                </Card>
                 <Card className="shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                      <CheckCircle className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Easy to Use</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center text-sm">
                      Intuitive interface means less time training and more time focusing on your clients.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-6 text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Ready to Transform Your Firm's Scheduling?</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join forward-thinking law firms taking control of their calendars and dedicating more time to what truly matters: their clients.
              </p>
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-primary/30 transition-shadow" onClick={openLoginModal}>
                Get Started for Free Today
              </Button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center bg-slate-200 border-t border-slate-300">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} Lexis Reminder. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
