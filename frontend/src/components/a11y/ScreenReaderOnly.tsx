import * as React from "react";

export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

export default ScreenReaderOnly;


