"use client";

import { EmptyState } from "../empty-state";
import { SearchIllustration } from "./illustrations";

interface NoSearchResultsEmptyStateProps {
  onClearFilters: () => void;
  searchQuery?: string;
  className?: string;
}

export function NoSearchResultsEmptyState({ 
  onClearFilters, 
  searchQuery,
  className 
}: NoSearchResultsEmptyStateProps) {
  const title = searchQuery 
    ? `No pools match "${searchQuery}"`
    : "No pools match your criteria";
    
  const description = searchQuery
    ? `We couldn't find any pools matching "${searchQuery}". Try adjusting your search terms or browse all available pools.`
    : "No pools match your current filters. Try adjusting your search criteria or browse all available pools.";

  return (
    <EmptyState
      illustration={<SearchIllustration />}
      title={title}
      description={description}
      action={{
        label: "Clear Filters",
        onClick: onClearFilters,
        variant: "secondary"
      }}
      className={className}
    />
  );
}
