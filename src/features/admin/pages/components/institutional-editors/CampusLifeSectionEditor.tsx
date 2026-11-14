"use client";

import React from "react";
import {
  Plus,
  Trash2,
} from "lucide-react";
import {
  CmsImagePreviewInput,
  CmsAutoTextarea,
  CmsStringRepeater,
} from "@/features/admin/pages/components/CmsFieldHelpers";
import type { SpecializedSectionEditorProps } from "./types";

export function CampusLifeSectionEditor({
  sectionKey,
  body = {},
  onChange,
}: SpecializedSectionEditorProps) {
  /* =========================================================
     1. HERO & OVERVIEW
  ========================================================= */
  if (sectionKey === "hero") {
    const state = body || {};
    const stats = state.stats || [];

    return (
      <div className="space-y-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Hero Banner &amp; Overview</h3>
          <p className="text-xs text-slate-500">Page title, subtitle, main description, and highlight metrics.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Page Title</label>
            <input
              type="text"
              value={state.title || "Campus Life"}
              onChange={(e) => onChange({ ...state, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-[#0A1F44]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle / Tagline</label>
            <input
              type="text"
              value={state.subtitle || ""}
              onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
            />
          </div>
        </div>

        <CmsAutoTextarea
          label="Main Campus Life Description"
          value={state.description || ""}
          onChange={(val) => onChange({ ...state, description: val })}
          rows={4}
        />

        <CmsImagePreviewInput
          label="Top Hero Banner Image URL"
          value={state.bannerImage || ""}
          onChange={(val) => onChange({ ...state, bannerImage: val })}
        />

        {/* Hero Stats */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <label className="block text-xs font-bold uppercase text-[#0A1F44]">
              Hero Highlights &amp; Statistics ({stats.length})
            </label>
            <button
              type="button"
              onClick={() => {
                const newStat = { value: "100%", label: "New Highlight" };
                onChange({ ...state, stats: [...stats, newStat] });
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Metric</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.map((st: any, idx: number) => (
              <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                  <span className="text-xs font-bold text-slate-700">Metric #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => onChange({ ...state, stats: stats.filter((_: any, i: number) => i !== idx) })}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block font-bold text-slate-600 mb-0.5">Value</label>
                    <input
                      type="text"
                      value={st.value || ""}
                      onChange={(e) => {
                        const copy = [...stats];
                        copy[idx] = { ...copy[idx], value: e.target.value };
                        onChange({ ...state, stats: copy });
                      }}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs font-bold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-0.5">Label</label>
                    <input
                      type="text"
                      value={st.label || ""}
                      onChange={(e) => {
                        const copy = [...stats];
                        copy[idx] = { ...copy[idx], label: e.target.value };
                        onChange({ ...state, stats: copy });
                      }}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     2. FACILITIES SECTION
  ========================================================= */
  if (sectionKey === "facilities") {
    const state = body || {};
    const facilities = state.facilities || [];

    return (
      <div className="space-y-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">World Class Infrastructure</h3>
          <p className="text-xs text-slate-500">Campus buildings, labs, hostels, and academic infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={state.title || "World Class Infrastructure"}
              onChange={(e) => onChange({ ...state, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={state.subtitle || ""}
              onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <label className="block text-xs font-bold uppercase text-[#0A1F44]">
            Campus Facilities ({facilities.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const newFacility = {
                id: `fac-${Date.now()}`,
                title: "New Campus Facility",
                category: "Academics",
                description: "",
                image: "",
                features: [],
              };
              onChange({ ...state, facilities: [...facilities, newFacility] });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Facility</span>
          </button>
        </div>

        <div className="space-y-4">
          {facilities.map((fac: any, idx: number) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800">
                  Facility #{idx + 1}: {fac.title}
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ ...state, facilities: facilities.filter((_: any, i: number) => i !== idx) })}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Facility Name</label>
                  <input
                    type="text"
                    value={fac.title || ""}
                    onChange={(e) => {
                      const copy = [...facilities];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      onChange({ ...state, facilities: copy });
                    }}
                    className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Category</label>
                  <select
                    value={fac.category || "Academics"}
                    onChange={(e) => {
                      const copy = [...facilities];
                      copy[idx] = { ...copy[idx], category: e.target.value };
                      onChange({ ...state, facilities: copy });
                    }}
                    className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="Academics">Academics</option>
                    <option value="Research">Research</option>
                    <option value="Community">Community</option>
                    <option value="Living">Living</option>
                  </select>
                </div>
              </div>

              <CmsAutoTextarea
                label="Facility Overview"
                value={fac.description || ""}
                onChange={(val) => {
                  const copy = [...facilities];
                  copy[idx] = { ...copy[idx], description: val };
                  onChange({ ...state, facilities: copy });
                }}
                rows={2}
              />

              <CmsImagePreviewInput
                label="Facility Photo URL"
                value={fac.image || ""}
                onChange={(val) => {
                  const copy = [...facilities];
                  copy[idx] = { ...copy[idx], image: val };
                  onChange({ ...state, facilities: copy });
                }}
              />

              <CmsStringRepeater
                title="Key Feature Highlights"
                items={Array.isArray(fac.features) ? fac.features : []}
                onChange={(newFeats) => {
                  const copy = [...facilities];
                  copy[idx] = { ...copy[idx], features: newFeats };
                  onChange({ ...state, facilities: copy });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
     3. SPORTS SECTION
  ========================================================= */
  if (sectionKey === "sports") {
    const state = body || {};
    const sports = state.sports || [];

    return (
      <div className="space-y-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Sports Facilities</h3>
          <p className="text-xs text-slate-500">Indoor and outdoor athletics, grounds, and courts.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={state.title || "Sports & Athletics"}
              onChange={(e) => onChange({ ...state, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={state.subtitle || ""}
              onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <label className="block text-xs font-bold uppercase text-[#0A1F44]">
            Sports Facilities ({sports.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const newSport = {
                id: `sport-${Date.now()}`,
                title: "New Sport Field",
                tagline: "Sport Tagline",
                type: "Outdoor",
                image: "",
                highlights: "",
              };
              onChange({ ...state, sports: [...sports, newSport] });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Sport</span>
          </button>
        </div>

        <div className="space-y-4">
          {sports.map((sp: any, idx: number) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800">
                  Sport #{idx + 1}: {sp.title}
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ ...state, sports: sports.filter((_: any, i: number) => i !== idx) })}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Sport Name</label>
                  <input
                    type="text"
                    value={sp.title || ""}
                    onChange={(e) => {
                      const copy = [...sports];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      onChange({ ...state, sports: copy });
                    }}
                    className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Tagline</label>
                  <input
                    type="text"
                    value={sp.tagline || ""}
                    onChange={(e) => {
                      const copy = [...sports];
                      copy[idx] = { ...copy[idx], tagline: e.target.value };
                      onChange({ ...state, sports: copy });
                    }}
                    className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Type</label>
                  <select
                    value={sp.type || "Outdoor"}
                    onChange={(e) => {
                      const copy = [...sports];
                      copy[idx] = { ...copy[idx], type: e.target.value };
                      onChange({ ...state, sports: copy });
                    }}
                    className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="Outdoor">Outdoor</option>
                    <option value="Indoor">Indoor</option>
                    <option value="Fitness">Fitness</option>
                  </select>
                </div>
              </div>

              <CmsImagePreviewInput
                label="Sport Facility Photo URL"
                value={sp.image || ""}
                onChange={(val) => {
                  const copy = [...sports];
                  copy[idx] = { ...copy[idx], image: val };
                  onChange({ ...state, sports: copy });
                }}
              />

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Highlights</label>
                <input
                  type="text"
                  value={sp.highlights || ""}
                  onChange={(e) => {
                    const copy = [...sports];
                    copy[idx] = { ...copy[idx], highlights: e.target.value };
                    onChange({ ...state, sports: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
     4. EVENTS SECTION
  ========================================================= */
  if (sectionKey === "events") {
    const state = body || {};
    const events = state.events || [];
    const spotlight = state.videoSpotlight || {};

    return (
      <div className="space-y-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Campus Events &amp; Fests</h3>
          <p className="text-xs text-slate-500">Convocations, cultural fests, hackathons, and video highlights.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={state.title || "Campus Events & Fests"}
              onChange={(e) => onChange({ ...state, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={state.subtitle || ""}
              onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
            />
          </div>
        </div>

        {/* Video Spotlight Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <h4 className="font-bold text-xs uppercase text-[#0A1F44]">Event Video Spotlight Card</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-600 mb-0.5">Spotlight Title</label>
              <input
                type="text"
                value={spotlight.title || ""}
                onChange={(e) => onChange({ ...state, videoSpotlight: { ...spotlight, title: e.target.value } })}
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-0.5">YouTube Video ID / URL</label>
              <input
                type="text"
                value={spotlight.videoUrl || ""}
                onChange={(e) => onChange({ ...state, videoSpotlight: { ...spotlight, videoUrl: e.target.value } })}
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
              />
            </div>
          </div>
          <CmsImagePreviewInput
            label="Spotlight Thumbnail Poster"
            value={spotlight.thumbnail || ""}
            onChange={(val) => onChange({ ...state, videoSpotlight: { ...spotlight, thumbnail: val } })}
          />
        </div>

        {/* Events Repeater */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <label className="block text-xs font-bold uppercase text-[#0A1F44]">
            Campus Events ({events.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const newEv = {
                id: `event-${Date.now()}`,
                title: "New Campus Fest",
                tagline: "Event Tagline",
                category: "Cultural",
                image: "",
                description: "",
              };
              onChange({ ...state, events: [...events, newEv] });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Event</span>
          </button>
        </div>

        <div className="space-y-4">
          {events.map((ev: any, idx: number) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800">
                  Event #{idx + 1}: {ev.title}
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ ...state, events: events.filter((_: any, i: number) => i !== idx) })}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Event Name</label>
                  <input
                    type="text"
                    value={ev.title || ""}
                    onChange={(e) => {
                      const copy = [...events];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      onChange({ ...state, events: copy });
                    }}
                    className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Tagline</label>
                  <input
                    type="text"
                    value={ev.tagline || ""}
                    onChange={(e) => {
                      const copy = [...events];
                      copy[idx] = { ...copy[idx], tagline: e.target.value };
                      onChange({ ...state, events: copy });
                    }}
                    className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-0.5">Category</label>
                  <input
                    type="text"
                    value={ev.category || "Cultural"}
                    onChange={(e) => {
                      const copy = [...events];
                      copy[idx] = { ...copy[idx], category: e.target.value };
                      onChange({ ...state, events: copy });
                    }}
                    className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>

              <CmsImagePreviewInput
                label="Event Banner Photo URL"
                value={ev.image || ""}
                onChange={(val) => {
                  const copy = [...events];
                  copy[idx] = { ...copy[idx], image: val };
                  onChange({ ...state, events: copy });
                }}
              />

              <CmsAutoTextarea
                label="Event Description"
                value={ev.description || ""}
                onChange={(val) => {
                  const copy = [...events];
                  copy[idx] = { ...copy[idx], description: val };
                  onChange({ ...state, events: copy });
                }}
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
     5. PERSONALITIES SECTION
  ========================================================= */
  if (sectionKey === "personalities") {
    const state = body || {};
    const items = state.personalities || [];

    return (
      <div className="space-y-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Eminent Personalities</h3>
          <p className="text-xs text-slate-500">Keynote speakers, celebrity guests, and national dignitaries.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={state.title || "Eminent Personalities at GU"}
              onChange={(e) => onChange({ ...state, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={state.subtitle || ""}
              onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <label className="block text-xs font-bold uppercase text-[#0A1F44]">
            Dignitaries &amp; Personalities ({items.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const newItem = {
                id: `ep-${Date.now()}`,
                title: "Distinguished Dignitary Visit",
                role: "Eminent Guest",
                image: "",
              };
              onChange({ ...state, personalities: [...items, newItem] });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Personality</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800">Person #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => onChange({ ...state, personalities: items.filter((_: any, i: number) => i !== idx) })}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <CmsImagePreviewInput
                label="Photo URL"
                value={item.image || ""}
                onChange={(val) => {
                  const copy = [...items];
                  copy[idx] = { ...copy[idx], image: val };
                  onChange({ ...state, personalities: copy });
                }}
              />

              <input
                type="text"
                placeholder="Title / Event Session Name"
                value={item.title || ""}
                onChange={(e) => {
                  const copy = [...items];
                  copy[idx] = { ...copy[idx], title: e.target.value };
                  onChange({ ...state, personalities: copy });
                }}
                className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
     6. FAQS SECTION
  ========================================================= */
  if (sectionKey === "faqs") {
    const state = body || {};
    const faqs = state.faqs || [];

    return (
      <div className="space-y-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Campus Life FAQs</h3>
          <p className="text-xs text-slate-500">Student queries regarding hostel rules, security, clubs, and sports.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={state.title || "Frequently Asked Questions"}
              onChange={(e) => onChange({ ...state, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={state.subtitle || ""}
              onChange={(e) => onChange({ ...state, subtitle: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <label className="block text-xs font-bold uppercase text-[#0A1F44]">
            FAQ Questions &amp; Answers ({faqs.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const newFaq = {
                id: `faq-${Date.now()}`,
                question: "New Campus Life Question?",
                answer: "Detailed answer goes here...",
              };
              onChange({ ...state, faqs: [...faqs, newFaq] });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add FAQ</span>
          </button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq: any, idx: number) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800">FAQ #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => onChange({ ...state, faqs: faqs.filter((_: any, i: number) => i !== idx) })}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-0.5 text-xs">Question</label>
                <input
                  type="text"
                  value={faq.question || faq.q || ""}
                  onChange={(e) => {
                    const copy = [...faqs];
                    copy[idx] = { ...copy[idx], question: e.target.value };
                    onChange({ ...state, faqs: copy });
                  }}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>

              <CmsAutoTextarea
                label="Answer"
                value={faq.answer || faq.a || ""}
                onChange={(val) => {
                  const copy = [...faqs];
                  copy[idx] = { ...copy[idx], answer: val };
                  onChange({ ...state, faqs: copy });
                }}
                rows={3}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-xs text-slate-500">
      Select a valid campus life section to edit.
    </div>
  );
}
