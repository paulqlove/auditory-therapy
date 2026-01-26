"use client";

import { ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StudyCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  children?: React.ReactNode;
}

export function StudyCard({
  icon: Icon,
  title,
  description,
  link,
  linkText,
  children,
}: StudyCardProps) {
  return (
    <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
          <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
          {children}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              {linkText || "Read study"}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
