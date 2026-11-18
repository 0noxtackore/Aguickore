"use client";

import React, { useState, useEffect } from "react";
import {
  EyeIcon as Eye,
  CodeIcon as Code,
  BookOpenTextIcon as Book,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DemoList } from "@/components/demo-list/demo-list";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ChevronDown } from "lucide-react";
import featureConfig from "@/config";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { menuIntegrations, type MenuIntegrationConfig } from "@/menu";
import type { Feature } from "@/types/integration";
import { useURLParams } from "@/contexts/url-params-context";
import { View } from "@/types/interface";
import { getTitleForCurrentDomain } from "@/utils/domain-config";
import posthog from "posthog-js";

// Integrations without a hosted backend stay out of the picker in production.
const pickerIntegrations = (menuIntegrations as readonly MenuIntegrationConfig[]).filter(
  (integration) =>
    !integration.localOnly || process.env.NODE_ENV === "development",
);

interface SidebarProps {
  isMobile?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobile, onMobileClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const logoSrc = "/Aguickore_logo_name_light.png";
  const {
    view,
    frameworkPickerHidden,
    viewPickerHidden,
    featurePickerHidden,
    setView,
  } = useURLParams();

  // Extract the current integration ID from the pathname
  const pathParts = pathname.split("/");
  const currentIntegrationId = pathParts[1]; // First segment after root
  const currentDemoId = pathParts[pathParts.length - 1];
  const isFeatureRoute = pathParts[2] === "feature" && Boolean(pathParts[3]);

  // Find the current integration (only if we have a valid integration ID)
  const currentIntegration =
    currentIntegrationId && currentIntegrationId !== ""
      ? menuIntegrations.find(
          (integration) => integration.id === currentIntegrationId,
        )
      : null;

  // Filter demos based on current integration's features
  const filteredDemos = currentIntegration
    ? featureConfig.filter((demo) =>
        (currentIntegration.features as Feature[]).includes(demo.id as Feature),
      )
    : []; // Show no demos if no integration is selected

  // Handle selecting a demo
  const handleDemoSelect = (demoId: string) => {
    if (currentIntegration) {
      posthog.capture("demo_selected", {
        demo_id: demoId,
        integration_id: currentIntegration.id,
        integration_name: currentIntegration.name,
      });
      const queryString = searchParams.toString();
      const newPath = `/${currentIntegration.id}/feature/${demoId}`;
      const url = queryString ? `${newPath}?${queryString}` : newPath;
      router.push(url);
      // Close mobile sidebar when demo is selected
      if (isMobile && onMobileClose) {
        onMobileClose();
      }
    }
  };

  // Handle integration selection
  const handleIntegrationSelect = (integrationId: string) => {
    posthog.capture("integration_selected", {
      integration_id: integrationId,
      previous_integration_id: currentIntegrationId || null,
    });
    const queryString = searchParams.toString();
    const newPath = `/${integrationId}`;
    const url = queryString ? `${newPath}?${queryString}` : newPath;
    router.push(url);
  };

  const tabClass = `cursor-pointer flex-1 h-8 px-2 text-sm text-palette-text-secondary shadow-none bg-transparent border border-transparent font-medium gap-1 rounded-lg transition-all data-[state=active]:bg-palette-surface-containerActive data-[state=active]:text-palette-text-primary data-[state=active]:border-palette-border-actionEnabled/40 data-[state=active]:shadow-none hover:text-palette-text-primary`;

  return (
    <div
      className={`flex flex-col h-full border border-palette-border-default backdrop-blur-xl
      ${isMobile ? "w-80 shadow-2xl bg-palette-surface-container/95 z-99" : "bg-palette-surface-container/70 w-74 min-w-[296px] flex-shrink-0 rounded-xl overflow-hidden shadow-lg"}
    `}
    >
      {/* Sidebar Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between ml-1">
          <div className="flex items-center">
            <img
              src={logoSrc}
              alt="Aguickore"
              className="h-14 w-auto max-w-[260px] object-contain"
            />
          </div>

          {/*<ThemeToggle />*/}
        </div>
      </div>

      {/* Controls Section */}
      {(!frameworkPickerHidden || !viewPickerHidden) && (
        <div className="p-4 border-b border-palette-border-divider">
          {/* Integration picker */}
          {!frameworkPickerHidden && (
            <div className="mb-spacing-4">
              <SectionTitle title="Integrations" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center justify-between h-spacing-8 rounded-lg gap-spacing-2 px-spacing-3 border border-palette-border-container bg-palette-surface-default50 transition-colors hover:bg-palette-surface-containerHovered hover:border-palette-border-actionEnabled/40 cursor-pointer">
                    <span className="pb-[2px] text-palette-text-primary font-medium leading-[22px] inline-block truncate">
                      {currentIntegration
                        ? currentIntegration.name
                        : "Select Integration"}
                    </span>
                    <ChevronDown
                      className="text-palette-icon-default transition-transform"
                      size={16}
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="ml-4 w-80 bg-palette-surface-container border-palette-border-container shadow-xl">
                  {pickerIntegrations.map((integration) => (
                    <DropdownMenuItem
                      key={integration.id}
                      onClick={() => handleIntegrationSelect(integration.id)}
                      className="cursor-pointer hover:bg-palette-surface-containerHovered focus:bg-palette-surface-containerHovered text-palette-text-primary text-base h-12 rounded-md"
                    >
                      <span>{integration.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Preview/Code Tabs */}
          {!viewPickerHidden && (
            <div className="mb-1">
              <SectionTitle title="View" />
              {isFeatureRoute ? (
                <Tabs
                  value={view}
                  onValueChange={(tab) => {
                    posthog.capture("view_changed", {
                      view: tab,
                      integration_id: currentIntegrationId || null,
                      demo_id: currentDemoId || null,
                    });
                    setView(tab as View);
                  }}
                  className="w-full rounded-lg bg-none border-none"
                >
                  <TabsList className="w-full rounded-lg h-8 p-0 bg-transparent border-none">
                    <TabsTrigger value="preview" className={tabClass}>
                      <Eye className="h-3 w-3" />
                      <span>Preview</span>
                    </TabsTrigger>
                    <TabsTrigger value="code" className={tabClass}>
                      <Code className="h-3 w-3" />
                      <span>Code</span>
                    </TabsTrigger>
                    <TabsTrigger value="readme" className={tabClass}>
                      <Book className="h-3 w-3" />
                      <span>Docs</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              ) : (
                <p className="text-xs text-palette-text-secondary px-1 py-1">
                  Selecciona una demo para cambiar entre Preview, Code y Docs.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Demo List */}
      <div className="flex-1 overflow-auto">
        {currentIntegration && !featurePickerHidden ? (
          <DemoList
            demos={filteredDemos}
            selectedDemo={currentDemoId}
            onSelect={handleDemoSelect}
          />
        ) : (
          <div className="flex items-center justify-center h-full p-8">
            <p className="text-muted-foreground text-center"></p>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className={cn("items-center", "flex px-spacing-1 gap-spacing-2 mb-2")}>
      <label
        className={cn(
          "transition-all duration-300 ease-in-out inline-block whitespace-nowrap paragraphs-Small-Regular-Uppercase text-[10px] text-palette-text-secondary opacity-100 scale-100 w-fit",
        )}
      >
        {title}
      </label>
      <div
        className={cn(
          "h-[1px] bg-palette-border-container transition-all duration-300 ease-[cubic-bezier(0.36,0.01,0.22,1)]",
          "w-full",
        )}
      />
    </div>
  );
}
