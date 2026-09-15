/**
 * 自动定位按钮组件
 * 调用浏览器 Geolocation API 获取用户位置
 */

import { useState } from 'react'

interface LocationButtonProps {
  loading: boolean
  onLocate: (lat: number, lon: number) => void
}

export default function LocationButton({ loading, onLocate }: LocationButtonProps) {
  const [error, setError] = useState<string | null>(null)

  const handleLocate = () => {
    setError(null)

    if (!navigator.geolocation) {
      setError('您的浏览器不支持定位功能')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocate(position.coords.latitude, position.coords.longitude)
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('定位权限被拒绝，请在浏览器设置中允许定位')
            break
          case err.POSITION_UNAVAILABLE:
            setError('无法获取当前位置信息')
            break
          case err.TIMEOUT:
            setError('定位请求超时，请重试')
            break
          default:
            setError('定位失败，请手动搜索城市')
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 分钟缓存
      },
    )
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleLocate}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 transition-all cursor-pointer"
        title="使用当前定位"
      >
        <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-medium">定位</span>
      </button>
      {error && (
        <p className="text-xs text-red-500 text-center max-w-[200px]">{error}</p>
      )}
    </div>
  )
}
