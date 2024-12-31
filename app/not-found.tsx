"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import ShinyButton from "@/components/ui/shiny-button";
import StaggeredFadeLoader from "@/components/ui/staggered-fade-loader";

export default function NotFound() {
  const router = useRouter();
  const [isBackendAwake, setIsBackendAwake] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/health`);
        if (response.ok) {
          setIsBackendAwake(true);
        } else {
          setIsBackendAwake(false);
        }
      } catch (error) {
        console.error("Backend is not reachable:", error);
        setIsBackendAwake(false);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#141313] to-[#2b2928] flex items-center justify-center">
      {/* Loader Overlay */}
      {!isBackendAwake && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center">
          <StaggeredFadeLoader />
          <p className="text-white mt-4">Flask application on Render is waking up...</p>
        </div>
      )}

      {/* Background Beams */}
      <BackgroundBeams className="opacity-50" />

      {/* Content */}
      <div className={isBackendAwake ? "z-10" : "opacity-50 pointer-events-none"}>
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
    </div>
  );
}
