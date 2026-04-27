import { useEffect, useState } from "react";

export function useDashboard() {
  const [pages, setPages] = useState<any[]>([]);

  const fetchPages = async () => {
    const res = await fetch("/api_local/admin/dashboardBuilder/page");
    const data = await res.json();
    setPages(data);
  };

  const addPage = async () => {
  const res = await fetch("/api_local/admin/dashboardBuilder/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "New Page",
    }),
  });

  return await res.json();
};

  useEffect(() => {
    fetchPages();
  }, []);

  return {
    pages,
    setPages,
    addPage,
  };
}