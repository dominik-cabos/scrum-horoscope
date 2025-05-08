// src/lib/api.ts
import axios from "axios";
import { HoroscopeRequest } from "../types";

// This would normally be in .env.local
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
if (!CLAUDE_API_KEY) {
  throw new Error("CLAUDE_API_KEY is not defined");
}
const API_ENDPOINT = "https://api.anthropic.com/v1/messages";

export async function generateHoroscope(
  request: HoroscopeRequest,
  zodiacSign: string,
): Promise<string> {
  try {
    const prompt = `Make me a very funny, rude, sarcastic horoscope
     (for the "Next sprint"), poking fun as much as possible from stereotypes perceived
     for the role and technology stack of the individual whose
     data is provided
     
    First Name: ${request.firstName}
    Birthday: ${request.birthday}
    Occupation: ${request.occupation}
    Zodiac Sign: ${zodiacSign}
    
    Please take some cues from the photo such as age / gender / emotion / accessories / clothing / etc, 
    and try to mention or poke fun from at least one detail (or more) from the photo
     within your response.
    Note: The photo was provided separately and you can see it in this conversation.
    `;

    // In a real application, you would make a call to Claude's API here
    // This is a simplified example
    let response;
    if (process.env.NODE_ENV !== "development") {
      response = await axios.post(
        API_ENDPOINT,
        {
          model: "claude-3-opus-20240229",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: "image/jpeg",
                    data: request.photoUrl.split(",")[1],
                  },
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": CLAUDE_API_KEY,
            "anthropic-version": "2023-06-01",
          },
        },
      );
      // For development purposes, return a mock response
    }
    if (!response?.data?.content[0]?.text) {
      return `Dear ${request.firstName}, your ${request.occupation} ${getZodiacSign(request.birthday)} Horoscope:
      The alignment of JIRA tickets with Mercury retrograde suggests your next sprint will be memorable for all the wrong reasons. That determined look in your eyes (from your photo) won't save you from the chaos of conflicting requirements. Your manager will praise your "innovative solutions" while secretly wondering if you've been randomly generating code.
      With Saturn crossing your productivity house, expect to spend hours debugging a problem caused by a single misplaced semicolon. That ${getAccessoryFromOccupation(request.occupation)} you're so proud of won't help when the staging environment mysteriously crashes right before the demo.
      But fear not! Venus brings good fortune in the form of a senior developer who takes pity on you after seeing your desperate Slack messages at 2 AM. Embrace the chaos, for in the world of IT, the only constant is change – and your outdated tech stack.`;
    }

    return response.data.content[0].text;
  } catch (error) {
    console.error("Error generating horoscope:", error);
    return "Error generating your horoscope. Please try again later.";
  }
}

// Helper function to generate mock responses with occupation-relevant accessories
function getAccessoryFromOccupation(occupation: string): string {
  const accessories: Record<string, string> = {
    "FE Dev (Angular)": "Angular sticker-covered laptop",
    "FE Dev (React)": "React hoodie",
    "BE Dev (node JS)": "terminal-themed coffee mug",
    BA: "overly detailed spreadsheet",
    QA: "bug-tracking notebook",
    Designer: "pristine MacBook Pro",
    PO: "overflowing kanban board",
    DL: "fancy noise-canceling headphones",
  };

  return accessories[occupation] || "tech gadget";
}

// Helper function for zodiac signs
function getZodiacSign(birthday: string): string {
  // Parse MM/DD format
  const [month, day] = birthday.split("/").map(Number);

  if (month === 1) {
    if (day <= 19) return "Capricorn";
    return "Aquarius";
  } else if (month === 2) {
    if (day <= 18) return "Aquarius";
    return "Pisces";
  } else if (month === 3) {
    if (day <= 20) return "Pisces";
    return "Aries";
  } else if (month === 4) {
    if (day <= 19) return "Aries";
    return "Taurus";
  } else if (month === 5) {
    if (day <= 20) return "Taurus";
    return "Gemini";
  } else if (month === 6) {
    if (day <= 20) return "Gemini";
    return "Cancer";
  } else if (month === 7) {
    if (day <= 22) return "Cancer";
    return "Leo";
  } else if (month === 8) {
    if (day <= 22) return "Leo";
    return "Virgo";
  } else if (month === 9) {
    if (day <= 22) return "Virgo";
    return "Libra";
  } else if (month === 10) {
    if (day <= 22) return "Libra";
    return "Scorpio";
  } else if (month === 11) {
    if (day <= 21) return "Scorpio";
    return "Sagittarius";
  } else {
    if (day <= 21) return "Sagittarius";
    return "Capricorn";
  }
}
