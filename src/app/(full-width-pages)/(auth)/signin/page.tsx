import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AJF Monitoring System",
  description: "AJF Smart-Monitoring System",
};

export default function SignIn() {
  return <SignInForm />;
}
