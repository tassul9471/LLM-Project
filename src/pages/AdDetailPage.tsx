import React, { useState, useEffect } from 'react';
import { adApi } from '../services/api.js';
import { Advertisement, AdContent } from '../types/index.js';
import { exportAdToTextFile } from '../utils/exportAd.js';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Copy, 
  Check, 
  Clock, 
  Type, 
  Quote, 
  FileText, 
  Megaphone, 
  MousePointerClick, 
  Share2, 
  Loader2, 
  AlertCircle, 
  Edit3,
  CheckCheck,
  FileDown
} from 'lucide-react';

interface AdDetailPageProps {
  id: string;
  navigate: (path: string) => void;
}

export const AdDetailPage: React.FC<AdDetailPageProps> = ({ id, navigate }) => {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Editable fields state
  const [editedFields, setEditedFields] = useState<Partial<AdContent>>({});
  const [editingSection, setEditingSection] = useState<keyof AdContent | null>(null);
  const [tempText, setTempText] = useState('');

  useEffect(() => {
    async function loadAd() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await adApi.getById(id);
        if (res.success && res.ad) {
          setAd(res.ad);
          setEditedFields(res.ad.editedContent || {});
        } else {
          setError('Advertisement not found or unauthorized.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load advertisement.');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadAd();
    }
  }, [id]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const startEdit = (key: keyof AdContent, currentText: string) => {
    setEditingSection(key);
    setTempText(currentText);
  };

  const saveEdit = (key: keyof AdContent) => {
    setEditedFields((prev) => ({
      ...prev,
      [key]: tempText,
    }));
    setEditingSection(null);
  };

  const handleSaveChanges = async () => {
    if (!ad) return;
    try {
      setIsSaving(true);
      setError(null);
      const res = await adApi.update(ad._id, {
        editedContent: editedFields,
      });

      if (res.success && res.ad) {
        setAd(res.ad);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update advertisement.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!ad) return;
    try {
      setIsDeleting(true);
      await adApi.delete(ad._id);
      navigate('/history');
    } catch (err: any) {
      setError(err.message || 'Failed to delete advertisement.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadText = () => {
    if (!ad) return;

    const fullContent: AdContent = {
      headline: editedFields.headline !== undefined ? editedFields.headline : ad.generatedContent.headline,
      shortDescription: editedFields.shortDescription !== undefined ? editedFields.shortDescription : ad.generatedContent.shortDescription,
      longDescription: editedFields.longDescription !== undefined ? editedFields.longDescription : ad.generatedContent.longDescription,
      tagline: editedFields.tagline !== undefined ? editedFields.tagline : ad.generatedContent.tagline,
      promotionalMessage: editedFields.promotionalMessage !== undefined ? editedFields.promotionalMessage : ad.generatedContent.promotionalMessage,
      callToAction: editedFields.callToAction !== undefined ? editedFields.callToAction : ad.generatedContent.callToAction,
      socialMediaCopy: editedFields.socialMediaCopy !== undefined ? editedFields.socialMediaCopy : ad.generatedContent.socialMediaCopy,
    };

    const filename = exportAdToTextFile({
      productName: ad.productName,
      platform: ad.platform,
      tone: ad.tone,
      content: fullContent,
    });

    setDownloadNotice(`Downloaded as ${filename}`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading advertisement details...</p>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error || 'Advertisement not found.'}</span>
        </div>
        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 inline-flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to History</span>
        </button>
      </div>
    );
  }

  const sectionsConfig: { key: keyof AdContent; title: string; icon: any }[] = [
    { key: 'headline', title: 'Headline', icon: Type },
    { key: 'tagline', title: 'Tagline', icon: Quote },
    { key: 'shortDescription', title: 'Short Description', icon: FileText },
    { key: 'longDescription', title: 'Long Description', icon: FileText },
    { key: 'promotionalMessage', title: 'Promotional Message', icon: Megaphone },
    { key: 'callToAction', title: 'Call-to-Action', icon: MousePointerClick },
    { key: 'socialMediaCopy', title: 'Social Media Copy', icon: Share2 },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/history')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{ad.productName}</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                {ad.tone}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                {ad.platform}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Saved on {new Date(ad.createdAt).toLocaleString()}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Download Text Button */}
          <button
            onClick={handleDownloadText}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Download .txt</span>
          </button>

          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
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
                <span>Save Updates</span>
              </>
            )}
          </button>

          <button
            onClick={() => setDeleteConfirm(true)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-slate-200"
            title="Delete this advertisement"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>Advertisement copy updated successfully in the database.</span>
        </div>
      )}

      {downloadNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <FileDown className="w-4 h-4 text-emerald-600" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Sections List - Compact 2-Column Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
        {sectionsConfig.map((sec) => {
          const Icon = sec.icon;
          const isEditing = editingSection === sec.key;
          const activeText =
            editedFields[sec.key] !== undefined
              ? (editedFields[sec.key] as string)
              : ad.generatedContent[sec.key];
          const isCustomModified = editedFields[sec.key] !== undefined;
          const isWide = sec.key === 'longDescription' || sec.key === 'socialMediaCopy';

          return (
            <div
              key={sec.key}
              className={`bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 space-y-2.5 transition-all shadow-sm ${
                isWide ? 'md:col-span-2' : 'col-span-1'
              }`}
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide truncate">
                    {sec.title}
                  </span>
                  {isCustomModified && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-semibold flex-shrink-0">
                      Modified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(sec.key, activeText)}
                    className="px-2 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
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

                  {!isEditing && (
                    <button
                      onClick={() => startEdit(sec.key, activeText)}
                      className="px-2 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-2 pt-0.5">
                  <textarea
                    rows={isWide ? 4 : 2}
                    value={tempText}
                    onChange={(e) => setTempText(e.target.value)}
                    className="w-full bg-white border border-purple-600 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none ring-1 ring-purple-600 font-normal leading-relaxed"
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setEditingSection(null)}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Delete Advertisement?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to permanently delete this advertisement from your history?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirm(false)}
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
