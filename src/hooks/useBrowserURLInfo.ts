"use client";

import { useEffect, useState } from "react";

export function useBrowserURLInfo() {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    const url = new URL(window.location.href);

    setInfo({
      href: url.href,
      origin: url.origin,
      hostname: url.hostname,
      port: url.port,
      protocol: url.protocol,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
    });
  }, []);

  return info;
}