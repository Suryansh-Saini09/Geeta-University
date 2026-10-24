"use client";

import React, { useState } from "react";
import { HOSTEL_DATA, TRANSPORT_ROUTES, HostelOption, TransportRoute } from "@/data/feeAndScholarshipData";
import { Building2, Bus, CheckCircle2, ArrowLeft, ArrowRight, RotateCcw, Loader2, Sparkles } from "lucide-react";

interface TransportAndHostelPredictorProps {
  data?: {
    title?: string;
    subtitle?: string;
    hostelData?: HostelOption[];
    transportRoutes?: TransportRoute[];
  };
}

export default function TransportAndHostelPredictor({ data }: TransportAndHostelPredictorProps = {}) {
  const hostelList = (data?.hostelData && data.hostelData.length > 0) ? data.hostelData : HOSTEL_DATA;
  const transportList = (data?.transportRoutes && data.transportRoutes.length > 0) ? data.transportRoutes : TRANSPORT_ROUTES;
  const title = data?.title || "Hostel & Transport Fee Predictor";
  const subtitle = data?.subtitle || "Estimate your annual hostel accommodation or bus travel charges across Haryana and Delhi NCR in seconds.";

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState<"hostel" | "travel" | null>(null);

  // Hostel Form State
  const [hostelSharing, setHostelSharing] = useState<"3" | "4">("3");
  const [hostelAc, setHostelAc] = useState<"ac" | "non-ac">("ac");
  const [hostelWashroom, setHostelWashroom] = useState<"attached" | "common">("attached");

  // Travel Form State
  const [selectedRouteName, setSelectedRouteName] = useState<string>(transportList[0]?.route || "Panipat");

  // Loading state for smooth calculation effect
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Results state
  const [matchedHostel, setMatchedHostel] = useState<HostelOption | null>(null);
  const [matchedTransport, setMatchedTransport] = useState<TransportRoute | null>(null);

  // Handler for sharing change (4-sharing only has common washroom)
  const handleSharingChange = (val: "3" | "4") => {
    setHostelSharing(val);
    if (val === "4") {
      setHostelWashroom("common");
    }
  };

  const handleServiceSelect = (service: "hostel" | "travel") => {
    setSelectedService(service);
    setErrorMessage(null);
  };

  const handleProceedToStep2 = () => {
    if (!selectedService) {
      setErrorMessage("Please select a service option to proceed.");
      return;
    }
    setErrorMessage(null);
    setActiveStep(2);
  };

  const handleCalculateFee = () => {
    setIsLoading(true);

    setTimeout(() => {
      if (selectedService === "hostel") {
        const sharingNum = parseInt(hostelSharing, 10);
        const match =
          hostelList.find(
            (h) => h.sharing === sharingNum && h.ac === hostelAc && h.washroom === hostelWashroom
          ) || hostelList[0];
        setMatchedHostel(match);
        setMatchedTransport(null);
      } else if (selectedService === "travel") {
        const match =
          transportList.find((r) => r.route === selectedRouteName) || transportList[0];
        setMatchedTransport(match);
        setMatchedHostel(null);
      }
      setIsLoading(false);
      setActiveStep(3);
    }, 600);
  };

  const handleRestart = () => {
    setSelectedService(null);
    setHostelSharing("3");
    setHostelAc("ac");
    setHostelWashroom("attached");
    setSelectedRouteName(transportList[0]?.route || "Panipat");
    setActiveStep(1);
  };

  return (
    <section id="hostel-transport-calculator" className="w-full bg-white py-12 md:py-16 border-b border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0A1F44]/5 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0A1F44] mb-3">
            <Bus className="h-3.5 w-3.5 text-[#E8871A]" />
            <span>Campus Living &amp; Commute</span>
          </div>
          <h2 className="font-serif text-[30px] sm:text-[38px] md:text-[44px] font-black text-[#0A1F44] leading-[1.2]">
            {title}
          </h2>
          <p className="mt-3 text-[16px] sm:text-[18px] text-[#475569]">
            {subtitle}
          </p>
        </div>

        {/* Predictor Card Wrapper */}
        <div className="max-w-4xl mx-auto rounded-[24px] bg-[#FAF7F2] border border-[#E2E8F0] p-6 sm:p-10 md:p-12 shadow-sm">
          {/* Step Indicator */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative flex items-center justify-between">
              {/* Connecting Line */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-[#E2E8F0] z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#06355F] transition-all duration-500 z-0"
                style={{
                  width: activeStep === 1 ? "0%" : activeStep === 2 ? "50%" : "100%",
                }}
              />

              {/* Step 1 Node */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold transition-all ${
                    activeStep >= 1
                      ? "bg-[#06355F] text-white shadow-md"
                      : "bg-white text-[#64748B] border-2 border-[#CBD5E1]"
                  }`}
                >
                  1
                </div>
                <span className="mt-1.5 text-[12px] font-bold text-[#06355F]">Service</span>
              </div>

              {/* Step 2 Node */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold transition-all ${
                    activeStep >= 2
                      ? "bg-[#06355F] text-white shadow-md"
                      : "bg-white text-[#64748B] border-2 border-[#CBD5E1]"
                  }`}
                >
                  2
                </div>
                <span className="mt-1.5 text-[12px] font-bold text-[#06355F]">Options</span>
              </div>

              {/* Step 3 Node */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold transition-all ${
                    activeStep === 3
                      ? "bg-[#E8871A] text-white shadow-md"
                      : "bg-white text-[#64748B] border-2 border-[#CBD5E1]"
                  }`}
                >
                  3
                </div>
                <span className="mt-1.5 text-[12px] font-bold text-[#E8871A]">Result</span>
              </div>
            </div>
          </div>

          {/* STEP 1: Select Service */}
          {activeStep === 1 && (
            <div className="animate-fadeIn space-y-8">
              <div className="text-center">
                <label className="text-[17px] font-bold text-[#0A1F44]">
                  What fee would you like to estimate? <span className="text-[#E8871A]">*</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Hostel Card */}
                <div
                  onClick={() => handleServiceSelect("hostel")}
                  className={`group relative rounded-[20px] border-2 p-6 sm:p-8 text-center cursor-pointer transition-all ${
                    selectedService === "hostel"
                      ? "border-[#E8871A] bg-white shadow-lg ring-4 ring-[#E8871A]/15"
                      : "border-[#CBD5E1] bg-white hover:border-[#06355F] hover:shadow-md"
                  }`}
                >
                  {selectedService === "hostel" && (
                    <div className="absolute top-4 right-4 text-[#E8871A]">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  )}
                  <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-all ${
                      selectedService === "hostel"
                        ? "bg-[#E8871A] text-white"
                        : "bg-[#F1F5F9] text-[#06355F] group-hover:bg-[#06355F] group-hover:text-white"
                    }`}
                  >
                    <Building2 className="h-7 w-7" />
                  </div>
                  <h3 className="font-serif text-[20px] font-bold text-[#06355F] mb-2">
                    Hostel Fee
                  </h3>
                  <p className="text-[14px] text-[#64748B] leading-relaxed">
                    Check approved annual charges for AC/Non-AC 3-4 sharing rooms and attached/common washrooms.
                  </p>
                </div>

                {/* Transport Card */}
                <div
                  onClick={() => handleServiceSelect("travel")}
                  className={`group relative rounded-[20px] border-2 p-6 sm:p-8 text-center cursor-pointer transition-all ${
                    selectedService === "travel"
                      ? "border-[#E8871A] bg-white shadow-lg ring-4 ring-[#E8871A]/15"
                      : "border-[#CBD5E1] bg-white hover:border-[#06355F] hover:shadow-md"
                  }`}
                >
                  {selectedService === "travel" && (
                    <div className="absolute top-4 right-4 text-[#E8871A]">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  )}
                  <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-all ${
                      selectedService === "travel"
                        ? "bg-[#E8871A] text-white"
                        : "bg-[#F1F5F9] text-[#06355F] group-hover:bg-[#06355F] group-hover:text-white"
                    }`}
                  >
                    <Bus className="h-7 w-7" />
                  </div>
                  <h3 className="font-serif text-[20px] font-bold text-[#06355F] mb-2">
                    Travel / Transport Fee
                  </h3>
                  <p className="text-[14px] text-[#64748B] leading-relaxed">
                    Check distances and approved annual bus route charges from 24 regional stops across Delhi NCR &amp; Haryana.
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="text-center text-[14px] font-bold text-[#DC2626]">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#06355F] px-7 py-3 text-[15px] font-bold text-white shadow-md hover:bg-[#0A1F44] transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Configure Options */}
          {activeStep === 2 && !isLoading && (
            <div className="animate-fadeIn space-y-6">
              {selectedService === "hostel" ? (
                <div>
                  <h3 className="font-serif text-[22px] font-bold text-[#06355F] text-center mb-6">
                    Configure Your Hostel Preference
                  </h3>

                  <div className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-[18px] border border-[#E2E8F0]">
                    {/* Room Sharing */}
                    <div>
                      <label className="block text-[13px] font-bold uppercase tracking-wider text-[#0A1F44] mb-1.5">
                        Room Sharing <span className="text-[#E8871A]">*</span>
                      </label>
                      <select
                        value={hostelSharing}
                        onChange={(e) => handleSharingChange(e.target.value as "3" | "4")}
                        className="w-full rounded-[10px] border border-[#CBD5E1] bg-white px-4 py-3 text-[15px] font-semibold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20 transition-all cursor-pointer"
                      >
                        <option value="3">3 Sharing Room</option>
                        <option value="4">4 Sharing Room</option>
                      </select>
                    </div>

                    {/* AC / Non-AC */}
                    <div>
                      <label className="block text-[13px] font-bold uppercase tracking-wider text-[#0A1F44] mb-1.5">
                        Room Comfort (AC / Non-AC) <span className="text-[#E8871A]">*</span>
                      </label>
                      <select
                        value={hostelAc}
                        onChange={(e) => setHostelAc(e.target.value as "ac" | "non-ac")}
                        className="w-full rounded-[10px] border border-[#CBD5E1] bg-white px-4 py-3 text-[15px] font-semibold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20 transition-all cursor-pointer"
                      >
                        <option value="ac">AC Room</option>
                        <option value="non-ac">Non-AC Room</option>
                      </select>
                    </div>

                    {/* Washroom */}
                    <div>
                      <label className="block text-[13px] font-bold uppercase tracking-wider text-[#0A1F44] mb-1.5">
                        Washroom Configuration <span className="text-[#E8871A]">*</span>
                      </label>
                      <select
                        value={hostelWashroom}
                        onChange={(e) => setHostelWashroom(e.target.value as "attached" | "common")}
                        className="w-full rounded-[10px] border border-[#CBD5E1] bg-white px-4 py-3 text-[15px] font-semibold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20 transition-all cursor-pointer"
                      >
                        {hostelSharing === "3" && (
                          <option value="attached">Attached Washroom</option>
                        )}
                        <option value="common">Common Washroom</option>
                      </select>
                      {hostelSharing === "4" && (
                        <p className="mt-1 text-[12px] text-[#64748B]">
                          *Attached washroom is exclusively available in 3-sharing rooms.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-serif text-[22px] font-bold text-[#06355F] text-center mb-6">
                    Configure Your Bus Route &amp; Stop
                  </h3>

                  <div className="max-w-lg mx-auto bg-white p-6 rounded-[18px] border border-[#E2E8F0]">
                    <label className="block text-[13px] font-bold uppercase tracking-wider text-[#0A1F44] mb-1.5">
                      Select Your Bus Route / Stop <span className="text-[#E8871A]">*</span>
                    </label>
                    <select
                      value={selectedRouteName}
                      onChange={(e) => setSelectedRouteName(e.target.value)}
                      className="w-full rounded-[10px] border border-[#CBD5E1] bg-white px-4 py-3 text-[15px] font-semibold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none focus:ring-2 focus:ring-[#E8871A]/20 transition-all cursor-pointer"
                    >
                      {transportList.map((route, idx) => (
                        <option key={idx} value={route.route}>
                          {route.route} ({route.km} Km)
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-[12.5px] text-[#64748B]">
                      Includes GPS-tracked AC buses with designated boarding points.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="inline-flex items-center gap-2 rounded-[10px] border-2 border-[#CBD5E1] bg-white px-6 py-2.5 text-[14px] font-bold text-[#475569] hover:bg-[#F1F5F9] transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleCalculateFee}
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#E8871A] px-7 py-3 text-[15px] font-bold text-white shadow-md hover:bg-[#D47309] transition-all"
                >
                  <span>Predict Fee</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Loading Animation Transition */}
          {isLoading && (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="mx-auto h-12 w-12 text-[#E8871A] animate-spin" />
              <h4 className="font-serif text-[20px] font-bold text-[#06355F]">
                Analyzing Fee Configuration...
              </h4>
              <p className="text-[14px] text-[#64748B]">
                Fetching approved 2026–27 schedules and availability.
              </p>
            </div>
          )}

          {/* STEP 3: Results Display */}
          {activeStep === 3 && !isLoading && (
            <div className="animate-fadeIn space-y-6">
              <div className="rounded-[20px] bg-white p-8 text-center border-2 border-dashed border-[#06355F]/30 shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8871A] text-white shadow-md">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h3 className="font-serif text-[20px] font-bold text-[#06355F]">
                  {selectedService === "hostel"
                    ? "Estimated Approved Hostel Fee"
                    : "Estimated Approved Transport Fee"}
                </h3>

                <div className="font-serif text-[38px] sm:text-[48px] font-black text-[#E8871A] leading-tight my-2">
                  {selectedService === "hostel"
                    ? matchedHostel?.charge || "₹1,37,000"
                    : matchedTransport?.charge || "₹29,000"}
                </div>

                <div className="text-[12px] font-extrabold uppercase tracking-wider text-[#64748B] mb-6">
                  Final Approved Annual Fee (2026–27)
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-[14px] bg-[#FAF7F2] p-5 border border-[#E2E8F0] text-left">
                  {selectedService === "hostel" && matchedHostel ? (
                    <>
                      <div className="p-2">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                          Sharing Preference
                        </span>
                        <strong className="text-[16px] text-[#06355F]">
                          {matchedHostel.sharing} Sharing Room
                        </strong>
                      </div>

                      <div className="p-2 sm:border-l border-[#E2E8F0]">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                          Room Comfort
                        </span>
                        <strong className="text-[16px] text-[#06355F]">
                          {matchedHostel.ac.toUpperCase()} Room
                        </strong>
                      </div>

                      <div className="col-span-1 sm:col-span-2 pt-3 border-t border-[#E2E8F0] p-2">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                          Washroom Configuration
                        </span>
                        <strong className="text-[16px] text-[#06355F]">
                          {matchedHostel.washroom === "attached"
                            ? "Attached Washroom"
                            : "Common Washroom"}
                        </strong>
                      </div>
                    </>
                  ) : selectedService === "travel" && matchedTransport ? (
                    <>
                      <div className="p-2">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                          Selected Bus Route / Stop
                        </span>
                        <strong className="text-[16px] text-[#06355F]">
                          {matchedTransport.route}
                        </strong>
                      </div>

                      <div className="p-2 sm:border-l border-[#E2E8F0]">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                          One-Way Distance
                        </span>
                        <strong className="text-[16px] text-[#06355F]">
                          {matchedTransport.km} Km
                        </strong>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Reset / Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 rounded-[10px] border-2 border-[#06355F] bg-white px-6 py-3 text-[14.5px] font-bold text-[#06355F] hover:bg-[#F1F5F9] transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Predict Another Fee</span>
                </button>

                <a
                  href="https://admissions.geetauniversity.edu.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#E8871A] px-7 py-3 text-[14.5px] font-bold text-white shadow-md hover:bg-[#D47309] transition-all"
                >
                  <span>Book Seat / Apply Now</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
