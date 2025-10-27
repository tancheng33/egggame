"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GoldenEgg } from "@/components/golden-egg"
import { PrizeModal } from "@/components/prize-modal"
import { Confetti } from "@/components/confetti"
import { AIAssistant } from "@/components/ai-assistant"
import { GrandPrizeSlot } from "@/components/grand-prize-slot"
import { cn } from "@/lib/utils"

const prizes = [
  { id: 1, name: "小米加湿器", price: "¥199", description: "智能加湿，健康生活" },
  { id: 2, name: "skg护颈枕", price: "¥299", description: "呵护颈椎，舒适按摩" },
  { id: 3, name: "小米剃须刀", price: "¥169", description: "精准剃须，清爽干净" },
  { id: 4, name: "美的空气炸锅", price: "¥399", description: "健康烹饪，美味无油" },
  { id: 5, name: "小米香氛机", price: "¥139", description: "香氛扩散，优雅生活" },
  { id: 6, name: "小米音箱", price: "¥299", description: "智能语音，品质音质" },
  { id: 7, name: "美的榨汁机", price: "¥259", description: "新鲜果汁，营养健康" },
  { id: 8, name: "美的除螨吸尘器", price: "¥499", description: "深层清洁，除螨杀菌" },
  { id: 9, name: "绿联充电宝", price: "¥199", description: "大容量快充，续航无忧" },
  { id: 10, name: "usmile电动牙刷", price: "¥299", description: "专业口腔护理，洁白牙齿" },
  { id: 11, name: "美的破壁机", price: "¥599", description: "破壁料理，营养丰富" },
  { id: 12, name: "美的挂烫机", price: "¥399", description: "快速熨烫，平整如新" },
  { id: 13, name: "美的电蒸锅", price: "¥299", description: "蒸汽烹饪，营养保留" },
  { id: 14, name: "小米吹风机", price: "¥199", description: "护发速干，造型轻松" },
  { id: 15, name: "乐高-富贵竹", price: "¥399", description: "创意拼搭，装饰家居" },
  { id: 16, name: "美的电饭煲", price: "¥499", description: "智能烹饪，粒粒香甜" },
  { id: 17, name: "小米体脂秤", price: "¥149", description: "精准测量，健康管理" },
  { id: 18, name: "美的电火锅", price: "¥359", description: "多功能烹饪，美味火锅" },
]

export default function WeddingGoldenEggGame() {
  const [openedEggs, setOpenedEggs] = useState<number[]>([])
  const [selectedPrize, setSelectedPrize] = useState<(typeof prizes)[0] | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [availablePrizes, setAvailablePrizes] = useState([...prizes])
  const [eggPrizes, setEggPrizes] = useState<Record<number, (typeof prizes)[0]>>({})
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null)
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]) // 存储多个中奖号码
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinningNumber, setSpinningNumber] = useState<string | null>(null)
  const [spinningSlots, setSpinningSlots] = useState<string[]>([]) // 每个槽位正在滚动的数字
  const [revealedNumbers, setRevealedNumbers] = useState<string[]>([]) // 已经揭晓的数字
  const [drawnNumbers, setDrawnNumbers] = useState<Set<string>>(new Set())
  const [numberRange, setNumberRange] = useState({ min: 1, max: 999 })
  const [inputValue, setInputValue] = useState("999") // 用于输入框的临时值
  const [prizeCount, setPrizeCount] = useState(1) // 一轮抽几个奖品
  const [prizeCountInput, setPrizeCountInput] = useState("1") // 奖品数量输入框临时值
  const [showGrandPrize, setShowGrandPrize] = useState(false) // 显示大奖抽奖
  const [grandPrizeNumber, setGrandPrizeNumber] = useState<string>("") // 中奖号码
  const [grandPrizeDrawn, setGrandPrizeDrawn] = useState(false) // 大奖是否已抽过
  const [assignedPrizes] = useState<Record<number, (typeof prizes)[0]>>(() => {
    // 按照固定顺序分配奖品到金蛋：1号金蛋=1号奖品，2号金蛋=2号奖品...
    const map: Record<number, (typeof prizes)[0]> = {}
    for (let i = 1; i <= 18; i++) {
      map[i] = prizes[i - 1] // 直接按顺序分配，不随机打乱
    }
    return map
  })

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

  // 获取未抽中的数字列表
  const getAvailableNumbers = (): string[] => {
    const allNumbers = generateAvailableNumbers(numberRange.min, numberRange.max)
    return allNumbers.filter(num => !drawnNumbers.has(num))
  }

  const handleSelectNumber = () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    setSelectedNumber(null)
    setSelectedNumbers([])
    setRevealedNumbers([])
    setSpinningSlots([])
    setSpinningNumber(null)

    // 获取可用数字列表
    const availableNumbers = getAvailableNumbers()
    
    // 检查是否还有可抽的数字
    if (availableNumbers.length === 0) {
      setIsSpinning(false)
      alert("所有数字都已抽完！")
      return
    }
    
    // 确定本次实际抽取的数量
    const actualCount = Math.min(prizeCount, availableNumbers.length)
    
    // 随机选择多个不重复的数字
    const selectedNums: string[] = []
    const tempAvailable = [...availableNumbers]
    for (let i = 0; i < actualCount; i++) {
      const randomIndex = Math.floor(Math.random() * tempAvailable.length)
      selectedNums.push(tempAvailable[randomIndex])
      tempAvailable.splice(randomIndex, 1)
    }

    // 初始化所有槽位为滚动状态
    setSpinningSlots(new Array(actualCount).fill('---'))

    // 为每个槽位创建滚动动画
    const intervals: NodeJS.Timeout[] = []
    
    // 每个槽位的滚动动画
    for (let i = 0; i < actualCount; i++) {
      const interval = setInterval(() => {
        const randomNum = availableNumbers[Math.floor(Math.random() * availableNumbers.length)]
        setSpinningSlots(prev => {
          const newSlots = [...prev]
          newSlots[i] = randomNum
          return newSlots
        })
      }, 80)
      intervals.push(interval)
    }

    // 逐个停止槽位并揭晓数字
    selectedNums.forEach((num, index) => {
      setTimeout(() => {
        // 停止当前槽位的滚动
        clearInterval(intervals[index])
        
        // 揭晓当前数字
        setRevealedNumbers(prev => [...prev, num])
        
        // 如果是最后一个数字
        if (index === actualCount - 1) {
          // 清除所有间隔
          intervals.forEach(interval => clearInterval(interval))
          
          // 等待一小段时间后完成抽奖
          setTimeout(() => {
            setSelectedNumbers(selectedNums)
            setDrawnNumbers(prev => new Set([...prev, ...selectedNums]))
            setIsSpinning(false)
            setSpinningSlots([])
          }, 500)
        }
      }, 1500 + index * 800) // 每个数字间隔800ms揭晓
    })
  }

  const handleClearNumbers = () => {
    setSelectedNumbers([])
    setSelectedNumber(null)
    setRevealedNumbers([])
    setSpinningSlots([])
  }

  const handleGrandPrizeComplete = (winningNumber: string) => {
    setGrandPrizeNumber(winningNumber)
    setGrandPrizeDrawn(true)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000)
  }

  const handleEggClick = (eggId: number) => {
    if (openedEggs.includes(eggId) || availablePrizes.length === 0) return

    // Use pre-assigned prize to enable prize-related hints
    const selectedPrize = assignedPrizes[eggId]

    // Remove the selected prize from available prizes
    const newAvailablePrizes = availablePrizes.filter((p) => p.id !== selectedPrize.id)
    setAvailablePrizes(newAvailablePrizes)

    setOpenedEggs([...openedEggs, eggId])
    setSelectedPrize(selectedPrize)
    setEggPrizes(prev => ({ ...prev, [eggId]: selectedPrize }))
    setShowConfetti(true)

    // Hide confetti after 3 seconds
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const resetGame = () => {
    setOpenedEggs([])
    setSelectedPrize(null)
    setShowConfetti(false)
    setAvailablePrizes([...prizes])
    setEggPrizes({})
    setSelectedNumber(null)
    setSelectedNumbers([])
    setRevealedNumbers([])
    setSpinningSlots([])
    setDrawnNumbers(new Set())
    setInputValue("999")
    setNumberRange({ min: 1, max: 999 })
    setPrizeCount(1)
    setPrizeCountInput("1")
    setGrandPrizeNumber("")
    setGrandPrizeDrawn(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      {showConfetti && <Confetti />}

      <div className="relative">
        <div className="container mx-auto px-6 py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-7xl md:text-8xl font-bold tracking-tight text-gradient leading-none">幸福时刻</h1>
              <h2 className="text-4xl md:text-5xl font-semibold text-foreground/90 leading-tight">砸金蛋抽盲盒</h2>
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              点击金蛋，开启惊喜之旅
              <br />
              每一个都是独特的礼物
            </p>

            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl px-6 py-4 shadow-lg">
                <div className="text-2xl font-bold text-primary">{openedEggs.length}</div>
                <div className="text-sm text-muted-foreground">已开启</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl px-6 py-4 shadow-lg">
                <div className="text-2xl font-bold text-accent">{availablePrizes.length}</div>
                <div className="text-sm text-muted-foreground">剩余奖品</div>
              </div>
            </div>

            {/* 号码范围设置 */}
            <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
              <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border-2 border-blue-400/30 rounded-2xl px-8 py-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <label htmlFor="maxNumber" className="text-base font-semibold text-foreground/90 whitespace-nowrap">
                    抽奖号码范围：
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-blue-600">001</span>
                    <span className="text-lg text-muted-foreground">-</span>
                    <input
                      id="maxNumber"
                      type="number"
                      min="10"
                      max="9999"
                      value={inputValue}
                      onChange={(e) => {
                        const value = e.target.value
                        setInputValue(value) // 允许任意输入
                        
                        // 实时更新numberRange（如果是有效数字）
                        const numValue = parseInt(value)
                        if (!isNaN(numValue) && numValue >= 10) {
                          setNumberRange({ min: 1, max: Math.min(numValue, 9999) })
                        }
                      }}
                      onBlur={(e) => {
                        // 失去焦点时验证并修正
                        const value = e.target.value
                        const numValue = parseInt(value)
                        
                        if (value === '' || isNaN(numValue) || numValue < 10) {
                          // 无效值，恢复默认
                          setInputValue("999")
                          setNumberRange({ min: 1, max: 999 })
                        } else {
                          // 有效值，确保在范围内
                          const validValue = Math.min(Math.max(numValue, 10), 9999)
                          setInputValue(validValue.toString())
                          setNumberRange({ min: 1, max: validValue })
                        }
                      }}
                      className="w-24 px-4 py-2 text-lg font-bold text-center bg-white/90 border-2 border-blue-400/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="mt-2 text-xs text-center text-muted-foreground/60">
                  可用号码数：<span className="font-bold text-blue-600">{getAvailableNumbers().length}</span> 个
                  {drawnNumbers.size > 0 && (
                    <span className="ml-2">
                      | 已抽：<span className="font-bold text-orange-600">{drawnNumbers.size}</span> 个
                    </span>
                  )}
                </div>
              </div>

              {/* 一轮抽几个奖品设置 */}
              <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 backdrop-blur-sm border-2 border-orange-400/30 rounded-2xl px-8 py-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <label htmlFor="prizeCount" className="text-base font-semibold text-foreground/90 whitespace-nowrap">
                    一轮抽奖数量：
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="prizeCount"
                      type="number"
                      min="1"
                      max="50"
                      value={prizeCountInput}
                      onChange={(e) => {
                        const value = e.target.value
                        setPrizeCountInput(value)
                        
                        const numValue = parseInt(value)
                        if (!isNaN(numValue) && numValue >= 1) {
                          setPrizeCount(Math.min(numValue, 50))
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value
                        const numValue = parseInt(value)
                        
                        if (value === '' || isNaN(numValue) || numValue < 1) {
                          setPrizeCountInput("1")
                          setPrizeCount(1)
                        } else {
                          const validValue = Math.min(Math.max(numValue, 1), 50)
                          setPrizeCountInput(validValue.toString())
                          setPrizeCount(validValue)
                        }
                      }}
                      className="w-20 px-4 py-2 text-lg font-bold text-center bg-white/90 border-2 border-orange-400/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                    <span className="text-base font-medium text-muted-foreground">个</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-center text-muted-foreground/60">
                  每次抽奖将随机抽取 <span className="font-bold text-orange-600">{prizeCount}</span> 个号码
                </div>
              </div>
            </div>

            {/* 大奖抽奖按钮 */}
            <div className="flex flex-col items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setShowGrandPrize(true)}
                disabled={grandPrizeDrawn}
                className={cn(
                  "group relative px-10 py-5 bg-gradient-to-r text-white text-xl font-black rounded-2xl shadow-2xl transition-all duration-300 transform overflow-hidden",
                  grandPrizeDrawn 
                    ? "from-gray-500 to-gray-600 cursor-not-allowed opacity-50" 
                    : "from-purple-600 via-pink-600 to-red-600 hover:shadow-3xl hover:scale-110 animate-pulse"
                )}
              >
                {/* 按钮内部光效 */}
                {!grandPrizeDrawn && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-slide-right"></div>
                )}
                
                <span className="relative z-10 flex items-center gap-3">
                  <span className={!grandPrizeDrawn ? "animate-bounce" : ""}>🎰</span>
                  <span>{grandPrizeDrawn ? "已抽取大奖" : "抽取超级大奖"}</span>
                  <span className={!grandPrizeDrawn ? "animate-bounce" : ""}>🎁</span>
                </span>

                {/* 按钮边框光效 */}
                {!grandPrizeDrawn && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-yellow-300 animate-ping"></div>
                )}
              </button>

              {/* 中奖号码显示 */}
              {grandPrizeDrawn && grandPrizeNumber && (
                <div className="bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-sm border-2 border-yellow-400/50 rounded-2xl px-8 py-4 shadow-xl animate-fade-in">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2 font-semibold">中奖号码</div>
                    <div className="text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                      {grandPrizeNumber}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">iPad (A16)</div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 lg:pr-[450px]">
        <div className="max-w-5xl">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {Array.from({ length: 18 }, (_, i) => (
              <div key={i + 1} className="slide-up-animation" style={{ animationDelay: `${i * 0.05}s` }}>
                <GoldenEgg 
                  id={i + 1} 
                  isOpened={openedEggs.includes(i + 1)} 
                  onClick={() => handleEggClick(i + 1)}
                  prizeName={eggPrizes[i + 1]?.name}
                />
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Prize Modal */}
      <PrizeModal 
        prize={selectedPrize} 
        isOpen={!!selectedPrize} 
        onClose={() => setSelectedPrize(null)}
      />

      {/* AI Robot Assistant component */}
      <AIAssistant 
        openedEggs={openedEggs} 
        onSelectNumber={handleSelectNumber}
        onClearNumbers={handleClearNumbers}
        isSpinning={isSpinning}
        spinningNumber={spinningNumber}
        selectedNumber={selectedNumber}
        selectedNumbers={selectedNumbers}
        spinningSlots={spinningSlots}
        revealedNumbers={revealedNumbers}
      />

      {/* Grand Prize Slot Machine */}
      <GrandPrizeSlot
        isOpen={showGrandPrize}
        onClose={() => setShowGrandPrize(false)}
        onComplete={handleGrandPrizeComplete}
        numberRange={numberRange}
      />
    </div>
  )
}
