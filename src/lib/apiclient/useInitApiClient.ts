// src/lib/api/useInitApiClient.ts

"use client";

import { useEffect } from "react";
import { setApiUIHandlers } from "./apiClient";
import { useConfirm } from "@/components/ui/Provider/ConfrimProvider";
import { useToast } from "@/components/ui/Provider/useToast";

export function useInitApiClient() {
  const { confirm } = useConfirm();
  const { toast } = useToast();

  useEffect(() => {
    setApiUIHandlers({
      confirm: (msg) => confirm(msg),
      toast: (type, msg) => toast({ type, message: msg }),
    });
  }, [confirm, toast]);
}