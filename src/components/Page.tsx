// src/components/Page.tsx
export function Page({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(16,185,129,0.08),transparent_60%),linear-gradient(to_bottom,white,rgba(249,250,251,0.6))]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </div>
    );
  }
  
  // src/components/Section.tsx (enhanced)
  export default function Section({
    title,
    subtitle,
    action,
    children,
  }: {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
  }) {
    return (
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
        <div className="h-px bg-gradient-to-r from-gray-200/70 via-gray-200/40 to-transparent rounded-full" />
        {children}
      </section>
    );
  }
  