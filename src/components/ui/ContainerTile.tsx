import React from "react";

interface ContainerTileProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4;
  className?: string;
  id?: string;
}

export function ContainerTile({
  children,
  span = 1,
  className = "",
  id,
}: ContainerTileProps) {
  // Grid column span classes on desktop (4-column grid)
  const spanClasses: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-1 lg:col-span-2",
    3: "col-span-1 lg:col-span-3",
    4: "col-span-1 md:col-span-2 lg:col-span-4",
  };

  return (
    <div
      id={id}
      className={`@container ${spanClasses[span] || "col-span-1"} ${className} group relative`}
    >
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-amber-500/25 via-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="h-full glass-card hairline-accent card-hover rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 relative z-0">
        {children}
      </div>
    </div>
  );
}
