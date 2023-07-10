"use client";

"use client";

import { Moon, Sun } from "lucide-react";
import { Button, useDarkMode } from "ui";

export const DarkModeToggle = () => {
  const { isDarkMode, setDarkMode } = useDarkMode();

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  return (
    <Button variant="ghost" onClick={toggleDarkMode}>
      {isDarkMode ? <Sun /> : <Moon />}
    </Button>
  );
};
