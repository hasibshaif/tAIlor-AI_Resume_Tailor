import { useEffect, useMemo, useState } from "react";
import { IoSparklesSharp } from "react-icons/io5";
import { loadFull } from "tsparticles";

import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";

const options: ISourceOptions = {
  key: "star",
  name: "Star",
  particles: {
    number: {
      value: 20,
      density: {
        enable: false,
      },
    },
    color: {
      value: ["#7c3aed", "#bae6fd", "#a78bfa", "#93c5fd", "#0284c7", "#fafafa", "#dce084", "#38bdf8", "#e39d10", "#e3dc10", "#f7f25e"],
    },
    shape: {
      type: "star",
      options: {
        star: {
          sides: 4,
        },
      },
    },
    opacity: {
      value: 0.8,
    },
    size: {
      value: { min: 1, max: 4 },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      enable: true,
      direction: "clockwise",
      animation: {
        enable: true,
        speed: 10,
        sync: false,
      },
    },
    links: {
      enable: false,
    },
    reduceDuplicates: true,
    move: {
      enable: true,
      center: {
        x: 120,
        y: 45,
      },
    },
  },
  interactivity: {
    events: {},
  },
  smooth: true,
  fpsLimit: 120,
  background: {
    color: "transparent",
    size: "cover",
  },
  fullScreen: {
    enable: false,
  },
  detectRetina: true,
  absorbers: [
    {
      enable: true,
      opacity: 0,
      size: {
        value: 1,
        density: 1,
        limit: {
          radius: 5,
          mass: 5,
        },
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: {
        wait: true,
      },
      rate: {
        quantity: 5,
        delay: 0.5,
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
};

export default function AiButton({ disabled, children }: { disabled: boolean; children: React.ReactNode }) {
  const [particleState, setParticlesReady] = useState<"loaded" | "ready">();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setParticlesReady("loaded");
    });
  }, []);

  const modifiedOptions = useMemo(() => {
    options.autoPlay = isHovering && !disabled;
    return options;
  }, [isHovering, disabled]);

  return (
    <button
      className={`group relative my-8 rounded-full bg-gradient-to-br from-blue-300/30 via-purple-500/30 via-40% to-yellow-500/30 p-1 text-white transition-transform ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-110 active:scale-105"
      }`}
      onMouseEnter={() => !disabled && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      disabled={disabled}
    >
      <div className="relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-yellow-500 via-purple-400 via-40% to-blue-500 px-4 py-2 text-white">
        <IoSparklesSharp className="size-6 -translate-y-0.5 animate-sparkle fill-yellow-400" />
        <span className="font-semibold">{children}</span>
      </div>
      {!!particleState && (
        <Particles
          id="particles"
          className={`pointer-events-none absolute -bottom-4 -left-4 -right-4 -top-4 z-0 opacity-0 transition-opacity ${
            particleState === "ready" && !disabled ? "group-hover:opacity-100" : ""
          }`}
          particlesLoaded={async () => {
            setParticlesReady("ready");
          }}
          options={modifiedOptions}
        />
      )}
    </button>
  );
}
