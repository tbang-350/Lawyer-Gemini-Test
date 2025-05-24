
# Lexis Reminder - Court Appointment Tracker (SaaS Concept)

This is a Next.js application designed as a "Lexis Reminder" tool. It's evolving into a SaaS concept where law firms can track court appointments, manage lawyers, and view key statistics. It's built using Next.js, React, ShadCN UI components, Tailwind CSS, and is set up for potential AI integration with Genkit.

**This project was prototyped with the assistance of Firebase Studio's AI coding partner.**

## Application Structure

*   **Landing Page (`/`):** A public-facing page describing the Lexis Reminder service with "Login" and "Get Started" options.
*   **Dashboard (`/dashboard`):** The main application interface accessible after "login" (currently simulated by navigation). This is where users manage appointments and view data.
*   **Settings Page (`/settings`):** A page (accessible from the dashboard header) for managing firm details and lawyers (currently using mock data and local state).

## Current Features (Dashboard & Settings)

*   **Dashboard View (`/dashboard`):**
    *   **Statistics Cards:** Displaying counts for total appointments, upcoming appointments, completed appointments, and the number of onboarded attorneys.
    *   **Interactive Calendar:** Allows users to select dates to view appointments. Days with appointments are marked.
    *   **Upcoming Appointments List:** Shows the next few upcoming appointments with quick details.
    *   **Data Visualizations:**
        *   Bar chart showing the number of appointments assigned per lawyer.
        *   Pie chart illustrating the distribution of upcoming vs. completed appointments.
*   **Appointment Management (Dashboard):**
    *   Add new appointments with details like title, date, time, description, court name, case number, client name, and assigned lawyer.
    *   View detailed information for appointments on a selected date.
    *   Edit existing appointment details.
    *   Delete appointments with a confirmation step.
    *   (Conceptual) Set reminder preferences for appointments (days before, time on day), and see a "Scheduled" status.
*   **Settings Page (`/settings`):**
    *   **Firm Details:** (Mock) Interface to manage the law firm's name, address, phone, and email.
    *   **Lawyer Management:** (Mock) Interface to add new lawyers and view/remove existing ones.
*   **User Interface:**
    *   Clean, modern UI built with ShadCN components and Tailwind CSS.
    *   Responsive design for various screen sizes.
    *   Loading indicators for page transitions.
*   **Data Handling:**
    *   Currently uses **mock data** for all appointments, lawyers, and firm details. Data will reset on page refresh.
    *   The application was previously configured for Firebase Firestore integration, and service files for this (`src/services/`) may still be present but are currently unused. This can be reactivated for a live backend.

## Tech Stack

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **UI Components:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **Charting:** Recharts (via ShadCN UI Charts)
*   **AI (Setup):** Genkit (Google AI) - currently not actively used for core features in the mock data version.
*   **State Management:** React Hooks (useState, useMemo, useEffect)

## Getting Started

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:9002` (or another port if 9002 is in use). The landing page is at `/`, and the main app dashboard is at `/dashboard`.

## Future Enhancements / SaaS Development

*   **User Authentication:** Implement a proper login/signup system (e.g., using Firebase Authentication).
*   **Persistent Storage (Multi-tenant):**
    *   Activate Firebase Firestore (or another database).
    *   Structure data to be multi-tenant, ensuring each law firm's data is isolated.
    *   Update service functions in `src/services/` to interact with the live, multi-tenant database.
*   **Real-time Email Notifications:** Implement actual email sending for appointment reminders using a backend service (e.g., Firebase Functions with an email provider), potentially triggered by appointment data and reminder settings.
*   **Subscription Management:** If it's a paid SaaS, integrate a subscription/billing system.
*   **Advanced AI Features:** Integrate Genkit more deeply for features like smart scheduling suggestions, automated appointment summaries, or drafting reminder communications, potentially tailored per firm or user.

This project serves as a functional prototype demonstrating key features of a legal appointment management system, now with a foundational structure for a SaaS model.
