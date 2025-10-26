"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Smartphone } from "lucide-react"

interface GoldenEggProps {
  id: number
  isOpened: boolean
  onClick: () => void
  onShake?: (eggId: number, hint: string) => void
  onShakeStart?: (eggId: number) => void
  onShakeEnd?: (eggId: number) => void
  prizeName?: string
}

export function GoldenEgg({ id, isOpened, onClick, onShake, onShakeStart, onShakeEnd, prizeName }: GoldenEggProps) {
  const [isClicked, setIsClicked] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [shakeHint, setShakeHint] = useState<string>("")
  const [showHint, setShowHint] = useState(false)

  // 金蛋的有趣提示数据
  const eggHints = [
    { id: 1, hint: "它不说话，但能让你发出\"啊~\"的声音。", emoji: "🔨" },
    { id: 2, hint: "液体灵感，社畜燃料，DDL伴侣。", emoji: "☕" },
    { id: 3, hint: "你可能抽不到\"亲生的\"，但一定能收获一个\"娃\"。", emoji: "🔋" },
    { id: 4, hint: "你可能抽不到\"亲生的\"，但一定能收获一个\"娃\"。", emoji: "🎁" },
    { id: 5, hint: "滋滋滋", emoji: "🦷" },
    { id: 6, hint: "嗅觉ASMR，专治\"精神内耗\"。", emoji: "💜" },
    { id: 7, hint: "美团现在要收你3块一小时", emoji: "🏛️" },
    { id: 8, hint: "温度升高！", emoji: "🔥" },
    { id: 9, hint: "一种\"闻得到的东方叙事\"，比文案还香。", emoji: "🌸" },
    { id: 10, hint: "来自南半球的\"液体宝石\"，适合\"吨吨吨\"也适合\"摇摇摇\"。", emoji: "🍷" },
    { id: 11, hint: "通往\"童话世界\"和\"发丝顺滑\"的传送门。", emoji: "✨" },
    { id: 12, hint: "好用、爱用", emoji: "🌊" },
  ]

  const handleClick = () => {
    if (isOpened) return

    setIsClicked(true)
    setTimeout(() => {
      onClick()
    }, 600)
  }

  const handleShake = useCallback(() => {
    if (isOpened || isShaking) return

    setIsShaking(true)
    setShowHint(false)

    // 通知摇动开始
    if (onShakeStart) {
      onShakeStart(id)
    }

    // 获取当前金蛋的提示
    const currentHint = eggHints.find(h => h.id === id)
    
    // 模拟摇动延迟
    setTimeout(() => {
      if (currentHint) {
        const hint = `${currentHint.emoji} ${currentHint.hint}`
        setShakeHint(hint)
        setShowHint(true)
        
        // 调用回调函数，通知父组件
        if (onShake) {
          onShake(id, hint)
        }
      }
      setIsShaking(false)
      
      // 通知摇动结束
      if (onShakeEnd) {
        onShakeEnd(id)
      }
      
      // 5秒后隐藏提示
      setTimeout(() => {
        setShowHint(false)
      }, 5000)
    }, 1500)
  }, [id, isOpened, isShaking, onShake, onShakeStart, onShakeEnd])

  return (
    <div className="flex flex-col items-center group perspective-1000">
      {/* GIF 金蛋区域 */}
      <div
        className={cn(
          "relative w-36 h-44 cursor-pointer transition-all duration-500 ease-out preserve-3d",
          !isOpened && "hover:scale-110 float3d-animation group-hover:animation-none hover:bounce3d-animation",
          isOpened && "opacity-40 cursor-not-allowed scale-95",
          isClicked && "egg-crack3d-animation",
          isShaking && "animate-pulse scale-105",
        )}
        onClick={handleClick}
        style={{
          animation: isShaking ? "shake 0.3s ease-in-out infinite" : undefined,
          background: 'transparent',
        }}
      >
        {/* GIF 金蛋图片 - 直接撑满整个区域，无边框 */}
        <img 
          src="/egg.gif" 
          alt={`Golden Egg ${id}`}
          className={cn(
            "w-full h-full object-contain rounded-[50%_50%_50%_50%/60%_60%_40%_40%]",
            "transition-all duration-300",
            !isOpened && "hover:scale-105 hover:brightness-110",
            isOpened && "opacity-50 grayscale scale-95",
            isShaking && "animate-pulse brightness-125",
            isClicked && "brightness-150 scale-110",
          )}
          draggable={false}
          loading="eager"
          style={{ background: 'transparent' }}
        />
      </div>

      {/* 奖品名称与碎蛋壳/编号显示 */}
      {isOpened ? (
        <div className="mt-3 w-40 text-center">
          {/* 碎掉的蛋壳简单图形 */}
          <div className="mx-auto mb-2 w-24 h-6 relative">
            <svg viewBox="0 0 200 50" className="absolute inset-0">
              <path d="M0 40 L20 20 L40 40 L60 18 L80 40 L100 16 L120 40 L140 22 L160 40 L180 20 L200 40" fill="none" stroke="oklch(0.7 0.2 80)" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold inline-block max-w-full truncate" title={prizeName || ''}>
            {prizeName || '恭喜中奖'}
          </div>
        </div>
      ) : (
        <div className="mt-2 flex items-center justify-center">
          <span className={cn(
            "font-bold text-2xl drop-shadow-lg transform transition-all duration-200",
            !isOpened && "text-gray-700 hover:scale-110 hover:text-gray-900",
            isOpened && "text-gray-400",
            isShaking && "text-orange-500 animate-pulse scale-110",
            isClicked && "text-yellow-600 scale-125"
          )}>
            {id}
          </span>
        </div>
      )}

      <div className="mt-6 text-center space-y-3">
        {/* 主要状态显示 */}
        {isOpened && (
          <div className="px-4 py-2 bg-muted/60 rounded-full border border-border/50 backdrop-blur-sm">
            <span className="text-sm text-muted-foreground font-medium">✨ 已开启</span>
          </div>
        )}
      </div>
    </div>
  )
}
