import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white mt-8 rounded-b-lg">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row justify-center gap-8 text-center">
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-2xl font-bold mb-4">SIP</h3>
            <ul className="space-y-2">
              <li>
                <Link href={ROUTES.SIP_MONTHLY} className="hover:underline">SIP (Monthly)</Link>
              </li>
              <li>
                <Link href={ROUTES.SIP_WEEKLY} className="hover:underline">SIP (Weekly)</Link>
              </li>
              <li>
                <Link href={ROUTES.SIP_DAILY} className="hover:underline">SIP (Daily)</Link>
              </li>
              <li>
                <Link href={ROUTES.SIP_QUARTERLY} className="hover:underline">SIP (Quarterly)</Link>
              </li>
              <li>
                <Link href={ROUTES.SIP_YEARLY} className="hover:underline">SIP (Yearly)</Link>
              </li>
            </ul>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href={ROUTES.HOME} className="hover:underline">Home</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm w-full flex justify-center">
          © 2020-{new Date().getFullYear()} Design and developed by{' '}
          <Link href="https://ankitbansal.co.in" target="_blank" rel="noopener noreferrer" className="underline ml-1">Ankit Bansal</Link>
        </div>
      </div>
    </footer>
  );
} 