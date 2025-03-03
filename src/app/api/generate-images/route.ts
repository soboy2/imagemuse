import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Generate 4 images with slightly different prompts to ensure variety
    const imagePromises = Array(4).fill(0).map((_, i) => {
      const enhancedPrompt = `${prompt}${i > 0 ? ` (variation ${i})` : ''}`;
      
      return openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
      });
    });

    const responses = await Promise.all(imagePromises);
    const imageUrls = responses.map(response => response.data[0].url);

    return NextResponse.json({ imageUrls });
  } catch (error: any) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate images' },
      { status: 500 }
    );
  }
} 