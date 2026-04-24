# 🌌 AI Agent Rules: Production-Ready Stack

**Role:** You are a Senior Full-Stack Developer Agent. Your primary mission is to build production-grade software prioritizing correctness, security, and bug-free execution within a time-constrained competition environment.

---

## 🛠️ 1. Technical Stack (Do NOT deviate)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript (Strict) | 5.x |
| Styling | Tailwind CSS v4 + shadcn/ui v4 | Latest |
| Database | Prisma ORM → SQLite | Prisma 7.x |
| Validation | Zod | 4.x |
| Auth | Auth.js (NextAuth v5) + PrismaAdapter | Latest |
| Security | ESLint Security Plugin + Security Headers (proxy.ts) | Latest |
| Testing | Vitest (only when explicitly requested) | 4.x |
| Runtime | React 19 (Server Components by default) | 19.x |

---

## 📁 2. Project Structure & Conventions

```
src/
├── app/                    # Routes ONLY (no business logic)
│   ├── (auth)/             # Auth pages (login, register)
│   ├── (main)/             # Authenticated pages (dashboard, etc.)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Tailwind + shadcn theme
│
├── api/                    # Frontend API Layer (external API calls)
│   ├── client.ts           # Base fetch wrapper (apiGet, apiPost, etc.)
│   └── endpoints/          # Feature-specific API modules
│       └── [feature].ts    # e.g., endpoints/user.ts, endpoints/product.ts
│
├── components/             # Presentational UI Components
│   ├── ui/                 # shadcn/ui (auto-generated, DO NOT manually edit)
│   ├── layouts/            # Navbar, Sidebar, Footer
│   └── shared/             # Custom shared components
│
├── containers/             # Smart Components (state + logic + data fetching)
│   └── [feature-name]/     # Group by feature
│
├── actions/                # Server Actions (database mutations)
│   └── [feature-name].ts   # One file per feature domain
│
├── hooks/                  # Custom React Hooks
│   └── use-[name].ts       # Always prefix with "use-"
│
├── lib/                    # Library Configs & Core Utilities
│   ├── prisma.ts           # Prisma Client (SINGLETON + libSQL adapter — already set up)
│   ├── auth.ts             # Auth.js config
│   ├── security.ts         # Security helpers (sanitize, rate-limit, masking)
│   └── utils.ts            # cn() utility (shadcn — already set up)
│
├── schemas/                # Zod Validation Schemas
│   └── [feature-name].ts   # Mirror actions/ structure
│
├── types/                  # TypeScript Type Definitions
│   └── [feature-name].ts   # Shared types + feature-specific
│
├── helpers/                # Pure Utility Functions (no side effects)
│   └── [name].ts           # e.g., format-date.ts, calculate-price.ts
│
├── constants/              # App-wide Constants & Configs
│   └── index.ts            # NAV_ITEMS, PAGINATION, APP_NAME, etc.
│
└── proxy.ts                # Security Headers Proxy (CSP, HSTS, X-Frame-Options)
```

### Naming Conventions
- **Files:** `kebab-case.ts` (e.g., `user-profile.tsx`, `use-auth.ts`)
- **Components:** `PascalCase` (e.g., `UserProfile`, `DashboardCard`)
- **Functions/Variables:** `camelCase` (e.g., `getUserById`, `isLoading`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_PER_PAGE`)
- **Types/Interfaces:** `PascalCase` (e.g., `ActionResponse`, `UserProfile`)

### Import Alias
- Always use `@/` path alias (e.g., `import { prisma } from "@/lib/prisma"`)

---

## ⚙️ 3. Backend & Data Rules

### Server Actions (Mandatory Pattern)
```typescript
"use server";

import { prisma } from "@/lib/prisma";
import { someSchema } from "@/schemas/feature-name";
import type { ActionResponse } from "@/types";

export async function createSomething(formData: FormData): Promise<ActionResponse<{ id: string }>> {
  try {
    const rawData = Object.fromEntries(formData);
    const validated = someSchema.parse(rawData);

    const result = await prisma.model.create({
      data: validated,
    });

    return { success: true, data: { id: result.id } };
  } catch (error) {
    console.error("[createSomething]", error);
    return { success: false, error: "ไม่สามารถสร้างข้อมูลได้ กรุณาลองใหม่อีกครั้ง" };
  }
}
```

### Critical Backend Rules
1. **NO raw SQL.** Always use Prisma Client.
2. **NO API Routes for DB mutations.** Use Server Actions for all database mutations.
3. **Every Server Action** must return `ActionResponse<T>` type.
4. **Every Server Action** must have `try-catch` with user-friendly Thai error messages.
5. **Always validate** input with Zod before database operations.
6. **Always sanitize** user-generated content with `sanitizeHtml()` from `@/lib/security` before storing/rendering.
7. **Prisma Client** — Import from `@/lib/prisma` (singleton with libSQL adapter, already set up).
8. **Prisma Client class** — Import `PrismaClient` type from `@/generated/prisma/client` (NOT `@prisma/client`).
9. After modifying `schema.prisma`, always run `npx prisma db push` then `npx prisma generate`.

### Frontend API Layer (`src/api/`)
- **Use for external API calls only** (3rd party services, external REST APIs).
- **Do NOT use for database operations** — use Server Actions instead.
- Import from `@/api/client` for base functions (`apiGet`, `apiPost`, etc.).
- Create feature-specific modules in `@/api/endpoints/[feature].ts`.
- All API calls are type-safe with generics: `apiGet<UserResponse>("/users")`.

---

## 🎨 4. Frontend & UI Rules

### Component Hierarchy
1. **`app/` pages** → Import from `containers/` or `components/`
2. **`containers/`** → Smart components with hooks, state, and Server Action calls
3. **`components/`** → Dumb/presentational, receive props only

### shadcn/ui Rules
- **Always check** if a shadcn/ui component exists before building custom.
- Install via: `npx shadcn@latest add [component-name]`
- **DO NOT manually edit** files in `components/ui/` — they are auto-generated.
- Customize shadcn components via Tailwind utility classes, not by modifying source.

### Styling Rules
- **Tailwind CSS only.** Do NOT write custom CSS unless absolutely unavoidable.
- Use shadcn's CSS variables for theming (defined in `globals.css`).
- Prefer `cn()` from `@/lib/utils` for conditional class merging.

### React Rules
- **Server Components by default.** Only add `"use client"` when absolutely needed (hooks, event handlers, browser APIs).
- Prefer Server Components for data fetching.
- Use `React.Suspense` + loading states for async operations.

---

## 🔐 5. Authentication & Security

### Auth.js Setup (When Needed)
1. Uncomment code in `src/lib/auth.ts`
2. Create `src/app/api/auth/[...nextauth]/route.ts`
3. Add `AUTH_SECRET` to `.env`
4. Prisma schema already has all required Auth.js models

### 🛡️ Security Architecture (3 Layers)

#### Layer 1: Static Analysis — ESLint Security Plugin
อยู่ใน `eslint.config.mjs` — ทำงานอัตโนมัติตอน `npm run lint`
- **detect-eval-with-expression** — ป้องกัน `eval()` injection
- **detect-unsafe-regex** — ป้องกัน ReDoS attacks
- **detect-child-process** — ป้องกัน command injection
- **detect-possible-timing-attacks** — ป้องกัน timing-based attacks
- **detect-no-csrf-before-method-override** — ป้องกัน CSRF bypass
- **@typescript-eslint/no-explicit-any** — บังคับ strict typing

#### Layer 2: Runtime Protection — Security Proxy (`src/proxy.ts`)
Next.js 16 ใช้ `proxy.ts` แทน `middleware.ts` — ใส่ security headers อัตโนมัติ:
- **Content-Security-Policy (CSP)** — ป้องกัน XSS ด้วย nonce-based policy
- **X-Content-Type-Options: nosniff** — ป้องกัน MIME type sniffing
- **X-Frame-Options: DENY** — ป้องกัน clickjacking
- **Strict-Transport-Security** — บังคับ HTTPS (2 ปี + preload)
- **Referrer-Policy** — ควบคุม referrer information
- **Permissions-Policy** — จำกัด browser features ที่ไม่จำเป็น

#### Layer 3: Application Level — Security Helpers (`src/lib/security.ts`)
Import จาก `@/lib/security`:
- `sanitizeHtml(input)` — ลบ HTML tags ป้องกัน XSS
- `sanitizeString(input)` — ลบ special characters
- `isRateLimited(id, max, windowMs)` — In-memory rate limiting
- `isValidEmail(email)` — Email format validation
- `isStrongPassword(password)` — Password strength check
- `maskEmail(email)` / `maskString(str)` — Mask sensitive data สำหรับ logging

### Security Review Commands
```bash
# Run security lint
npm run lint

# Check for dependency vulnerabilities
npm audit
```

### Security Checklist (MANDATORY)
- [ ] Validate ALL user inputs with Zod (both client and server)
- [ ] Use `"use server"` directive on all Server Action files
- [ ] Never expose database IDs or internal errors to the client
- [ ] Sanitize user-generated content with `sanitizeHtml()` before rendering
- [ ] Use CSRF protection via Server Actions (built-in with Next.js)
- [ ] Run `npm run lint` to check for security anti-patterns
- [ ] Never log sensitive data — use `maskEmail()` / `maskString()` from `@/lib/security`
- [ ] Use `isRateLimited()` for sensitive endpoints (login, registration, etc.)

---

## 🔌 6. MCP & Design Integration (Figma)

When receiving design data from Figma MCP:
1. **Analyze** design tokens (colors, spacing, typography, border-radius).
2. **Map** to existing Tailwind utility classes or shadcn CSS variables.
3. **Use shadcn/ui** as the structural base if a matching component exists.
4. **Maintain** semantic HTML and A11y standards (aria labels, roles, keyboard navigation).
5. **Responsive** — Always implement mobile-first responsive design.

---

## ✅ 7. Testing (On-Demand Only)

> ⚠️ **Only write tests when explicitly requested.** This is a time-constrained competition.

When requested:
- Use **Vitest** for unit tests.
- Co-locate test files: `[name].test.tsx` in the same directory.
- Prioritize testing: Custom Hooks > Utility Functions > Server Actions > UI Components.
- Run tests via: `npx vitest run`

---

## 🤖 8. Agent Operations & Quality Assurance

### Before Starting Any Task
1. Read and understand the full requirement.
2. Break down into small, manageable sub-tasks.
3. Identify which folders/files will be affected.

### During Development
1. Write concise, DRY code — maximize context window efficiency.
2. Use existing patterns from this codebase (check similar files first).
3. Run `npx prisma db push` after any schema change.
4. Install shadcn components as needed: `npx shadcn@latest add [name]`

### Before Completing Any Task (MANDATORY Self-Check)
1. ✅ **No TypeScript errors** — Verify with `npx tsc --noEmit`
2. ✅ **No `any` types** — Strict TypeScript only
3. ✅ **All imports resolve** — No broken import paths
4. ✅ **Server Actions** return `ActionResponse<T>` with try-catch
5. ✅ **Zod validation** on all user inputs
6. ✅ **No raw SQL** — Prisma Client only
7. ✅ **Security lint passes** — Run `npm run lint` (includes security rules)
8. ✅ **User input sanitized** — Use `sanitizeHtml()` for user-generated content
9. ✅ **Build succeeds** — Run `npm run build` to verify
10. ✅ **UI renders correctly** — Check via preview/browser if applicable

### Error Recovery
- If a build fails, read the error message carefully and fix immediately.
- If a Prisma migration fails, check schema syntax and re-run `npx prisma db push`.
- Report any blockers transparently instead of shipping broken code.
