import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api.js';
import { AdminUserItem, Product, Advertisement } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { 
  Users, 
  Search, 
  Trash2, 
  Eye, 
  Loader2, 
  AlertCircle, 
  Check, 
  ShieldCheck, 
  User as UserIcon, 
  Package, 
  FileText, 
  X,
  AlertTriangle
} from 'lucide-react';

interface AdminUsersPageProps {
  navigate: (path: string) => void;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({ navigate }) => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // User Details Modal
  const [selectedUser, setSelectedUser] = useState<(AdminUserItem & { products: Product[]; ads: Advertisement[] }) | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Delete Confirmation Modal
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AdminUserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminApi.getUsers(searchTerm);
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load user records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleViewUser = async (id: string) => {
    try {
      setIsLoadingDetails(true);
      setError(null);
      const res = await adminApi.getUserById(id);
      if (res.success && res.user) {
        setSelectedUser(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user details.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;

    if (deleteConfirmUser._id === currentUser?._id) {
      setError('You cannot delete your own active administrator account.');
      setDeleteConfirmUser(null);
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      const res = await adminApi.deleteUser(deleteConfirmUser._id);
      if (res.success) {
        setSuccessMessage(res.message);
        setDeleteConfirmUser(null);
        await loadUsers();
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete user.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Identity & Accounts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse all registered accounts, inspect their product collections, and manage permissions.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          Total Users: <strong className="text-slate-900">{users.length}</strong>
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
          placeholder="Search users by name or email address..."
          className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-sm"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-xs text-slate-500">Loading user catalog...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No user accounts matched your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">User Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Registration Date</th>
                  <th className="py-2.5 px-3 text-center">Products</th>
                  <th className="py-2.5 px-3 text-center">Advertisements</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => {
                  const isSelf = u._id === currentUser?._id;
                  return (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs">{u.name}</span>
                        {isSelf && (
                          <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-medium">
                            You
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{u.email}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-xs">
                        <span className="font-semibold text-slate-900">{u.productCount}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-xs">
                        <span className="font-semibold text-slate-900">{u.adCount}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleViewUser(u._id)}
                            title="View User Details"
                            className="p-1 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmUser(u)}
                            disabled={isSelf}
                            title={isSelf ? 'Cannot delete yourself' : 'Delete User'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isSelf
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">User Role</div>
                <div className="font-bold text-slate-900 uppercase mt-0.5">{selectedUser.role}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Products</div>
                <div className="font-bold text-slate-900 mt-0.5">{selectedUser.products.length}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Saved Ads</div>
                <div className="font-bold text-slate-900 mt-0.5">{selectedUser.ads.length}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Joined</div>
                <div className="font-bold text-slate-900 mt-0.5">{new Date(selectedUser.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Associated Products ({selectedUser.products.length})</span>
              </h4>
              {selectedUser.products.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No products created by this user.</p>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {selectedUser.products.map((p) => (
                    <div key={p._id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900">{p.name}</span>
                        <span className="ml-2 text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                          {p.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{p.price || 'No price'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Advertisements List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Associated Advertisements ({selectedUser.ads.length})</span>
              </h4>
              {selectedUser.ads.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No advertisements generated by this user.</p>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {selectedUser.ads.map((a) => (
                    <div key={a._id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="font-semibold text-slate-900">{a.productName}</span>
                        <span className="ml-2 text-[10px] text-slate-500">
                          {a.platform} • {a.tone}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete User Account?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to remove <strong className="text-slate-800">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})?
                All associated products and advertisements will be permanently erased.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
