/**
 * 收藏城市展示组件
 * 标签式展示已收藏城市，支持点击快速查询和删除
 */

import { getWeatherEmoji } from '../utils/weather'

interface FavoriteCityItem {
  id: string
  name: string
  adm1: string
  country: string
  lat: number
  lon: number
}

interface FavoriteCitiesProps {
  favorites: FavoriteCityItem[]
  onSelect: (city: FavoriteCityItem) => void
  onRemove: (cityId: string) => void
}

export default function FavoriteCities({ favorites, onSelect, onRemove }: FavoriteCitiesProps) {
  if (favorites.length === 0) return null

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>⭐</span> 收藏城市
      </h3>
      <div className="flex flex-wrap gap-3">
        {favorites.map((city) => (
          <div
            key={city.id}
            className="group relative flex items-center bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl px-4 py-2.5 hover:shadow-md transition-all cursor-pointer border border-blue-100 hover:border-blue-200"
            onClick={() => onSelect(city)}
          >
            <span className="mr-1.5 text-lg">{getWeatherEmoji(0, true)}</span>
            <span className="font-medium text-gray-700 text-sm">{city.name}</span>
            <span className="ml-1 text-xs text-gray-400">{city.adm1}</span>

            {/* 删除按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove(city.id)
              }}
              className="ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-100 text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 cursor-pointer"
              title="取消收藏"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
