"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Gift, Sparkles, Heart } from "lucide-react"

interface Prize {
  id: number
  name: string
  price: string
  description: string
}

interface PrizeModalProps {
  prize: Prize | null
  isOpen: boolean
  onClose: () => void
}

export function PrizeModal({ prize, isOpen, onClose }: PrizeModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen || !prize) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <Card className="relative z-10 w-full max-w-lg shadow-2xl border-0 bg-card/95 backdrop-blur-xl overflow-hidden animate-fade-in">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="absolute top-0 left-0 w-full h-1 gradient-primary" />

        <CardHeader className="relative text-center pb-6 pt-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
            <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 gradient-primary rounded-full animate-pulse" />
                <div className="relative w-full h-full bg-card rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <Gift className="w-10 h-10 text-primary" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-bounce" />
              </div>

              <CardTitle className="text-3xl font-bold text-gradient mb-3 leading-tight">🎉 恭喜获得奖品！</CardTitle>
              <p className="text-muted-foreground text-lg">您的幸运时刻到了</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full w-10 h-10 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="relative text-center space-y-6 pb-8">
          <div className="relative p-8 bg-gradient-to-br from-card to-muted/50 rounded-2xl border border-border/50 shadow-inner">
            <div className="absolute top-4 right-4">
              <Heart className="w-5 h-5 text-secondary/60" />
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-3 leading-tight">{prize.name}</h3>

            {/* 去掉价格与等级显示 */}

            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">{prize.description}</p>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              onClick={onClose}
              size="lg"
              className="px-8 h-12 text-lg font-semibold gradient-primary hover:opacity-90 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              太棒了！
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
