// src/app/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { Occupation, HoroscopeRequest } from '@/types';

export default function RequestForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<HoroscopeRequest>>({
    firstName: '',
    birthday: '',
    photoUrl: '',
    occupation: undefined
  });

  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof HoroscopeRequest, string>>>({});

  const webcamRef = useRef<Webcam>(null);

  const occupations: Occupation[] = [
    "Frontend Developer (Angular)",
    "Frontend Developer (React)",
    "Backend Developer (Node.js)",
    "Business Analyst",
    "Quality Assurance Engineer",
    "Designer",
    "Product Owner",
    "Delivery Lead"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (errors[name as keyof HoroscopeRequest]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setFormData(prev => ({ ...prev, photoUrl: imageSrc || '' }));
      setShowCamera(false);

      // Clear error for photoUrl if it exists
      if (errors.photoUrl) {
        setErrors(prev => ({ ...prev, photoUrl: undefined }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof HoroscopeRequest, string>> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.birthday) {
      newErrors.birthday = 'Birthday is required';
    } else {
      // Validate birthday format (MM/DD)
      const birthdayPattern = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])$/;
      if (!birthdayPattern.test(formData.birthday)) {
        newErrors.birthday = 'Birthday must be in MM/DD format';
      }
    }

    if (!formData.photoUrl) {
      newErrors.photoUrl = 'Photo is required';
    }

    if (!formData.occupation) {
      newErrors.occupation = 'Occupation is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/horoscope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate horoscope');
      }

      // Navigate to the result page with the response data
      router.push(`/result?horoscopeId=${data.id}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to generate horoscope. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Next Sprint Horoscope Request</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${
              errors.firstName ? "border-red-500" : ""
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Birthday */}
        <div>
          <label
            htmlFor="birthday"
            className="block text-sm font-medium text-gray-700"
          >
            Birthday
          </label>
          <div className="flex gap-2">
            <select
              id="month"
              name="month"
              value={formData.birthday?.split("/")[0] || ""}
              onChange={(e) => {
                const day = formData.birthday?.split("/")[1] || "";
                setFormData((prev) => ({
                  ...prev,
                  birthday: `${e.target.value}/${day}`,
                }));
                if (errors.birthday) {
                  setErrors((prev) => ({ ...prev, birthday: undefined }));
                }
              }}
              className={`mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${
                errors.birthday ? "border-red-500" : ""
              }`}
            >
              <option value="">Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
            <select
              id="day"
              name="day"
              value={formData.birthday?.split("/")[1] || ""}
              onChange={(e) => {
                const month = formData.birthday?.split("/")[0] || "";
                setFormData((prev) => ({
                  ...prev,
                  birthday: `${month}/${e.target.value}`,
                }));
                if (errors.birthday) {
                  setErrors((prev) => ({ ...prev, birthday: undefined }));
                }
              }}
              className={`mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${
                errors.birthday ? "border-red-500" : ""
              }`}
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          {errors.birthday && (
            <p className="mt-1 text-sm text-red-600">{errors.birthday}</p>
          )}
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Photo
          </label>

          {formData.photoUrl ? (
            <div className="mt-2">
              <img
                src={formData.photoUrl}
                alt="Captured"
                className="w-full h-48 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="mt-2 px-3 py-1 text-sm text-purple-600 hover:text-purple-800"
              >
                Retake Photo
              </button>
            </div>
          ) : showCamera ? (
            <div className="mt-2">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-48 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={capturePhoto}
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Capture Photo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Take Photo
            </button>
          )}

          {errors.photoUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.photoUrl}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <div className="mt-2 space-y-2">
            {occupations.map((occupation) => (
              <div key={occupation} className="flex items-center">
                <input
                  type="radio"
                  id={occupation}
                  name="occupation"
                  value={occupation}
                  checked={formData.occupation === occupation}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <label
                  htmlFor={occupation}
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  {occupation}
                </label>
              </div>
            ))}
          </div>
          {errors.occupation && (
            <p className="mt-1 text-sm text-red-600">{errors.occupation}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
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
                Generating...
              </span>
            ) : (
              "Get Your Horoscope"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
