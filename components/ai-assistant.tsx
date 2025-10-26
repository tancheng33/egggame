"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AIAssistantProps {
  openedEggs: number[]
  onSelectNumber?: () => void
  onClearNumbers?: () => void
  isSpinning?: boolean
  spinningNumber?: string | null
  selectedNumber?: string | null
  selectedNumbers?: string[]
  spinningSlots?: string[]
  revealedNumbers?: string[]
}

export function AIAssistant({ openedEggs, onSelectNumber, onClearNumbers, isSpinning = false, spinningNumber, selectedNumber, selectedNumbers = [], spinningSlots = [], revealedNumbers = [] }: AIAssistantProps) {
  const [robotExpression, setRobotExpression] = useState<'idle' | 'thinking' | 'excited'>('idle')

  // 机器人GIF组件
  const RobotGif = () => {
    return (
      <div className={cn(
        "relative w-80 h-80 rounded-3xl overflow-hidden transform transition-all duration-300",
        robotExpression === 'excited' && "scale-110",
        robotExpression === 'thinking' && "animate-pulse"
      )}>
        {/* 机器人GIF */}
        <img 
          src="/bot.gif"
          alt="AI Robot Assistant"
          className={cn(
            "w-full h-full object-cover rounded-3xl transition-all duration-300",
            "brightness-110 saturate-110" // 始终保持较高的亮度和饱和度
          )}
          draggable={false}
          loading="eager"
        />
        
        {/* 永久的动态渐变效果覆盖层 - 始终显示 */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/30 via-yellow-400/20 to-red-400/30 animate-gradient-shift" />
        
        {/* 额外的呼吸光效 */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-400/20 via-transparent to-purple-400/20 animate-pulse" />
        
        {/* 根据不同状态添加额外效果 */}
        {robotExpression === 'excited' && (
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-400/30 via-transparent to-pink-400/30 animate-ping" />
        )}
      </div>
    )
  }

  return (
    <>
      {/* 机器人本体 - 固定在右下角 */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="transform transition-all duration-300">
          <RobotGif />
        </div>
        
        {/* 抽奖按钮 - 在机器人下方 */}
        {onSelectNumber && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={onSelectNumber}
              disabled={isSpinning}
              className={cn(
                "px-8 py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden",
                isSpinning && "animate-pulse"
              )}
            >
              {/* 按钮内部光效 */}
              {isSpinning && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-slide-right"></div>
              )}
              
              <span className="relative z-10 flex items-center gap-2">
                {isSpinning ? (
                  <>
                    <span className="animate-spin">🎰</span>
                    <span>抽奖中...</span>
                    <span className="animate-spin">🎰</span>
                  </>
                ) : (
                  <>
                    <span className="animate-bounce">🎯</span>
                    <span>随机抽数字</span>
                    <span className="animate-bounce">🎯</span>
                  </>
                )}
              </span>
            </button>
          </div>
        )}
        
        {/* 老虎机效果显示 */}
        {(isSpinning || selectedNumbers.length > 0) && (
          <div className="mt-4 bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-sm border-2 border-yellow-400/50 rounded-2xl p-6 shadow-2xl max-w-md relative overflow-hidden">
            {/* 关闭按钮 - 只在抽奖完成后显示 */}
            {!isSpinning && selectedNumbers.length > 0 && onClearNumbers && (
              <button
                onClick={onClearNumbers}
                className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-gray-600/80 hover:bg-gray-700 text-white transition-all duration-200 hover:scale-110 shadow-lg"
                aria-label="关闭"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {/* 跑马灯背景效果 */}
            {isSpinning && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-slide-right"></div>
            )}
            
            {/* 闪烁边框效果 */}
            {isSpinning && (
              <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400 animate-ping"></div>
            )}
            
            <div className="text-center relative z-10">
              <div className="text-lg font-bold text-yellow-700 mb-4 flex items-center justify-center gap-2">
                {isSpinning ? (
                  <>
                    <span className="animate-bounce">🎰</span>
                    <span className="animate-pulse">抽奖中...</span>
                    <span className="animate-bounce">🎰</span>
                  </>
                ) : (
                  <>
                    <span className="animate-bounce">🎉</span>
                    <span>恭喜中奖！</span>
                    <span className="animate-bounce">🎉</span>
                  </>
                )}
              </div>
              
              {/* 数字显示 - 老虎机风格 */}
              <div>
                <div className="text-sm text-gray-600 mb-3 font-semibold">
                  {spinningSlots.length > 1 || selectedNumbers.length > 1 ? `幸运数字 (共${Math.max(spinningSlots.length, selectedNumbers.length)}个)` : "幸运数字"}
                </div>
                
                {isSpinning ? (
                  <div className="flex flex-wrap gap-3 justify-center">
                    {spinningSlots.map((slotNum, index) => {
                      const isRevealed = index < revealedNumbers.length
                      const displayNum = isRevealed ? revealedNumbers[index] : slotNum
                      
                      return (
                        <div 
                          key={index}
                          className={cn(
                            "text-4xl font-black px-4 py-3 rounded-xl shadow-lg transition-all duration-300 min-w-[100px] text-center",
                            isRevealed 
                              ? "bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-white/70 scale-110 animate-bounce" 
                              : "bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 bg-clip-text text-transparent bg-white/30 animate-pulse"
                          )}
                        >
                          {displayNum}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3 justify-center">
                    {selectedNumbers.map((num, index) => (
                      <div 
                        key={index}
                        className="text-4xl font-black bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent px-4 py-3 bg-white/70 rounded-xl shadow-lg animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 装饰性元素 */}
              {isSpinning && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              )}
              {isSpinning && (
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
