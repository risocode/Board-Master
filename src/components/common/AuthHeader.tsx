"use client";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  SignedOut,
} from "@clerk/nextjs";

export default function AuthHeader() {
  const pathname = usePathname();
  if (
    pathname === "/" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  ) return null;
  return (
    <header>
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
    </header>
  );
} 