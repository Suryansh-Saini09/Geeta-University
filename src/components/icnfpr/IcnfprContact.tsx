
import React from "react";
import { Phone, MapPin, Globe, Headset } from "lucide-react";

export default function IcnfprContact() {
  return (
    <section id="contact" className="py-20 lg:py-24 bg-white text-[#0A1F44]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center justify-center gap-2 mb-3 text-[#E8871A] font-extrabold text-xs tracking-widest uppercase">
            <Headset size={16} />
            <span>Assistance &amp; Venue</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1F44] tracking-tight">
            Contact <span className="text-[#E8871A]">Us</span>
          </h2>
          <p className="mt-3 text-[#475569] text-sm sm:text-base leading-relaxed">
            Reach out to our conference helpline team for delegate inquiries, registrations, or directions to the venue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Helpline Card */}
          <div className="bg-[#F8FAFC] rounded-3xl p-7 border border-slate-200 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-[#E8871A] flex items-center justify-center mb-5">
                <Phone size={22} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44] mb-4">
                Helpline No. (For Conference)
              </h3>

              <div className="space-y-3.5">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <p className="font-bold text-sm text-[#0A1F44] mb-1">Dr. Charit</p>
                  <a
                    href="tel:+919034588173"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#E8871A] hover:underline"
                  >
                    <Phone size={14} />
                    <span>+91 9034588173</span>
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <p className="font-bold text-sm text-[#0A1F44] mb-1">Dr. Mamta</p>
                  <a
                    href="tel:+919887595300"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#E8871A] hover:underline"
                  >
                    <Phone size={14} />
                    <span>+91 9887595300</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Campus Venue Card */}
          <div className="bg-[#F8FAFC] rounded-3xl p-7 border border-slate-200 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 text-[#0A1F44] flex items-center justify-center mb-5">
                <MapPin size={22} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44] mb-3">
                Conference Venue
              </h3>
              <p className="text-[#334155] text-sm leading-relaxed mb-6 font-medium">
                <strong className="text-[#0A1F44]">Geeta University Campus</strong>
                <br />
                NH-71A, Naultha, Gohana Road,
                <br />
                Panipat, Haryana (132145), India.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1.5">Official Website</p>
              <a
                href="https://www.geetauniversity.edu.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0A1F44] hover:text-[#E8871A] transition-colors"
              >
                <Globe size={15} className="text-[#E8871A]" />
                <span>www.geetauniversity.edu.in</span>
              </a>
            </div>
          </div>

          {/* Google Maps Embed Card */}
          <div className="bg-[#F8FAFC] rounded-3xl p-7 border border-slate-200 flex flex-col shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-[#E8871A] flex items-center justify-center mb-5">
              <Globe size={22} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0A1F44] mb-4">
              Location Map
            </h3>
            <div className="relative w-full h-[180px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex-1">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3479.377497089641!2d76.89281097546439!3d29.30060045343027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390dc3b5533b6d9f%3A0x1b563db61bcc0195!2sGEETA%20UNIVERSITY%2C%20NAULTHA%2C%20PANIPAT!5e0!3m2!1sen!2sin!4v1772790894721!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Geeta University Location Map"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
