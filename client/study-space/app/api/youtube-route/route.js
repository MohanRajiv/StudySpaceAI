import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript-plus";

function extractVideoId(url) {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

function formatError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) return formatError("YouTube URL is required");

    const videoId = extractVideoId(url);
    if (!videoId) return formatError("Please provide a valid YouTube video URL");

    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL. Please provide a valid YouTube video URL." },
        { status: 400 }
      );
    }

    // Fetch transcript from YouTube (prefer English, fallback to available language)
    let transcriptData;
    try {
      transcriptData = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: "en",
      });
    } catch {
      transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
    }

    if (!Array.isArray(transcriptData) || transcriptData.length === 0) {
      return formatError(
        "Transcript is unavailable for this video. Please try one with captions enabled.",
        404
      );
    }

    const transcriptText = transcriptData
      .map((item) =>
        typeof item === "object"
          ? item.text || item.transcript || item.content || ""
          : String(item || "")
      )
      .filter((chunk) => chunk.trim().length > 0)
      .join(" ")
      .trim();

    if (!transcriptText) {
      return formatError(
        "Transcript is empty. Please try a different video with captions enabled.",
        404
      );
    }

    return NextResponse.json({ text: transcriptText });
  } catch (error) {
    if (error.message?.includes("Transcript is disabled")) {
      return formatError(
        "Transcript is not available for this video. The video owner may have disabled captions.",
        404
      );
    }

    if (
      error.message?.includes("Could not retrieve a transcript") ||
      error.message?.includes("No transcripts were found")
    ) {
      return formatError(
        "No transcript available for this video. Please try a different video with captions enabled.",
        404
      );
    }

    return formatError(
      "Failed to fetch transcript. Please ensure the video has captions enabled.",
      500
    );
  }
}
