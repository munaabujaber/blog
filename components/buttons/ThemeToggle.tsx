/** @format */

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon } from "@/components/icons/moon";
import { Sun } from "@/components/icons/sun";
import "@/app/globals.css";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      title="Toggle theme"
      className="relative w-14 h-7 lg:w-18 lg:h-9 rounded-full p-1 cursor-pointer transition-all duration-500 border-2 border-(--btn-themetoggle-color) bg-(--btn-themetoggle-bg)"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      type="button"
    >
      <div className="relative w-full h-full">
        <div
          className={
            "absolute top-1/2 -translate-y-1/2 w-6 h-6 lg:w-8 lg:h-8 rounded-full transition-all duration-500" +
            (isDark ? " left-full -translate-x-[calc(100%+0.1rem)]" : " left-0")
          }
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: "var(--btn-themetoggle-color)" }}
          >
            {isDark ? (
              <Moon width={25} height={25} />
            ) : (
              <Sun width={28} height={28} />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
