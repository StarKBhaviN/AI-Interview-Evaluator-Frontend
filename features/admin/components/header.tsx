"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from "lucide-react";

export default function Header() {

  return (
    <header className="border-b bg-background h-16 flex items-center justify-between px-6">
      <h1 className="font-semibold text-lg">Admin Panel</h1>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
        //   onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {/* {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />} */}
          later
        </Button>

        <Button variant="destructive" size="sm">
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
