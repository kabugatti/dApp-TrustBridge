// Base component
export { EmptyState } from "../empty-state";
export type { EmptyStateProps, EmptyStateAction } from "../empty-state";

// Specialized components
export { NoPoolsEmptyState } from "./NoPoolsEmptyState";
export { NoPositionsEmptyState } from "./NoPositionsEmptyState";
export { WalletNotConnectedEmptyState } from "./WalletNotConnectedEmptyState";
export { NoActivityEmptyState } from "./NoActivityEmptyState";
export { NoSearchResultsEmptyState } from "./NoSearchResultsEmptyState";
export { ErrorEmptyState } from "./ErrorEmptyState";

// Illustrations
export {
  PoolsIllustration,
  WalletIllustration,
  PositionsIllustration,
  ActivityIllustration,
  SearchIllustration,
  ErrorIllustration,
} from "./illustrations";
