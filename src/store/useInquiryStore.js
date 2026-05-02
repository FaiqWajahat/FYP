'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  currentStep: 1,

  // Step 1 — Product
  categoryId: '',
  uploadedDesignImage: null, // base64 data URL
  uploadedDesignName: '',

  // Step 2 — Construction (dynamic per category)
  construction: {},

  // Step 3 — Material
  fabricId: '',
  gsm: 0,
  customFabricNotes: '',

  // Step 4 — Color & Artwork
  colorType: 'solid', // solid | two-tone | multi-zone | sublimation
  zoneColors: {},      // { Body: '#111', Sleeves: '#fff', ... }
  customPantone: '',
  artworkPlacements: [], // [{ zone, technique, fileName, notes }]
  artworkNotes: '',

  // Step 5 — Sizing
  sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0, '3XL': 0 },
  sizeChartFile: null,
  sizeChartData: null, // base64
  customMeasurements: false,
  measurements: { chest: '', length: '', sleeve: '', shoulder: '', waist: '', hem: '' },
  gradingNotes: '',

  // Step 6 — Branding & Packaging
  labelType: '',
  labelPlacement: '',
  labelArtworkFile: null,
  labelArtworkData: null, // base64
  packaging: [],        // array of packaging option ids
  hangTagFile: null,
  hangTagData: null, // base64

  // Step 7 — Delivery & Business
  timeline: 'standard',
  destination: '',
  incoterm: 'fob',
  sampleRequired: false,
  sampleQty: 1,
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  specialNotes: '',
};

// List of all state keys to persist (excludes functions)
const STATE_KEYS = Object.keys(initialState);

export const useInquiryStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // ─── Navigation ────────────────────────────────────────
      setStep: (step) => {
        set({ currentStep: step });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      nextStep: () => {
        set((s) => ({ currentStep: Math.min(s.currentStep + 1, 8) }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      prevStep: () => {
        set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      // ─── Step 1 — Product ─────────────────────────────────
      setCategoryId: (id) => set({ categoryId: id }),
      setUploadedDesign: (dataUrl, name) => set({ uploadedDesignImage: dataUrl, uploadedDesignName: name }),
      clearUploadedDesign: () => set({ uploadedDesignImage: null, uploadedDesignName: '' }),

      // ─── Step 2 — Construction ─────────────────────────────
      setConstruction: (key, value) =>
        set((s) => ({ construction: { ...s.construction, [key]: value } })),
      resetConstruction: () => set({ construction: {} }),

      // ─── Step 3 — Material ─────────────────────────────────
      setFabricId: (id) => set({ fabricId: id }),
      setGsm: (gsm) => set({ gsm }),
      setCustomFabricNotes: (v) => set({ customFabricNotes: v }),

      // ─── Step 4 — Color & Artwork ──────────────────────────
      setColorType: (v) => set({ colorType: v, zoneColors: {} }),
      setZoneColor: (zone, color) =>
        set((s) => ({ zoneColors: { ...s.zoneColors, [zone]: color } })),
      setCustomPantone: (v) => set({ customPantone: v }),
      addArtworkPlacement: (placement) =>
        set((s) => ({ artworkPlacements: [...s.artworkPlacements, placement] })),
      removeArtworkPlacement: (index) =>
        set((s) => ({ artworkPlacements: s.artworkPlacements.filter((_, i) => i !== index) })),
      updateArtworkPlacement: (index, data) =>
        set((s) => ({
          artworkPlacements: s.artworkPlacements.map((p, i) => (i === index ? { ...p, ...data } : p)),
        })),
      setArtworkNotes: (v) => set({ artworkNotes: v }),

      // ─── Step 5 — Sizing ───────────────────────────────────
      updateSize: (sz, val) =>
        set((s) => ({ sizes: { ...s.sizes, [sz]: Math.max(0, parseInt(val) || 0) } })),
      setSizeChartFile: (name, data) => set({ sizeChartFile: name, sizeChartData: data || null }),
      setCustomMeasurements: (v) => set({ customMeasurements: v }),
      updateMeasurement: (k, v) =>
        set((s) => ({ measurements: { ...s.measurements, [k]: v } })),
      setGradingNotes: (v) => set({ gradingNotes: v }),

      // ─── Step 6 — Branding & Packaging ─────────────────────
      setLabelType: (v) => set({ labelType: v }),
      setLabelPlacement: (v) => set({ labelPlacement: v }),
      setLabelArtworkFile: (name, data) => set({ labelArtworkFile: name, labelArtworkData: data || null }),
      togglePackaging: (id) =>
        set((s) => ({
          packaging: s.packaging.includes(id)
            ? s.packaging.filter((p) => p !== id)
            : [...s.packaging, id],
        })),
      setHangTagFile: (name, data) => set({ hangTagFile: name, hangTagData: data || null }),

      // ─── Step 7 — Delivery & Business ──────────────────────
      setTimeline: (v) => set({ timeline: v }),
      setDestination: (v) => set({ destination: v }),
      setIncoterm: (v) => set({ incoterm: v }),
      setSampleRequired: (v) => set({ sampleRequired: v }),
      setSampleQty: (v) => set({ sampleQty: v }),
      setCompanyName: (v) => set({ companyName: v }),
      setContactName: (v) => set({ contactName: v }),
      setEmail: (v) => set({ email: v }),
      setPhone: (v) => set({ phone: v }),
      setWebsite: (v) => set({ website: v }),
      setSpecialNotes: (v) => set({ specialNotes: v }),

      // ─── Reset ─────────────────────────────────────────────
      resetInquiry: () => set({ ...initialState }),

      // ─── Computed ──────────────────────────────────────────
      getTotalQty: () => Object.values(get().sizes).reduce((a, b) => a + b, 0),
    }),
    {
      name: 'inquiry-wizard-storage',
      // Persist only plain state keys (no functions, no large base64)
      partialize: (state) => {
        const persisted = {};
        STATE_KEYS.forEach((key) => {
          // Skip the large base64 image — it would blow up localStorage
          if (key === 'uploadedDesignImage') return;
          if (key === 'sizeChartData') return;
          if (key === 'labelArtworkData') return;
          if (key === 'hangTagData') return;
          persisted[key] = state[key];
        });
        return persisted;
      },
    }
  )
);
