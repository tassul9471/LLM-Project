import React, { useState, useEffect } from 'react';
import { adApi } from '../services/api.js';
import { Advertisement } from '../types/index.js';
import { exportAdToTextFile } from '../utils/exportAd.js';
import { 
  History, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle, 
  Clock, 
  Wand2, 
  Layers,
  ChevronRight,
  FileDown
} from 'lucide-react';

interface HistoryPageProps {
  navigate: (path: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ navigate }) => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adApi.getHistory();
      if (res.success && res.ads) {
        setAds(res.ads);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load advertisement history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await adApi.delete(id);
      setDeleteConfirmId(null);
      await loadHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to delete advertisement.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyPreview = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (ad: Advertisement) => {
    const effectiveContent = {
      headline: ad.editedContent?.headline || ad.generatedContent.headline,
      shortDescription: ad.editedContent?.shortDescription || ad.generatedContent.shortDescription,
      longDescription: ad.editedContent?.longDescription || ad.generatedContent.longDescription,
      tagline: ad.editedContent?.tagline || ad.generatedContent.tagline,
      promotionalMessage: ad.editedContent?.promotionalMessage || ad.generatedContent.promotionalMessage,
      callToAction: ad.editedContent?.callToAction || ad.generatedContent.callToAction,
      socialMediaCopy: ad.editedContent?.socialMediaCopy || ad.generatedContent.socialMediaCopy,
    };

    const filename = exportAdToTextFile({
      productName: ad.productName,
      platform: ad.platform,
      tone: ad.tone,
      content: effectiveContent,
    });

    setDownloadNotice(`Downloaded as ${filename}`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handleDuplicateToGenerator = (ad: Advertisement) => {
    sessionStorage.setItem('ad_generator_selected_product', JSON.stringify({
      name: ad.productName,
      category: '',
      description: ad.generatedContent.longDescription || ad.generatedContent.shortDescription,
      features: '',
      benefits: '',
      audience: '',
    }));
    navigate('/generator');
  };

  const platforms = ['All', ...Array.from(new Set(ads.map((a) => a.platform).filter(Boolean)))];

  const filteredAds = ads.filter((ad) => {
    const headline = ad.editedContent?.headline || ad.generatedContent.headline;
    const shortDesc = ad.editedContent?.shortDescription || ad.generatedContent.shortDescription;
    const matchesSearch =
      ad.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.tone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'All' || ad.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <History className="w-7 h-7 text-purple-600" />
            <span>Advertisement History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access, export, and manage your saved AI advertising campaigns.
          </p>
        </div>

        <button
          onClick={() => navigate('/generator')}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          <span>New Advertisement</span>
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {downloadNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <FileDown className="w-4 h-4 text-emerald-600" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved ads by product, headline, tone..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-sm"
          />
        </div>

        {platforms.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedPlatform === p
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* History Items */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-xs text-slate-500">Loading saved advertisements...</p>
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-2xl bg-white border border-dashed border-slate-300 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-800">
              {searchTerm ? 'No advertisements match your search.' : 'No advertisements saved yet.'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm
                ? 'Try searching with different terms or reset your platform filter.'
                : 'Create and save your first advertisement package to view it in history.'}
            </p>
          </div>
          {!searchTerm && (
            <button
              onClick={() => navigate('/generator')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs inline-flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <Wand2 className="w-4 h-4" />
              <span>Create Your First Advertisement</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAds.map((ad) => {
            const headline = ad.editedContent?.headline || ad.generatedContent.headline;
            const shortDesc = ad.editedContent?.shortDescription || ad.generatedContent.shortDescription;
            const fullContent = `${headline}\n\n${shortDesc}\n\nTagline: ${ad.editedContent?.tagline || ad.generatedContent.tagline}\nCTA: ${ad.editedContent?.callToAction || ad.generatedContent.callToAction}`;

            return (
              <div
                key={ad._id}
                className="bg-white border border-slate-200/90 hover:border-purple-300 rounded-xl p-3.5 transition-all group shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Left: Product & Preview */}
                  <div
                    onClick={() => navigate(`/ads/${ad._id}`)}
                    className="space-y-1.5 flex-1 cursor-pointer min-w-0"
                  >
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors text-sm">
                        {ad.productName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                        {ad.tone}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium">
                        {ad.platform}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(ad.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {headline}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                      {shortDesc}
                    </p>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 self-end lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-end flex-wrap flex-shrink-0">
                    <button
                      onClick={() => handleCopyPreview(ad._id, fullContent)}
                      title="Copy full ad package"
                      className="px-2 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedId === ad._id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDownload(ad)}
                      title="Download as .txt"
                      className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <FileDown className="w-3 h-3" />
                      <span className="text-[11px]">.txt</span>
                    </button>

                    <button
                      onClick={() => handleDuplicateToGenerator(ad)}
                      title="Duplicate to Generator"
                      className="px-2 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Layers className="w-3 h-3" />
                      <span className="text-[11px]">Duplicate</span>
                    </button>

                    <button
                      onClick={() => navigate(`/ads/${ad._id}`)}
                      title="View & Edit Ad Details"
                      className="px-2.5 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="text-[11px]">Open</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(ad._id)}
                      title="Delete from History"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Delete Advertisement?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to remove this advertisement record from your history? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
