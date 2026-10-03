import React, { useState, useEffect } from 'react';
import { productApi, adApi } from '../services/api.js';
import { Product, AdContent, AdTone, AdPlatform, AdLength, AdType } from '../types/index.js';
import { exportAdToTextFile } from '../utils/exportAd.js';
import { 
  Wand2, 
  Sparkles, 
  RotateCw, 
  Save, 
  Copy, 
  Check, 
  Edit3, 
  CheckCheck, 
  AlertCircle, 
  Loader2, 
  Package, 
  Sliders, 
  Type, 
  FileText, 
  Quote, 
  Megaphone, 
  MousePointerClick, 
  Share2, 
  ChevronDown,
  Download,
  FileDown
} from 'lucide-react';

interface GeneratorPageProps {
  navigate: (path: string) => void;
}

export const GeneratorPage: React.FC<GeneratorPageProps> = ({ navigate }) => {
  // Products list for picker
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('manual');

  // Product Inputs
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [benefits, setBenefits] = useState('');
  const [audience, setAudience] = useState('');
  const [price, setPrice] = useState('');
  const [offer, setOffer] = useState('');

  // Ad Settings
  const [tone, setTone] = useState<AdTone>('Modern');
  const [platform, setPlatform] = useState<AdPlatform>('Social Media');
  const [contentLength, setContentLength] = useState<AdLength>('Medium');
  const [adType, setAdType] = useState<AdType>('Complete Advertisement');

  // Generation & Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AdContent | null>(null);
  const [editedContent, setEditedContent] = useState<Partial<AdContent>>({});
  const [editingSection, setEditingSection] = useState<keyof AdContent | null>(null);
  const [tempEditText, setTempEditText] = useState('');

  // Notifications & Feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [savedAdId, setSavedAdId] = useState<string | null>(null);

  // Load products on mount
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await productApi.getAll();
        if (res.success && res.products) {
          setProducts(res.products);

          const stored = sessionStorage.getItem('ad_generator_selected_product');
          if (stored) {
            try {
              const parsed: Product = JSON.parse(stored);
              populateFromProduct(parsed);
              sessionStorage.removeItem('ad_generator_selected_product');
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn('Could not load products:', err);
      }
    }
    loadProducts();
  }, []);

  const populateFromProduct = (p: Product) => {
    setSelectedProductId(p._id);
    setName(p.name);
    setCategory(p.category);
    setDescription(p.description);
    setFeatures(p.features);
    setBenefits(p.benefits);
    setAudience(p.audience);
    setPrice(p.price ? String(p.price) : '');
    setOffer(p.offer || '');
  };

  const handleProductSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedProductId(val);
    if (val === 'manual') {
      setName('');
      setCategory('');
      setDescription('');
      setFeatures('');
      setBenefits('');
      setAudience('');
      setPrice('');
      setOffer('');
    } else {
      const found = products.find((p) => p._id === val);
      if (found) {
        populateFromProduct(found);
      }
    }
  };

  const handleGenerate = async (isRegen = false) => {
    setErrorMessage(null);
    setSaveSuccess(false);
    setDownloadNotice(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage('Product name is required.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Product description is required.');
      return;
    }
    if (!features.trim()) {
      setErrorMessage('Key features are required.');
      return;
    }
    if (!benefits.trim()) {
      setErrorMessage('Product benefits are required.');
      return;
    }
    if (!audience.trim()) {
      setErrorMessage('Target audience is required.');
      return;
    }

    if (isRegen) {
      setIsRegenerating(true);
    } else {
      setIsGenerating(true);
    }

    try {
      const res = await adApi.generate({
        name: name.trim(),
        category: category.trim() || undefined,
        description: description.trim(),
        features: features.trim(),
        benefits: benefits.trim(),
        audience: audience.trim(),
        price: price.trim() || undefined,
        offer: offer.trim() || undefined,
        tone,
        platform,
        contentLength,
        adType,
        isRegeneration: isRegen,
      });

      if (res.success && res.generatedContent) {
        setGeneratedContent(res.generatedContent);
        setEditedContent({});
        setSavedAdId(null);
      } else {
        throw new Error('AI returned an empty advertisement response.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setIsRegenerating(false);
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const startEdit = (key: keyof AdContent, currentText: string) => {
    setEditingSection(key);
    setTempEditText(currentText);
  };

  const saveEdit = (key: keyof AdContent) => {
    setEditedContent((prev) => ({
      ...prev,
      [key]: tempEditText,
    }));
    setEditingSection(null);
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setTempEditText('');
  };

  const handleSaveToHistory = async () => {
    if (!generatedContent) return;

    try {
      setIsSaving(true);
      setErrorMessage(null);

      const res = await adApi.save({
        productId: selectedProductId !== 'manual' ? selectedProductId : null,
        productName: name.trim(),
        tone,
        platform,
        contentLength,
        adType,
        generatedContent,
        editedContent,
      });

      if (res.success && res.ad) {
        setSaveSuccess(true);
        setSavedAdId(res.ad._id);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save advertisement to history.');
    } finally {
      setIsSaving(false);
    }
  };

  // Download as text file handler
  const handleDownloadTextFile = () => {
    if (!generatedContent) return;

    const fullContent: AdContent = {
      headline: editedContent.headline !== undefined ? editedContent.headline : generatedContent.headline,
      shortDescription: editedContent.shortDescription !== undefined ? editedContent.shortDescription : generatedContent.shortDescription,
      longDescription: editedContent.longDescription !== undefined ? editedContent.longDescription : generatedContent.longDescription,
      tagline: editedContent.tagline !== undefined ? editedContent.tagline : generatedContent.tagline,
      promotionalMessage: editedContent.promotionalMessage !== undefined ? editedContent.promotionalMessage : generatedContent.promotionalMessage,
      callToAction: editedContent.callToAction !== undefined ? editedContent.callToAction : generatedContent.callToAction,
      socialMediaCopy: editedContent.socialMediaCopy !== undefined ? editedContent.socialMediaCopy : generatedContent.socialMediaCopy,
    };

    const savedFilename = exportAdToTextFile({
      productName: name.trim() || 'Product',
      platform,
      tone,
      content: fullContent,
    });

    setDownloadNotice(`Downloaded as text file (${savedFilename})`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const sectionsConfig: { key: keyof AdContent; title: string; icon: any; placeholder: string }[] = [
    { key: 'headline', title: 'Headline', icon: Type, placeholder: 'Catchy primary headline' },
    { key: 'tagline', title: 'Tagline', icon: Quote, placeholder: 'Brand motto / tagline' },
    { key: 'shortDescription', title: 'Short Description', icon: FileText, placeholder: 'Elevator pitch' },
    { key: 'longDescription', title: 'Long Description', icon: FileText, placeholder: 'Detailed product description' },
    { key: 'promotionalMessage', title: 'Promotional Message', icon: Megaphone, placeholder: 'Promotional hook or special offer' },
    { key: 'callToAction', title: 'Call-to-Action', icon: MousePointerClick, placeholder: 'Action command' },
    { key: 'socialMediaCopy', title: 'Social Media Copy', icon: Share2, placeholder: 'Post ready with emojis and hashtags' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-purple-600" />
            <span>AI Advertisement Generator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ground your advertising copy strictly on real product specifications without hallucination.
          </p>
        </div>

        {generatedContent && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Copy All */}
            <button
              onClick={() => handleCopy('all', `${generatedContent.headline}\n\n${generatedContent.shortDescription}\n\n${generatedContent.longDescription}\n\nTagline: ${generatedContent.tagline}\nCTA: ${generatedContent.callToAction}`)}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Copy all ad content"
            >
              {copiedKey === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'all' ? 'Copied All!' : 'Copy All'}</span>
            </button>

            {/* Regenerate Button */}
            <button
              onClick={() => handleGenerate(true)}
              disabled={isGenerating || isRegenerating}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSaveToHistory}
              disabled={isSaving || saveSuccess}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </>
              )}
            </button>

            {/* Download as Text File Feature (Requirement 5) */}
            <button
              onClick={handleDownloadTextFile}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download generated ad package as a formatted .txt document"
            >
              <FileDown className="w-4 h-4" />
              <span>Download as Text File</span>
            </button>
          </div>
        )}
      </div>

      {/* Global Alerts */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Advertisement successfully saved to your history!</span>
          </div>
          {savedAdId && (
            <button
              onClick={() => navigate(`/ads/${savedAdId}`)}
              className="text-xs font-bold text-emerald-700 underline underline-offset-2 cursor-pointer"
            >
              View in History
            </button>
          )}
        </div>
      )}

      {downloadNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* 2-Section Layout: Left = Inputs + Settings, Right = Output Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT SECTION (5 cols): Product Info + Settings ================= */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          {/* Product Picker */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
              <Package className="w-4 h-4 text-purple-600" />
              <span>Select Product or Enter Details</span>
            </label>
            <div className="relative">
              <select
                value={selectedProductId}
                onChange={handleProductSelectChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="manual">+ Enter Custom Product Details</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    📦 {p.name} ({p.category})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Product Information Form */}
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lumina Smart Desk Lamp"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Smart Home, Tech"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Product Description *
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this product and what core problem does it solve?"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Key Features *
                </label>
                <textarea
                  rows={2}
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="e.g. Wireless charger base, 3 color temps"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Product Benefits *
                </label>
                <textarea
                  rows={2}
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="e.g. Reduces eye strain during late work"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Audience *
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Remote software engineers, college students"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Price (Optional)
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. $59.99"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Offer / Coupon (Optional)
                </label>
                <input
                  type="text"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  placeholder="e.g. 15% off first order"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Advertisement Settings Section */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-600" />
              <span>Advertisement Configuration</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as AdTone)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                >
                  <option value="Modern">Modern</option>
                  <option value="Professional">Professional</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Creative">Creative</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as AdPlatform)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                >
                  <option value="Social Media">Social Media</option>
                  <option value="Website">Website</option>
                  <option value="Email">Email</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="General Advertisement">General Advertisement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Content Length</label>
                <select
                  value={contentLength}
                  onChange={(e) => setContentLength(e.target.value as AdLength)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                >
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Long">Long</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ad Type</label>
                <select
                  value={adType}
                  onChange={(e) => setAdType(e.target.value as AdType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                >
                  <option value="Complete Advertisement">Complete Advertisement</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Product Description">Product Description</option>
                  <option value="Promotional Advertisement">Promotional</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => handleGenerate(false)}
            disabled={isGenerating || isRegenerating}
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Advertisement...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate Advertisement</span>
              </>
            )}
          </button>
        </div>

        {/* ================= RIGHT SECTION (7 cols): Result Workspace ================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Initial State / Empty Workspace (Stage 6) */}
          {!generatedContent && !isGenerating && (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-4 min-h-[460px] flex flex-col items-center justify-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-sm">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-base font-bold text-slate-800">
                  Your generated advertisement will appear here.
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fill in your product specifications on the left and click{' '}
                  <strong className="text-purple-700">Generate Advertisement</strong> to construct full multi-channel ad copy.
                </p>
              </div>
            </div>
          )}

          {/* Loading State (Stage 8) */}
          {(isGenerating || isRegenerating) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 min-h-[460px] flex flex-col items-center justify-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center animate-pulse">
                <Wand2 className="w-8 h-8 animate-bounce text-purple-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {isRegenerating ? 'Crafting Creative Variation...' : 'Grounding Specs & Generating Ads...'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Analyzing facts for <strong className="text-slate-800">{name || 'Product'}</strong> ({tone} tone on {platform}).
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Zero hallucination enforcement active</span>
              </div>
            </div>
          )}

          {/* Generated Result Cards (Compact Bento Grid with Inline Editing) */}
          {generatedContent && !isGenerating && !isRegenerating && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Generated Assets ({sectionsConfig.length} Components)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Click <span className="text-purple-600 font-medium">Edit</span> or <span className="text-purple-600 font-medium">Copy</span> on any block
                </div>
              </div>

              {/* Bento Grid: 2 columns on tablet/desktop, spans full width for longer texts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                {sectionsConfig.map((sec) => {
                  const Icon = sec.icon;
                  const isEditing = editingSection === sec.key;
                  const activeText =
                    editedContent[sec.key] !== undefined
                      ? (editedContent[sec.key] as string)
                      : generatedContent[sec.key];
                  const wasEdited = editedContent[sec.key] !== undefined;
                  const isWide = sec.key === 'longDescription' || sec.key === 'socialMediaCopy';

                  return (
                    <div
                      key={sec.key}
                      className={`bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 space-y-2.5 transition-all shadow-sm ${
                        isWide ? 'md:col-span-2' : 'col-span-1'
                      }`}
                    >
                      {/* Card Header Bar */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-3 h-3" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide truncate">
                            {sec.title}
                          </span>
                          {wasEdited && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-semibold flex-shrink-0">
                              Edited
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          {/* Copy Button */}
                          <button
                            onClick={() => handleCopy(sec.key, activeText)}
                            className="px-2 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copy text"
                          >
                            {copiedKey === sec.key ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          {/* Edit Button */}
                          {!isEditing && (
                            <button
                              onClick={() => startEdit(sec.key, activeText)}
                              className="px-2 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                              title="Edit text"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Card Content or Inline Editor */}
                      {isEditing ? (
                        <div className="space-y-2 pt-0.5">
                          <textarea
                            rows={isWide ? 4 : 2}
                            value={tempEditText}
                            onChange={(e) => setTempEditText(e.target.value)}
                            className="w-full bg-white border border-purple-600 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none ring-1 ring-purple-600 font-normal leading-relaxed"
                          />
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={cancelEdit}
                              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveEdit(sec.key)}
                              className="px-2.5 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Apply</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                          {activeText}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
