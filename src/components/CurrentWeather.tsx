/**
 * 当前天气展示组件
 * 大字号温度 + 天气状况 + 详细指标网格
 */

import type { CurrentWeatherInfo, City } from '../types/weather'
import { getWeatherEmoji, formatTime } from '../utils/weather'

interface CurrentWeatherProps {
  city: City
  current: CurrentWeatherInfo
  isFavorite: boolean
  onToggleFavorite: () => void
}

export default function CurrentWeather({ city, current, isFavorite, onToggleFavorite }: CurrentWeatherProps) {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8">
      {/* 城市名 + 收藏按钮 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{city.name}</h2>
          <p className="text-sm text-gray-500">{city.adm1}{city.adm1 ? ', ' : ''}{city.country}</p>
        </div>
        <button
          onClick={onToggleFavorite}
          className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${isFavorite ? 'animate-pulse' : ''}`}
          title={isFavorite ? '取消收藏' : '添加收藏'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* 温度 + 天气图标 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-6xl">{getWeatherEmoji(current.weatherCode, current.isDay)}</span>
          <div>
            <div className="text-5xl font-light text-gray-800">
              {Math.round(current.temp)}°
            </div>
            <div className="text-gray-500 mt-1">
              体感 {Math.round(current.feelsLike)}°
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-medium text-gray-700">{current.text}</p>
          <p className="text-xs text-gray-400 mt-1">
            更新于 {formatTime(current.updateTime)}
          </p>
        </div>
      </div>

      {/* 详细指标网格 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DetailCard label="湿度" value={`${current.humidity}%`} icon="💧" />
        <DetailCard label="风速" value={`${current.windSpeed} km/h`} icon="💨" />
        <DetailCard label="风向" value={current.windDir} icon="🧭" />
        <DetailCard label="气压" value={`${Math.round(current.pressure)} hPa`} icon="📊" />
        <DetailCard label="能见度" value={current.vis > 0 ? `${current.vis} km` : '—'} icon="👁️" />
        <DetailCard label="降水量" value={`${current.precip} mm`} icon="🌧️" />
        <DetailCard label="风力" value={`${current.windScale} 级`} icon="🌬️" />
        <DetailCard label="坐标" value={`${city.lat.toFixed(1)}°, ${city.lon.toFixed(1)}°`} icon="📍" />
      </div>
    </div>
  )
}

/** 单个指标卡片 */
function DetailCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white/60 rounded-xl p-3 text-center">
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      <div className="text-sm font-medium text-gray-700 truncate">{value}</div>
    </div>
  )
}
