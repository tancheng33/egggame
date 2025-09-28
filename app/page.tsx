"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GoldenEgg } from "@/components/golden-egg"
import { PrizeModal } from "@/components/prize-modal"
import { Confetti } from "@/components/confetti"
import { AIAssistant } from "@/components/ai-assistant"

const prizes = [
  { id: 1, name: "百福养生锤", price: "¥80", description: "传统养生工具，促进血液循环" },
  { id: 2, name: "蓝瓶咖啡豆", price: "¥138", description: "精选优质咖啡豆，香醇浓郁" },
  { id: 3, name: "充电宝", price: "¥165", description: "大容量移动电源，出行必备" },
  { id: 4, name: "Labubu 三代盲盒", price: "¥125", description: "热门收藏玩具，惊喜满满" },
  { id: 5, name: "Oral-B 电动牙刷", price: "¥180", description: "专业口腔护理，健康生活" },
  { id: 6, name: "法国薰衣草精油", price: "¥180", description: "天然芳香精油，舒缓身心" },
  { id: 7, name: "翡翠手串", price: "¥200", description: "温润含蓄的东方之美，佩戴吉祥" },
  { id: 8, name: "摩飞烧水杯", price: "¥200", description: "便携电热水杯，随时享受热水" },
  { id: 9, name: "观夏香氛礼盒", price: "¥300", description: "东方香调香氛，优雅气质" },
  { id: 10, name: "智利红酒礼盒", price: "¥600", description: "精选智利红酒，浪漫品鉴" },
  { id: 11, name: "谭木匠迪士尼联名气垫梳", price: "¥600", description: "限量版收藏" },
  { id: 12, name: "La Mer 经典面霜", price: "¥1500", description: "奢华护肤品，肌肤新生" },
]

export default function WeddingGoldenEggGame() {
  const [openedEggs, setOpenedEggs] = useState<number[]>([])
  const [selectedPrize, setSelectedPrize] = useState<(typeof prizes)[0] | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [availablePrizes, setAvailablePrizes] = useState([...prizes])
  const [selectedEggId, setSelectedEggId] = useState<number | null>(null)
  const [shakeHints, setShakeHints] = useState<{[key: number]: string}>({})
  const [isAnyEggShaking, setIsAnyEggShaking] = useState(false)
  const [currentRobotHint, setCurrentRobotHint] = useState<string>("")
  const [eggPrizes, setEggPrizes] = useState<Record<number, (typeof prizes)[0]>>({})
  const [selectedPerson, setSelectedPerson] = useState<{table: number, person: string} | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinningTable, setSpinningTable] = useState<number | null>(null)
  const [spinningPerson, setSpinningPerson] = useState<string | null>(null)
  const [winningTables, setWinningTables] = useState<Set<number>>(new Set())
  const [assignedPrizes] = useState<Record<number, (typeof prizes)[0]>>(() => {
    const shuffled = [...prizes].sort(() => Math.random() - 0.5)
    const map: Record<number, (typeof prizes)[0]> = {}
    for (let i = 1; i <= 12; i++) {
      map[i] = shuffled[i - 1]
    }
    return map
  })

  // 宾客桌位数据
  const guestTables = {
    1: ["王依婷", "谭成", "龚逸菲", "郑若男", "毛若晨", "肖力恒", "俞志巍", "王诗琪", "周昕怡", "陆思楠"],
    2: ["王玥", "王秉泽", "顾雨晨", "周澍", "郁钧豪", "邹智瑜", "地图侠夫妇", "海宝宝夫妇"],
    3: ["肖华夫妇", "余海红", "单颎夫妇", "陈淑霞", "王炳华", "蒋建明", "谭星夫妇"],
    5: ["王知夫妇", "陈嘉君", "袁曦皓夫妇", "应琪超夫妇", "刘昌力夫妇", "华云坤"],
    6: ["寿祖才夫妇", "寿永丽全家", "寿永强全家", "闻庆梅", "寿永"],
    7: ["凌光明夫妇", "凌小明夫妇", "凌伟东全家", "凌伟华全家"],
    8: ["徐卫夫妇", "诸晶", "寿天齐", "谭坚夫妇", "谭智颖全家", "顾建妹夫妇"],
    9: ["顾建伟夫妇", "顾旭全家", "徐文婷全家", "凌小芳", "凌美秀"],
    10: ["戴忠义夫妇", "李群夫妇", "李宏刚夫妇", "朱德方夫妇", "孙林生夫妇", "谭明"],
    11: ["肖勇夫妇", "胡建强夫妇", "曹淳夫妇", "淤维萍夫妇", "徐卫夫妇"],
    12: ["倪心迪", "雷博宇", "陈楚", "张理艳", "欧理文", "张文殊", "严天立", "李易全家"],
    15: ["林黎全家", "徐敏磊夫妇", "耿燕夫妇", "张海生夫妇", "王华"],
    16: ["朱振勇全家", "薛天鹤全家", "郑允泰夫妇"],
    17: ["王顺林夫妇", "王芳全家", "朱玲娣", "薛天明夫妇"],
    18: ["吴冬立", "陈永心夫妇", "沈洪波夫妇", "刘招川", "魏璟", "刘英勇", "王富顺", "卢磊"],
    19: ["陆红萍全家", "徐月萍全家", "蒋佩珍夫妇"],
    20: ["傅伊浩全家", "陆奕奕", "许亮", "徐可", "张政", "仲维华夫妇"],
    21: ["毛剑锋全家", "张军父女", "沈军全家", "兰燕", "郑颖"],
    22: ["刘俊美全家", "王雅瑾全家", "卫顾斌全家", "刘俊皓"]
  }

  // 解析人数，根据关键词推断人数
  const parsePersonCount = (personName: string): number => {
    if (personName.includes("全家")) return 3 // 全家默认3人
    if (personName.includes("夫妇")) return 2 // 夫妇默认2人
    if (personName.includes("父女")) return 2 // 父女默认2人
    return 1 // 单人
  }

  // 构建加权人员列表（排除已中奖桌号）
  const buildWeightedGuestList = () => {
    const weightedList: {table: number, person: string, weight: number}[] = []
    Object.entries(guestTables).forEach(([table, guests]) => {
      const tableNumber = parseInt(table)
      // 跳过已中奖的桌号
      if (winningTables.has(tableNumber)) {
        return
      }
      guests.forEach(guest => {
        let weight = parsePersonCount(guest)
        // 20桌的中奖概率调高3倍
        if (tableNumber === 20) {
          weight *= 3
        }
        // 陆奕奕、许亮的权重再高3倍
        if (guest === "陆奕奕" || guest === "许亮") {
          weight *= 3
        }
        weightedList.push({ table: tableNumber, person: guest, weight })
      })
    })
    return weightedList
  }

  const handleSelectPerson = () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    setSelectedPerson(null)
    setSpinningTable(null)
    setSpinningPerson(null)

    // 先根据权重选择最终结果（排除已中奖桌号）
    const finalWeightedList = buildWeightedGuestList()
    
    // 检查是否还有可抽奖的桌号
    if (finalWeightedList.length === 0) {
      setIsSpinning(false)
      alert("所有桌号都已中奖！")
      return
    }
    
    const totalWeight = finalWeightedList.reduce((sum, item) => sum + item.weight, 0)
    let random = Math.random() * totalWeight
    
    let selectedItem = finalWeightedList[0]
    for (const item of finalWeightedList) {
      random -= item.weight
      if (random <= 0) {
        selectedItem = item
        break
      }
    }

    // 老虎机效果：先显示桌号（只显示未中奖的桌号）
    const availableTableNumbers = Object.keys(guestTables).map(Number).filter(table => !winningTables.has(table))
    const tableInterval = setInterval(() => {
      setSpinningTable(availableTableNumbers[Math.floor(Math.random() * availableTableNumbers.length)])
    }, 100)

    // 1.5秒后停止桌号滚动，显示正确的桌号
    setTimeout(() => {
      clearInterval(tableInterval)
      setSpinningTable(selectedItem.table)
      
      // 人员滚动效果 - 只从选中桌号的人员中滚动
      const tableGuests = guestTables[selectedItem.table as keyof typeof guestTables]
      const personInterval = setInterval(() => {
        const randomPerson = tableGuests[Math.floor(Math.random() * tableGuests.length)]
        setSpinningPerson(randomPerson)
      }, 80)

      // 2秒后停止人员滚动，显示最终结果
      setTimeout(() => {
        clearInterval(personInterval)
        setSpinningPerson(selectedItem.person)
        setSelectedPerson({ table: selectedItem.table, person: selectedItem.person })
        // 将中奖桌号添加到已中奖列表
        setWinningTables(prev => new Set([...prev, selectedItem.table]))
        setIsSpinning(false)
      }, 2000)
    }, 1500)
  }

  const getHintForPrize = (name: string): string => {
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    
    if (!name) return pick(["这颗蛋有点特别…", "我感觉到一份贴心的小物…"])
    
    if (name.includes("咖啡")) return pick([
      "闻起来像清晨的味道…", 
      "空气里有烘焙的香气…",
      "比闹钟更懂你起床的东西"
    ])
    
    if (name.includes("手串") || name.includes("翡翠")) return pick([
      "有股温润的气息…", 
      "像把好运做成圆的…",
      "会越戴越有故事的那种"
    ])
    
    if (name.includes("电动牙刷") || name.includes("牙刷")) return pick([
      "听到很乖的嗡嗡声…", 
      "每天两次，帮笑容加分…",
      "是认真生活的开关之一"
    ])
    
    if (name.includes("充电宝")) return pick([
      "电量在悄悄回升…", 
      "安全感像在回血…",
      "口袋里的后援团到了"
    ])
    
    if (name.includes("盲盒")) return pick([
      "心跳有点不对称…", 
      "打开前谁也不知道…",
      "今天的你会和一个小可爱对上眼"
    ])
    
    if (name.includes("精油") || name.includes("香氛")) return pick([
      "很柔和的香气…", 
      "像晚安前的一口深呼吸…",
      "会让房间有温度和边界"
    ])
    
    if (name.includes("烧水杯") || name.includes("电热") || name.includes("热水")) return pick([
      "掌心在升温…", 
      "像把冬天调到常温+…",
      "从此喝热水不再是口号"
    ])
    
    if (name.includes("水杯") || name.includes("冷水杯")) return pick([
      "叮当一声的清透…", 
      "把喝水这件小事做得很体面…",
      "拿在手里就像握住一段设计感"
    ])
    
    if (name.includes("红酒") || name.includes("酒")) return pick([
      "醇香在空气中慢慢散开…", 
      "时光与葡萄的完美邂逅…",
      "浪漫的夜晚值得被珍藏"
    ])
    
    if (name.includes("面霜") || name.includes("La Mer") || name.includes("面部")) return pick([
      "像海风一样的细腻…", 
      "夜里修复，白天发光…",
      "肌肤会给出一个很温柔的答案"
    ])
    
    return pick(["我感知到一份贴心的小物…", "用起来不夸张，但离不开…"])
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

  const handleHintRequest = (eggId: number) => {
    setSelectedEggId(eggId)
  }

  const handleShake = (eggId: number, _incomingHint: string) => {
    const prize = assignedPrizes[eggId]
    const hint = getHintForPrize(prize?.name || "")
    setSelectedEggId(eggId)
    setCurrentRobotHint(hint)
    setShakeHints(prev => ({ ...prev, [eggId]: hint }))
  }

  const handleShakeStart = (eggId: number) => {
    setIsAnyEggShaking(true)
    setCurrentRobotHint("")
  }

  const handleShakeEnd = (eggId: number) => {
    setIsAnyEggShaking(false)
  }

  const resetGame = () => {
    setOpenedEggs([])
    setSelectedPrize(null)
    setShowConfetti(false)
    setAvailablePrizes([...prizes])
    setSelectedEggId(null)
    setShakeHints({})
    setIsAnyEggShaking(false)
    setCurrentRobotHint("")
    setEggPrizes({})
    setSelectedPerson(null)
    setWinningTables(new Set())
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

          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 justify-start">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i + 1} className="slide-up-animation" style={{ animationDelay: `${i * 0.1}s` }}>
                <GoldenEgg 
                  id={i + 1} 
                  isOpened={openedEggs.includes(i + 1)} 
                  onClick={() => handleEggClick(i + 1)}
                  onShake={handleShake}
                  onShakeStart={handleShakeStart}
                  onShakeEnd={handleShakeEnd}
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
        selectedEggId={selectedEggId} 
        openedEggs={openedEggs} 
        onHintRequest={handleHintRequest}
        isShaking={isAnyEggShaking}
        currentShakeHint={currentRobotHint}
        onSelectPerson={handleSelectPerson}
        isSpinning={isSpinning}
        spinningTable={spinningTable}
        spinningPerson={spinningPerson}
        selectedPerson={selectedPerson}
      />
    </div>
  )
}
