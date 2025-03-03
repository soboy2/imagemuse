# Ansh & Riley Full-Stack Template

This is a full-stack template project for Software Composers to create  applications with AI.

## Getting started
To create a new project, you go to `/paths`, choose from our list of Paths, and then use Cursor's Composer feature to quickly scaffold your project!

You can also edit the Path's prompt template to be whatever you like!

## Technologies used
This doesn't really matter, but is useful for the AI to understand more about this project. We are using the following technologies
- React with Next.js 14 App Router
- TailwindCSS
- Firebase Auth, Storage, and Database
- Multiple AI endpoints including OpenAI, Anthropic, and Replicate using Vercel's AI SDK

# ImageMuse

ImageMuse is an AI-powered image generation application that creates high-quality images from text prompts using OpenAI's DALL-E 3 model.

## Features

- Generate multiple image variations from a single text prompt
- Modern, clean UI with hover effects
- Download images directly to your computer
- Copy images to clipboard with a single click
- Responsive design for various screen sizes

## Technologies Used

- React with Next.js 14 App Router
- TailwindCSS for styling
- OpenAI API for image generation
- Lucide React for beautiful icons

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/soboy2/imagemuse.git
   cd imagemuse
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment to Vercel

This project is optimized for deployment on Vercel:

1. Push your code to GitHub (without the `.env.local` file)
2. Connect your GitHub repository to Vercel
3. During setup, add your environment variables (OPENAI_API_KEY) in the Vercel dashboard
4. Deploy!

## Environment Variables

The following environment variables are used in this project:

- `OPENAI_API_KEY`: Your OpenAI API key (required)

Optional variables for additional features (not currently used):
- Firebase configuration (for authentication and storage)
- Anthropic API key (for Claude AI)
- Replicate API token (for alternative image models)
- Deepgram API key (for speech recognition)

## License

MIT