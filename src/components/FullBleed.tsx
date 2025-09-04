export default function FullBleed({ children }: { children: React.ReactNode }) {
    // makes the child span the full viewport width even inside a centered container
    return (
      <div className="relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen">
        {children}
      </div>
    )
  }
  