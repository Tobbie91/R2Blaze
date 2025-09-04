export default function Section({
    title,
    children,
    className = '',
    action,
  }: {
    title: string
    children: React.ReactNode
    className?: string
    action?: React.ReactNode
  }) {
    return (
      <section className={className}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          {action}
        </div>
        {children}
      </section>
    )
  }
  