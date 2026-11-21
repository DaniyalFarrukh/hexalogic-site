"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ChevronDown, Plus, UploadCloud, ArrowRight, X } from "lucide-react";
import { PopupButton } from "react-calendly";
import { COUNTRIES } from "@/constants/countries";
import { CONTACT_EMAIL, CONTACT_LOCATION, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/lib/site";
import { EASE_EDITORIAL, EASE_SNAP } from "@/components/motion/EditorialReveal";

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_TYPES = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".zip"];

const inputClass =
  "w-full px-4 py-3.5 bg-paper border border-line-strong rounded-xl text-sm text-ink focus:outline-none focus:border-accent transition-colors duration-200 placeholder:text-ink-muted hover:border-ink/35";

export default function ModernContact() {
  const [form, setForm] = useState({
    helpType: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileError, setFileError] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRIES.find((c) => c.code === "pk") || COUNTRIES[0]
  );
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
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.includes(q)
    );
  }, [countrySearch]);

  useEffect(() => {
    setRootElement(document.body);
  }, []);

  useEffect(() => {
    if (!isCountryOpen) return;
    const onClick = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node))
        setIsCountryOpen(false);
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

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
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
          data: await toBase64(selectedFile),
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
          file: fileData,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setForm({
        helpType: "",
        name: "",
        email: "",
        phone: "",
        location: "",
        message: "",
        website: "",
      });
      removeFile();
      setShowAttachments(false);

      setTimeout(() => setStatus("idle"), 6000);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-[100dvh] bg-paper text-ink pt-28 sm:pt-32 pb-20 relative overflow-x-clip">
      <div className="absolute inset-0 ds-hairline-grid opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-[var(--ds-gutter)] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-line w-fit mb-6">
              <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
              <span className="ds-meta text-ink-soft">Contact Us</span>
            </div>

            <h1 className="text-[clamp(2.5rem,5vw,4rem)] ds-display text-ink mb-6 text-balance">
              Let&apos;s build something <span className="text-accent">amazing</span> together.
            </h1>

            <p className="text-ink-soft text-base sm:text-lg mb-10 max-w-lg leading-relaxed">
              Whether you have a groundbreaking idea, need to modernize your infrastructure, or just want to say hi, our team is ready to hear from you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-card border border-line flex items-center justify-center text-accent shrink-0 shadow-[var(--ds-shadow-card)]">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="ds-meta text-ink-muted mb-1">Email Us</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-lg font-semibold text-ink hover:text-accent transition-colors break-all"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-card border border-line flex items-center justify-center text-ink shrink-0 shadow-[var(--ds-shadow-card)]">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="ds-meta text-ink-muted mb-1">
                    Chat with our AI agent or call us
                  </p>
                  <a
                    href={`https://wa.me/${CONTACT_PHONE_TEL.replace("+", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-ink hover:text-accent transition-colors"
                  >
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-card border border-line flex items-center justify-center text-ink shrink-0 shadow-[var(--ds-shadow-card)]">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="ds-meta text-ink-muted mb-1">Visit Us</p>
                  <p className="text-lg font-semibold text-ink">{CONTACT_LOCATION}</p>
                </div>
              </div>

              {rootElement && (
                <div className="pt-8 mt-6 border-t border-line-strong">
                  <h3 className="text-xl ds-heading text-ink mb-2">
                    Ready to discuss your vision?
                  </h3>
                  <p className="text-ink-soft text-sm sm:text-base mb-5">
                    Pick a time that works for you and let&apos;s make it happen.
                  </p>
                  <PopupButton
                    url="https://calendly.com/hexalogict"
                    rootElement={rootElement}
                    text="📅 Schedule a Meeting"
                    className="ds-pill w-full sm:w-auto px-8 py-3.5 min-h-[48px] bg-accent text-white hover:bg-accent-hover text-sm font-semibold inline-flex items-center justify-center cursor-pointer"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_EDITORIAL }}
            className="bg-card border border-line-strong rounded-[var(--ds-radius-bento)] p-6 sm:p-9 shadow-[var(--ds-shadow-elevated)] relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-[var(--ds-radius-bento)] bg-accent" aria-hidden="true" />

            <h2 className="text-2xl ds-heading text-ink mb-7">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
              {/* Honeypot */}
              <div className="absolute -left-[9999px] top-0" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>

              <div className="relative">
                <label htmlFor="helpType" className="sr-only">
                  How can we help you?
                </label>
                <select
                  id="helpType"
                  value={form.helpType}
                  onChange={(e) => setForm({ ...form, helpType: e.target.value })}
                  required
                  className={`w-full px-4 py-3.5 appearance-none bg-paper rounded-xl text-sm focus:outline-none transition-colors border hover:border-ink/35 ${
                    form.helpType === ""
                      ? "border-line-strong text-ink-soft"
                      : "border-line-strong text-ink focus:border-accent"
                  }`}
                >
                  <option value="" disabled>
                    How can we help you? *
                  </option>
                  <option value="web-development">Web Development</option>
                  <option value="custom-software">Custom Software</option>
                  <option value="ui-ux-design">UI/UX Design</option>
                  <option value="cloud-solutions">Cloud Solutions</option>
                  <option value="it-consulting">IT Consulting</option>
                  <option value="business-automation">Business Automation</option>
                  <option value="other">Something else</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-ink-soft">
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Name *"
                    required
                    maxLength={120}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">
                    Your email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Your Email *"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex bg-paper border border-line-strong rounded-xl focus-within:border-accent transition-colors hover:border-ink/35">
                <div className="relative shrink-0 border-r border-line-strong" ref={countryRef}>
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={isCountryOpen}
                    aria-label={`Country code ${selectedCountry.dial}, ${selectedCountry.name}`}
                    className="h-full flex items-center gap-2 px-3.5 sm:px-4 min-h-[50px] hover:bg-paper-alt transition-colors rounded-l-xl"
                  >
                    <img
                      src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.4/flags/4x3/${selectedCountry.code.toLowerCase()}.svg`}
                      alt=""
                      className="w-5 h-auto rounded-[2px] object-cover"
                    />
                    <span className="text-sm text-ink font-medium">{selectedCountry.dial}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-ink-soft transition-transform ${
                        isCountryOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isCountryOpen && (
                    <div className="absolute top-full left-0 mt-2 w-[min(320px,calc(100vw-3rem))] bg-card border border-line-strong rounded-xl shadow-[var(--ds-shadow-elevated)] z-50 flex flex-col overflow-hidden">
                      <div className="p-2 border-b border-line">
                        <label htmlFor="country-search" className="sr-only">
                          Search country
                        </label>
                        <input
                          id="country-search"
                          type="text"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full px-3 py-2 bg-paper border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                          autoFocus
                        />
                      </div>
                      <ul className="max-h-60 overflow-y-auto overscroll-contain py-1" role="listbox">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((c) => (
                            <li
                              key={c.code}
                              role="option"
                              aria-selected={c.code === selectedCountry.code}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(c);
                                  setIsCountryOpen(false);
                                  setCountrySearch("");
                                }}
                                className="w-full flex items-center justify-between px-4 py-2.5 min-h-[44px] hover:bg-paper-alt text-sm text-left transition-colors"
                              >
                                <span className="flex items-center gap-3 text-ink truncate pr-2">
                                  <img
                                    src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.4/flags/4x3/${c.code.toLowerCase()}.svg`}
                                    alt=""
                                    className="w-5 h-auto rounded-[2px] object-cover"
                                  />
                                  <span className="truncate">{c.name}</span>
                                </span>
                                <span className="font-mono text-xs text-ink-soft shrink-0">
                                  {c.dial}
                                </span>
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-3 text-sm text-ink-soft text-center">
                            No countries found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <label htmlFor="phone" className="sr-only">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel-national"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone"
                  className="w-full flex-1 px-4 py-3.5 bg-transparent text-sm text-ink focus:outline-none placeholder:text-ink-muted min-w-0"
                />
              </div>

              <div>
                <label htmlFor="location" className="sr-only">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  autoComplete="address-level2"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Location (City/Country) *"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="message" className="sr-only">
                  Tell us about your project
                </label>
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
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowAttachments(!showAttachments)}
                  aria-expanded={showAttachments}
                  className="flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-accent transition-colors group min-h-[44px]"
                >
                  <span
                    className={`w-5 h-5 rounded-md border border-line-strong flex items-center justify-center transition-colors group-hover:border-accent ${
                      showAttachments ? "bg-accent border-accent text-white" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <Plus
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        showAttachments ? "rotate-45" : ""
                      }`}
                    />
                  </span>
                  Add project files / attachments
                </button>

                {showAttachments && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, ease: EASE_SNAP }}
                    className="mt-3"
                  >
                    <label
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        acceptFile(e.dataTransfer.files?.[0]);
                      }}
                      className={`border border-dashed rounded-xl p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                        isDragging
                          ? "border-accent bg-accent/5"
                          : "border-line-strong hover:border-accent/60 hover:bg-paper"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept={ACCEPTED_TYPES.join(",")}
                      />
                      <div className="mb-3 p-3 rounded-full bg-paper-alt text-ink-soft">
                        <UploadCloud className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      {selectedFile ? (
                        <p className="text-sm font-semibold text-accent break-all">
                          {selectedFile.name}
                        </p>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-ink">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-ink-soft mt-1">
                            PDF, Word, images or ZIP (max 2MB)
                          </p>
                        </>
                      )}
                    </label>
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={removeFile}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-ink-soft hover:text-accent min-h-[44px]"
                      >
                        <X className="w-3.5 h-3.5" aria-hidden="true" /> Remove file
                      </button>
                    )}
                    {fileError && (
                      <p role="alert" className="mt-2 text-xs text-accent font-medium">
                        {fileError}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="ds-pill w-full py-3.5 min-h-[48px] bg-ink hover:bg-accent text-paper hover:text-white text-sm font-semibold disabled:opacity-70 group/btn"
                >
                  {status === "loading" ? (
                    "Sending..."
                  ) : status === "success" ? (
                    "Message sent! We'll be in touch soon."
                  ) : (
                    <>
                      Send Message
                      <ArrowRight
                        className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              </div>

              {status === "error" && (
                <div
                  role="alert"
                  className="text-accent text-sm font-medium p-3 rounded-xl bg-accent/10 border border-accent/25 text-center"
                >
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
