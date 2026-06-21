"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

// Types
interface PaginationProps {
  totalPages: number;
  searchParams?: { page?: string };
  /** Pass when using client-side state (useState) instead of URL navigation */
  currentPage?: number;
  /** Pass when using client-side state (useState) instead of URL navigation */
  onPageChange?: (page: number) => void;
  rtl?: boolean;
  className?: string;
}

// Component
export default function PaginationWrapper({
  totalPages,
  searchParams,
  currentPage: controlledPage,
  onPageChange,
  rtl = false,
  className,
}: PaginationProps) {
  // Navigation (only used when onPageChange is not provided)
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();

  // State — controlled (via props) or derived from URL
  const pageParam = controlledPage ?? Number(searchParams?.page) ?? 1;
  const currentPage = Math.max(1, Math.min(pageParam || 1, totalPages));

  // Variables
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const visiblePages = generatePageNumbers();

  // Functions
  /**
   * Generate an array of page numbers to display in the pagination.
   * Handles edge cases for first/last pages and includes ellipsis where needed.
   */
  function generatePageNumbers(): (number | "ellipsis")[] {
    const maxVisible = 5;
    const edgeThreshold = 3;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= edgeThreshold) {
      return [1, 2, 3, 4, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "ellipsis",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  }

  /**
   * Navigate to a specific page.
   * Uses onPageChange callback if provided, otherwise updates the URL.
   */
  function navigateToPage(page: number): void {
    if (page < 1 || page > totalPages) return;

    // Client-side state mode
    if (onPageChange) {
      onPageChange(page);
      return;
    }

    // URL navigation mode
    const params = new URLSearchParams(currentSearchParams.toString());

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.push(newUrl);
  }

  // Render
  return (
    <PaginationRoot className={className}>
      <PaginationContent dir={rtl ? "rtl" : "ltr"}>
        <PaginationItem>
          {/* Go to first page */}
          <PaginationLink
            onClick={() => navigateToPage(1)}
            className={cn(
              "rounded-lg border border-zinc-100 dark:border-zinc-200 hover:border-zinc-200 hover:bg-zinc-50 cursor-pointer",
              isFirstPage && "opacity-50 pointer-events-none",
            )}
            aria-disabled={isFirstPage}
          >
            {rtl ? (
              <ChevronsRight className="h-4 w-4 dark:text-zinc-50" />
            ) : (
              <ChevronsLeft className="h-4 w-4 dark:text-zinc-50" />
            )}
          </PaginationLink>
        </PaginationItem>

        {/* Previous page button */}
        <PaginationItem>
          <PaginationLink
            onClick={() => navigateToPage(currentPage - 1)}
            className={cn(
              "rounded-lg border border-zinc-100 dark:border-zinc-200 hover:border-zinc-200 hover:bg-zinc-50 cursor-pointer",
              isFirstPage && "opacity-50 pointer-events-none",
            )}
            aria-disabled={isFirstPage}
          >
            {rtl ? (
              <ChevronRight className="h-4 w-4 dark:text-zinc-50" />
            ) : (
              <ChevronLeft className="h-4 w-4 dark:text-zinc-50" />
            )}
          </PaginationLink>
        </PaginationItem>

        {/* Page numbers with ellipsis */}
        {visiblePages.map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => navigateToPage(page)}
                isActive={page === currentPage}
                className={cn(
                  "w-9 h-9 rounded-lg border",
                  page === currentPage
                    ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 cursor-pointer dark:bg-emerald-500 dark:border-emerald-500 dark:hover:bg-emerald-600 hover:border-emerald-600 hover:text-white"
                    : "border-border text-foreground hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer",
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        {/* Next page button */}
        <PaginationItem>
          <PaginationLink
            onClick={() => navigateToPage(currentPage + 1)}
            className={cn(
              "rounded-lg border border-zinc-100 dark:border-zinc-200 hover:border-zinc-200 hover:bg-zinc-50 cursor-pointer",
              isLastPage && "opacity-50 pointer-events-none",
            )}
            aria-disabled={isLastPage}
          >
            {rtl ? (
              <ChevronLeft className="h-4 w-4 dark:text-zinc-50" />
            ) : (
              <ChevronRight className="h-4 w-4 dark:text-zinc-50" />
            )}
          </PaginationLink>
        </PaginationItem>

        {/* Go to last page */}
        <PaginationItem>
          <PaginationLink
            onClick={() => navigateToPage(totalPages)}
            className={cn(
              "rounded-lg border border-zinc-100 dark:border-zinc-200 hover:border-zinc-200 hover:bg-zinc-50 cursor-pointer",
              isLastPage && "opacity-50 pointer-events-none",
            )}
            aria-disabled={isLastPage}
          >
            {rtl ? (
              <ChevronsLeft className="h-4 w-4 dark:text-zinc-50" />
            ) : (
              <ChevronsRight className="h-4 w-4 dark:text-zinc-50" />
            )}
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
