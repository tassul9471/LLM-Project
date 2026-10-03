import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api.js';
import { AdminAdItem, Advertisement } from '../../types/index.js';
import { exportAdToTextFile } from '../../utils/exportAd.js';
import { 
  FileText, 
  Search, 
  Trash2, 
  Eye, 
  Loader2, 
  AlertCircle, 
  Check, 
  X, 
  Clock, 
  Copy,
  Type,
  Quote,
  Megaphone,
  MousePointerClick,
  Share2,
  FileDown
} from 'lucide-react';

interface AdminAdsPageProps {
  navigate: (path: string) => void;
}

export const AdminAdsPage: React.FC<AdminAdsPageProps> = ({ navigate }) => {
  const [ads, setAds] = useState<AdminAdItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAd, setSelectedAd] = useState<(Advertisement & { ownerName: string; ownerEmail: string }) | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [deleteConfirmAd, setDeleteConfirmAd] = useState<AdminAdItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadAds = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminApi.getAds(searchTerm);
      if (res.success && res.ads) {
        setAds(res.ads);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve advertisements.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAds();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleViewAd = async (id: string) => {
    try {
      setIsLoadingDetail(true);
      setError(null);
      const res = await adminApi.getAdById(id);
      if (res.success && res.ad) {
        setSelectedAd(res.ad);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load advertisement details.');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmAd) return;
    try {
      setIsDeleting(true);
      setError(null);
      const res = await adminApi.deleteAd(deleteConfirmAd._id);
      if (res.success) {
        setSuccessMessage(res.message);
        setDeleteConfirmAd(null);
        await loadAds();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete advertisement.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportText = (adObj: Advertisement) => {
    const content = {
      headline: adObj.editedContent?.headline || adObj.generatedContent.headline,
      shortDescription: adObj.editedContent?.shortDescription || adObj.generatedContent.shortDescription,
      longDescription: adObj.editedContent?.longDescription || adObj.generatedContent.longDescription,
      tagline: adObj.editedContent?.tagline || adObj.generatedContent.tagline,
      promotionalMessage: adObj.editedContent?.promotionalMessage || adObj.generatedContent.promotionalMessage,
      callToAction: adObj.editedContent?.callToAction || adObj.generatedContent.callToAction,
      socialMediaCopy: adObj.editedContent?.socialMediaCopy || adObj.generatedContent.socialMediaCopy,
    };
    const filename = exportAdToTextFile({
      productName: adObj.productName,
      platform: adObj.platform,
      tone: adObj.tone,
      content,
    });
    setDownloadNotice(`Downloaded text file (${filename})`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Campaign Archives</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Advertisement Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit, inspect, and moderate all AI-generated campaign copies created across the platform.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          Total Campaigns: <strong className="text-slate-900">{ads.length}</strong>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-1 hover:text-red-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {downloadNotice && (
        <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs flex items-center gap-2">
          <FileDown className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search ads by product, headline, tone, or platform..."
          className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-sm"
        />
      </div>

      {/* Advertisements Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-xs text-slate-500">Loading campaign archives...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No advertisements matched your search filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Owner</th>
                  <th className="py-2.5 px-3">Platform</th>
                  <th className="py-2.5 px-3">Tone</th>
                  <th className="py-2.5 px-3">Headline & Preview</th>
                  <th className="py-2.5 px-3">Created</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {ads.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap text-xs">
                      {a.productName}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-800 text-xs">{a.ownerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{a.ownerEmail}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-medium">
                        {a.platform}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-medium">
                        {a.tone}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-sm">
                      <div className="font-medium text-slate-900 truncate text-xs">{a.headline}</div>
                      <div className="text-[11px] text-slate-400 truncate">{a.shortDescription}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewAd(a._id)}
                          title="View Complete Output"
                          className="p-1 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmAd(a)}
                          title="Delete Advertisement"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complete Generated Ad Modal */}
      {selectedAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {selectedAd.platform}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {selectedAd.tone}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedAd.productName}</h3>
                <p className="text-[11px] text-slate-400">Created by {selectedAd.ownerName} ({selectedAd.ownerEmail})</p>
              </div>
              <button
                onClick={() => setSelectedAd(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* All 7 Structured Sections */}
            <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-2 text-xs">
              {[
                { key: 'headline', label: 'Headline', icon: Type },
                { key: 'tagline', label: 'Tagline', icon: Quote },
                { key: 'shortDescription', label: 'Short Description', icon: FileText },
                { key: 'longDescription', label: 'Long Description', icon: FileText },
                { key: 'promotionalMessage', label: 'Promotional Message', icon: Megaphone },
                { key: 'callToAction', label: 'Call to Action', icon: MousePointerClick },
                { key: 'socialMediaCopy', label: 'Social Media Copy', icon: Share2 },
              ].map(({ key, label, icon: Icon }) => {
                const text =
                  selectedAd.editedContent?.[key as keyof typeof selectedAd.generatedContent] ||
                  selectedAd.generatedContent[key as keyof typeof selectedAd.generatedContent];
                return (
                  <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-purple-600" />
                        <span>{label}</span>
                      </span>
                      <button
                        onClick={() => handleCopy(key, text || '')}
                        className="text-[10px] text-slate-500 hover:text-purple-600 flex items-center gap-1 font-medium cursor-pointer"
                      >
                        {copiedKey === key ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-slate-800 leading-relaxed whitespace-pre-line">{text}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleExportText(selectedAd)}
                className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-purple-600" />
                <span>Export as Text File (.txt)</span>
              </button>

              <button
                onClick={() => setSelectedAd(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Delete Advertisement?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this campaign for <strong className="text-slate-800">{deleteConfirmAd.productName}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmAd(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
