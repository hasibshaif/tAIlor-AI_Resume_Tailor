"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { FaCloudDownloadAlt, FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { Meteors } from "@/components/ui/meteors";
import InteractiveHoverButton from "@/components/ui/interactive-hover-button";
import WhirlpoolLoader from "@/components/ui/whirlpool-loader";

interface MasterResume {
  resumeUrl: string;
  fileName: string;
}

interface TailoredResume {
  title: string;
  downloadUrl: string;
  key: string;
}

export default function TailorPage() {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();

  const [masterResume, setMasterResume] = useState<MasterResume | null>(null);
  const [tailoredResumes, setTailoredResumes] = useState<TailoredResume[]>([]);
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
    const fetchMasterResume = async () => {
      if (!userId) return;

      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-master-resume`,
          {
            headers: {
              userId,
            },
          }
        );
        setMasterResume({
          resumeUrl: data.resumeUrl,
          fileName: data.fileName,
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.error("No master resume found. Redirecting...");
        router.push("/upload-resume");
      }
    };

    const fetchTailoredResumes = async () => {
      if (!userId) return;

      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-tailored-resumes`,
          {
            headers: {
              userId,
            },
          }
        );
        setTailoredResumes(data.resumes || []);
      } catch (error) {
        console.error("Failed to fetch tailored resumes:", error);
      }
    };

    fetchMasterResume();
    fetchTailoredResumes();
  }, [userId, router]);

  const handleDelete = async (key: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/delete-tailored-resume`,
        {
          headers: {
            userId,
          },
          params: { key },
        }
      );

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-tailored-resumes`,
        {
          headers: { userId },
        }
      );
      setTailoredResumes(data.resumes || []);
    } catch (error) {
      console.error("Failed to delete tailored resume:", error);
    }
  };

  return userId ? (
    <div className="relative min-h-screen bg-gradient-to-br from-[#141313] to-[#2b2928] flex items-center justify-center px-4">
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
        <div className="flex flex-col gap-8 container mx-auto p-4 text-left text-white">
          {/* Master Resume Section */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Master Resume</h2>
            <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-700 to-orange-700 p-6 w-full max-w-sm rounded-lg shadow-lg flex flex-col justify-between items-center overflow-hidden">
              <Meteors number={12} className="opacity-50" />
              <p className="text-lg sm:text-xl font-bold text-black z-10 text-center break-words whitespace-normal overflow-hidden">
                {masterResume ? masterResume.fileName : "No Master Resume Uploaded"}
              </p>
              <div className="flex justify-center gap-4 z-10 mt-4">
                {masterResume && (
                  <a
                    href={masterResume.resumeUrl}
                    download={masterResume.fileName}
                    className="text-black hover:text-blue-600 transition"
                    aria-label="Download Master Resume"
                  >
                    <FaCloudDownloadAlt size={24} />
                  </a>
                )}
                <Link href="/upload-resume">
                  <FaCloudUploadAlt
                    size={24}
                    className="text-black hover:text-purple-600 transition cursor-pointer"
                    aria-label="Upload New Master Resume"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* New Tailor Section */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Start a New Tailor</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {masterResume ? (
                <Link href="/create-tailor">
                  <InteractiveHoverButton text="Create New Resume Tailor" />
                </Link>
              ) : (
                <button
                  disabled
                  className="bg-gray-500 text-gray-300 cursor-not-allowed px-6 py-3 rounded-lg"
                >
                  Upload a Master Resume First
                </button>
              )}
            </div>
          </div>

          {/* Past Tailors Section */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Past Tailorings</h2>
            {tailoredResumes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tailoredResumes.map((resume, index) => (
                  <div
                    key={index}
                    className="relative bg-gradient-to-br from-[#17181c] via-[#262e47] to-[#252629] p-4 rounded-lg shadow-md flex flex-col items-center justify-between overflow-hidden"
                  >
                    <Meteors number={12} className="opacity-50" />
                    <p className="font-semibold text-white mb-4 text-center z-10 break-words whitespace-pre-wrap overflow-hidden">
                      {resume.title}
                    </p>
                    <div className="flex justify-center gap-2">
                      <a
                        href={resume.downloadUrl}
                        download={`${resume.title}.docx`}
                        className="text-white hover:text-blue-400 transition z-10"
                        aria-label="Download Resume"
                      >
                        <FaCloudDownloadAlt size={24} />
                      </a>
                      <button
                        onClick={() => handleDelete(resume.title)}
                        className="text-white hover:text-red-600 transition z-10"
                        aria-label="Delete"
                      >
                        <FaTrash size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No tailored resumes found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
