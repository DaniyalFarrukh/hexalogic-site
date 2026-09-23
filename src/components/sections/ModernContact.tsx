"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ChevronDown, Plus, UploadCloud, ArrowRight, X, Calendar } from "lucide-react";
import { PopupButton } from "react-calendly";
import { COUNTRIES } from "@/constants/countries";
import { CONTACT_EMAIL, CONTACT_LOCATION, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/lib/site";

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_TYPES = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".zip"];

/** Small country-code badge; renders identically on every OS (flag emoji do not). */
function CountryCode({ code }: { code: string }) {
  return <span className="text-[10px] font-bold tracking-wider text-gray-300 bg-white/10 rounded px-1.5 py-0.5 leading-none">{code.toUpperCase()}</span>;
}

const inputClass =
  "w-full px-5 py-4 bg-surface-darkest border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-primary transition-all duration-300 placeholder:text-gray-500 hover:border-white/30";

export default function ModernContact() {
  const [form, setForm] = useState({ helpType: "", name: "", email: "", phone: "", location: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileError, setFileError] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.code === "pk") || COUNTRIES[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.code.includes(q)
    );
  }, [countrySearch]);

  useEffect(() => {
    setRootElement(document.body);
  }, []);

  // Close the country picker on outside click or Escape
  useEffect(() => {
    if (!isCountryOpen) return;
    const onClick = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setIsCountryOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCountryOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isCountryOpen]);

  const acceptFile = (file: File | undefined) => {
    if (!file) return;
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      setFileError("Please attach a PDF, Word document, image or ZIP file.");
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileError("File size must not exceed 2MB.");
      setSelectedFile(null);
      return;
    }
    setFileError("");
    setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(e.target.files?.[0]);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      let fileData = null;
      if (selectedFile) {
        fileData = {
          name: selectedFile.name,
          type: selectedFile.type,
          data: await toBase64(selectedFile)
        };
      }

      const fullMessage = [
        `Service Requested: ${form.helpType}`,
        `Phone: ${form.phone ? `${selectedCountry.dial} ${form.phone}` : "Not provided"}`,
        `Location: ${form.location}`,
        "",
        "Message:",
        form.message,
      ].join("\n");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: fullMessage,
          website: form.website,
          file: fileData
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setForm({ helpType: "", name: "", email: "", phone: "", location: "", message: "", website: "" });
      removeFile();
      setShowAttachments(false);

      setTimeout(() => setStatus("idle"), 6000);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-surface-darkest pt-28 sm:pt-32 pb-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" aria-hidden="true" />
              <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Contact Us</span>
            </div>

            <h1 className="text-[clamp(2.5rem,5vw,3.75rem)] font-bold text-white mb-6 tracking-tight leading-tight text-balance">
              Let&apos;s build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7324] to-[#ff9b66]">amazing</span> together.
            </h1>

            <p className="text-gray-400 text-lg mb-12 max-w-lg leading-relaxed">
              Whether you have a groundbreaking idea, need to modernize your infrastructure, or just want to say hi, our team is ready to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-primary shrink-0">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Email Us</p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-lg sm:text-xl font-semibold text-white hover:text-brand-primary transition-colors break-all">{CONTACT_EMAIL}</a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Chat with our AI agent or call us</p>
                  <a href={`https://wa.me/${CONTACT_PHONE_TEL.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="text-lg sm:text-xl font-semibold text-white hover:text-blue-400 transition-colors">{CONTACT_PHONE_DISPLAY}</a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Visit Us</p>
                  <p className="text-lg sm:text-xl font-semibold text-white">{CONTACT_LOCATION}</p>
                </div>
              </div>

              {rootElement && (
                <div className="pt-8 mt-8 border-t border-white/10">
                  <h3 className="text-xl font-bold text-white mb-2">Ready to discuss your vision?</h3>
                  <p className="text-gray-400 mb-6">Pick a time that works for you and let's make it happen.</p>
                  <PopupButton
                    url="https://calendly.com/hexalogict"
                    rootElement={rootElement}
                    text="📅 Schedule a Meeting"
                    className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-bold rounded-xl text-lg shadow-[0_0_20px_rgba(255,115,36,0.3)] hover:bg-[#ff8947] hover:-translate-y-1 transition-all duration-300 inline-block text-center"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#121214] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r from-[#FF7324] to-[#ff9b66]" aria-hidden="true" />

            <h2 className="text-2xl font-bold text-white mb-8">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
              {/* Honeypot: hidden from humans, filled by bots */}
              <div className="absolute -left-[9999px] top-0" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>

              <div className="relative">
                <label htmlFor="helpType" className="sr-only">How can we help you?</label>
                <select
                  id="helpType"
                  value={form.helpType}
                  onChange={(e) => setForm({ ...form, helpType: e.target.value })}
                  required
                  className={`w-full px-5 py-4 appearance-none bg-surface-darkest rounded-xl text-sm focus:outline-none transition-all duration-300 border hover:border-white/30 ${
                    form.helpType === "" ? "border-white/10 text-gray-400" : "border-white/20 text-white focus:border-brand-primary"
                  }`}
                >
                  <option value="" disabled>How can we help you? *</option>
                  <option value="web-development">Web Development</option>
                  <option value="custom-software">Custom Software</option>
                  <option value="ui-ux-design">UI/UX Design</option>
                  <option value="cloud-solutions">Cloud Solutions</option>
                  <option value="it-consulting">IT Consulting</option>
                  <option value="business-automation">Business Automation</option>
                  <option value="other">Something else</option>
                </select>
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="sr-only">Your name</label>
                  <input id="name" type="text" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Name *" required maxLength={120} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Your email</label>
                  <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Your Email *" required className={inputClass} />
                </div>
              </div>

              {/* Phone */}
              <div className="flex bg-surface-darkest border border-white/10 rounded-xl focus-within:border-brand-primary transition-all duration-300 hover:border-white/30 group/phone">
                <div className="relative shrink-0 border-r border-white/10" ref={countryRef}>
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={isCountryOpen}
                    aria-label={`Country code ${selectedCountry.dial}, ${selectedCountry.name}`}
                    className="h-full flex items-center gap-2 px-4 sm:px-5 min-h-[56px] hover:bg-white/5 transition-colors rounded-l-xl"
                  >
                    <img src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.4/flags/4x3/${selectedCountry.code.toLowerCase()}.svg`} alt="" className="w-5 h-auto rounded-[2px] object-cover" />
                    <span className="text-base text-gray-300 font-medium">{selectedCountry.dial}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isCountryOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  {isCountryOpen && (
                    <div className="absolute top-full left-0 mt-2 w-[min(320px,calc(100vw-3rem))] bg-[#121214] border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
                      <div className="p-2 border-b border-white/10">
                        <label htmlFor="country-search" className="sr-only">Search country</label>
                        <input
                          id="country-search"
                          type="text"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full px-3 py-2 bg-surface-darkest border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-brand-primary transition-colors"
                          autoFocus
                        />
                      </div>
                      <ul className="max-h-60 overflow-y-auto overscroll-contain py-1" role="listbox">
                        {filteredCountries.length > 0 ? filteredCountries.map((c) => (
                          <li key={c.code} role="option" aria-selected={c.code === selectedCountry.code}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setIsCountryOpen(false);
                                setCountrySearch("");
                              }}
                              className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] hover:bg-white/5 text-sm text-left transition-colors"
                            >
                              <span className="flex items-center gap-3 text-gray-300 truncate pr-2">
                                <img src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.4/flags/4x3/${c.code.toLowerCase()}.svg`} alt="" className="w-5 h-auto rounded-[2px] object-cover" />
                                <span className="truncate">{c.name}</span>
                              </span>
                              <span className="text-gray-500 shrink-0">{c.dial}</span>
                            </button>
                          </li>
                        )) : (
                          <li className="px-4 py-3 text-sm text-gray-500 text-center">No countries found</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <label htmlFor="phone" className="sr-only">Phone number</label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel-national"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone"
                  className="w-full flex-1 px-5 py-4 bg-transparent text-base tracking-wide text-white focus:outline-none placeholder:text-gray-500 min-w-0"
                />
              </div>

              <div>
                <label htmlFor="location" className="sr-only">Location</label>
                <input id="location" type="text" autoComplete="address-level2" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location (City/Country) *" required className={inputClass} />
              </div>

              <div>
                <label htmlFor="message" className="sr-only">Tell us about your project</label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your project *"
                  required
                  maxLength={5000}
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Attachments */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAttachments(!showAttachments)}
                  aria-expanded={showAttachments}
                  className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-brand-primary transition-colors group min-h-[44px]"
                >
                  <span className={`w-5 h-5 rounded-md border border-gray-600 flex items-center justify-center transition-colors group-hover:border-brand-primary ${showAttachments ? "bg-brand-primary border-brand-primary text-white" : ""}`} aria-hidden="true">
                    <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${showAttachments ? "rotate-45" : ""}`} />
                  </span>
                  Add project files / attachments
                </button>

                {showAttachments && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4"
                  >
                    <label
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDragging(false); acceptFile(e.dataTransfer.files?.[0]); }}
                      className={`border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                        isDragging ? "border-brand-primary bg-brand-primary/10" : "border-white/20 hover:border-brand-primary/50 hover:bg-brand-primary/5"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept={ACCEPTED_TYPES.join(",")}
                      />
                      <div className="mb-3 p-3 rounded-full bg-white/5 text-gray-400">
                        <UploadCloud className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      {selectedFile ? (
                        <p className="text-sm font-semibold text-brand-primary break-all">{selectedFile.name}</p>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-gray-300">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, Word, images or ZIP (max 2MB)</p>
                        </>
                      )}
                    </label>
                    {selectedFile && (
                      <button type="button" onClick={removeFile} className="mt-2 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 min-h-[36px]">
                        <X className="w-3.5 h-3.5" aria-hidden="true" /> Remove file
                      </button>
                    )}
                    {fileError && (
                      <p role="alert" className="mt-2 text-xs text-red-400">{fileError}</p>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 min-h-[48px] bg-brand-primary text-white font-bold rounded-xl text-sm shadow-[0_0_20px_rgba(255,115,36,0.3)] hover:bg-[#ff8947] transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 group/btn"
                >
                  {status === "loading" ? (
                    "Sending..."
                  ) : status === "success" ? (
                    "Message sent! We'll be in touch soon."
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>

              {status === "error" && (
                <div role="alert" className="text-red-400 text-sm font-medium p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                  {errorMessage}
                </div>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
