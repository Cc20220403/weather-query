/** 加载动画组件 */

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        {/* 外圈旋转 */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
        {/* 内圈脉冲 */}
        <div className="absolute inset-3 rounded-full bg-blue-100 animate-pulse" />
      </div>
      <p className="mt-4 text-blue-600 text-sm font-medium animate-pulse">
        正在查询天气...
      </p>
    </div>
  )
}
