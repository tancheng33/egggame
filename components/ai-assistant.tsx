"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AIAssistantProps {
  selectedEggId: number | null
  openedEggs: number[]
  onHintRequest: (eggId: number) => void
  isShaking?: boolean
  currentShakeHint?: string
  onSelectPerson?: () => void
  isSpinning?: boolean
  spinningTable?: number | null
  spinningPerson?: string | null
  selectedPerson?: {table: number, person: string} | null
}

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

export function AIAssistant({ selectedEggId, openedEggs, onHintRequest, isShaking = false, currentShakeHint, onSelectPerson, isSpinning = false, spinningTable, spinningPerson, selectedPerson }: AIAssistantProps) {
  const [currentMessage, setCurrentMessage] = useState<string>("")
  const [robotExpression, setRobotExpression] = useState<'idle' | 'thinking' | 'excited' | 'shaking'>('idle')

  const getRandomEncouragement = () => {
    const encouragements = [
      "你好！我是你的AI小助手 ✨ 我能感知到每个金蛋的神秘能量，需要我的建议吗？",
      "欢迎来到神奇的金蛋世界！我已经准备好为你提供智能提示了～",
      "我的AI直觉告诉我，今天对你来说是个特别幸运的日子！",
      "每个金蛋都散发着独特的光芒，让我帮你找到最适合的那一个吧！",
      "我正在分析这些金蛋的能量场...有什么我可以帮助你的吗？",
    ]
    return encouragements[Math.floor(Math.random() * encouragements.length)]
  }

  const getSmartSuggestion = () => {
    const unopenedEggs = Array.from({ length: 12 }, (_, i) => i + 1).filter((id) => !openedEggs.includes(id))

    if (unopenedEggs.length === 0) {
      return "恭喜你！所有的金蛋都被你发现了！每一个都是完美的选择 🎉"
    }

    const suggestions = [
      `我的AI算法建议你试试第${unopenedEggs[Math.floor(Math.random() * unopenedEggs.length)]}号金蛋，它的能量波动很特别！`,
      `根据你之前的选择模式，我推荐你考虑一下那些还在闪闪发光的金蛋～`,
      `我感觉到有几个金蛋特别想被你发现，要不要听听我的直觉？`,
      `基于概率分析，现在是开启新金蛋的最佳时机！`,
      `我的传感器检测到某些金蛋的惊喜指数特别高哦！`,
    ]

    return suggestions[Math.floor(Math.random() * suggestions.length)]
  }

  const getSpecificHint = () => {
    const unopenedEggs = Array.from({ length: 12 }, (_, i) => i + 1).filter((id) => !openedEggs.includes(id))

    if (unopenedEggs.length === 0) return "所有金蛋都已经被发现了！"

    const randomEgg = unopenedEggs[Math.floor(Math.random() * unopenedEggs.length)]
    const hint = eggHints.find((h) => h.id === randomEgg)

    return `${hint?.emoji} 第${randomEgg}号金蛋的秘密：${hint?.hint}`
  }


  // 监听摇动状态变化
  useEffect(() => {
    if (isShaking) {
      setRobotExpression('shaking')
      setCurrentMessage("正在感知金蛋的神秘能量... 🔮")
    } else if (currentShakeHint) {
      setRobotExpression('excited')
      setCurrentMessage(currentShakeHint)
      
      // 3秒后恢复空闲状态
      setTimeout(() => {
        setRobotExpression('idle')
        setCurrentMessage(getRandomEncouragement())
      }, 3000)
    }
  }, [isShaking, currentShakeHint])

  useEffect(() => {
    if (!isShaking && !currentShakeHint) {
      setCurrentMessage(getRandomEncouragement())
      setRobotExpression('idle')
    }
  }, [isShaking, currentShakeHint])

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
            robotExpression === 'excited' && "brightness-110 saturate-110",
            robotExpression === 'thinking' && "brightness-105 hue-rotate-15",
            robotExpression === 'shaking' && "brightness-125 saturate-125",
            robotExpression === 'idle' && "brightness-90"
          )}
          draggable={false}
          loading="eager"
        />
        
        {/* 添加动态效果覆盖层 */}
        {robotExpression === 'excited' && (
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-400/20 via-transparent to-pink-400/20 animate-pulse" />
        )}
        {robotExpression === 'thinking' && (
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/20 via-transparent to-purple-400/20 animate-pulse" />
        )}
        {robotExpression === 'shaking' && (
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/30 via-transparent to-red-400/30 animate-ping" />
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
        {onSelectPerson && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={onSelectPerson}
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
                    <span>AI随机选人</span>
                    <span className="animate-bounce">🎯</span>
                  </>
                )}
              </span>
            </button>
          </div>
        )}
        
        {/* 老虎机效果显示 */}
        {(isSpinning || selectedPerson) && (
          <div className="mt-4 bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-sm border-2 border-yellow-400/50 rounded-2xl p-4 shadow-2xl max-w-xs relative overflow-hidden">
            {/* 跑马灯背景效果 */}
            {isSpinning && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-slide-right"></div>
            )}
            
            {/* 闪烁边框效果 */}
            {isSpinning && (
              <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400 animate-ping"></div>
            )}
            
            <div className="text-center relative z-10">
              <div className="text-lg font-bold text-yellow-700 mb-2 flex items-center justify-center gap-2">
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
              
              {/* 桌号显示 - 老虎机风格 */}
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2 font-semibold">桌号</div>
                <div className={cn(
                  "text-3xl font-black text-primary bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent",
                  isSpinning && spinningTable && "animate-pulse"
                )}>
                  {spinningTable || selectedPerson?.table || "---"}
                </div>
              </div>
              
              {/* 人员显示 - 老虎机风格 */}
              <div>
                <div className="text-sm text-gray-600 mb-2 font-semibold">人员</div>
                <div className={cn(
                  "text-xl font-bold text-secondary bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent truncate",
                  isSpinning && spinningPerson && "animate-pulse"
                )}>
                  {spinningPerson || selectedPerson?.person || "---"}
                </div>
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

      {/* 机器人提示气泡 - 在机器人上方，保持合理距离 */}
      {(isShaking || currentShakeHint || robotExpression !== 'idle') && (
        <div className="fixed bottom-[35rem] right-6 z-50">
          <div className={cn(
            "bg-white/95 backdrop-blur-sm border border-blue-200/50 rounded-3xl p-6 shadow-xl max-w-sm",
            "transform transition-all duration-300 animate-fade-in",
            isShaking && "animate-pulse"
          )}>
            <div className="text-base text-blue-700 font-medium leading-relaxed">
              {currentMessage}
            </div>
            <div className="text-sm text-blue-500/70 mt-2">
              AI机器人助手 🤖
            </div>
            {/* 气泡箭头指向下方机器人 */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 w-4 h-4 bg-white border-r border-b border-blue-200/50"></div>
          </div>
        </div>
      )}
    </>
  )
}
