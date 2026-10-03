import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Database, 
  Server, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  FileCode, 
  FolderTree, 
  Network, 
  Key, 
  Workflow,
  FileDown
} from 'lucide-react';

interface ProjectDocsPageProps {
  navigate: (path: string) => void;
}

export const ProjectDocsPage: React.FC<ProjectDocsPageProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'stages' | 'architecture' | 'erd' | 'api' | 'security'>('stages');

  const stagesList = [
    { id: 0, title: 'Stage 0 — Project Planning & Architecture', desc: 'Requirement analysis, 13-stage roadmap, component mapping, and system architecture design.' },
    { id: 1, title: 'Stage 1 — Project Setup & Health Verification', desc: 'Full-stack folder structure, Express server, health check GET /api/health, and React root.' },
    { id: 2, title: 'Stage 2 — Frontend Landing Page', desc: 'Hero section, How It Works, Advertisement Formats, Benefits, Example Ad, and CTA.' },
    { id: 3, title: 'Stage 3 — Authentication System', desc: 'User registration, login, logout, password hashing with bcrypt, JWT generation, and protected routes.' },
    { id: 4, title: 'Stage 4 — User Dashboard', desc: 'Authenticated dashboard, real statistics, quick navigation, recent advertisements, and empty states.' },
    { id: 5, title: 'Stage 5 — Product Management Module', desc: 'Full CRUD operations for user products with strict ownership authorization and MongoDB schema.' },
    { id: 6, title: 'Stage 6 — Advertisement Generator UI', desc: 'Two-column generator workspace, product selector, tone/platform/length settings, and validation.' },
    { id: 7, title: 'Stage 7 — Generative AI Integration', desc: 'Server-side Gemini 3.8 Flash SDK, structured JSON output, and strict factual grounding rules.' },
    { id: 8, title: 'Stage 8 — Result Display, Editing & Regeneration', desc: '7 section cards, one-click clipboard copying, inline text editing, and creative variation regeneration.' },
    { id: 9, title: 'Stage 9 — Advertisement Storage & History', desc: 'Save advertisement to database, history catalogue, view/edit saved ads, duplicate, and delete.' },
    { id: 10, title: 'Stage 10 — Security & Validation Audit', desc: 'OWASP security check, password hashing, authorization audits, input sanitization, and error masks.' },
    { id: 11, title: 'Stage 11 — UI/UX Polish & Accessibility', desc: 'Modern Light Theme, typography hierarchy, responsive multi-column layouts, and mobile optimization.' },
    { id: 12, title: 'Modification — Admin Panel & Text Export', desc: 'Role-based access (admin/user), Admin Dashboard with metrics & charts, User/Product/Ad moderation, Vertical Menu & .txt download.' },
  ];

  const securityChecklist = [
    { feature: 'Password Security', status: 'Passed', implementation: 'Salted hashing using bcryptjs (10 rounds). Plaintext passwords never stored or logged.' },
    { feature: 'Route Protection', status: 'Passed', implementation: 'JWT Bearer token verification middleware for all private endpoints (Products, Ads, Stats).' },
    { feature: 'Authorization (RBAC)', status: 'Passed', implementation: 'Role-based access: Admin routes (/api/admin/*) require authenticated user with role="admin". Non-admins receive 403 Forbidden.' },
    { feature: 'Resource Isolation', status: 'Passed', implementation: 'Normal users can only query, edit, or delete their own products and advertisements.' },
    { feature: 'Frontend Secrets', status: 'Passed', implementation: 'Zero API keys or secrets exposed in frontend bundles; Gemini API executed strictly on server.' },
    { feature: 'Input Validation', status: 'Passed', implementation: 'Strict regular expression checks for email, minimum password length, and required product specs.' },
    { feature: 'AI Grounding & Trust', status: 'Passed', implementation: 'System instructions prevent invention of prices, discounts, features, or fake certifications.' },
    { feature: 'Error Sanitization', status: 'Passed', implementation: 'Global Express error handler catches unexpected exceptions and suppresses sensitive stack traces.' },
    { feature: 'Safe Document IDs', status: 'Passed', implementation: '24-character hexadecimal format verified prior to querying collections to prevent injection.' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>BCA Final Year Viva Documentation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System Planning & Project Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Comprehensive project report blueprint covering development stages, full-stack data flow,
          MongoDB schemas, API endpoints, Admin Panel role-based control, and security compliance.
        </p>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          {[
            { id: 'stages', label: 'Development Stages (0-12)', icon: Workflow },
            { id: 'architecture', label: 'System Architecture', icon: Network },
            { id: 'erd', label: 'Database Models (ERD)', icon: Database },
            { id: 'api', label: 'REST API Catalog', icon: Server },
            { id: 'security', label: 'Security & RBAC Audit', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Stages 0 to 12 */}
      {activeTab === 'stages' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">Development Order & Methodology</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The AI Ad Generator was implemented following an incremental agile lifecycle. Each stage
              isolated a specific layer of the stack (planning, setup, UI, auth, domain CRUD, AI prompt engineering,
              persistence, security, Light Theme styling, and Admin Panel role-based control).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stagesList.map((st) => (
              <div
                key={st.id}
                className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 hover:border-purple-300 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700">{st.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    Completed
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Architecture & Flow */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Full-Stack Data Flow</h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre overflow-x-auto">
{`React Frontend (Client SPA)
  │
  ├─ User inputs product specs (Name, Features, Benefits, Audience, Offer)
  ├─ Selects tone (Professional, Friendly, Creative) & channel (Social, Email)
  │
  ▼ [HTTP POST /api/ads/generate with JWT Bearer Token]
Express Backend Server
  │
  ├─ 1. Authentication Middleware (verifies JWT session & user identity)
  ├─ 2. Request Validation Middleware (sanitizes input fields & types)
  ├─ 3. AI Service Prompt Construction (injects strict anti-hallucination rules)
  │
  ▼ [@google/genai SDK — Gemini 3.8 Flash]
Google Generative AI Model
  │
  ├─ Validates prompt against user constraints
  ├─ Adheres to factual grounding (zero fabricated specs/prices)
  ├─ Returns structured JSON:
  │    { headline, shortDescription, longDescription, tagline, promotionalMessage, callToAction, socialMediaCopy }
  │
  ▼ [JSON Response]
Express Backend Controller
  │
  ▼ [HTTP 200 OK]
React Frontend Workspace
  │
  ├─ Displays 7 individual section cards
  ├─ Allows inline editing & clipboard copying
  ├─ Provides "Export as Text File (.txt)" download
  ├─ Provides "Regenerate Variation" & "Save Advertisement"
  │
  ▼ [HTTP POST /api/ads/save]
MongoDB Collection (advertisements)
  │
  └─ Stores userId, productId, settings, original & edited content`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
              <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider">Frontend Architecture</h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>React 19 with TypeScript</li>
                <li>Tailwind CSS for responsive Light Theme design</li>
                <li>Vertical Menu navigation with collapsible mobile drawer</li>
                <li>AuthContext for centralized authentication state</li>
                <li>Role-based client protection with AdminRoute</li>
                <li>Text file export utility via client-side Blob generation</li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
              <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider">Backend Architecture</h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Node.js + Express.js REST API</li>
                <li>Modular MVC: Routes → Middlewares → Controllers → Services → Models</li>
                <li>Role-based access: requireAuth + requireAdmin middleware</li>
                <li>JWT Token Authentication & bcrypt password hashing</li>
                <li>@google/genai SDK (Gemini 3.8 Flash with server-side API key)</li>
                <li>MongoDB-compatible persistent document store</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Database Models (ERD) */}
      {activeTab === 'erd' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Model */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-purple-700">
                <Database className="w-4 h-4" />
                <h4 className="text-sm font-bold uppercase tracking-wider">User Model</h4>
              </div>
              <p className="text-xs text-slate-500">Stores credentials, profile, and role (user / admin).</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
                <div>_id: String (PK)</div>
                <div>name: String</div>
                <div>email: String (Unique)</div>
                <div>passwordHash: String</div>
                <div>role: 'user' | 'admin'</div>
                <div>createdAt: Timestamp</div>
                <div>updatedAt: Timestamp</div>
              </div>
            </div>

            {/* Product Model */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-purple-700">
                <Database className="w-4 h-4" />
                <h4 className="text-sm font-bold uppercase tracking-wider">Product Model</h4>
              </div>
              <p className="text-xs text-slate-500">Maintains user product specifications.</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
                <div>_id: String (PK)</div>
                <div>userId: String (FK → User)</div>
                <div>name: String</div>
                <div>category: String</div>
                <div>description: String</div>
                <div>features: String</div>
                <div>benefits: String</div>
                <div>audience: String</div>
                <div>price: String?</div>
                <div>offer: String?</div>
              </div>
            </div>

            {/* Advertisement Model */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-purple-700">
                <Database className="w-4 h-4" />
                <h4 className="text-sm font-bold uppercase tracking-wider">Advertisement Model</h4>
              </div>
              <p className="text-xs text-slate-500">Stores generated and edited campaign packages.</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
                <div>_id: String (PK)</div>
                <div>userId: String (FK → User)</div>
                <div>productId: String? (FK)</div>
                <div>productName: String</div>
                <div>tone: String</div>
                <div>platform: String</div>
                <div>contentLength: String</div>
                <div>generatedContent: Object</div>
                <div>editedContent: Object?</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: API Catalog */}
      {activeTab === 'api' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-2">REST API Endpoints</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Endpoint</th>
                  <th className="py-2.5 px-3">Access Level</th>
                  <th className="py-2.5 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                <tr>
                  <td className="py-2 px-3 text-emerald-600 font-bold">GET</td>
                  <td className="py-2 px-3">/api/health</td>
                  <td className="py-2 px-3 text-slate-400">Public</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Server health verification</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-amber-600 font-bold">POST</td>
                  <td className="py-2 px-3">/api/auth/register</td>
                  <td className="py-2 px-3 text-slate-400">Public</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Register new user account</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-amber-600 font-bold">POST</td>
                  <td className="py-2 px-3">/api/auth/login</td>
                  <td className="py-2 px-3 text-slate-400">Public</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Authenticate user & issue JWT</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-emerald-600 font-bold">GET</td>
                  <td className="py-2 px-3">/api/auth/me</td>
                  <td className="py-2 px-3 text-purple-600 font-semibold">User (Auth)</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Fetch current user session</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-emerald-600 font-bold">GET</td>
                  <td className="py-2 px-3">/api/products</td>
                  <td className="py-2 px-3 text-purple-600 font-semibold">User (Auth)</td>
                  <td className="py-2 px-3 font-sans text-slate-600">List user's products</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-amber-600 font-bold">POST</td>
                  <td className="py-2 px-3">/api/products</td>
                  <td className="py-2 px-3 text-purple-600 font-semibold">User (Auth)</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Create new product</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-blue-600 font-bold">PUT</td>
                  <td className="py-2 px-3">/api/products/:id</td>
                  <td className="py-2 px-3 text-purple-600 font-semibold">User (Auth)</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Update product (ownership check)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-red-600 font-bold">DELETE</td>
                  <td className="py-2 px-3">/api/products/:id</td>
                  <td className="py-2 px-3 text-purple-600 font-semibold">User (Auth)</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Delete product (ownership check)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-amber-600 font-bold">POST</td>
                  <td className="py-2 px-3">/api/ads/generate</td>
                  <td className="py-2 px-3 text-purple-600 font-semibold">User (Auth)</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Generate ad copy via Gemini AI</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-amber-600 font-bold">POST</td>
                  <td className="py-2 px-3">/api/ads/save</td>
                  <td className="py-2 px-3 text-purple-600 font-semibold">User (Auth)</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Save ad package to database</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-emerald-600 font-bold">GET</td>
                  <td className="py-2 px-3">/api/ads/history</td>
                  <td className="py-2 px-3 text-purple-600 font-semibold">User (Auth)</td>
                  <td className="py-2 px-3 font-sans text-slate-600">List user's saved ads</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-emerald-600 font-bold">GET</td>
                  <td className="py-2 px-3">/api/admin/dashboard</td>
                  <td className="py-2 px-3 text-red-600 font-bold">Admin Only</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Platform-wide statistics & charts</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-emerald-600 font-bold">GET</td>
                  <td className="py-2 px-3">/api/admin/users</td>
                  <td className="py-2 px-3 text-red-600 font-bold">Admin Only</td>
                  <td className="py-2 px-3 font-sans text-slate-600">List all users with stats</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-red-600 font-bold">DELETE</td>
                  <td className="py-2 px-3">/api/admin/users/:id</td>
                  <td className="py-2 px-3 text-red-600 font-bold">Admin Only</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Delete user and cascade records</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-emerald-600 font-bold">GET</td>
                  <td className="py-2 px-3">/api/admin/products</td>
                  <td className="py-2 px-3 text-red-600 font-bold">Admin Only</td>
                  <td className="py-2 px-3 font-sans text-slate-600">List all products across owners</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-emerald-600 font-bold">GET</td>
                  <td className="py-2 px-3">/api/admin/ads</td>
                  <td className="py-2 px-3 text-red-600 font-bold">Admin Only</td>
                  <td className="py-2 px-3 font-sans text-slate-600">Moderate & inspect all advertisements</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Security Checklist */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">STAGE 10 — Security & RBAC Audit</h3>
            <p className="text-xs text-slate-500">
              Audit results verifying authentication, ownership authorization, role-based admin security, secret protection,
              and AI grounding constraints.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="py-2.5 px-3">Security Feature</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Technical Implementation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {securityChecklist.map((item) => (
                  <tr key={item.feature}>
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">{item.feature}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{item.implementation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
