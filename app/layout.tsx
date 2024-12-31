import "./globals.css";
import Navbar from "../components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

// Metadata
export const generateMetadata = () => ({
  title: "tAIlor - AI Resume Tailorer | Your Dream Resume, Personalized",
  description: "Effortlessly create tailored resumes that match your dream job's requirements.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased font-spaceGrotesk">
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
