"use client";

import { useState } from "react";
import { Radio, Waves, Headphones, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const steps = [
  {
    title: "Welcome to 40Hz Auditory Therapy",
    content: (
      <div className="space-y-4 text-gray-300">
        <p>
          This app generates 40Hz audio stimulation based on scientific research
          showing potential cognitive benefits from gamma brainwave entrainment.
        </p>
        <p className="text-sm text-gray-400">
          Research suggests regular 40Hz stimulation may support brain health,
          enhance focus, and promote neural synchronization.
        </p>
      </div>
    ),
  },
  {
    title: "Choose Your Mode",
    content: (
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
              <Radio className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="font-medium text-gray-100">Click Train</p>
              <p className="text-sm text-gray-400">
                1ms bursts of 1kHz tone at 40Hz - matches the PNAS study
                protocol
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
              <Waves className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="font-medium text-gray-100">Binaural Beats</p>
              <p className="text-sm text-gray-400">
                200Hz in left ear, 240Hz in right - brain perceives 40Hz
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Important: Use Headphones",
    content: (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20">
            <Headphones className="h-10 w-10 text-amber-400" />
          </div>
        </div>
        <div className="space-y-3 text-center">
          <p className="text-gray-300">
            For <strong>Binaural Beats</strong> mode, stereo headphones are
            required to perceive the 40Hz effect.
          </p>
          <p className="text-sm text-gray-400">
            Click Train mode works with any audio output, but headphones are
            still recommended for the best experience.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Ready to Start",
    content: (
      <div className="space-y-4 text-center">
        <p className="text-gray-300">
          Start with the recommended 60-minute session to match the research
          protocol. You can adjust the duration anytime.
        </p>
        <div className="rounded-lg bg-gray-800 p-4">
          <p className="text-sm text-gray-400">
            <strong className="text-gray-300">Tip:</strong> Use the keyboard
            shortcuts for quick control. Press{" "}
            <kbd className="rounded bg-gray-700 px-1.5 py-0.5 text-xs">?</kbd>{" "}
            anytime to see all shortcuts.
          </p>
        </div>
      </div>
    ),
  },
];

export function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-700 hover:text-gray-100"
          aria-label="Skip onboarding"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step indicator */}
        <div className="mb-6 flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 w-8 rounded-full transition-colors",
                index === currentStep ? "bg-green-500" : "bg-gray-700",
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-100">
            {step.title}
          </h2>
          {step.content}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="ghost"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1">
            {isLastStep ? "Get Started" : "Next"}
            {!isLastStep && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Skip link */}
        {!isLastStep && (
          <button
            onClick={handleSkip}
            className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-400"
          >
            Skip tutorial
          </button>
        )}
      </div>
    </div>
  );
}
