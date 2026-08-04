import React, { useState, useEffect } from "react"
// Offline.tsx


export default function Offline() {
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [position, setPosition] = useState(50)
  const [obstacles, setObstacles] = useState<number[]>([])

  useEffect(() => {
    if (!gameActive) return

    const interval = setInterval(() => {
      setObstacles(prev => {
        const newObstacles = prev.map(x => x - 2).filter(x => x > -10)
        if (Math.random() > 0.98) {
          newObstacles.push(110)
        }
        return newObstacles
      })

      setObstacles(prev => {
        const collision = prev.some(x => x > 40 && x < 60 && Math.abs(position - 50) < 10)
        if (collision) {
          setGameActive(false)
        }
        return prev
      })

      setScore(s => s + 1)
    }, 50)

    return () => clearInterval(interval)
  }, [gameActive, position])

  const handleMove = (direction: 'up' | 'down') => {
    setPosition(prev => {
      if (direction === 'up') return Math.max(20, prev - 10)
      return Math.min(80, prev + 10)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden bg-[#FBF7EF]">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute left-1/2 -top-40 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.12), transparent 60%)' }}
        />
      </div>
      <div className="max-w-2xl w-full text-center relative">
        <div className="mb-8">
          <div className="inline-block p-6 bg-gradient-to-br from-[#C9A227] to-[#A07C12] rounded-full mb-6 glow-gold">
            <svg className="w-16 h-16 text-[#0D1B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
          </div>
          <p className="eyebrow block mb-3">Tatlight · Hors ligne</p>
          <h1 className="font-display text-4xl font-bold text-[#0D1B2A] mb-4">Mode Hors Connexion</h1>
          <p className="text-xl text-[#C9A227] mb-2">Même sans connexion, ton évolution continue...</p>
          <p className="text-gray-500">La lumière brille même dans l'obscurité</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#C9A227]/20 glow-gold-subtle">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mini-Jeu : Lumière Éternelle</h2>
          
          {!gameActive ? (
            <div className="space-y-6">
              <p className="text-gray-600">
                Guidez la lumière à travers l'obscurité. Évitez les obstacles et collectez des points !
              </p>
              {score > 0 && (
                <div className="p-4 bg-[#C9A227]/5 border border-[#C9A227]/20 rounded-xl">
                  <p className="text-[#C9A227] font-bold text-2xl">Score : {Math.floor(score / 10)}</p>
                </div>
              )}
              <button
                onClick={() => {
                  setGameActive(true)
                  setScore(0)
                  setObstacles([])
                  setPosition(50)
                }}
                className="px-8 py-4 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold text-lg hover:glow-gold transition-all"
              >
                {score > 0 ? 'Rejouer' : 'Commencer'}
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4 text-right">
                <span className="text-[#C9A227] font-bold text-xl">Score : {Math.floor(score / 10)}</span>
              </div>
              
              <div className="relative w-full h-64 bg-gray-50 rounded-xl overflow-hidden border-2 border-[#C9A227]/30">
                {/* Joueur */}
                <div
                  className="absolute w-8 h-8 bg-gradient-to-br from-[#C9A227] to-[#A07C12] rounded-full shadow-lg shadow-[#C9A227]/50 transition-all duration-100"
                  style={{ left: '50%', top: `${position}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="absolute inset-0 animate-ping bg-[#C9A227] rounded-full opacity-75"></div>
                </div>

                {/* Obstacles */}
                {obstacles.map((x, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-16 bg-red-500 rounded"
                    style={{ left: `${x}%`, top: '50%', transform: 'translateY(-50%)' }}
                  />
                ))}
              </div>

              <div className="flex gap-4 justify-center mt-6">
                <button
                  onClick={() => handleMove('up')}
                  className="px-8 py-4 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all"
                >
                  ↑ Haut
                </button>
                <button
                  onClick={() => handleMove('down')}
                  className="px-8 py-4 bg-[#C9A227] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all"
                >
                  ↓ Bas
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 p-6 bg-white rounded-3xl border border-[#C9A227]/20 glow-gold-subtle">
          <p className="text-gray-600 italic">
            "Dans l'obscurité, la plus petite lumière devient un phare d'espoir."
          </p>
        </div>
      </div>
    </div>
  )
}
