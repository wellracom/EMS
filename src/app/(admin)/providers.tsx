"use client";

import { ToastProvider } from "@/components/ui/Provider/ToastProvider";
import { ConfirmProvider } from "@/components/ui/Provider/ConfrimProvider";
import { AlertProvider } from "@/components/ui/Provider/AlertProvider";
import { useInitApiClient } from "@/lib/apiclient/useInitApiClient";

function Init() {
  useInitApiClient();
  return null;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AlertProvider>
          <Init />
          {children}
        </AlertProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}