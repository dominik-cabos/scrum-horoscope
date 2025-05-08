// src/app/api/horoscope/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateHoroscope } from "@/lib/api";
import { HoroscopeRequest } from "@/types";
import { getZodiacSign } from "@/lib/zodiac";
import { likeHoroscope, saveHoroscope, getHoroscopeById } from "@/lib/db";

// Add GET route

export async function GET(request: NextRequest) {
  try {
    // Get the horoscopeId from URL parameters
    const { searchParams } = new URL(request.url);
    const horoscopeId = searchParams.get("horoscopeId");

    if (!horoscopeId) {
      return NextResponse.json(
        { error: "horoscopeId is required" },
        { status: 400 },
      );
    }

    // Retrieve horoscope data
    const horoscope = await getHoroscopeById(parseInt(horoscopeId));
debugger;
    if (!horoscope) {
      return NextResponse.json(
        { error: "Horoscope not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(horoscope);
  } catch (error) {
    console.error("Error retrieving horoscope:", error);
    return NextResponse.json(
      { error: "Failed to retrieve horoscope" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData: HoroscopeRequest = await request.json();

    // Validate input
    if (
      !requestData.firstName ||
      !requestData.birthday ||
      !requestData.photoUrl ||
      !requestData.occupation
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Generate horoscope
    const zodiacSign = getZodiacSign(requestData.birthday);
    const horoscopeText = await generateHoroscope(requestData, zodiacSign);

    // Calculate zodiac sign

    // Create result object
    const result = {
      firstName: requestData.firstName,
      birthday: requestData.birthday,
      photoUrl: requestData.photoUrl,
      occupation: requestData.occupation,
      zodiacSign,
      horoscope: horoscopeText,
    };

    // Save to database
    const id = await saveHoroscope(result);
// debugger;
    return NextResponse.json({ id });
  } catch (error) {
    console.error("Error processing horoscope request:", error);
    return NextResponse.json(
      { error: "Failed to generate horoscope" },
      { status: 500 },
    );
  }
}

// API route to save a liked horoscope
export async function PUT(request: NextRequest) {
  try {
    const horoscopeData = await request.json();

    // Save to database
    const id = horoscopeData.id;

    likeHoroscope(id);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error saving horoscope:", error);
    return NextResponse.json(
      { error: "Failed to save horoscope" },
      { status: 500 },
    );
  }
}
