"use client";

import React, { useEffect, useRef, useState } from "react";
import { Doctor, EmergencyCenter, MOCK_DOCTORS, MOCK_EMERGENCY_CENTERS } from "@/lib/medical-data";
import { MapPin, Phone, Star, ShieldCheck, Clock, Navigation, Hospital, User, CheckCircle2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface MedicalMapProps {
  selectedCategory?: string;
  onSelectDoctor?: (doctor: Doctor) => void;
  userCoordinates?: [number, number];
}

export function MedicalMap({
  selectedCategory = "all",
  onSelectDoctor,
  userCoordinates = [43.2389, 76.8897]
}: MedicalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<EmergencyCenter | null>(null);
  const [bookedDoctorId, setBookedDoctorId] = useState<string | null>(null);

  // Sync prop changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const filteredDoctors = activeCategory === "all"
    ? MOCK_DOCTORS
    : activeCategory === "emergency"
    ? []
    : MOCK_DOCTORS.filter(d => d.category === activeCategory);

  const showEmergencyCenters = activeCategory === "all" || activeCategory === "emergency";

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      const L = (await import("leaflet")).default;

      if (!isMounted) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: userCoordinates,
          zoom: 13,
          zoomControl: true
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach(m => map.removeLayer(m));
      markersRef.current = [];

      // Patient location marker (pulsing blue)
      const userIcon = L.divIcon({
        className: "custom-user-marker",
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-8 w-8 animate-ping rounded-full bg-blue-500 opacity-60"></span>
            <span class="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border-2 border-white shadow-lg items-center justify-center text-[9px] font-bold text-white">Сіз</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const userMarker = L.marker(userCoordinates, { icon: userIcon })
        .addTo(map)
        .bindPopup("<b>📍 Сіздің орналасқан жеріңіз</b><br/>Алматы, Қазақстан");
      markersRef.current.push(userMarker);

      // Add doctor markers
      filteredDoctors.forEach(doc => {
        const docIcon = L.divIcon({
          className: "custom-doctor-marker",
          html: `
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-md text-white hover:scale-110 transition-transform cursor-pointer">
              <span class="text-xs">👨‍⚕️</span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker(doc.coordinates, { icon: docIcon })
          .addTo(map)
          .on("click", () => {
            setSelectedDoctor(doc);
            setSelectedCenter(null);
            if (onSelectDoctor) onSelectDoctor(doc);
          });

        marker.bindTooltip(`<b>${doc.name}</b><br/>${doc.specialty}<br/>Қашықтық: ${doc.distanceKm} км`, {
          direction: "top",
          offset: [0, -10]
        });

        markersRef.current.push(marker);
      });

      // Add Emergency stations markers
      if (showEmergencyCenters) {
        MOCK_EMERGENCY_CENTERS.forEach(em => {
          const emIcon = L.divIcon({
            className: "custom-emergency-marker",
            html: `
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-md text-white hover:scale-110 transition-transform cursor-pointer animate-pulse">
                <span class="text-xs font-black">103</span>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const emMarker = L.marker(em.coordinates, { icon: emIcon })
            .addTo(map)
            .on("click", () => {
              setSelectedCenter(em);
              setSelectedDoctor(null);
            });

          emMarker.bindTooltip(`<b>🚨 ${em.name}</b><br/>24/7 Шұғыл көмек`, {
            direction: "top",
            offset: [0, -10]
          });

          markersRef.current.push(emMarker);
        });
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, [activeCategory, filteredDoctors.length, showEmergencyCenters, userCoordinates]);

  const handleFocusDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setSelectedCenter(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(doc.coordinates, 15, { duration: 1.2 });
    }
  };

  const handleFocusCenter = (center: EmergencyCenter) => {
    setSelectedCenter(center);
    setSelectedDoctor(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(center.coordinates, 15, { duration: 1.2 });
    }
  };

  const categories = [
    { key: "all", label: "Барлық мамандар" },
    { key: "cardiologist", label: "Кардиолог" },
    { key: "therapist", label: "Терапевт" },
    { key: "neurologist", label: "Невролог" },
    { key: "pediatrician", label: "Педиатр" },
    { key: "traumatologist", label: "Травматолог" },
    { key: "pulmonologist", label: "Пульмонолог" },
    { key: "emergency", label: "🚨 103 Станциялары" }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
      {/* Category Pills Header */}
      <div className="p-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.key
                ? cat.key === "emergency"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Container: Map + Sidebar list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-[480px]">
        {/* Map View */}
        <div className="lg:col-span-8 relative min-h-[350px] lg:min-h-full">
          <div ref={mapContainerRef} className="w-full h-full min-h-[350px]" />
          
          {/* Legend badge on map */}
          <div className="absolute top-3 left-3 z-[1000] bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 p-2.5 rounded-lg shadow-xl text-[11px] text-zinc-200 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 border border-white" />
              <span>Сіздің орналасқан жеріңіз</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white" />
              <span>Дәрігерлер / Клиникалар</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 border border-white" />
              <span>103 Жедел көмек пункттері</span>
            </div>
          </div>
        </div>

        {/* Doctor & Hospital Details Sidebar */}
        <div className="lg:col-span-4 bg-zinc-900/50 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col h-full max-h-[550px]">
          <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Табылған мамандар мен мекемелер ({filteredDoctors.length + (showEmergencyCenters ? MOCK_EMERGENCY_CENTERS.length : 0)})
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Тексерілген
            </span>
          </div>

          <div className="p-3 overflow-y-auto space-y-3 flex-1">
            {/* Show Selected Doctor Highlight Card if active */}
            {selectedDoctor && (
              <div className="p-3.5 bg-emerald-950/40 border-2 border-emerald-500 rounded-xl space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Таңдалған дәрігер</span>
                    <h4 className="text-sm font-bold text-white">{selectedDoctor.name}</h4>
                    <p className="text-xs text-zinc-300">{selectedDoctor.specialty}</p>
                  </div>
                  <span className="text-2xl">{selectedDoctor.avatar}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-300">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {selectedDoctor.rating}
                  </span>
                  <span>({selectedDoctor.reviewCount} пікір)</span>
                  <span>•</span>
                  <span>Тәжірибе: {selectedDoctor.experienceYears} жыл</span>
                </div>

                <div className="text-xs text-zinc-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Hospital className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{selectedDoctor.clinicName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{selectedDoctor.address} ({selectedDoctor.distanceKm} км)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                    <span>Қабылдау құны: {selectedDoctor.consultationFee}</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <a
                    href={`tel:${selectedDoctor.phone}`}
                    className="flex-1 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Қоңырау
                  </a>
                  <button
                    onClick={() => setBookedDoctorId(selectedDoctor.id)}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
                  >
                    {bookedDoctorId === selectedDoctor.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Жазылдыңыз!
                      </>
                    ) : (
                      "Қабылдауға жазылу"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Show Selected Emergency Center Highlight Card */}
            {selectedCenter && (
              <div className="p-3.5 bg-red-950/40 border-2 border-red-500 rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-red-400">Шұғыл медициналық станция</span>
                <h4 className="text-sm font-bold text-white">{selectedCenter.name}</h4>
                <div className="text-xs text-zinc-300 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-red-400" /> 24/7 Тәулік бойы жұмыс істейді
                </div>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {selectedCenter.address} ({selectedCenter.distanceKm} км)
                </p>
                <div className="pt-2 flex gap-2">
                  <a
                    href="tel:103"
                    className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-600/30"
                  >
                    <Phone className="w-3.5 h-3.5" /> 103 Жедел шақыру
                  </a>
                </div>
              </div>
            )}

            {/* List of Doctors */}
            {filteredDoctors.map(doc => (
              <div
                key={doc.id}
                onClick={() => handleFocusDoctor(doc)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedDoctor?.id === doc.id
                    ? "bg-zinc-800/80 border-emerald-500 shadow-sm"
                    : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{doc.avatar}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{doc.name}</h4>
                      <p className="text-[11px] text-zinc-400">{doc.specialty}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400">{doc.distanceKm} км</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1 text-amber-400 font-medium">
                    <Star className="w-3 h-3 fill-amber-400" /> {doc.rating}
                  </span>
                  <span>{doc.clinicName}</span>
                </div>
              </div>
            ))}

            {/* List of Emergency Stations */}
            {showEmergencyCenters &&
              MOCK_EMERGENCY_CENTERS.map(center => (
                <div
                  key={center.id}
                  onClick={() => handleFocusCenter(center)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedCenter?.id === center.id
                      ? "bg-zinc-800/80 border-red-500 shadow-sm"
                      : "bg-zinc-900/60 border-zinc-800 hover:border-red-900/50 hover:bg-zinc-800/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">103</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{center.name}</h4>
                        <p className="text-[11px] text-red-400">Шұғыл көмек (24/7)</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-400">{center.distanceKm} км</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
