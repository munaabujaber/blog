/** @format */

import Image from "next/image";
import { ThemeToggle } from "@/components/buttons/ThemeToggle";
import { Button } from "@/components/ui/button";
import { GetStartedButton } from "@/components/buttons/get-started";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="flex justify-center gap-8 flex-col items-center">
        <ThemeToggle />
        <h1 className="text-6xl font-bold">Blog Template</h1>
        <GetStartedButton />
      </div>
    </div>
  );
}
