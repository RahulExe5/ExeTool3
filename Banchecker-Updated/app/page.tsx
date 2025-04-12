"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Search } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"

export default function Home() {
  const [playerId, setPlayerId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const checkBanStatus = async () => {
    if (!playerId) {
      setError("Please enter a player ID")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/check?check=checkbanned&id=${playerId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to check ban status")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || "An error occurred while checking ban status")
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Animated background with particles and shooting stars */}
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="card-hover"
        >
          <Card className="w-full backdrop-blur-sm bg-white/10 border-white/20 shadow-xl">
            <CardHeader>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <CardTitle className="text-2xl font-bold text-white">Free Fire Ban Checker</CardTitle>
                <CardDescription className="text-gray-200">Check if a player is banned in Free Fire</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="player-id" className="text-white">
                  Player ID
                </Label>
                <div className="relative">
                  <Input
                    id="player-id"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    placeholder="Enter player ID"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                  </div>
                </div>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive" className="border-red-800 bg-red-900/50 text-white">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Alert
                      className={
                        result.status === "BANNED"
                          ? "bg-red-900/50 border-red-700 text-white"
                          : "bg-green-900/50 border-green-700 text-white"
                      }
                    >
                      {result.status === "BANNED" ? (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                      ) : result.status === "NOT BANNED" ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : null}
                      <AlertTitle className="text-lg font-bold">{result.status || "Result"}</AlertTitle>
                      <AlertDescription className="mt-2">
                        {result.player_id ? (
                          <motion.div
                            className="space-y-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="font-medium">Player ID: {result.player_id}</div>
                          </motion.div>
                        ) : (
                          result.message
                        )}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            <CardFooter className="flex justify-end">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={checkBanStatus}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                      className="mr-2"
                    >
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </motion.div>
                  ) : (
                    "Check Ban Status"
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      {/* Portfolio-style footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-8 text-center text-white/60 text-sm relative z-10"
      >
        <p>© {new Date().getFullYear()} Free Fire Ban Checker | Advanced Portfolio Project</p>
      </motion.div>
    </div>
  )
}
