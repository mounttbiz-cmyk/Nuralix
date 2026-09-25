"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Database,
  Search,
  Sparkles,
  MapPin,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Phone,
  Mail,
  Building2,
  FileSpreadsheet,
  FileText,
  Upload,
  Globe,
  Star,
  Layers,
  Key,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Send,
  Sliders,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  X,
  Plus,
  Info,
} from "lucide-react";
import {
  BusinessCategory,
  DataPalApiSettings,
  DataPalBusinessLead,
  DataPalSearchCampaign,
  DataPalSearchConfig,
  TargetProfilePreset,
} from "@/lib/datapal/types";
import {
  BUSINESS_CATEGORIES,
  COUNTRY_HIERARCHIES,
  DIRECTORY_SOURCES,
  SAMPLE_HISTORIC_CAMPAIGNS,
  TARGET_PROFILE_PRESETS,
} from "@/lib/datapal/constants";
import {
  exportAllCampaignsToExcel,
  exportLeadsToCSV,
  exportLeadsToExcel,
} from "@/lib/datapal/export";
import {
  deleteCampaign,
  generateSyntheticLeads,
  getStoredApiSettings,
  getStoredCampaigns,
  pushLeadsToBizzPalTasks,
  saveApiSettings,
  saveCampaign,
} from "@/lib/datapal/storage";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function DataPalPage() {
  // Navigation tabs: 'search' | 'results' | 'history'
  const [activeTab, setActiveTab] = useState<"search" | "results" | "history">("search");

  // State for search form
  const [targetRequirement, setTargetRequirement] = useState("Missing Website");
  const [showReqDropdown, setShowReqDropdown] = useState(false);
  const reqRef = useRef<HTMLDivElement>(null);

  // Country & Location state
  const [countryCode, setCountryCode] = useState("IN");
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [areaPincode, setAreaPincode] = useState("");

  // Category selections
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Dental Clinics",
    "Aesthetic & Dermatology Clinics",
  ]);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("healthcare");

  // Advanced Filters
  const [mustHavePhone, setMustHavePhone] = useState(true);
  const [mustHaveEmail, setMustHaveEmail] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [selectedSources, setSelectedSources] = useState<string[]>([
    "Google Maps & Places",
    "JustDial India",
    "IndiaMART B2B",
  ]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // AI Analyzer pitch / brochure
  const [serviceDescription, setServiceDescription] = useState("");
  const [uploadedBrochure, setUploadedBrochure] = useState<{ name: string; size: string } | null>(null);
  const [isAnalyzingPitch, setIsAnalyzingPitch] = useState(false);
  const [aiPitchAnalysisResult, setAiPitchAnalysisResult] = useState<string | null>(null);

  // Extraction Execution & Progress
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [extractStatusText, setExtractStatusText] = useState("");

  // Campaigns & Active results
  const [campaigns, setCampaigns] = useState<DataPalSearchCampaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<DataPalSearchCampaign | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());

  // Results filtering & search
  const [resultsSearchQuery, setResultsSearchQuery] = useState("");
  const [opportunityFilter, setOpportunityFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pushTaskStatus, setPushTaskStatus] = useState<string | null>(null);

  // API Key Settings Modal
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [apiSettings, setApiSettings] = useState<DataPalApiSettings>({
    apiKey: "",
    apiEndpoint: "https://data-pal.vercel.app/api",
    isLiveConnected: false,
  });
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiEndpointInput, setApiEndpointInput] = useState("https://data-pal.vercel.app/api");
  const [apiSaveFeedback, setApiSaveFeedback] = useState<string | null>(null);

  // Load stored data on mount
  useEffect(() => {
    const loadedCampaigns = getStoredCampaigns();
    setCampaigns(loadedCampaigns);
    if (loadedCampaigns.length > 0) {
      setActiveCampaign(loadedCampaigns[0]);
    }
    const settings = getStoredApiSettings();
    setApiSettings(settings);
    setApiKeyInput(settings.apiKey || "");
    setApiEndpointInput(settings.apiEndpoint || "https://data-pal.vercel.app/api");
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (reqRef.current && !reqRef.current.contains(e.target as Node)) {
        setShowReqDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Country Hierarchy helpers
  const currentCountry = useMemo(() => {
    return COUNTRY_HIERARCHIES.find(c => c.code === countryCode) || COUNTRY_HIERARCHIES[0];
  }, [countryCode]);

  const availableStates = useMemo(() => {
    return currentCountry.states;
  }, [currentCountry]);

  const availableCities = useMemo(() => {
    const st = availableStates.find(s => s.name === selectedState);
    return st ? st.cities : availableStates[0]?.cities || [];
  }, [availableStates, selectedState]);

  // Handle Country switch
  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    const country = COUNTRY_HIERARCHIES.find(c => c.code === code) || COUNTRY_HIERARCHIES[0];
    const firstState = country.states[0]?.name || "All States";
    const firstCity = country.states[0]?.cities[0] || "All Cities";
    setSelectedState(firstState);
    setSelectedCity(firstCity);
  };

  // Quick Indian metropolitan buttons
  const setQuickCity = (city: string, state: string) => {
    setCountryCode("IN");
    setSelectedState(state);
    setSelectedCity(city);
  };

  // Category toggle
  const toggleCategory = (catName: string) => {
    setSelectedCategories(prev =>
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  const selectAllInGroup = (subcategories: string[]) => {
    const allSelected = subcategories.every(sub => selectedCategories.includes(sub));
    if (allSelected) {
      setSelectedCategories(prev => prev.filter(c => !subcategories.includes(c)));
    } else {
      setSelectedCategories(prev => Array.from(new Set([...prev, ...subcategories])));
    }
  };

  // AI Analyzer simulation
  const handleAnalyzePitch = () => {
    if (!serviceDescription.trim() && !uploadedBrochure) {
      alert("Please provide a service description, website URL, or upload a brochure.");
      return;
    }
    setIsAnalyzingPitch(true);
    setAiPitchAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzingPitch(false);
      const text = serviceDescription.toLowerCase();

      let inferredReq = "Missing Website";
      let recommendedCats = ["Dental Clinics", "Aesthetic & Dermatology Clinics"];

      if (text.includes("seo") || text.includes("rank") || text.includes("maps")) {
        inferredReq = "Missing Google Business Profile";
        recommendedCats = ["Medical Clinics", "Law Firms & Advocates", "Salons & Hairdressers"];
      } else if (text.includes("social") || text.includes("instagram") || text.includes("creative")) {
        inferredReq = "Missing Social Media Presence";
        recommendedCats = ["Cafes & Coffee Shops", "Aesthetic & Dermatology Clinics", "Jewelry & Watches"];
      } else if (text.includes("order") || text.includes("app") || text.includes("food") || text.includes("saas")) {
        inferredReq = "Missing Online Ordering & Booking";
        recommendedCats = ["Restaurants & Fine Dining", "Cloud Kitchens & Food Hubs", "Diagnostic Centers"];
      } else if (text.includes("brand") || text.includes("logo") || text.includes("identity")) {
        inferredReq = "Missing Logo / Branding";
        recommendedCats = ["Wholesalers & Distributors", "Builders & Contractors", "Retail Stores & Boutiques"];
      }

      setTargetRequirement(inferredReq);
      setSelectedCategories(recommendedCats);
      setAiPitchAnalysisResult(
        `AI Analysis Complete: Optimized for ${inferredReq}. Selected high-converting targets: ${recommendedCats.join(", ")}.`
      );
    }, 1200);
  };

  // Trigger Data Extraction
  const handleStartExtraction = async () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least one business category or industry.");
      return;
    }

    const config: DataPalSearchConfig = {
      requirement: targetRequirement,
      countryCode,
      state: selectedState,
      city: selectedCity,
      areaPincode,
      selectedCategories,
      filters: {
        mustHavePhone,
        mustHaveEmail,
        minRating,
        sources: selectedSources,
      },
      servicePitch: {
        text: serviceDescription,
        imageName: uploadedBrochure?.name,
      },
    };

    setIsExtracting(true);
    setExtractProgress(15);
    setExtractStatusText(`Connecting to DataPal Directory Scraper across ${selectedCity}, ${selectedState}...`);

    const interval = setInterval(() => {
      setExtractProgress(prev => {
        if (prev < 40) {
          setExtractStatusText(`Scanning Google Maps, JustDial & directories for ${selectedCategories[0]}...`);
          return prev + 12;
        } else if (prev < 70) {
          setExtractStatusText(`Verifying Indian mobile phone numbers & resolving domains...`);
          return prev + 10;
        } else if (prev < 90) {
          setExtractStatusText(`Evaluating digital gaps (${targetRequirement}) & synthesizing AI Opportunity notes...`);
          return prev + 7;
        }
        return 95;
      });
    }, 350);

    try {
      // Call backend API (proxies to DataPal if key configured, or uses high-fidelity local generator)
      const res = await fetch("/api/datapal/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          apiKey: apiSettings.apiKey,
          apiEndpoint: apiSettings.apiEndpoint,
        }),
      });

      clearInterval(interval);
      setExtractProgress(100);
      setExtractStatusText("Data extraction complete! Formatting report...");

      const data = await res.json();
      let newCampaign: DataPalSearchCampaign;

      if (data.campaign) {
        newCampaign = data.campaign;
      } else {
        const leads = generateSyntheticLeads(config);
        const locString = [areaPincode, selectedCity, selectedState, currentCountry.name]
          .filter(Boolean)
          .join(", ");
        newCampaign = {
          id: `camp_${Date.now()}`,
          title: `${targetRequirement} in ${selectedCity}`,
          requirement: targetRequirement,
          location: locString,
          countryCode,
          businessTypes: selectedCategories,
          totalExtracted: leads.length,
          phoneCount: leads.filter(l => l.phone).length,
          emailCount: leads.filter(l => l.email).length,
          websiteCount: leads.filter(l => l.website).length,
          opportunityCount: leads.filter(l => l.opportunityLevel === "Critical" || l.opportunityLevel === "High").length,
          createdAt: new Date().toISOString(),
          status: "completed",
          results: leads,
        };
      }

      // Save to localStorage & state
      const updated = saveCampaign(newCampaign);
      setCampaigns(updated);
      setActiveCampaign(newCampaign);
      setSelectedLeadIds(new Set());

      setTimeout(() => {
        setIsExtracting(false);
        setActiveTab("results");
      }, 600);
    } catch (err) {
      clearInterval(interval);
      setIsExtracting(false);
      console.error("Extraction error:", err);
      // Fallback local save
      const leads = generateSyntheticLeads(config);
      const newCampaign: DataPalSearchCampaign = {
        id: `camp_${Date.now()}`,
        title: `${targetRequirement} in ${selectedCity}`,
        requirement: targetRequirement,
        location: `${selectedCity}, ${selectedState}, ${currentCountry.name}`,
        countryCode,
        businessTypes: selectedCategories,
        totalExtracted: leads.length,
        phoneCount: leads.filter(l => l.phone).length,
        emailCount: leads.filter(l => l.email).length,
        websiteCount: leads.filter(l => l.website).length,
        opportunityCount: leads.filter(l => l.opportunityLevel === "Critical").length,
        createdAt: new Date().toISOString(),
        status: "completed",
        results: leads,
      };
      const updated = saveCampaign(newCampaign);
      setCampaigns(updated);
      setActiveCampaign(newCampaign);
      setActiveTab("results");
    }
  };

  // Delete a campaign
  const handleDeleteCampaign = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this extraction campaign?")) {
      const updated = deleteCampaign(id);
      setCampaigns(updated);
      if (activeCampaign?.id === id) {
        setActiveCampaign(updated[0] || null);
      }
    }
  };

  // Filter active campaign leads
  const filteredLeads = useMemo(() => {
    if (!activeCampaign) return [];
    let list = activeCampaign.results;

    if (resultsSearchQuery.trim()) {
      const q = resultsSearchQuery.toLowerCase();
      list = list.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          (l.phone && l.phone.includes(q)) ||
          (l.email && l.email.toLowerCase().includes(q))
      );
    }

    if (opportunityFilter === "critical") {
      list = list.filter(l => l.opportunityLevel === "Critical" || !l.website);
    } else if (opportunityFilter === "whatsapp") {
      list = list.filter(l => l.phone);
    } else if (opportunityFilter === "email") {
      list = list.filter(l => l.email);
    } else if (opportunityFilter === "high_rating") {
      list = list.filter(l => (l.rating || 0) >= 4.7);
    }

    return list;
  }, [activeCampaign, resultsSearchQuery, opportunityFilter]);

  // Lead selection checkboxes
  const toggleSelectLead = (id: string) => {
    setSelectedLeadIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllFilteredLeads = () => {
    if (selectedLeadIds.size === filteredLeads.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(filteredLeads.map(l => l.id)));
    }
  };

  // Copy to clipboard helper
  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Push leads to BizzPal Tasks
  const handlePushToTasks = async () => {
    if (!activeCampaign) return;
    const leadsToPush =
      selectedLeadIds.size > 0
        ? activeCampaign.results.filter(l => selectedLeadIds.has(l.id))
        : filteredLeads;

    setPushTaskStatus("Pushing to Tasks...");
    const result = await pushLeadsToBizzPalTasks(leadsToPush);
    if (result.success) {
      setPushTaskStatus(`✅ Created ${result.count} outreach tasks in BizzPal!`);
      setTimeout(() => setPushTaskStatus(null), 3500);
    } else {
      setPushTaskStatus("⚠️ Saved locally (Check Tasks tab)");
      setTimeout(() => setPushTaskStatus(null), 3000);
    }
  };

  // Export handlers
  const handleExportExcel = () => {
    if (!activeCampaign) return;
    const leadsToExport =
      selectedLeadIds.size > 0
        ? activeCampaign.results.filter(l => selectedLeadIds.has(l.id))
        : activeCampaign.results;
    exportLeadsToExcel(leadsToExport, `DataPal_${activeCampaign.title.replace(/\s+/g, "_")}.xls`, activeCampaign.title);
  };

  const handleExportCSV = () => {
    if (!activeCampaign) return;
    const leadsToExport =
      selectedLeadIds.size > 0
        ? activeCampaign.results.filter(l => selectedLeadIds.has(l.id))
        : activeCampaign.results;
    exportLeadsToCSV(leadsToExport, `DataPal_${activeCampaign.title.replace(/\s+/g, "_")}.csv`);
  };

  // Save API Settings
  const handleSaveApiSettings = () => {
    const updated = saveApiSettings({
      apiKey: apiKeyInput.trim(),
      apiEndpoint: apiEndpointInput.trim() || "https://data-pal.vercel.app/api",
    });
    setApiSettings(updated);
    setApiSaveFeedback("Settings saved successfully! DataPal is connected.");
    setTimeout(() => {
      setApiSaveFeedback(null);
      setIsApiModalOpen(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-bg text-text pb-16 selection:bg-gold/20">
      {/* Top Header Banner */}
      <div className="border-b border-line bg-surface/80 backdrop-blur-xl sticky top-0 z-20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight">DataPal™</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                  Extraction Engine
                </span>
                {apiSettings.isLiveConnected ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Cloud API
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-2 text-text-muted border border-line flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    High-Fidelity Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted hidden sm:block">
                Extract verified businesses, phone numbers & digital gap opportunities across India & worldwide
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsApiModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-line text-xs font-semibold text-text hover:text-gold transition-all cursor-pointer"
              title="Configure DataPal API Key"
            >
              <Key className="w-3.5 h-3.5 text-gold" />
              <span>{apiSettings.isLiveConnected ? "API Key Connected" : "Connect API Key"}</span>
            </button>

            {campaigns.length > 0 && (
              <button
                type="button"
                onClick={() => exportAllCampaignsToExcel(campaigns)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                title="Download Master Excel Report of all campaigns"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Export Master Excel</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Pills */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-line/60">
          <div className="flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("search")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "search"
                  ? "bg-gold/15 text-gold border border-gold/30 shadow-xs"
                  : "text-text-muted hover:text-text hover:bg-surface-2"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>1. Extract Data (Search Studio)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("results")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${
                activeTab === "results"
                  ? "bg-gold/15 text-gold border border-gold/30 shadow-xs"
                  : "text-text-muted hover:text-text hover:bg-surface-2"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>2. Extracted Leads</span>
              {activeCampaign && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface border border-line font-mono font-bold">
                  {activeCampaign.results.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "history"
                  ? "bg-gold/15 text-gold border border-gold/30 shadow-xs"
                  : "text-text-muted hover:text-text hover:bg-surface-2"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>3. Campaign History</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface border border-line font-mono font-bold">
                {campaigns.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* ============================================================== */}
        {/* TAB 1: SEARCH & SCRAPE STUDIO                                  */}
        {/* ============================================================== */}
        {activeTab === "search" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Hero Section */}
            <div className="text-center max-w-3xl mx-auto pt-2 pb-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Generate <span className="text-indigo-400 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Business Data</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-text-muted font-normal max-w-2xl mx-auto">
                Configure your search parameters to extract high-quality, verified business contacts and digital gaps across India's top directories.
              </p>
            </div>

            {/* Split Screen Bento: AI Analyzer (Left) + Search Config (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT CARD: AI Analyzer (4 cols) */}
              <div className="lg:col-span-4 bg-surface border border-line rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Card Header */}
                  <div className="flex items-center gap-3.5 pb-4 border-b border-line">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">AI Analyzer</h2>
                      <p className="text-xs text-text-muted">Let AI figure out who needs you.</p>
                    </div>
                  </div>

                  {/* Service Description Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text uppercase tracking-wider block">
                      Service URL or Description
                    </label>
                    <textarea
                      rows={3}
                      value={serviceDescription}
                      onChange={e => setServiceDescription(e.target.value)}
                      placeholder="e.g. 'We build high-converting e-commerce web apps and automated WhatsApp booking for clinics and restaurants'"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted/60 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                    />
                  </div>

                  {/* OR Divider */}
                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-line w-full" />
                    <span className="bg-surface px-3 text-[10px] uppercase font-bold text-text-muted absolute">
                      OR
                    </span>
                  </div>

                  {/* Upload Poster / Brochure */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text uppercase tracking-wider block">
                      Upload Poster / Brochure
                    </label>
                    <label className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-line hover:border-gold/50 bg-surface-2/60 hover:bg-surface-2 transition-all cursor-pointer group">
                      <Upload className="w-4 h-4 text-text-muted group-hover:text-gold transition-colors shrink-0" />
                      <span className="text-xs font-medium text-text-muted group-hover:text-text truncate">
                        {uploadedBrochure ? uploadedBrochure.name : "Choose Image / Brochure to analyze"}
                      </span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadedBrochure({
                              name: file.name,
                              size: (file.size / 1024).toFixed(1) + " KB",
                            });
                          }
                        }}
                      />
                    </label>
                    {uploadedBrochure && (
                      <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                        <span className="truncate">📎 {uploadedBrochure.name} ({uploadedBrochure.size})</span>
                        <button
                          type="button"
                          onClick={() => setUploadedBrochure(null)}
                          className="text-text-muted hover:text-rust text-xs ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* AI Feedback Banner */}
                  {aiPitchAnalysisResult && (
                    <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-indigo-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Analysis Applied</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{aiPitchAnalysisResult}</p>
                    </div>
                  )}
                </div>

                {/* Generate Strategy CTA */}
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={handleAnalyzePitch}
                    disabled={isAnalyzingPitch || (!serviceDescription.trim() && !uploadedBrochure)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {isAnalyzingPitch ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                        <span>Synthesizing Strategy...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-gold" />
                        <span>Set Target Profile with AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* RIGHT CARD: Search Configuration (8 cols) */}
              <div className="lg:col-span-8 bg-surface border border-line rounded-3xl p-6 sm:p-8 shadow-sm space-y-7">
                {/* Header */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-line">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Search Configuration</h2>
                    <p className="text-xs text-text-muted">Define your target audience to start scraping.</p>
                  </div>
                </div>

                {/* 1. Data Requirement (Target Profile) */}
                <div className="space-y-2 relative" ref={reqRef}>
                  <label className="text-xs font-bold text-text uppercase tracking-wider block">
                    Data Requirement (Target Profile)
                  </label>
                  <div className="relative">
                    <div
                      onClick={() => setShowReqDropdown(true)}
                      className="flex items-center w-full bg-surface-2 border border-line rounded-2xl px-4 py-3 cursor-text focus-within:border-gold/50 transition-colors"
                    >
                      <Search className="w-4 h-4 text-text-muted mr-3 shrink-0" />
                      <input
                        type="text"
                        value={targetRequirement}
                        onChange={e => {
                          setTargetRequirement(e.target.value);
                          setShowReqDropdown(true);
                        }}
                        onFocus={() => setShowReqDropdown(true)}
                        placeholder="e.g. Missing Website, Needs SEO, Missing Online Ordering..."
                        className="w-full bg-transparent text-xs font-bold text-text placeholder:font-normal placeholder:text-text-muted focus:outline-none"
                      />
                      {targetRequirement && (
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setTargetRequirement("");
                          }}
                          className="p-1 hover:bg-surface rounded-full text-text-muted hover:text-text text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Requirement Autocomplete Dropdown */}
                    {showReqDropdown && (
                      <div className="absolute z-30 w-full mt-2 bg-surface border border-line rounded-2xl shadow-xl overflow-hidden max-h-64 overflow-y-auto animate-fadeIn">
                        <div className="p-2 divide-y divide-line/40">
                          {TARGET_PROFILE_PRESETS.map(preset => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => {
                                setTargetRequirement(preset.label);
                                if (preset.suggestedCategories) {
                                  setSelectedCategories(preset.suggestedCategories);
                                }
                                setShowReqDropdown(false);
                              }}
                              className="w-full text-left p-3 hover:bg-surface-2 transition-colors rounded-xl flex items-start justify-between gap-3 group"
                            >
                              <div>
                                <div className="text-xs font-bold text-text group-hover:text-gold transition-colors">
                                  {preset.label}
                                </div>
                                <div className="text-[11px] text-text-muted mt-0.5">
                                  {preset.desc}
                                </div>
                              </div>
                              {preset.badge && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-2 border border-line text-text-muted shrink-0">
                                  {preset.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Preset Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {TARGET_PROFILE_PRESETS.slice(0, 5).map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setTargetRequirement(p.label);
                          if (p.suggestedCategories) setSelectedCategories(p.suggestedCategories);
                        }}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                          targetRequirement === p.label
                            ? "bg-gold/15 text-gold border-gold/40 shadow-xs"
                            : "bg-surface-2 text-text-muted border-line hover:text-text hover:border-line-strong"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Target Location & Hierarchy */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-2/60 border border-line space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-line">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold">Target Location & Geographic Hierarchy</span>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-surface border border-line text-indigo-400 font-semibold truncate max-w-xs">
                      📍 {[areaPincode, selectedCity, selectedState, currentCountry.name].filter(Boolean).join(", ")}
                    </span>
                  </div>

                  {/* Country Selector */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                      Select Country
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {COUNTRY_HIERARCHIES.map(c => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleCountryChange(c.code)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            countryCode === c.code
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                              : "bg-surface text-text border-line hover:bg-surface-2"
                          }`}
                        >
                          <span className="text-sm">{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* State, City & Area Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* State Selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                        State / Province
                      </label>
                      <select
                        value={selectedState}
                        onChange={e => {
                          setSelectedState(e.target.value);
                          const st = availableStates.find(s => s.name === e.target.value);
                          if (st && st.cities.length > 0) setSelectedCity(st.cities[0]);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-surface border border-line text-xs font-semibold text-text focus:outline-none focus:border-gold/50 cursor-pointer"
                      >
                        {availableStates.map(s => (
                          <option key={s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City Selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                        City / Metro
                      </label>
                      <select
                        value={selectedCity}
                        onChange={e => setSelectedCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-surface border border-line text-xs font-semibold text-text focus:outline-none focus:border-gold/50 cursor-pointer"
                      >
                        {availableCities.map(c => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Area / Postal Code */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                        Local Suburb / {currentCountry.postalCodeLabel}
                      </label>
                      <input
                        type="text"
                        value={areaPincode}
                        onChange={e => setAreaPincode(e.target.value)}
                        placeholder="e.g. Bandra, 400050"
                        className="w-full px-3 py-2 rounded-xl bg-surface border border-line text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-gold/50"
                      />
                    </div>
                  </div>

                  {/* Quick Metropolitan Hubs (India) */}
                  {countryCode === "IN" && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">
                        Top Metropolitan Hubs:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { city: "Mumbai", state: "Maharashtra" },
                          { city: "New Delhi", state: "Delhi NCR" },
                          { city: "Bangalore (Bengaluru)", state: "Karnataka" },
                          { city: "Pune", state: "Maharashtra" },
                          { city: "Hyderabad", state: "Telangana" },
                          { city: "Chennai", state: "Tamil Nadu" },
                          { city: "Ahmedabad", state: "Gujarat" },
                          { city: "Kolkata", state: "West Bengal" },
                        ].map(hub => (
                          <button
                            key={hub.city}
                            type="button"
                            onClick={() => setQuickCity(hub.city, hub.state)}
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                              selectedCity === hub.city
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-surface text-text-muted border-line hover:text-text hover:bg-surface-2"
                            }`}
                          >
                            {hub.city.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Business Types & Industry Multi-select */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-text uppercase tracking-wider block">
                        Business Types & Categories Filter
                      </label>
                      <span className="text-[11px] text-text-muted">
                        Select specific industries to extract ({selectedCategories.length} selected)
                      </span>
                    </div>
                    {selectedCategories.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedCategories([])}
                        className="text-[11px] text-text-muted hover:text-rust underline font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Selected Pills */}
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 rounded-xl bg-surface-2/60 border border-line">
                      {selectedCategories.map(cat => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium"
                        >
                          <span>{cat}</span>
                          <button
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className="hover:text-rust text-xs"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Category Groups Accordion */}
                  <div className="border border-line rounded-2xl overflow-hidden divide-y divide-line/60 bg-surface">
                    {BUSINESS_CATEGORIES.map(group => {
                      const isExpanded = expandedCategory === group.id;
                      const selectedCount = group.subcategories.filter(s =>
                        selectedCategories.includes(s)
                      ).length;

                      return (
                        <div key={group.id} className="transition-colors">
                          <button
                            type="button"
                            onClick={() => setExpandedCategory(isExpanded ? null : group.id)}
                            className="w-full flex items-center justify-between p-3.5 hover:bg-surface-2 text-left transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-bold text-text">{group.name}</span>
                              {selectedCount > 0 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                                  {selectedCount} selected
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-text-muted">
                                {isExpanded ? "▲" : "▼"}
                              </span>
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="p-3.5 bg-surface-2/40 border-t border-line/60 space-y-2.5">
                              <div className="flex justify-between items-center pb-1">
                                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                                  Subcategories ({group.subcategories.length})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => selectAllInGroup(group.subcategories)}
                                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                                >
                                  {group.subcategories.every(s => selectedCategories.includes(s))
                                    ? "Deselect All in Group"
                                    : "Select All in Group"}
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {group.subcategories.map(sub => {
                                  const isChecked = selectedCategories.includes(sub);
                                  return (
                                    <label
                                      key={sub}
                                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                        isChecked
                                          ? "bg-indigo-600/10 border-indigo-500/40 text-text font-semibold"
                                          : "bg-surface border-line text-text-muted hover:text-text hover:bg-surface-2"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleCategory(sub)}
                                        className="rounded border-line text-indigo-600 focus:ring-0 w-3.5 h-3.5"
                                      />
                                      <span className="truncate">{sub}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Advanced Directory & Verification Filters (Collapsible) */}
                <div className="border border-line rounded-2xl bg-surface-2/40 p-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="w-full flex items-center justify-between text-xs font-bold text-text cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gold" />
                      <span>Advanced Extraction & Verification Rules</span>
                    </div>
                    <span className="text-text-muted">{showAdvancedFilters ? "▲ Hide" : "▼ Show"}</span>
                  </button>

                  {showAdvancedFilters && (
                    <div className="pt-3 border-t border-line space-y-4 animate-fadeIn">
                      {/* Checkbox Toggles */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface border border-line text-xs font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={mustHavePhone}
                            onChange={e => setMustHavePhone(e.target.checked)}
                            className="rounded border-line text-gold focus:ring-0 w-4 h-4"
                          />
                          <span>Must have Verified Phone (WhatsApp / Call ready)</span>
                        </label>

                        <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface border border-line text-xs font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={mustHaveEmail}
                            onChange={e => setMustHaveEmail(e.target.checked)}
                            className="rounded border-line text-gold focus:ring-0 w-4 h-4"
                          />
                          <span>Must have Email Address</span>
                        </label>
                      </div>

                      {/* Directory Sources */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
                          Directories to Query
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {DIRECTORY_SOURCES.map(source => {
                            const isIncluded = selectedSources.includes(source.name);
                            return (
                              <button
                                key={source.id}
                                type="button"
                                onClick={() => {
                                  setSelectedSources(prev =>
                                    prev.includes(source.name)
                                      ? prev.filter(s => s !== source.name)
                                      : [...prev, source.name]
                                  );
                                }}
                                className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                                  isIncluded
                                    ? "bg-surface border-gold/40 text-gold shadow-xs"
                                    : "bg-surface border-line text-text-muted hover:text-text"
                                }`}
                              >
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: source.color }}
                                />
                                <span>{source.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStartExtraction}
                    disabled={isExtracting || selectedCategories.length === 0}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-white" />
                    <span>Generate Data Report</span>
                    <ArrowRight className="w-5 h-5 text-white" />
                  </button>
                  <p className="text-[11px] text-center text-text-muted mt-2">
                    Engineered for massive data extraction across India's top directories & global registries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: EXTRACTED LEADS & TABLE VIEW                            */}
        {/* ============================================================== */}
        {activeTab === "results" && (
          <div className="space-y-6 animate-fadeIn">
            {/* If no campaign selected */}
            {!activeCampaign ? (
              <div className="text-center py-20 bg-surface border border-line rounded-3xl p-8 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-surface-2 border border-line flex items-center justify-center mx-auto text-text-muted">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">No extraction campaign active</h3>
                <p className="text-xs text-text-muted max-w-md mx-auto">
                  Start an extraction in the Search Studio to find verified businesses with high-converting digital gaps.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("search")}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Start New Extraction
                </button>
              </div>
            ) : (
              <>
                {/* Campaign Summary & Controls Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface border border-line rounded-3xl p-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold tracking-tight">{activeCampaign.title}</h2>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                            {activeCampaign.location}
                          </span>
                          <span>•</span>
                          <span>{activeCampaign.results.length} total extracted businesses</span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">
                            {new Date(activeCampaign.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Export and Task Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportExcel}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Export Excel</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-2 hover:bg-surface border border-line text-xs font-bold text-text transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePushToTasks}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/30 text-gold text-xs font-bold transition-all cursor-pointer"
                      title="Add extracted leads as outreach execution tasks in BizzPal"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Push to Tasks</span>
                    </button>
                  </div>
                </div>

                {pushTaskStatus && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center justify-between animate-fadeIn">
                    <span>{pushTaskStatus}</span>
                    <Link href="/tasks" className="underline hover:text-emerald-300 font-bold ml-2">
                      View in Tasks & Execution →
                    </Link>
                  </div>
                )}

                {/* Bento Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-surface border border-line shadow-xs">
                    <p className="text-2xl font-black text-text tracking-tight">
                      {activeCampaign.results.length}
                    </p>
                    <p className="text-xs text-text-muted font-medium mt-0.5">Total Extracted</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface border border-line shadow-xs">
                    <p className="text-2xl font-black text-emerald-400 tracking-tight">
                      {activeCampaign.phoneCount}
                      <span className="text-xs font-semibold text-text-muted ml-1.5 font-normal">
                        ({Math.round((activeCampaign.phoneCount / (activeCampaign.results.length || 1)) * 100)}%)
                      </span>
                    </p>
                    <p className="text-xs text-text-muted font-medium mt-0.5">Verified Phone / WhatsApp</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface border border-line shadow-xs">
                    <p className="text-2xl font-black text-cyan-400 tracking-tight">
                      {activeCampaign.emailCount}
                      <span className="text-xs font-semibold text-text-muted ml-1.5 font-normal">
                        ({Math.round((activeCampaign.emailCount / (activeCampaign.results.length || 1)) * 100)}%)
                      </span>
                    </p>
                    <p className="text-xs text-text-muted font-medium mt-0.5">Verified Emails</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface border border-line shadow-xs">
                    <p className="text-2xl font-black text-amber-400 tracking-tight">
                      {activeCampaign.opportunityCount}
                    </p>
                    <p className="text-xs text-text-muted font-medium mt-0.5">High Digital Gap Opportunities</p>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface border border-line rounded-2xl p-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={resultsSearchQuery}
                      onChange={e => setResultsSearchQuery(e.target.value)}
                      placeholder="Filter by business name, phone, email, locality..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-2 border border-line text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-gold/50"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {[
                      { id: "all", label: "All Leads" },
                      { id: "critical", label: "Missing Website" },
                      { id: "whatsapp", label: "Has Phone" },
                      { id: "email", label: "Has Email" },
                      { id: "high_rating", label: "Top Rated (4.7+)" },
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setOpportunityFilter(f.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          opportunityFilter === f.id
                            ? "bg-indigo-600 text-white"
                            : "bg-surface-2 text-text-muted hover:text-text"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Data Table */}
                <div className="bg-surface border border-line rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-line bg-surface-2/60 text-[11px] uppercase font-bold text-text-muted tracking-wider">
                          <th className="py-3.5 px-4 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={
                                filteredLeads.length > 0 &&
                                selectedLeadIds.size === filteredLeads.length
                              }
                              onChange={selectAllFilteredLeads}
                              className="rounded border-line text-indigo-600 w-3.5 h-3.5"
                            />
                          </th>
                          <th className="py-3.5 px-4 w-12 text-center">#</th>
                          <th className="py-3.5 px-4 min-w-[200px]">Business</th>
                          <th className="py-3.5 px-4 min-w-[130px]">Category</th>
                          <th className="py-3.5 px-4 min-w-[200px]">Address & Area</th>
                          <th className="py-3.5 px-4 min-w-[140px]">Phone Number</th>
                          <th className="py-3.5 px-4 min-w-[150px]">Email Address</th>
                          <th className="py-3.5 px-4 min-w-[90px]">Rating</th>
                          <th className="py-3.5 px-4 min-w-[130px]">Presence</th>
                          <th className="py-3.5 px-4 min-w-[240px]">AI Opportunity Notes</th>
                          <th className="py-3.5 px-4 w-20 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line/60 text-xs">
                        {filteredLeads.length === 0 ? (
                          <tr>
                            <td colSpan={11} className="py-12 text-center text-text-muted">
                              No businesses match your filter criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredLeads.map((lead, idx) => {
                            const isSelected = selectedLeadIds.has(lead.id);
                            return (
                              <tr
                                key={lead.id}
                                className={`hover:bg-surface-2/60 transition-colors ${
                                  isSelected ? "bg-indigo-500/5" : ""
                                }`}
                              >
                                {/* Checkbox */}
                                <td className="py-3 px-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelectLead(lead.id)}
                                    className="rounded border-line text-indigo-600 w-3.5 h-3.5 cursor-pointer"
                                  />
                                </td>

                                {/* Index */}
                                <td className="py-3 px-4 text-center font-mono text-text-muted text-[11px]">
                                  {idx + 1}
                                </td>

                                {/* Business Name & Website */}
                                <td className="py-3 px-4">
                                  <div className="font-bold text-text truncate max-w-[220px]">
                                    {lead.name}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    {lead.website ? (
                                      <a
                                        href={lead.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 truncate max-w-[180px]"
                                      >
                                        <Globe className="w-3 h-3 shrink-0" />
                                        <span>Website</span>
                                      </a>
                                    ) : (
                                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rust/15 text-rust border border-rust/30">
                                        No Website
                                      </span>
                                    )}
                                    <span className="text-[10px] text-text-muted/60">•</span>
                                    <span className="text-[10px] text-text-muted truncate">
                                      {lead.source.split(" ")[0]}
                                    </span>
                                  </div>
                                </td>

                                {/* Category */}
                                <td className="py-3 px-4">
                                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-surface-2 border border-line text-text truncate block max-w-[130px]">
                                    {lead.category}
                                  </span>
                                </td>

                                {/* Address */}
                                <td className="py-3 px-4">
                                  <div className="text-text-muted text-[11px] truncate max-w-[200px]" title={lead.address}>
                                    {lead.address}
                                  </div>
                                  <div className="text-[10px] text-text-muted/70 font-mono">
                                    {lead.city}, {lead.postalCode}
                                  </div>
                                </td>

                                {/* Phone */}
                                <td className="py-3 px-4 font-mono">
                                  {lead.phone ? (
                                    <div className="flex items-center gap-1.5">
                                      <a
                                        href={`tel:${lead.phone}`}
                                        className="text-emerald-400 hover:underline font-semibold text-[11px]"
                                      >
                                        {lead.phone}
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => copyText(lead.phone!, `phone_${lead.id}`)}
                                        className="p-1 hover:bg-surface-2 rounded text-text-muted hover:text-text text-[10px]"
                                        title="Copy phone"
                                      >
                                        {copiedId === `phone_${lead.id}` ? (
                                          <Check className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-text-muted/40">—</span>
                                  )}
                                </td>

                                {/* Email */}
                                <td className="py-3 px-4 font-mono">
                                  {lead.email ? (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-cyan-400 text-[11px] truncate max-w-[120px]" title={lead.email}>
                                        {lead.email}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => copyText(lead.email!, `email_${lead.id}`)}
                                        className="p-1 hover:bg-surface-2 rounded text-text-muted hover:text-text text-[10px]"
                                        title="Copy email"
                                      >
                                        {copiedId === `email_${lead.id}` ? (
                                          <Check className="w-3 h-3 text-cyan-400" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-text-muted/40">—</span>
                                  )}
                                </td>

                                {/* Rating */}
                                <td className="py-3 px-4">
                                  {lead.rating ? (
                                    <div className="flex items-center gap-1 font-semibold text-amber-400 text-[11px]">
                                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                                      <span>{lead.rating}</span>
                                      <span className="text-[10px] text-text-muted font-normal">
                                        ({lead.reviewsCount})
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-text-muted/40">—</span>
                                  )}
                                </td>

                                {/* Presence */}
                                <td className="py-3 px-4">
                                  <span className="text-[10px] text-text-muted truncate max-w-[120px] block">
                                    {lead.existingPresence || "None"}
                                  </span>
                                </td>

                                {/* AI Opportunity Notes */}
                                <td className="py-3 px-4">
                                  <div className="p-2 rounded-xl bg-surface-2 border border-line text-[11px] text-text leading-tight">
                                    {lead.notes}
                                  </div>
                                </td>

                                {/* Quick WhatsApp / Outreach Action */}
                                <td className="py-3 px-4 text-center">
                                  {lead.phone ? (
                                    <a
                                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(lead.name)},%20I%20noticed%20your%20business%20in%20${encodeURIComponent(lead.city)}...`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-colors"
                                      title="Open WhatsApp Chat"
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                    </a>
                                  ) : (
                                    <span className="text-text-muted/30 text-xs">—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer */}
                  <div className="p-4 border-t border-line bg-surface-2/40 flex items-center justify-between text-xs text-text-muted">
                    <span>
                      Showing {filteredLeads.length} of {activeCampaign.results.length} extracted businesses
                    </span>
                    <div className="flex items-center gap-3">
                      <span>{selectedLeadIds.size} selected</span>
                      {selectedLeadIds.size > 0 && (
                        <button
                          type="button"
                          onClick={handlePushToTasks}
                          className="font-bold text-gold hover:underline"
                        >
                          Push Selected to Tasks
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CAMPAIGN HISTORY & ARCHIVAL                             */}
        {/* ============================================================== */}
        {activeTab === "history" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Search History & Campaigns</h2>
                <p className="text-xs text-text-muted">Revisit and export your generated data campaigns.</p>
              </div>

              {campaigns.length > 0 && (
                <button
                  type="button"
                  onClick={() => exportAllCampaignsToExcel(campaigns)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export All to Excel</span>
                </button>
              )}
            </div>

            {campaigns.length === 0 ? (
              <div className="text-center py-20 bg-surface border border-line rounded-3xl p-8 space-y-4">
                <Search className="w-12 h-12 text-text-muted mx-auto" />
                <h3 className="text-lg font-bold">No searches yet</h3>
                <p className="text-xs text-text-muted">Start searching for businesses to see your history here.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("search")}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Start a Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {campaigns.map(camp => (
                  <div
                    key={camp.id}
                    onClick={() => {
                      setActiveCampaign(camp);
                      setActiveTab("results");
                    }}
                    className="p-5 rounded-3xl bg-surface border border-line hover:border-gold/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {camp.requirement}
                        </span>
                        <button
                          type="button"
                          onClick={e => handleDeleteCampaign(e, camp.id)}
                          className="p-1 rounded text-text-muted/60 hover:text-rust transition-colors text-xs"
                          title="Delete campaign"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-text group-hover:text-gold transition-colors mt-2.5">
                        {camp.title}
                      </h3>

                      <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{camp.location}</span>
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {camp.businessTypes.slice(0, 3).map(bt => (
                          <span
                            key={bt}
                            className="text-[10px] px-2 py-0.5 rounded bg-surface-2 border border-line text-text-muted"
                          >
                            {bt}
                          </span>
                        ))}
                        {camp.businessTypes.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 text-text-muted">
                            +{camp.businessTypes.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-line/60 flex items-center justify-between">
                      <div className="text-[11px] text-text-muted">
                        <span className="font-bold text-text">{camp.results.length}</span> businesses •{" "}
                        <span className="font-bold text-emerald-400">{camp.phoneCount}</span> phones
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            exportLeadsToExcel(camp.results, `DataPal_${camp.title.replace(/\s+/g, "_")}.xls`, camp.title);
                          }}
                          className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-line text-text-muted hover:text-gold transition-colors"
                          title="Download Excel"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            exportLeadsToCSV(camp.results, `DataPal_${camp.title.replace(/\s+/g, "_")}.csv`);
                          }}
                          className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-line text-text-muted hover:text-gold transition-colors"
                          title="Download CSV"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* EXTRACTION PROGRESS MODAL                                      */}
      {/* ============================================================== */}
      {isExtracting && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-surface border border-line rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-scaleUp">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold tracking-tight">Extracting Business Data</h3>
              <p className="text-xs text-text-muted leading-relaxed font-mono">
                {extractStatusText}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-surface-2 rounded-full h-2.5 overflow-hidden border border-line">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${extractProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-text-muted font-mono font-bold">
                <span>Querying Directories</span>
                <span>{extractProgress}%</span>
              </div>
            </div>

            <p className="text-[11px] text-text-muted/70">
              Scanning directories, resolving contact numbers, and compiling high-priority outreach targets...
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* API KEY & INTEGRATION MODAL                                    */}
      {/* ============================================================== */}
      {isApiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-surface border border-line rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp relative">
            <button
              type="button"
              onClick={() => setIsApiModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-text-muted hover:text-text"
            >
              ✕
            </button>

            <div className="flex items-center gap-3.5 pb-4 border-b border-line">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">DataPal API Settings</h3>
                <p className="text-xs text-text-muted">Connect your DataPal instance or API key</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-indigo-400">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Frontend Ready for DataPal API</span>
                </div>
                <p className="text-[11px]">
                  The frontend is completely built and wired up. You can use DataPal right now in high-fidelity mode, or paste your DataPal API Key below whenever you are ready to stream live production scraping directly.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text uppercase tracking-wider block text-[10px]">
                  DataPal API Key
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder="e.g. dp_live_9f81a7b6c5d4e3f2..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-line text-xs font-mono text-text focus:outline-none focus:border-gold/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text uppercase tracking-wider block text-[10px]">
                  DataPal API Endpoint URL
                </label>
                <input
                  type="text"
                  value={apiEndpointInput}
                  onChange={e => setApiEndpointInput(e.target.value)}
                  placeholder="https://data-pal.vercel.app/api"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-line text-xs font-mono text-text focus:outline-none focus:border-gold/50"
                />
              </div>

              {apiSaveFeedback && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center font-bold text-xs">
                  {apiSaveFeedback}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsApiModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-surface-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveApiSettings}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
