"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-toastify";
import AiButton from "@/components/animata/button/ai-button";
import StaggeredFadeLoader from "@/components/ui/staggered-fade-loader";
import WhirlpoolLoader from "@/components/ui/whirlpool-loader";
import { FaCloudDownloadAlt, FaArrowLeft, FaRedo } from "react-icons/fa";

export default function CreateTailor() {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();

  const [masterResume, setMasterResume] = useState<boolean>(false);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [tailoredResume, setTailoredResume] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/");
    }
  }, [userId, isLoaded, router]);

  useEffect(() => {
    const checkMasterResume = async () => {
      if (!userId) return;

      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-master-resume`,
          {
            headers: { userId },
          }
        );
        setMasterResume(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.error("No master resume found. Redirecting...");
        setMasterResume(false);
        router.push("/upload-resume");
      }
    };
    checkMasterResume();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDescription || !userId) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (jobDescription.length > 1000) {
      toast.error("Job description exceeds the 1000-character limit.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/generate-resume`,
        {
          jobTitle,
          jobDescription,
        },
        {
          headers: {
            userId,
          },
        }
      );

      toast.success("Resume tailored successfully!");
      setTailoredResume(response.data.resumeUrl);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate tailored resume. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return userId ? (
    <div className="relative min-h-screen bg-gradient-to-br from-[#141313] via-[#2b2928] to-[#181818] flex items-center justify-center px-4">
      {/* Loader Overlay */}
      {!isBackendAwake && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center">
          <WhirlpoolLoader />
          <div className="bg-gray-800/50 rounded-xl flex justify-center items-center">
            <p className="text-white mt-4">Flask application on Render is waking up...</p>
          </div>
        </div>
      )}

      <div className={isBackendAwake ? "z-10" : "opacity-50 pointer-events-none"}>
        {/* Tailored Resume Section */}
        {tailoredResume ? (
          <div className="bg-gradient-to-br from-[#17181c] via-[#262e47] to-[#252629] rounded-lg shadow-xl p-6 w-full sm:w-3/4 lg:w-1/2 flex flex-col items-center gap-6">
            <h2 className="text-2xl font-semibold text-white text-center">
              {jobTitle} Tailored Resume
            </h2>
            <div className="flex justify-center gap-6">
              <a
                href={tailoredResume}
                download={`${jobTitle}_Tailored_Resume.docx`}
                className="flex flex-col items-center text-white hover:text-blue-400 transition"
              >
                <FaCloudDownloadAlt size={30} aria-label="Download Resume" />
                <span className="text-sm mt-1">Download</span>
              </a>
              <button
                onClick={() => router.push("/tailor")}
                className="flex flex-col items-center text-white hover:text-green-400 transition"
              >
                <FaArrowLeft size={30} aria-label="Back to Dashboard" />
                <span className="text-sm mt-1">Dashboard</span>
              </button>
              <button
                onClick={() => {
                  setTailoredResume(null);
                  router.push("/create-tailor");
                }}
                className="flex flex-col items-center text-white hover:text-yellow-400 transition"
              >
                <FaRedo size={30} aria-label="Start New Tailor" />
                <span className="text-sm mt-1">New Tailor</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            {/* Page Header */}
            <header className="text-center mb-12 mt-16">
              <h1 className="text-4xl font-bold text-white mb-4">Craft a Tailored Resume</h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Personalize your resume to match any job description effortlessly. Provide the job
                title and description, and let us tailor your resume for maximum impact.
              </p>
            </header>

            {/* Form Section */}
            <div className="bg-gradient-to-br from-[#242424] via-[#2f2f2f] to-[#383838] rounded-lg shadow-2xl p-8 text-white">
              <form
                onSubmit={handleGenerate}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Job Title Input */}
                <div className="flex flex-col">
                  <label htmlFor="jobTitle" className="font-semibold mb-2">
                    Job Title
                  </label>
                  <input
                    id="jobTitle"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    disabled={!masterResume}
                    className="px-4 py-3 rounded-md bg-[#1d1d1d] text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                {/* Job Description Input */}
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="jobDescription" className="font-semibold mb-2">
                    Job Description
                  </label>
                  <textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={!masterResume}
                    maxLength={1000}
                    className="w-full px-4 py-3 rounded-md bg-[#1d1d1d] text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste the job description here"
                    rows={5}
                  ></textarea>
                  <div className="text-sm text-gray-400 mt-1">
                    {jobDescription.length}/1000 characters
                  </div>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 flex justify-center">
                  {isLoading ? (
                    <StaggeredFadeLoader />
                  ) : (
                    <AiButton
                      disabled={!masterResume || !jobTitle || !jobDescription}
                    >
                      Generate
                    </AiButton>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;
}
