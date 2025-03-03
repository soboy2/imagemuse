"use client";
import { useState } from "react";
import { Download, Copy, Check, AlertCircle } from "lucide-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState<number | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && prompt.trim()) {
      setIsLoading(true);
      setImages([]);
      setError(null);
      
      try {
        const response = await fetch('/api/generate-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate images');
        }

        if (!data.imageUrls || data.imageUrls.length === 0) {
          throw new Error('No images were generated');
        }

        setImages(data.imageUrls);
      } catch (error: any) {
        console.error('Error generating images:', error);
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownload = (imageUrl: string, index: number) => {
    // Create a link element
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `generated-image-${index + 1}.png`;
    a.target = '_blank'; // Open in new tab as fallback
    a.rel = 'noopener noreferrer';
    
    // Try to trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Show success animation
    setDownloadSuccess(index);
    setTimeout(() => setDownloadSuccess(null), 1000);
  };

  const handleCopy = async (imageUrl: string, index: number) => {
    try {
      // Fetch the image and convert it to a blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Use the Clipboard API to copy the image
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      setCopySuccess(index);
      setTimeout(() => setCopySuccess(null), 1000);
    } catch (error) {
      console.error('Error copying image to clipboard:', error);
      // Fallback to copying URL if image copy fails
      try {
        await navigator.clipboard.writeText(imageUrl);
        setCopySuccess(index);
        setTimeout(() => setCopySuccess(null), 1000);
      } catch (fallbackError) {
        console.error('Error copying URL to clipboard:', fallbackError);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-slate-600 text-white p-4">
        <h1 className="text-xl font-semibold">Home</h1>
      </nav>

      <main className="container mx-auto p-8 space-y-6">
        <div className="w-full max-w-2xl mx-auto">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleSubmit}
            placeholder="Describe image here"
            className="w-full p-4 rounded-lg border-2 border-blue-700 bg-blue-50 focus:outline-none focus:border-blue-800 text-gray-700"
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
          {images.length > 0 && images.map((imageUrl, index) => (
            <div
              key={index}
              className="aspect-video bg-slate-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden relative group"
            >
              <img 
                src={imageUrl} 
                alt={`Generated image ${index + 1} for "${prompt}"`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  onClick={() => handleDownload(imageUrl, index)}
                  className={`p-2 rounded-full ${downloadSuccess === index ? 'bg-green-500 scale-110' : 'bg-white bg-opacity-80 hover:bg-opacity-100'} text-gray-800 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                  title="Download image"
                  aria-label="Download image"
                >
                  {downloadSuccess === index ? (
                    <Check size={20} className="text-white" />
                  ) : (
                    <Download size={20} />
                  )}
                </button>
                <button 
                  onClick={() => handleCopy(imageUrl, index)}
                  className={`p-2 rounded-full ${copySuccess === index ? 'bg-green-500 scale-110' : 'bg-white bg-opacity-80 hover:bg-opacity-100'} text-gray-800 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                  title="Copy image to clipboard"
                  aria-label="Copy image to clipboard"
                >
                  {copySuccess === index ? (
                    <Check size={20} className="text-white" />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </div>
            </div>
          ))}
          {isLoading && [...Array(4)].map((_, index) => (
            <div
              key={index}
              className="aspect-video bg-slate-100 rounded-lg shadow-sm animate-pulse"
            >
              <div className="h-full w-full bg-gradient-to-r from-slate-200 to-slate-300 blur-sm" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
