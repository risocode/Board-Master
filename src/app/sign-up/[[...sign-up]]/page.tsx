'use client';

import { SignUp } from "@clerk/nextjs";
import { useSearchParams, usePathname } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const course = searchParams.get("course") || "BSA";
  const redirectUrl = searchParams.get("redirect_url") || `/course/${course}`;

  // Robust logging for debugging
  console.log("[SignUp] page loaded");
  console.log("[SignUp] Current pathname:", pathname);
  console.log("[SignUp] Search params:", searchParams.toString());
  console.log("[SignUp] Course param:", course);
  console.log("[SignUp] Redirect URL:", redirectUrl);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaf4fb]">
      <SignUp
        path={pathname}
        routing="path"
        afterSignUpUrl={redirectUrl}
        appearance={{
          elements: {
            headerTitle: 'text-2xl font-bold text-blue-900',
            headerSubtitle: 'text-base text-gray-600',
            socialButtonsBlockButton: 'rounded-lg border border-blue-200',
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg',
            footerAction: 'text-blue-700',
          },
        }}
      />
    </div>
  );
}