import React from "react";
import { UserCheck, MapPin, Mail, Phone, MessageSquare } from "lucide-react";
import { librarianContactData as fallbackContact } from "@/data/libraryData";

interface LibraryContactLibrarianProps {
  contact?: {
    name?: string;
    designation?: string;
    address?: string;
    email?: string;
    phone?: string;
  } | null;
}

export default function LibraryContactLibrarian({ contact }: LibraryContactLibrarianProps) {
  const c = contact || fallbackContact;
  const name = c.name || fallbackContact.name;
  const designation = c.designation || fallbackContact.designation;
  const address = c.address || fallbackContact.address;
  const email = c.email || fallbackContact.email;

  return (
    <section className="w-full bg-[#F7F9FC] py-12 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-[#0A1F44] text-[#E8871A] shadow-md">
              <UserCheck className="h-10 w-10" />
            </div>

            <div className="space-y-2 flex-grow">
              <h3 className="font-serif text-2xl font-bold text-[#0A1F44]">
                {name}
              </h3>
              <p className="text-sm font-semibold text-slate-600 font-sans">
                {designation}
              </p>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4 justify-center sm:justify-start text-xs text-slate-600 font-sans">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#E8871A]" />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-[#E8871A]" />
                  <a
                    href={`mailto:${email}`}
                    className="font-bold text-[#0A1F44] hover:text-[#E8871A] transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
