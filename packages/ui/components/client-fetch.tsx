"use client";

import { useState, useEffect } from "react";

export interface ClientFetchProps {
  delay?: number;
}

export function ClientFetch({ delay = 1000 }: ClientFetchProps) {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate a client-side fetch with a delay
      await new Promise((resolve) => setTimeout(resolve, delay));
      setData(new Date().toISOString());
      setLoading(false);
    };

    fetchData();
  }, [delay]);

  return (
    <div className="p-4 border border-border rounded-md">
      <p className="text-sm font-medium mb-2">Client Fetch</p>
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : (
        <p className="text-sm">
          Fetched at: <code className="font-mono">{data}</code>
        </p>
      )}
    </div>
  );
}
