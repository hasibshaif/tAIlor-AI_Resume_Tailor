import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-full h-full cursor-pointer overflow-hidden rounded-lg border bg-gradient-to-br from-[#17181c] via-[#262e47] to-[#252629] p-4 text-center font-semibold shadow-md",
        "transition-transform hover:scale-105",
        className
      )}
      {...props}
    >
      <span className="inline-block text-4xl transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        +
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{text}</span>
        <ArrowRight />
      </div>
      {/* Removed blue dot div */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export default InteractiveHoverButton;
