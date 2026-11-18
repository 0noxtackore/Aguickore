import React from "react";
import { ViewerConfig } from "@/types/feature";
import { cn } from "@/lib/utils";
import { useMobileView } from "@/utils/use-mobile-view";
import { useURLParams } from "@/contexts/url-params-context";

interface ViewerLayoutProps extends ViewerConfig {
  className?: string;
  children?: React.ReactNode;
  codeEditor?: React.ReactNode;
  fileTree?: React.ReactNode;
  sidebarHeader?: React.ReactNode;
}

export function ViewerLayout({
  className,
  children,
}: ViewerLayoutProps) {
  const { sidebarHidden } = useURLParams();
  const { isMobile } = useMobileView();

  return (
    <div className={cn("relative flex h-screen overflow-hidden bg-palette-surface-main", className, {
      "p-spacing-2": !isMobile && !sidebarHidden,
    })}>
      <div className="flex flex-1 overflow-hidden relative z-10">
        <main className="flex-1 overflow-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>
      {/* Subtle neutral background glow */}
      <div className="absolute w-[600px] h-[600px] -left-[200px] -top-[200px] rounded-full z-0 pointer-events-none"
           style={{ background: 'rgba(255, 255, 255, 0.04)', filter: 'blur(140px)' }} />
      <div className="absolute w-[700px] h-[700px] right-[-220px] bottom-[-220px] rounded-full z-0 pointer-events-none"
           style={{ background: 'rgba(255, 255, 255, 0.03)', filter: 'blur(160px)' }} />
      <div className="absolute inset-0 z-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.2) 70%, rgba(10,10,10,0.55) 100%)' }} />
    </div>
  );
}
