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
    { id: 1, hint: "这个金蛋里藏着能让你放松身心的传统好物～", emoji: "🔨" },
    { id: 2, hint: "香醇的味道会唤醒你的清晨，来自蓝色的惊喜！", emoji: "☕" },
    { id: 3, hint: "出门在外的好伙伴，永远不会让你的设备没电～", emoji: "🔋" },
    { id: 4, hint: "可爱的小伙伴在等你，盲盒的魅力就在于未知！", emoji: "🎁" },
    { id: 5, hint: "每天两次的健康习惯，德国品质值得信赖～", emoji: "🦷" },
    { id: 6, hint: "来自法国的浪漫香气，紫色的梦幻体验！", emoji: "💜" },
    { id: 7, hint: "英伦文化的精致体现，喝水也能很有艺术感～", emoji: "🏛️" },
    { id: 8, hint: "随时随地享受热水，小巧便携的温暖陪伴！", emoji: "🔥" },
    { id: 9, hint: "东方美学的香氛艺术，优雅气质的完美诠释～", emoji: "🌸" },
    { id: 10, hint: "来自智利的醇香佳酿，浪漫品鉴时光！", emoji: "🍷" },
    { id: 11, hint: "迪士尼的魔法加上传统工艺，已经绝版的珍贵收藏！", emoji: "✨" },
    { id: 12, hint: "海洋的奢华秘密，让肌肤重获新生的传奇面霜！", emoji: "🌊" },
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

        {/* 摇一摇按钮 */}
        {!isOpened && (
          <Button
            onClick={handleShake}
            disabled={isShaking}
            size="sm"
            variant="outline"
            className={cn(
              "h-8 px-3 text-xs bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200/50 text-orange-600 hover:from-orange-100 hover:to-pink-100 hover:border-orange-300 transition-all duration-300 transform hover:scale-105",
              isShaking && "animate-bounce scale-105"
            )}
          >
            <Smartphone className="w-3 h-3 mr-1" />
            {isShaking ? "摇动中..." : "摇一摇"}
          </Button>
        )}

      </div>
    </div>
  )
}
