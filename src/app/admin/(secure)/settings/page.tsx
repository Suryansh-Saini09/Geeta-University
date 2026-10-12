import { notFound } from "next/navigation";
import Link from "next/link";

import {
  updateAdmissionCtaAction,
  updateAnnouncementSettingsAction,
  updateContactSettingsAction,
  updateSiteMetadataAction,
  updateSocialLinksAction,
} from "@/features/admin/settings/actions";
import { hasPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import {
  getAdmissionCtaSettings,
  getAnnouncementSettings,
  getContactSettings,
  getSiteMetadataSettings,
  getSocialLinksSettings,
} from "@/server/services/siteSettings";

export const dynamic = "force-dynamic";

interface SettingsPageProps {
  searchParams: Promise<{
    tab?: string;
    saved?: string;
    error?: string;
  }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const [session, params] = await Promise.all([requireAdminSession(), searchParams]);
  if (!hasPermission(session.user.role, "manageSettings")) notFound();

  const currentTab = params.tab || "contact";

  const [contact, announcement, cta, social, metadata] = await Promise.all([
    getContactSettings(),
    getAnnouncementSettings(),
    getAdmissionCtaSettings(),
    getSocialLinksSettings(),
    getSiteMetadataSettings(),
  ]);

  const tabs = [
    { id: "contact", label: "Contact Details" },
    { id: "announcement", label: "Announcement Bar" },
    { id: "cta", label: "Admission CTA" },
    { id: "social", label: "Social Links" },
    { id: "metadata", label: "General Metadata" },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold text-[#0A1F44]">Site Settings</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage global site configuration, header announcement, contact details, and social links.
        </p>
      </div>

      {params.saved ? (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          Settings updated successfully.
        </p>
      ) : null}

      {params.error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {params.error}
        </p>
      ) : null}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap border-b border-slate-200 gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/admin/settings?tab=${tab.id}`}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${
              currentTab === tab.id
                ? "border-slate-300 text-[#0A1F44]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* TAB 1: CONTACT DETAILS */}
      {currentTab === "contact" ? (
        <form action={updateContactSettingsAction} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">University Contact Details</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-1 text-sm font-semibold text-slate-700 sm:col-span-2">
              <span>University Name</span>
              <input
                name="universityName"
                type="text"
                required
                defaultValue={contact.universityName}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Primary Phone</span>
              <input
                name="phonePrimary"
                type="tel"
                required
                defaultValue={contact.phonePrimary}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Secondary / Toll-Free Phone</span>
              <input
                name="phoneSecondary"
                type="tel"
                required
                defaultValue={contact.phoneSecondary}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>General Email</span>
              <input
                name="emailPrimary"
                type="email"
                required
                defaultValue={contact.emailPrimary}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Admissions Email</span>
              <input
                name="emailAdmissions"
                type="email"
                required
                defaultValue={contact.emailAdmissions}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700 sm:col-span-2">
              <span>Campus Address</span>
              <input
                name="location"
                type="text"
                required
                defaultValue={contact.location}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700 sm:col-span-2">
              <span>Location Subtitle / Landmarks</span>
              <input
                name="locationDetails"
                type="text"
                required
                defaultValue={contact.locationDetails}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Working Hours</span>
              <input
                name="workingHours"
                type="text"
                required
                defaultValue={contact.workingHours}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Google Maps Embed / Link URL</span>
              <input
                name="mapUrl"
                type="text"
                defaultValue={contact.mapUrl}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0A1F44] transition-colors"
          >
            Save Contact Details
          </button>
        </form>
      ) : null}

      {/* TAB 2: ANNOUNCEMENT BAR */}
      {currentTab === "announcement" ? (
        <form action={updateAnnouncementSettingsAction} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">Header Announcement Bar</h3>

          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 cursor-pointer">
            <input
              name="enabled"
              type="checkbox"
              defaultChecked={announcement.enabled}
              className="h-5 w-5 rounded border-slate-300 text-[#0A1F44] focus:ring-[#E8871A]"
            />
            <span>Enable Top Announcement Bar</span>
          </label>

          <label className="block space-y-1 text-sm font-semibold text-slate-700">
            <span>Announcement Text</span>
            <input
              name="text"
              type="text"
              maxLength={300}
              placeholder="e.g. Admissions Open 2026-27 — Apply Today for GUTS Scholarship Exam!"
              defaultValue={announcement.text}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Action Target Link (href)</span>
              <input
                name="href"
                type="text"
                placeholder="e.g. /admissions or https://geetauniversity.edu.in"
                defaultValue={announcement.href}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Open Link In</span>
              <select
                name="target"
                defaultValue={announcement.target}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              >
                <option value="_self">Same Window (_self)</option>
                <option value="_blank">New Tab (_blank)</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0A1F44] transition-colors"
          >
            Save Announcement Settings
          </button>
        </form>
      ) : null}

      {/* TAB 3: ADMISSION CTA */}
      {currentTab === "cta" ? (
        <form action={updateAdmissionCtaAction} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">Global Admission CTA Button</h3>

          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 cursor-pointer">
            <input
              name="enabled"
              type="checkbox"
              defaultChecked={cta.enabled}
              className="h-5 w-5 rounded border-slate-300 text-[#0A1F44] focus:ring-[#E8871A]"
            />
            <span>Show Admission CTA in Navbar & Header</span>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Button Label</span>
              <input
                name="label"
                type="text"
                required
                maxLength={100}
                defaultValue={cta.label}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Destination URL (href)</span>
              <input
                name="href"
                type="text"
                required
                defaultValue={cta.href}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700 sm:col-span-2">
              <span>Open Link Target</span>
              <select
                name="target"
                defaultValue={cta.target}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              >
                <option value="_self">Same Window (_self)</option>
                <option value="_blank">New Tab (_blank)</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0A1F44] transition-colors"
          >
            Save Admission CTA
          </button>
        </form>
      ) : null}

      {/* TAB 4: SOCIAL LINKS */}
      {currentTab === "social" ? (
        <form action={updateSocialLinksAction} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">Official Social Media Links</h3>
          <p className="text-xs text-slate-500">
            Edit the list of official social channels displayed in the Navbar topbar, Footer, and Floating bar.
          </p>

          <label className="block space-y-1.5 text-sm font-semibold text-slate-700">
            <span>Social Links Configuration (JSON)</span>
            <textarea
              name="linksJson"
              rows={12}
              defaultValue={JSON.stringify(social.links, null, 2)}
              className="w-full rounded-lg border border-slate-300 p-3 font-mono text-xs text-slate-900 focus:border-slate-300 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0A1F44] transition-colors"
          >
            Save Social Links
          </button>
        </form>
      ) : null}

      {/* TAB 5: GENERAL METADATA */}
      {currentTab === "metadata" ? (
        <form action={updateSiteMetadataAction} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">General Site Metadata</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Site Name</span>
              <input
                name="siteName"
                type="text"
                required
                defaultValue={metadata.siteName}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Abbreviation / Short Name</span>
              <input
                name="shortName"
                type="text"
                required
                defaultValue={metadata.shortName}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700 sm:col-span-2">
              <span>Tagline</span>
              <input
                name="tagline"
                type="text"
                defaultValue={metadata.tagline}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700 sm:col-span-2">
              <span>Site Description</span>
              <textarea
                name="siteDescription"
                rows={3}
                defaultValue={metadata.siteDescription}
                className="w-full rounded-lg border border-slate-300 p-3 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Default Language</span>
              <input
                name="defaultLanguage"
                type="text"
                defaultValue={metadata.defaultLanguage}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Copyright Text</span>
              <input
                name="copyrightText"
                type="text"
                defaultValue={metadata.copyrightText}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Logo URL</span>
              <input
                name="logoUrl"
                type="text"
                defaultValue={metadata.logoUrl}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              <span>Favicon URL</span>
              <input
                name="faviconUrl"
                type="text"
                defaultValue={metadata.faviconUrl}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-slate-300 focus:outline-none"
              />
            </label>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0A1F44] transition-colors"
          >
            Save General Metadata
          </button>
        </form>
      ) : null}
    </div>
  );
}
