import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api.js';
import { AdminProductItem } from '../../types/index.js';
import { 
  Package, 
  Search, 
  Trash2, 
  Eye, 
  Loader2, 
  AlertCircle, 
  Check, 
  X,
  Users,
  Tag,
  DollarSign
} from 'lucide-react';

interface AdminProductsPageProps {
  navigate: (path: string) => void;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ navigate }) => {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<AdminProductItem | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<AdminProductItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminApi.getProducts(searchTerm);
      if (res.success && res.products) {
        setProducts(res.products);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async () => {
    if (!deleteConfirmProduct) return;
    try {
      setIsDeleting(true);
      setError(null);
      const res = await adminApi.deleteProduct(deleteConfirmProduct._id);
      if (res.success) {
        setSuccessMessage(res.message);
        setDeleteConfirmProduct(null);
        await loadProducts();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Master Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global repository of all user-created product specifications across accounts.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          Total Products: <strong className="text-slate-900">{products.length}</strong>
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

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products by title, category, or keyword..."
          className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-sm"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-xs text-slate-500">Loading product catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs space-y-2">
            <Package className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No products matched your search filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Owner</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Created</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      <div className="text-xs">{p.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal line-clamp-1">{p.description}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-800 text-xs">{p.ownerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.ownerEmail}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-mono text-xs">{p.price || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          title="View Details"
                          className="p-1 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmProduct(p)}
                          title="Delete Product"
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

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                  {selectedProduct.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedProduct.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                  Description
                </label>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                    Key Features
                  </label>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {selectedProduct.features}
                  </p>
                </div>
                <div>
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                    Core Benefits
                  </label>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {selectedProduct.benefits}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                    Target Audience
                  </label>
                  <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">{selectedProduct.audience}</p>
                </div>
                <div>
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                    Pricing & Offers
                  </label>
                  <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    {selectedProduct.price || 'No price set'} {selectedProduct.offer ? `(${selectedProduct.offer})` : ''}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Created by: <strong className="text-slate-800">{selectedProduct.ownerName}</strong> ({selectedProduct.ownerEmail})</span>
                <span>{new Date(selectedProduct.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Delete Product?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-800">{deleteConfirmProduct.name}</strong> owned by {deleteConfirmProduct.ownerName}?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmProduct(null)}
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
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
