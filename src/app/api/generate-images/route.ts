import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configure OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure route options for Vercel
export const config = {
  maxDuration: 60, // Set maximum duration to 60 seconds
};

export async function POST(request: Request) {
  console.log("API route called with OpenAI key configured:", !!process.env.OPENAI_API_KEY);
  
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return NextResponse.json(
        { error: 'Server configuration error: API key is missing' },
        { status: 500 }
      );
    }

    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log("Generating image for prompt:", prompt);

    // Generate just one image to reduce timeout risk
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });
      
      console.log("Image generated successfully");
      
      if (response.data && response.data[0] && response.data[0].url) {
        // Return just the one image for now to avoid timeouts
        return NextResponse.json({ imageUrls: [response.data[0].url] });
      } else {
        throw new Error('No image URL in response');
      }
    } catch (imageError: any) {
      console.error(`Error generating image:`, imageError);
      return NextResponse.json(
        { error: imageError.message || 'Failed to generate image' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
} 