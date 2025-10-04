"use client";

import * as React from "react";

export function useLiveRegion() {
  const [announcement, setAnnouncement] = React.useState("");

  const announce = React.useCallback(
    (message: string) => {
      setAnnouncement("");
      // Use a microtask to ensure re-announcement
      setTimeout(() => setAnnouncement(message), 50);
    },
    [],
  );

  const LiveRegion = ({ politeness = "polite" }: { politeness?: "polite" | "assertive" }) => (
    <div aria-live={politeness} aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );

  return { announce, LiveRegion };
}

export default useLiveRegion;


