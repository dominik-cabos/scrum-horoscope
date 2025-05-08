// src/app/result/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HoroscopeResult } from "@/types";

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<HoroscopeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const horoscopeId = searchParams.get("horoscopeId");
    if (horoscopeId) {
      try {
        fetch(`/api/horoscope?horoscopeId=${horoscopeId}`)
          .then((response) => response.json())

          .then((horoscopeData) => {
            console.log("Decoded data:", horoscopeData);
            setResult(horoscopeData);
          })
          .catch((error) => {
            console.error("Error parsing result data:", error);
            router.push("/");
          });
      } catch (error) {
        console.error("Error parsing result data:", error);
        router.push("/");
      }
    } else {
      // No data provided, redirect to the form
      router.push("/");
    }
  }, [searchParams, router]);

  const handleLike = async () => {
    if (!result) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/horoscope", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        throw new Error("Failed to save horoscope");
      }

      // Navigate to the saved horoscopes page
      router.push("/saved");
    } catch (error) {
      console.error("Error saving horoscope:", error);
      alert("Failed to save horoscope. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!result) return;

    setRegenerating(true);
    try {
      const requestData = {
        firstName: result.firstName,
        birthday: result.birthday,
        photoUrl: result.photoUrl,
        occupation: result.occupation,
      };

      const response = await fetch("/api/horoscope", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to regenerate horoscope");
      }

      // Update the result with the new data
      router.push(
        `/result?horoscopeId=${data.id}`,
      );
    } catch (error) {
      console.error("Error regenerating horoscope:", error);
      alert("Failed to regenerate horoscope. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  if (!result) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
Your Horoscope      </h2>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* User Info */}
        <div className="flex-shrink-0 md:w-1/3">
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="mb-4">
              <img
                src={result.photoUrl}
                alt={`${result.firstName}'s photo`}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-lg">{result.firstName}</p>
              <p className="text-gray-600">{result.occupation}</p>
              <p className="text-purple-600 font-medium">
                {result.zodiacSign} ({result.birthday})
              </p>
            </div>
          </div>
        </div>

        {/* Horoscope Content */}
        <div className="flex-grow md:w-2/3">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="text-xl font-semibold mb-3 text-purple-800">
              Horoscope for Next Sprint
            </h3>
            <div className="prose prose-sm">
              {result.horoscope.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-3">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        <button
          onClick={handleLike}
          disabled={isSaving}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 flex items-center"
        >
          {isSaving ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              Like & Save
            </>
          )}
        </button>

        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
        >
          {regenerating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Regenerating...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Regenerate
            </>
          )}
        </button>

        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Exit
        </button>
      </div>
    </div>
  );
}
