# AI agent guide for this repo

Laravel 12 + Inertia (React 19 + TS) with Vite, Tailwind v4, optional SSR, and Pest. Use these repo-specific patterns and commands.

## Architecture and flow
- Controllers return Inertia pages (no per-page Blade). Example: `LawFirmController@index` -> `Inertia::render('admin/law-firms/index')` mapped to `resources/js/pages/admin/law-firms/index.tsx`.
- Frontend entry `resources/js/app.tsx` uses `createInertiaApp` with dynamic resolution from `resources/js/pages/**/*.tsx`.
- Pages can set a layout: `Page.layout = (p) => <AdminLayout>{p}</AdminLayout>` (see `resources/js/layouts/**`).
- Tailwind v4 via `@tailwindcss/vite`; UI primitives in `resources/js/components/ui/**`.
- Routes in `routes/*.php` (home, dashboard, auth, settings, admin). Admin uses resource routes under `/admin`.
- SSR enabled (`config/inertia.php`), SSR entry `resources/js/ssr.tsx` (dev SSR server at http://127.0.0.1:13714).

## Dev workflows
- Local: `composer install`, `npm ci`, copy `.env`, `php artisan key:generate`, `php artisan migrate --graceful`.
	- `composer dev` = PHP server + queue listener + `npm run dev` (HMR).
	- `composer dev:ssr` also starts logs + `php artisan inertia:start-ssr`.
- Build: `npm run build` (client), `npm run build:ssr` (client + SSR).
- Tests: Pest via `./vendor/bin/pest` or `composer test` (config clear then `artisan test`). Inertia test config ensures page files exist.
- Lint/format: `vendor/bin/pint`, `npm run format`, `npm run lint`.
- Docker/Sail: `./vendor/bin/sail up -d` (ports `${APP_PORT:-80}`, `${VITE_PORT:-5173}`). Default DB is SQLite (`config/database.php`); switch `.env` for MySQL.

## Conventions and helpers
- Page name -> file: `Inertia::render('dashboard')` -> `resources/js/pages/dashboard.tsx`.
- Admin CRUD: `Route::resource('/admin/law-firms', LawFirmController::class)` with names `admin.law-firms.*` and pages under `resources/js/pages/admin/law-firms/`.
- TS alias: `@/*` -> `resources/js/*` (see `tsconfig.json`).
- Theme: `initializeTheme()` in `app.tsx` and `useAppearance()` from `resources/js/hooks/use-appearance.tsx`; Blade root `resources/views/app.blade.php` applies dark mode early for SSR.
- URL/query: `resources/js/wayfinder/index.ts` (`queryParams`, `setUrlDefaults`, `applyUrlDefaults`) for consistent query-string handling.

## CI expectations
- Tests workflow (`.github/workflows/tests.yml`): PHP 8.4, Node 22, `npm ci`, `composer install`, `npm run build`, copy `.env`, `php artisan key:generate`, run `./vendor/bin/pest`.
- Lint workflow (`.github/workflows/lint.yml`): Pint + Prettier + ESLint.

Examples: route -> `Inertia::render('home')` -> `resources/js/pages/home.tsx`; page layout in `pages/admin/law-firms/index.tsx`; build URL: `'/admin/law-firms' + queryParams({ query: { q: 'smith', tags: ['uk'] } })`.

Unclear or missing details (e.g., SSR port usage in other environments, Sail vs local preference, extending LawFirm CRUD)? Ask to refine this doc.
