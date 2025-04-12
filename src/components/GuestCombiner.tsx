import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function GuestCombiner() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<number>(0);

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      setSelectedFiles(files.length);
    } else {
      setSelectedFiles(0);
    }
  };

  const resetForm = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFiles(0);
  };

  const readFile = (file: File): Promise<{ uid: string; password: string } | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function(event) {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          const info = jsonData.guest_account_info;
          resolve({
            uid: info["com.garena.msdk.guest_uid"],
            password: info["com.garena.msdk.guest_password"]
          });
        } catch (error) {
          console.error("Error parsing file:", file.name, error);
          resolve(null);
        }
      };
      reader.onerror = function(error) {
        console.error("Error reading file:", file.name, error);
        resolve(null);
      };
      reader.readAsText(file);
    });
  };

  const processFiles = async () => {
    const files = fileInputRef.current?.files;
    if (!files?.length) {
      alert("Please select at least one .dat file.");
      return;
    }

    setIsProcessing(true);
    const readPromises = Array.from(files).map(file => readFile(file));

    try {
      const results = await Promise.all(readPromises);
      const validData = results.filter(data => data !== null);

      if (validData.length === 0) {
        alert("No valid .dat file data found.");
        return;
      }

      const blob = new Blob([JSON.stringify(validData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "combined_guest.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resetForm();
    } catch (error) {
      console.error("Error processing files:", error);
      alert("An error occurred while processing the files.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
        handleFileChange(e.dataTransfer.files);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <div className="glass-morphism p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
          .dat to .json Converter
        </h1>
        
        <div
          className={`relative ${dragActive ? 'border-blue-500' : 'border-white/40'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label className="block w-full px-4 py-8 border-2 border-dashed rounded-lg bg-white/5 hover:border-blue-400 transition-colors cursor-pointer focus-within:outline-none focus-within:border-blue-500">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".dat"
              className="sr-only"
              onChange={(e) => handleFileChange(e.target.files)}
            />
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-1 text-sm text-gray-400">
                Click to browse or drop your .dat files here
              </p>
              {selectedFiles > 0 && (
                <p className="mt-2 text-sm text-blue-500 font-semibold">
                  {selectedFiles} file{selectedFiles !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </label>
        </div>

        <button
          onClick={processFiles}
          disabled={isProcessing || selectedFiles === 0}
          className="w-full mt-6 py-3 px-6 button-gradient rounded-lg text-white font-semibold transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Convert & Download JSON</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}