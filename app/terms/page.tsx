import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Wordle",
  description: "Terms of Service for the Wordle application.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10 text-sm leading-6 text-gray-800 bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-900">Terms of Service</h1>
      <p className="mt-2 text-xs text-gray-500">Effective date: February 11, 2026</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Agreement to Terms</h2>
        <p>
          By accessing or using Wordle, you agree to these Terms of Service. If you do not agree, do
          not use the app.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Eligibility and Accounts</h2>
        <p>
          You must use a valid authentication account (Google Sign-In) and provide accurate information.
          You are responsible for activity that occurs under your account.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Permitted Use</h2>
        <p>You may use the app only for lawful, personal, non-commercial gameplay.</p>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>attempt to disrupt or interfere with app functionality;</li>
          <li>attempt unauthorized access to data, systems, or accounts;</li>
          <li>use automated methods to abuse or overload the service.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Service Availability</h2>
        <p>
          We may modify, suspend, or discontinue features at any time, with or without notice. We do
          not guarantee uninterrupted availability.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Intellectual Property</h2>
        <p>
          The app and its underlying software, design, and content are owned by the service operator or
          licensors and are protected by applicable intellectual property laws.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Termination</h2>
        <p>
          We may suspend or terminate access if you violate these Terms, pose a security risk, or misuse
          the service.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Disclaimers</h2>
        <p>
          The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any
          kind, express or implied.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, we are not liable for indirect, incidental, special,
          consequential, or punitive damages, or for loss of data, profits, or goodwill.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the app after updates means you
          accept the revised Terms.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
        <p>
          For questions about these Terms, contact the application administrator through the same channel
          where this app is distributed.
        </p>
      </section>

      <div className="mt-10">
        <Link href="/signin" className="text-sm text-gray-600 underline underline-offset-4 hover:text-gray-900">
          Back to Sign In
        </Link>
      </div>
    </main>
  );
}
