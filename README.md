ERP_BAWA – AI-Assisted ERP System for Medical & Pharma Stores

ERP_BAWA is a modern, AI-integrated ERP platform built for pharmaceutical and medical stores.
It manages inventory, sales, purchases, users, roles, and privileges — all dynamically.
The system integrates with an AI-powered Django backend that reads prescriptions and intelligently manages medicine stock.

Tech Stack
Category	Tools
Framework	Next.js 16 (App Router) + React 19
Language	TypeScript
UI / Styling	Tailwind CSS 4 + Radix UI
State & Data Fetching	TanStack Query + Axios
Forms & Validation	React Hook Form + Zod
Animation	Framer Motion
Charts	Recharts
Toasts & Alerts	Sonner
Backend API	Django (hosted on PythonAnywhere)
Package Manager	pnpm
Version Control	GitHub
Deployment	Vercel (Frontend) + PythonAnywhere (Backend)

Folder Structure
ERP_BAWA/
├── app/
│   ├── dashboard/
│   ├── login/
│   ├── manage/
│   ├── medicine/
│   ├── sales/
│   ├── stock/
│   ├── superadmin/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── admin/
│   ├── dashboard/
│
├── features/
│   ├── dynamic-crud-page/
│   ├── DropdownFields.tsx
│   ├── DynamicCrudPage.tsx
│   ├── DynamicForm.tsx
│   └── DynamicTable.tsx
│
├── hooks/
│   ├── useUsers.ts
│   ├── useRoles.ts
│   └── usePrivileges.ts
│
├── lib/
│   ├── api/
│   │   ├── users.ts
│   │   ├── roles.ts
│   │   └── privileges.ts
│   ├── api.ts         # Axios interceptor setup
│   └── utils.ts       # Helper functions
│
├── types/
│   └── medical.ts
│
└── .env.local

Environment Variables

Create a .env.local file in the root:

NEXT_PUBLIC_API_BASE_URL=https://ihubrobotics.pythonanywhere.com
NEXT_PUBLIC_PROJECT_NAME=ERP_BAWA

Project Overview
1. Authentication

Login via username and password.

JWT and user data are stored in local storage.

Token is auto-attached to every request via Axios interceptors.

2. Dynamic Navbar

The entire navigation is generated dynamically from backend privileges.

API: /privilege/role/privileges/:roleId/

Modules/submodules update instantly if permissions change — no reload needed.

3. Role-Based Access

Managed under Roles & Permissions.

Each role defines CRUD privileges and assigned modules.

Role updates instantly reflect in UI via TanStack Query cache updates.

4. User Management

CRUD operations for user accounts.

Assign roles during creation.

Uses TanStack Query mutations and centralized API layer.

Example Hook – useUsers.ts:

const { usersQuery, createUserMutation } = useUsers();

createUserMutation.mutate(formData);

Dynamic CRUD System

A fully reusable CRUD builder under features/dynamic-crud-page/.

File	Description
DynamicCrudPage.tsx	Renders form + table based on backend schema
DynamicForm.tsx	Auto-generates form fields using React Hook Form + Zod
DynamicTable.tsx	Displays data with edit/delete actions (privilege-based)
DropdownFields.tsx	Handles dynamic dropdowns

All CRUD components adapt to backend schema + role privileges.

Modules (Phase 1)
Module	Description
Dashboard	Displays KPIs: medicines, orders, revenue, users
User Management	CRUD for users
Roles & Permissions	Manage roles + privileges
Modules/Submodules	Configure ERP hierarchy
Stock	Track and update inventory
Medicine & Sales	Core inventory and sales UI (Phase 1 only)
Data Fetching & Caching

TanStack Query manages caching and auto-refetching.

Centralized query keys: "users", "roles", "privileges".

refetchOnWindowFocus = true keeps UI in sync.

Errors are handled globally using Sonner toast notifications.

Setup & Run Locally
# 1. Clone repo
git clone https://github.com/ihubrobotics/ERP_BAWA.git
cd ERP_BAWA

# 2. Install dependencies
pnpm install

# 3. Add .env.local file
NEXT_PUBLIC_API_BASE_URL=https://ihubrobotics.pythonanywhere.com

# 4. Start development
pnpm run dev

# 5. Build & run production
pnpm run build && pnpm start

Roles (Phase 1)
Role	Permissions
Super Admin	Full access (users, roles, modules)
Admin	Limited to assigned modules
Stock Manager	Inventory & stock only

Suggestions for Next Phase

Modularize forms using field schema configs
Add SSR/ISR for dashboard metrics
Migrate static icons → centralized Lucide map
Add Error Boundaries for layouts
Add unit tests (TanStack Query mocks)
Integrate AI Prescription Reader with Django backend

Deployment
Service	Platform
Frontend	Vercel

Backend	PythonAnywhere

Auto-deploys from main branch on GitHub using Vercel CI/CD.

