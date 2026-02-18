"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Hello World
      <Button variant="default" onClick={() => window.location.href = "/admin/dashboard"}>Click Me!</Button>
    </div>
  );
}
