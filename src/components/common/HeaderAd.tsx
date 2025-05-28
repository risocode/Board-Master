"use client";

import { useEffect } from "react";

export default function HeaderAd() {
  useEffect(() => {
    try {
      // @ts-expect-error: AdSense push may not be typed
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ignore AdSense errors
    }
  }, []);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "16px 0" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1482729173853463"
        data-ad-slot="3844537316"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
} 