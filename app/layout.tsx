import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import StaggeredFadeLoader from "@/components/ui/staggered-fade-loader";

// Metadata
export const metadata: Metadata = {
  title: "tAIlor - AI Resume Tailorer | Your Dream Resume, Personalized",
  description:
    "Effortlessly create tailored resumes that match your dream job's requirements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isBackendAwake, setIsBackendAwake] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Ping the backend health check endpoint
        await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/health`);
        setIsBackendAwake(true); // Backend is awake
      } catch (error) {
        console.error("Backend is waking up:", error);
        setTimeout(checkBackend, 2000); // Retry after 2 seconds
      }
    };

    checkBackend();
  }, []);

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased font-spaceGrotesk relative">
          <Navbar />
          {!isBackendAwake && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50 backdrop-blur-md pointer-events-auto">
              {/* Fullscreen overlay to block interactions */}
              <div className="absolute inset-0 pointer-events-auto" />
              <p className="text-white text-xl mb-4 z-10">
                Flask application on Render is waking up...
              </p>
              <StaggeredFadeLoader className="z-10" />
            </div>
          )}
          <div
            className={`transition-opacity duration-300 ${
              isBackendAwake ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none"
            }`}
          >
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
