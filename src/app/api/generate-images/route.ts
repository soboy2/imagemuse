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

    console.log("Generating images for prompt:", prompt);

    // Generate 4 images
    try {
      // Note: DALL-E 3 only supports n=1, so we'll make multiple requests
      // For DALL-E 2, we could use n=4 in a single request
      const imageUrls = [];
      
      // For DALL-E 3, we need to make 4 separate requests
      if (process.env.USE_DALLE_2 === 'true') {
        // DALL-E 2 approach (single request with n=4)
        const response = await openai.images.generate({
          model: "dall-e-2",
          prompt: prompt,
          n: 4,
          size: "1024x1024",
        });
        
        if (response.data) {
          imageUrls.push(...response.data.map(item => item.url).filter(Boolean));
        }
      } else {
        // DALL-E 3 approach (4 separate requests)
        // Make the first request
        const response1 = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        });
        
        if (response1.data && response1.data[0] && response1.data[0].url) {
          imageUrls.push(response1.data[0].url);
        }
        
        // Make three more requests with slight variations to the prompt
        // This helps ensure we get different images
        const variations = [
          "Alternative version: " + prompt,
          "Different style: " + prompt,
          "Another interpretation: " + prompt
        ];
        
        for (const variationPrompt of variations) {
          try {
            const responseVariation = await openai.images.generate({
              model: "dall-e-3",
              prompt: variationPrompt,
              n: 1,
              size: "1024x1024",
            });
            
            if (responseVariation.data && responseVariation.data[0] && responseVariation.data[0].url) {
              imageUrls.push(responseVariation.data[0].url);
            }
          } catch (variationError) {
            console.error(`Error generating variation image:`, variationError);
            // Continue with other variations even if one fails
          }
        }
      }
      
      console.log(`Generated ${imageUrls.length} images successfully`);
      
      if (imageUrls.length > 0) {
        return NextResponse.json({ imageUrls });
      } else {
        throw new Error('No image URLs in response');
      }
    } catch (imageError: any) {
      console.error(`Error generating images:`, imageError);
      return NextResponse.json(
        { error: imageError.message || 'Failed to generate images' },
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