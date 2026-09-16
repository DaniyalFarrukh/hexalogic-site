import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlayCircle, CheckCircle2, ChevronRight } from "lucide-react";

// Mock data for the services. In a real app, this might come from a CMS or database.
const serviceData: Record<string, { title: string; subtitle: string; description: string; features: string[]; client: string; timeline: string }> = {
  "web-development": {
    title: "Web Development",
    subtitle: "High-Performance Web Applications",
    description: "We build beautiful, responsive websites and web applications using modern frameworks like React and Next.js for maximum speed and scalability.",
    features: ["Server-Side Rendering for SEO", "Component-Driven Architecture", "Lightning-fast performance", "Responsive mobile-first design"],
    client: "Acme Corp",
    timeline: "12 Weeks",
  },
  "custom-software": {
    title: "Custom Software",
    subtitle: "Tailored Solutions for Your Business",
    description: "Custom-built software designed to integrate seamlessly with your existing workflows and solve your unique operational challenges.",
    features: ["End-to-end bespoke development", "Legacy system integration", "Scalable cloud infrastructure", "Secure API development"],
    client: "Global Logistics Inc.",
    timeline: "6 Months",
  },
  "business-automation": {
    title: "Business Automation",
    subtitle: "Streamline Your Operations",
    description: "Automate repetitive tasks and reduce human error with intelligent systems that let your team focus on high-value work.",
    features: ["Workflow orchestration", "RPA (Robotic Process Automation)", "AI-powered decision logic", "Real-time analytics dashboards"],
    client: "FinTech Solutions",
    timeline: "8 Weeks",
  },
  "cloud-solutions": {
    title: "Cloud Solutions",
    subtitle: "Scalable & Secure Infrastructure",
    description: "Future-proof your business with scalable cloud infrastructure, seamless migration services, and modern DevOps practices.",
    features: ["AWS/Azure/GCP Migration", "Infrastructure as Code (IaC)", "CI/CD Pipeline Setup", "24/7 Monitoring & Alerting"],
    client: "Healthcare Providers Network",
    timeline: "16 Weeks",
  },
  "it-consulting": {
    title: "IT Consulting",
    subtitle: "Strategic Tech Guidance",
    description: "Expert consulting services to align your technology investments with your business goals and ensure you stay ahead of the competition.",
    features: ["Digital Transformation Strategy", "Technology Stack Audit", "Security & Compliance Review", "Agile Transformation coaching"],
    client: "Enterprise Retailer",
    timeline: "Ongoing",
  },
};

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = serviceData[resolvedParams.slug];

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      {/* Breadcrumbs & Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-teal transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <span className="text-slate-900 font-medium">{data.title}</span>
        </div>
        
        <Link href="/" className="inline-flex items-center text-teal hover:text-teal-700 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Link>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-navy rounded-3xl p-8 md:p-12 text-white overflow-hidden relative shadow-xl">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-3xl">
            <span className="text-teal font-semibold tracking-wider uppercase text-sm mb-4 block">Case Study</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{data.title}</h1>
            <p className="text-xl text-slate-300 font-light mb-8 max-w-2xl">{data.subtitle}</p>
            
            <div className="flex flex-wrap gap-8 pt-6 border-t border-white/10">
              <div>
                <p className="text-sm text-slate-400 mb-1">Client</p>
                <p className="font-semibold">{data.client}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Timeline</p>
                <p className="font-semibold">{data.timeline}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Industry</p>
                <p className="font-semibold">Technology</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Demo Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-navy mb-4">End Product Demo</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Take a look at the final product we delivered to the client, showcasing the core functionalities and user experience.</p>
        </div>
        
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl group border border-slate-200">
          {/* Placeholder Video */}
          <video 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            autoPlay 
            muted 
            loop 
            playsInline
            poster="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80"
          >
            <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Play Button Overlay (Decorative) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg transition-transform group-hover:scale-110">
                <PlayCircle className="w-10 h-10 text-white ml-1" />
             </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <div>
            <h3 className="text-2xl font-bold text-navy mb-6">Project Overview</h3>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg">
              {data.description}
            </p>
            <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-teal transition-colors duration-300">
              Start Your Project
            </a>
          </div>
          
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <h4 className="text-xl font-bold text-navy mb-6">Key Features Delivered</h4>
            <ul className="space-y-4">
              {data.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-teal shrink-0 mr-3" />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
