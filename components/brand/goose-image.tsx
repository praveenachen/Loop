"use client";

import { useState } from "react";
import { Bird } from "lucide-react";

import { cn } from "@/lib/utils";

interface GooseImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function GooseImage({ src, alt, className, fallbackClassName }: GooseImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={cn("grid place-items-center rounded-xl bg-surface-soft text-ink-soft", fallbackClassName)}>
        <Bird className="h-6 w-6" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-contain mix-blend-multiply", className)}
      onError={() => setFailed(true)}
    />
  );
}
