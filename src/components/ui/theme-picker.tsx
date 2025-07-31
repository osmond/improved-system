import React, { useEffect, useState } from "react";
import { SimpleSelect } from "@/components/ui/select";

const options = [
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "rose", label: "Rose" },
];

export default function ThemePicker() {
  const [accent, setAccent] = useState<string>("blue");

  useEffect(() => {
    const stored = localStorage.getItem("accent");
    if (stored && options.some(o => o.value === stored)) {
      setAccent(stored);
      document.documentElement.classList.add(`theme-${stored}`);
    } else {
      document.documentElement.classList.add("theme-blue");
    }
  }, []);

  function handleChange(val: string) {
    setAccent(val);
    options.forEach(o => document.documentElement.classList.remove(`theme-${o.value}`));
    document.documentElement.classList.add(`theme-${val}`);
    localStorage.setItem("accent", val);
  }

  return (
    <SimpleSelect
      label="Accent"
      value={accent}
      onValueChange={handleChange}
      options={options}
    />
  );
}
