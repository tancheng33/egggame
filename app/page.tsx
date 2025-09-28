"use client"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-8">🎉 婚礼金蛋游戏 🎉</h1>
        <p className="text-xl text-gray-600 mb-8">点击金蛋，开启惊喜之旅</p>
        
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i + 1}
              className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold cursor-pointer hover:scale-110 transition-transform"
            >
              {i + 1}
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 mt-8">
          简化版本 - 测试部署
        </p>
      </div>
    </div>
  )
}