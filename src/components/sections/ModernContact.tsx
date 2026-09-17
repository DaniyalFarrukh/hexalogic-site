"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ChevronDown, Plus, UploadCloud, ArrowRight } from "lucide-react";
import { COUNTRIES } from "@/constants/countries";

export default function ModernContact() {
  const [form, setForm] = useState({ 
    helpType: "", 
    name: "", 
    email: "", 
    phone: "", 
    location: "", 
    message: "" 
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.code === 'us') || COUNTRIES[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
    c.dial.includes(countrySearch) || 
    c.code.includes(countrySearch.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File size must not exceed 2MB");
        setSelectedFile(null);
        return;
      }
      setErrorMessage("");
      setSelectedFile(file);
    }
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

      const fullMessage = `
Service Requested: ${form.helpType}
Phone: ${selectedCountry.dial} ${form.phone}
Location: ${form.location}

Message:
${form.message}
      `.trim();

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: fullMessage,
          file: fileData
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setForm({ helpType: "", name: "", email: "", phone: "", location: "", message: "" });
      setSelectedFile(null);
      
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err: unknown) {
      console.error(err);
      setStatus("error");
      const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-surface-darkest pt-24 sm:pt-32 pb-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column - Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Contact Us</span>
            </div>
            
            <h1 className="text-[clamp(2.5rem,5vw,3.75rem)] font-bold text-white mb-6 tracking-tight leading-tight">
              Let&apos;s build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7324] to-[#ff9b66]">amazing</span> together.
            </h1>
            
            <p className="text-gray-400 text-lg mb-12 max-w-lg leading-relaxed">
              Whether you have a groundbreaking idea, need to modernize your infrastructure, or just want to say hi — our team is ready to hear from you.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary/10 group-hover:border-brand-primary/30 transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Email Us</p>
                  <a href="mailto:hexalogict@gmail.com" className="text-xl font-semibold text-white hover:text-brand-primary transition-colors">hexalogict@gmail.com</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-400/10 group-hover:border-blue-400/30 transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Call Us</p>
                  <a href="tel:+923284552495" className="text-xl font-semibold text-white hover:text-blue-400 transition-colors">+92 328 4552495</a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400/10 group-hover:border-emerald-400/30 transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Visit Us</p>
                  <p className="text-xl font-semibold text-white">Lahore, Pakistan</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#121214] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r from-[#FF7324] to-[#ff9b66]" />
            
            <h3 className="text-2xl font-bold text-white mb-8">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Help Type */}
              <div className="relative group">
                <select
                  value={form.helpType}
                  onChange={(e) => setForm({ ...form, helpType: e.target.value })}
                  required
                  className={`w-full px-5 py-4 appearance-none bg-surface-darkest rounded-xl text-sm focus:outline-none transition-all duration-300 border ${
                    form.helpType === "" ? "border-white/10 text-gray-400" : "border-white/20 text-white focus:border-brand-primary"
                  } group-hover:border-white/30`}
                >
                  <option value="" disabled>How can we help you? *</option>
                  <option value="web-development">Web Development</option>
                  <option value="custom-software">Custom Software</option>
                  <option value="ui-ux">UI/UX Design</option>
                  <option value="cloud-solutions">Cloud Solutions</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name *"
                  required
                  className="w-full px-5 py-4 bg-surface-darkest border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-primary transition-all duration-300 placeholder:text-gray-500 hover:border-white/30"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Your Email *"
                  required
                  className="w-full px-5 py-4 bg-surface-darkest border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-primary transition-all duration-300 placeholder:text-gray-500 hover:border-white/30"
                />
              </div>

              {/* Phone */}
              <div className="flex bg-surface-darkest border border-white/10 rounded-xl focus-within:border-brand-primary transition-all duration-300 hover:border-white/30 overflow-visible group/phone">
                <div className="relative shrink-0 border-r border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    className="h-full flex items-center gap-2 px-5 hover:bg-white/5 transition-colors cursor-pointer rounded-l-xl"
                  >
                    <img src={`https://flagcdn.com/w20/${selectedCountry.code}.png`} alt={selectedCountry.code} className="w-5 h-auto object-contain rounded-[2px]" />
                    <span className="text-base text-gray-300 font-medium">{selectedCountry.dial}</span>
                    <span className="text-xs text-gray-500 ml-1">{isCountryOpen ? '▴' : '▾'}</span>
                  </button>
                  {isCountryOpen && (
                    <div className="absolute top-full left-0 mt-2 w-[320px] bg-[#121214] border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
                      <div className="p-2 border-b border-white/10">
                        <input
                          type="text"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full px-3 py-2 bg-surface-darkest border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-brand-primary transition-colors"
                          autoFocus
                        />
                      </div>
                      <div 
                        className="max-h-60 overflow-y-auto overscroll-contain py-1"
                        onWheel={(e) => e.stopPropagation()}
                      >
                        {filteredCountries.length > 0 ? filteredCountries.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(c);
                              setIsCountryOpen(false);
                              setCountrySearch("");
                            }}
                            className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] hover:bg-white/5 text-sm text-left transition-colors"
                          >
                            <span className="flex items-center gap-3 text-gray-300 truncate pr-2">
                              <img src={`https://flagcdn.com/w20/${c.code}.png`} alt={c.code} className="w-5 h-auto object-contain rounded-[2px]" />
                              <span className="truncate">{c.name}</span>
                            </span>
                            <span className="text-gray-500 shrink-0">{c.dial}</span>
                          </button>
                        )) : (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">No countries found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone Number"
                  className="w-full flex-1 px-5 py-4 bg-transparent text-base tracking-wide text-white focus:outline-none placeholder:text-gray-500"
                />
              </div>

              {/* Location */}
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Location (City/Country) *"
                required
                className="w-full px-5 py-4 bg-surface-darkest border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-primary transition-all duration-300 placeholder:text-gray-500 hover:border-white/30"
              />

              {/* Message */}
              <div>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your project *"
                  required
                  rows={4}
                  className="w-full px-5 py-4 bg-surface-darkest border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-primary transition-all duration-300 placeholder:text-gray-500 resize-none hover:border-white/30"
                />
              </div>

              {/* Project Details Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowProjectDetails(!showProjectDetails)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-brand-primary transition-colors group min-h-[44px]"
                >
                  <div className={`w-5 h-5 rounded-md border border-gray-600 flex items-center justify-center transition-colors group-hover:border-brand-primary ${showProjectDetails ? 'bg-brand-primary border-brand-primary text-white' : ''}`}>
                    <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${showProjectDetails ? 'rotate-45' : ''}`} />
                  </div>
                  Add project files / attachments
                </button>

                {showProjectDetails && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4"
                  >
                    <label className="border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all duration-300 group/upload">
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange} 
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip" 
                      />
                      <div className="mb-3 p-3 rounded-full bg-white/5 text-gray-400 group-hover/upload:text-brand-primary group-hover/upload:bg-brand-primary/10 transition-colors">
                        <UploadCloud className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      {selectedFile ? (
                        <p className="text-sm font-semibold text-brand-primary">{selectedFile.name}</p>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-gray-300">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, DOC, Images (Max 2MB)</p>
                        </>
                      )}
                    </label>
                  </motion.div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 min-h-[44px] bg-brand-primary text-white font-bold rounded-xl text-sm shadow-[0_0_20px_rgba(255,115,36,0.3)] hover:bg-[#ff8947] transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 group/btn hover:-translate-y-0.5"
                >
                  {status === "loading" ? (
                    "Sending..."
                  ) : status === "success" ? (
                    "Message Sent Successfully!"
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
              
              {status === "error" && (
                <div className="text-red-400 text-sm font-medium p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
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
