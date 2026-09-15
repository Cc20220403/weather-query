/**
 * 天气预报组件
 * 横向卡片列表展示未来几天天气
 */

import type { ForecastDayInfo } from '../types/weather'
import { getWeatherEmoji, formatDate, formatTime } from '../utils/weather'

interface WeatherForecastProps {
  forecast: ForecastDayInfo[]
}

export default function WeatherForecast({ forecast }: WeatherForecastProps) {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>📅</span> 未来天气预报
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {forecast.map((day) => (
          <div
            key={day.date}
            className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
          >
            {/* 日期 */}
            <p className="text-sm font-semibold text-blue-600 mb-2">
              {formatDate(day.date)}
            </p>

            {/* 天气图标 */}
            <div className="text-3xl mb-2 flex justify-center gap-1">
              <span>{getWeatherEmoji(day.weatherCodeDay, true)}</span>
              <span className="text-xl opacity-60">{getWeatherEmoji(day.weatherCodeNight, false)}</span>
            </div>

            {/* 天气文字 */}
            <p className="text-sm text-gray-700 mb-2">
              {day.textDay} / {day.textNight}
            </p>

            {/* 温度范围 */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-lg font-bold text-red-500">{Math.round(day.tempMax)}°</span>
              <span className="text-gray-300">/</span>
              <span className="text-lg font-bold text-blue-500">{Math.round(day.tempMin)}°</span>
            </div>

            {/* 日出日落 + 详细指标 */}
            <div className="flex justify-between text-xs text-gray-500 border-t border-blue-100 pt-2">
              {day.sunrise && day.sunset ? (
                <span>🌅 {formatTime(day.sunrise)}-{formatTime(day.sunset)}</span>
              ) : (
                <span>💧 —</span>
              )}
              <span>💨 {day.windSpeed}km/h</span>
              <span>☀️ UV {day.uvIndex}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
