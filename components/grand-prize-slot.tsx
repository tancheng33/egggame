"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface GrandPrizeSlotProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (winningNumber: string) => void
  numberRange: { min: number; max: number }
}

export function GrandPrizeSlot({ isOpen, onClose, onComplete, numberRange }: GrandPrizeSlotProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [slots, setSlots] = useState<string[]>(["?", "?", "?"])
  const [revealedSlots, setRevealedSlots] = useState<boolean[]>([false, false, false])
  const [showFireworks, setShowFireworks] = useState(false)
  const [finalNumber, setFinalNumber] = useState<string>("")
  const [isComplete, setIsComplete] = useState(false) // 是否完成抽奖

  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

  // 生成可用数字列表（排除含4的数字）
  const generateAvailableNumbers = (min: number, max: number): string[] => {
    const numbers: string[] = []
    for (let i = min; i <= max; i++) {
      const numStr = i.toString().padStart(3, '0')
      // 跳过包含数字4的
      if (!numStr.includes('4')) {
        numbers.push(numStr)
      }
    }
    return numbers
  }

  useEffect(() => {
    if (isOpen) {
      // 重置状态
      setSlots(["?", "?", "?"])
      setRevealedSlots([false, false, false])
      setShowFireworks(false)
      setFinalNumber("")
      setIsComplete(false)
    }
  }, [isOpen])

  const startSpin = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setRevealedSlots([false, false, false])
    setShowFireworks(false)
    setIsComplete(false)

    // 从号码范围中随机抽取一个数字
    const availableNumbers = generateAvailableNumbers(numberRange.min, numberRange.max)
    const winningNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)]
    
    // 将数字拆分成三位
    const finalSlots = winningNumber.split('')
    // 暂时不设置finalNumber，等抽奖完成后再设置

    // 所有槽位同时开始滚动
    const intervals: NodeJS.Timeout[] = []
    for (let i = 0; i < 3; i++) {
      const interval = setInterval(() => {
        setSlots(prev => {
          const newSlots = [...prev]
          newSlots[i] = digits[Math.floor(Math.random() * digits.length)]
          return newSlots
        })
      }, 80)
      intervals.push(interval)
    }

    // 依次停止每个槽位
    finalSlots.forEach((digit, index) => {
      setTimeout(() => {
        clearInterval(intervals[index])
        setSlots(prev => {
          const newSlots = [...prev]
          newSlots[index] = digit
          return newSlots
        })
        setRevealedSlots(prev => {
          const newRevealed = [...prev]
          newRevealed[index] = true
          return newRevealed
        })

        // 最后一个槽位停止后，显示结果
        if (index === 2) {
          setTimeout(() => {
            setIsSpinning(false)
            setShowFireworks(true)
            setFinalNumber(winningNumber) // 在这里才设置最终号码
            setIsComplete(true) // 标记为完成
            onComplete(winningNumber)
          }, 800)
        }
      }, 2000 + index * 1000) // 每个槽位间隔1秒停止
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in">
      {/* 烟花效果 */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-firework"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* 关闭按钮 */}
      {!isSpinning && (
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="relative w-full max-w-4xl px-6">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className={cn(
            "text-6xl md:text-8xl font-black mb-4 transition-all duration-500",
            isComplete ? "text-yellow-400 animate-pulse" : "text-white"
          )}>
            {isComplete ? "🎉 中奖号码已抽出！🎉" : isSpinning ? "🎰 正在抽奖中... 🎰" : "超级大奖"}
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300">
            {isComplete ? `中奖号码：${finalNumber}` : isSpinning ? "号码即将揭晓..." : "抽取一个幸运号码"}
          </p>
          <p className="text-lg md:text-xl text-yellow-400 mt-2">
            {isComplete ? "持有此号码的人获得 iPad (A16) 一台！" : "号码范围：" + numberRange.min.toString().padStart(3, '0') + " - " + numberRange.max.toString().padStart(3, '0')}
          </p>
        </div>

        {/* 老虎机主体 */}
        <div className="relative bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-yellow-500/50">
          {/* 霓虹灯边框效果 */}
          <div className="absolute inset-0 rounded-3xl">
            <div className="absolute inset-0 rounded-3xl border-4 border-yellow-400 animate-pulse" />
            <div className="absolute -inset-1 rounded-3xl border-2 border-pink-500 animate-ping" style={{ animationDuration: '2s' }} />
          </div>

          {/* 槽位容器 */}
          <div className="relative flex justify-center gap-4 md:gap-8 mb-12">
            {slots.map((digit, index) => (
              <div
                key={index}
                className={cn(
                  "relative w-36 h-48 md:w-52 md:h-64 bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-inner flex items-center justify-center overflow-hidden border-4 transition-all duration-500",
                  revealedSlots[index] ? "border-yellow-400 scale-110 shadow-2xl shadow-yellow-400/50" : "border-gray-700",
                  isSpinning && !revealedSlots[index] && "animate-pulse"
                )}
              >
                {/* 槽位发光效果 */}
                {revealedSlots[index] && (
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-transparent animate-pulse" />
                )}

                {/* 数字显示 */}
                <div className={cn(
                  "font-black transition-all duration-300 font-mono",
                  "text-8xl md:text-[12rem]",
                  "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent",
                  isSpinning && !revealedSlots[index] && "blur-sm scale-90",
                  revealedSlots[index] && "animate-bounce drop-shadow-[0_0_30px_rgba(250,204,21,0.8)]"
                )}
                style={{
                  textShadow: revealedSlots[index] ? '0 0 40px rgba(250, 204, 21, 0.8), 0 0 60px rgba(251, 146, 60, 0.6)' : 'none'
                }}>
                  {digit}
                </div>

                {/* 滚动光效 */}
                {isSpinning && !revealedSlots[index] && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-slide-down" />
                )}

                {/* 数字边框装饰 */}
                {revealedSlots[index] && (
                  <>
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-400 rounded-tl-lg" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-400 rounded-tr-lg" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-400 rounded-bl-lg" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-400 rounded-br-lg" />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* 提示文字 */}
          <div className="relative text-center mb-8">
            <p className="text-xl md:text-2xl text-yellow-300 font-bold">
              {isSpinning ? "正在抽取中奖号码..." : isComplete ? "" : "点击下方按钮抽取中奖号码"}
            </p>
          </div>

          {/* 抽奖按钮 */}
          {!isSpinning && !isComplete && (
            <div className="relative flex justify-center">
              <button
                onClick={startSpin}
                className="group relative px-12 py-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white text-2xl md:text-3xl font-black rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 overflow-hidden"
              >
                {/* 按钮光效 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-slide-right" />
                
                <span className="relative z-10 flex items-center gap-3">
                  <span>🎰</span>
                  <span>开始抽奖</span>
                  <span>🎰</span>
                </span>

                {/* 按钮边框光效 */}
                <div className="absolute inset-0 rounded-2xl border-2 border-yellow-300 group-hover:animate-ping" />
              </button>
            </div>
          )}

          {/* 结果按钮 */}
          {isComplete && !isSpinning && (
            <div className="relative flex justify-center">
              <button
                onClick={onClose}
                className="px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
              >
                确认
              </button>
            </div>
          )}
        </div>

        {/* 中奖横幅 */}
        {isComplete && !isSpinning && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <div className="bg-gradient-to-r from-transparent via-yellow-400 to-transparent text-red-900 text-4xl md:text-6xl font-black py-6 px-12 transform -rotate-12 shadow-2xl animate-bounce">
              🎊 中奖号码 🎊
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

