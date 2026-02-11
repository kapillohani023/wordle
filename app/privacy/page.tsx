import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Wordle",
  description: "Privacy Policy for the Wordle application.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10 text-sm leading-6 text-gray-800 bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-xs text-gray-500">Effective date: February 11, 2026</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
        <p>
          This Privacy Policy describes how Wordle collects, uses, and stores information when you use
          this application.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Information We Collect</h2>
        <p>
          We collect account information provided through Google Sign-In, such as your name, email
          address, and account identifier, as provided by your authentication provider.
        </p>
        <p>
          We also store gameplay data needed to run the service, including your active game state,
          guesses, attempt count, and game outcomes.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">How We Use Information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>authenticate you and keep your session active;</li>
          <li>operate and maintain your game progress;</li>
          <li>improve reliability, security, and performance of the app.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Cookies and Session Data</h2>
        <p>
          We use cookies or similar session mechanisms required for sign-in and account sessions. These
          are necessary for core functionality and cannot be disabled without affecting app access.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Sharing of Information</h2>
        <p>
          We do not sell personal information. We may share information only with service providers
          necessary to operate the app, including hosting, authentication, and database infrastructure.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Data Retention</h2>
        <p>
          We retain account and gameplay data for as long as needed to provide the service and comply
          with legal obligations, resolve disputes, and enforce agreements.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Data Security</h2>
        <p>
          We use reasonable administrative and technical safeguards to protect data. No method of
          transmission or storage is completely secure, and absolute security is not guaranteed.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Children&apos;s Privacy</h2>
        <p>
          This app is not directed to children under 13, and we do not knowingly collect personal
          information from children under 13.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Updated versions are effective when
          posted on this page.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
        <p>
          For privacy questions, contact the application administrator through the same channel where
          this app is distributed.
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
