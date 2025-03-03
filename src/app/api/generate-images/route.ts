import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configure OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure route options for Vercel
export const config = {
  runtime: 'edge', // Use Edge runtime for better performance
  maxDuration: 60, // Set maximum duration to 60 seconds
};

export async function POST(request: Request) {
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

    // Generate images one at a time instead of in parallel to avoid rate limits
    const imageUrls = [];
    
    for (let i = 0; i < 4; i++) {
      try {
        const enhancedPrompt = `${prompt}${i > 0 ? ` (variation ${i})` : ''}`;
        
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: enhancedPrompt,
          n: 1,
          size: "1024x1024",
        });
        
        if (response.data && response.data[0] && response.data[0].url) {
          imageUrls.push(response.data[0].url);
        }
      } catch (imageError: any) {
        console.error(`Error generating image ${i}:`, imageError);
        // Continue with other images even if one fails
      }
    }

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate any images' },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrls });
  } catch (error: any) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate images' },
      { status: 500 }
    );
  }
} 