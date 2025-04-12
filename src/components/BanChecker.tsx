import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BanChecker() {
  const [uid, setUid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; type: 'success' | 'error' | 'warn' } | null>(null);

  const checkBan = async () => {
    if (!uid.trim()) {
      setResult({ message: "Please enter a UID.", type: 'warn' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const apiUrl = `https://teamxcutehack.serv00.net/ban_chk/api.php?check=checkbanned&key=chx&id=${uid}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;

    try {
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("Invalid response");
      
      const data = await res.json();
      
      if (typeof data.is_banned === 'boolean') {
        const statusText = data.is_banned ? "BANNED" : "NOT BANNED";
        const resultType = data.is_banned ? "error" : "success";
        setResult({
          message: `UID = ${uid}\nStatus = ${statusText}`,
          type: resultType
        });
      } else {
        throw new Error("Invalid data");
      }
    } catch (error) {
      setResult({
        message: `UID = ${uid}\nStatus = ERROR`,
        type: 'warn'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <div className="glass-morphism p-8 rounded-2xl shadow-xl">
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
          Ban Status Checker
        </h2>
        
        <div className="relative mb-6">
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Enter UID"
            className={`w-full px-4 py-3 rounded-lg border border-white/20 focus:border-blue-400 outline-none transition-colors pl-10 ${
              document.body.classList.contains('light') ? 'input-light' : 'input-dark'
            }`}
          />
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {isLoading && (
          <div className="flex justify-center my-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <button
          onClick={checkBan}
          disabled={isLoading}
          className="w-full py-3 px-6 button-gradient rounded-lg text-white font-semibold transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span>Check Status</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg whitespace-pre-line ${
              result.type === 'success' ? 'bg-green-500/20 text-green-200 border border-green-500/30' :
              result.type === 'error' ? 'bg-red-500/20 text-red-200 border border-red-500/30' :
              'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30'
            }`}
          >
            {result.message}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}