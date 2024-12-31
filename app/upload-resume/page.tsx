"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { FileUpload } from "@/components/ui/file-upload";

export default function UploadResume() {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/");
    }
  }, [userId, isLoaded, router]);

  const handleFileUpload = (files: File[]) => {
    const validFileTypes = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const maxFileSize = 2 * 1024 * 1024; // 2MB in bytes

    if (!files.length) {
      setErrorMessage("No file selected.");
      toast.error("No file selected.");
      return;
    }

    const file = files[0];
    if (!validFileTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Please upload a .docx file.");
      toast.error("Invalid file type. Please upload a .docx file.");
      return;
    }

    if (file.size > maxFileSize) {
      setErrorMessage("File size exceeds the 2MB limit. Please upload a smaller file.");
      toast.error("File size exceeds the 2MB limit. Please upload a smaller file.");
      return;
    }

    setErrorMessage(null); // Clear any previous errors
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || !userId) {
      toast.error("Please select a .docx file.");
      setErrorMessage("Please select a .docx file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFiles[0]);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload-resume`,
        formData,
        {
          headers: {
            userId,
          },
        }
      );
      toast.success("Resume uploaded successfully!");
      router.push("/tailor");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to upload resume. Try again.");
    }
  };

  return userId ? (
    <div className="relative min-h-screen bg-gradient-to-br from-[#141313] to-[#2b2928] flex items-center justify-center px-4 sm:px-6">
      <div className="bg-gradient-to-br from-yellow-400 via-yellow-700 to-orange-700 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-bold text-center text-black mb-6">
          Upload Your Master Resume
        </h1>

        {/* File Upload Component */}
        <FileUpload onChange={handleFileUpload} aria-label="Upload Resume" />

        {/* Error Message */}
        {errorMessage && (
          <p className="text-sm text-red-600 mt-4">{errorMessage}</p>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFiles.length || !!errorMessage}
          className={`mt-6 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition w-full ${
            selectedFiles.length && !errorMessage
              ? "bg-black text-white hover:bg-gray-900"
              : "bg-gray-500 text-gray-200 cursor-not-allowed"
          }`}
        >
          Upload Resume
        </button>
      </div>
    </div>
  ) : null;
}
