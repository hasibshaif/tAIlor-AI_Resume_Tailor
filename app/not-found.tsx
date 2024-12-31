"use client";

import { useRouter } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";
import ShinyButton from "@/components/ui/shiny-button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#141313] to-[#2b2928] flex items-center justify-center">
      {/* Background Beams */}
      <BackgroundBeams className="opacity-50" />

      {/* Content */}
      <div className="flex flex-col items-center justify-center gap-[10px] z-10 container mx-auto p-4 text-center text-white">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-6">404 - Page Not Found</h1>
        <p className="mb-6 text-white">
          Sorry, the page you’re looking for doesn’t exist.
        </p>

        {/* Back to Home Button */}
        <div className="flex flex-col items-center">
          <ShinyButton
            onClick={() => router.push("/")}
            className="w-auto px-6 py-3"
          >
            Back to Home
          </ShinyButton>
        </div>
      </div>
    </div>
  );
}