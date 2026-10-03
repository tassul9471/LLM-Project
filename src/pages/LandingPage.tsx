import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Type, 
  FileText, 
  Quote, 
  Megaphone, 
  MousePointerClick, 
  Share2, 
  ShieldCheck, 
  Sliders, 
  Zap, 
  Copy,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface LandingPageProps {
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  const { isAuthenticated } = useAuth();

  const handleStart = () => {
    navigate(isAuthenticated ? '/generator' : '/register');
  };

  const adFormats = [
    {
      title: 'Headlines',
      icon: Type,
      description: 'High-impact, curiosity-driven titles engineered to grab audience attention within seconds.',
      example: 'Next-Gen Wireless Noise-Cancelling Headphones Built for Deep Focus',
    },
    {
      title: 'Product Descriptions',
      icon: FileText,
      description: 'Structured short and long form descriptions combining technical features with user benefits.',
      example: '40-hour ultra-battery life meets custom titanium drivers for distortion-free studio acoustics.',
    },
    {
      title: 'Taglines',
      icon: Quote,
      description: 'Memorable brand mottos that distill your core value proposition into punchy phrases.',
      example: 'Silence the World. Amplify Your Drive.',
    },
    {
      title: 'Promotional Messages',
      icon: Megaphone,
      description: 'Time-sensitive campaign blurbs, discount callouts, and seasonal promotion copy.',
      example: 'Limited Launch Offer: Save 20% + Free Express Shipping for the next 48 hours!',
    },
    {
      title: 'Call-to-Action (CTA)',
      icon: MousePointerClick,
      description: 'Action-oriented conversion triggers tailored for landing pages, emails, and ads.',
      example: 'Claim Your Wireless Audio Kit Before Stock Runs Out',
    },
    {
      title: 'Social Media Copy',
      icon: Share2,
      description: 'Platform-optimized social posts formatted with hashtags, hooks, and clean spacing.',
      example: 'Tired of background distractions during meetings? 🎧 Discover pure studio clarity today.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Add Product Details',
      desc: 'Input your product name, category, features, benefits, target audience, price, and offers.',
    },
    {
      number: '02',
      title: 'Choose Style & Format',
      desc: 'Select tone (Professional, Creative, Persuasive), channel (Social, Email, E-comm), and length.',
    },
    {
      number: '03',
      title: 'Generate Advertisement',
      desc: 'Gemini AI analyzes your inputs and constructs 7 grounded, fact-checked advertising components.',
    },
    {
      number: '04',
      title: 'Review, Edit & Use',
      desc: 'Tweak copy inline, copy instantly to clipboard, export as text file (.txt), or save to history.',
    },
  ];

  const benefits = [
    {
      title: '100% Factually Grounded',
      desc: 'Strict AI instructions ensure zero fake claims, false certifications, or invented prices.',
      icon: ShieldCheck,
    },
    {
      title: 'Instant Multi-Format Output',
      desc: 'Receive headlines, body copy, taglines, CTAs, and social posts simultaneously in one click.',
      icon: Layers,
    },
    {
      title: 'Complete Product Library',
      desc: 'Store products once and generate endless targeted campaign variants for any platform.',
      icon: Sliders,
    },
    {
      title: 'Text File (.txt) Export',
      desc: 'Instantly download your complete structured campaign output to disk with one click.',
      icon: Zap,
    },
  ];

  return (
    <div className="space-y-24 py-10">
      {/* 1. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center pt-8 pb-12">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-purple-100/60 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Generative AI Marketing Engine • BCA Final Year Project</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Turn Product Details Into{' '}
          <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Ready-to-Use Ads
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Create headlines, descriptions, taglines, promotional messages, and social media content
          from your product information using Generative AI.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/25 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Generate Advertisement</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/architecture')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Project Architecture</span>
          </button>
        </div>

        {/* Highlight trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No hallucinated specs
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Grounded on your product facts
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 7 Structured formats
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Text file export (.txt)
          </span>
        </div>
      </section>

      {/* 2. Interactive Example Advertisement Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">Live Example Preview</div>
              <h3 className="text-xl font-bold text-slate-900">SmartHydrate Pro — Smart Water Bottle</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-medium">Tone: Friendly</span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">Platform: Social Media</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-purple-700 flex items-center justify-between">
                <span>HEADLINE</span>
                <span className="text-[10px] text-slate-400 font-normal">Ready-to-use</span>
              </div>
              <p className="text-sm font-bold text-slate-800">Never Forget to Hydrate Again with SmartHydrate Pro</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-purple-700 flex items-center justify-between">
                <span>TAGLINE</span>
                <span className="text-[10px] text-slate-400 font-normal">Brand identity</span>
              </div>
              <p className="text-sm font-bold text-slate-800">SmartHydrate: Hydration made effortless, health made daily.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 md:col-span-2">
              <div className="text-xs font-bold text-purple-700 flex items-center justify-between">
                <span>SOCIAL MEDIA COPY</span>
                <span className="text-[10px] text-slate-400 font-normal">Instagram / LinkedIn</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-mono">
                Staying hydrated during busy workdays is tough. 💧 SmartHydrate Pro glows when it's time to drink, tracks your intake via Bluetooth, and keeps cold for 24 hours. Level up your routine today! 🚀 #SmartHydrate #WellnessTech
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works (4 Steps) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">Workflow</div>
          <h2 className="text-3xl font-extrabold text-slate-900">How It Works</h2>
          <p className="mt-3 text-slate-500 text-sm">
            Four simple stages from raw product specifications to high-converting campaign assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-purple-300 transition-all duration-300 relative group"
            >
              <div className="text-3xl font-black text-purple-600/30 group-hover:text-purple-600 transition-colors mb-4">
                {step.number}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Advertisement Formats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">Output Varieties</div>
          <h2 className="text-3xl font-extrabold text-slate-900">Advertisement Formats</h2>
          <p className="mt-3 text-slate-500 text-sm">
            Every generation produces a full suite of marketing assets tailored for diverse channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adFormats.map((format) => {
            const Icon = format.icon;
            return (
              <div
                key={format.title}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-purple-300 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{format.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{format.description}</p>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Example:</span>
                  <p className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    "{format.example}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Benefits */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 shadow-sm">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">Why It Works</div>
            <h2 className="text-3xl font-extrabold text-slate-900">Engineered for Accuracy & Speed</h2>
            <p className="mt-3 text-slate-500 text-sm">
              Designed from the ground up for commercial accuracy, academic rigor, and seamless user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex-shrink-0 flex items-center justify-center text-purple-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 mb-1">{b.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Call To Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8">
        <div className="p-10 rounded-3xl bg-purple-600 text-white shadow-xl shadow-purple-600/20 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to Generate Your Product Ads?
          </h2>
          <p className="text-purple-100 text-sm sm:text-base max-w-xl mx-auto">
            Get started right now. Input your product details and receive a full advertising kit in seconds.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStart}
              className="px-8 py-4 rounded-xl text-base font-bold bg-white hover:bg-slate-100 text-purple-900 shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 text-purple-900" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
