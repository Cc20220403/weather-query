/** 天气相关工具函数 */

/** WMO 天气代码 -> 中文天气名称 */
export function getWeatherText(code: number, isDay = true): string {
  if (code === 0) return '晴'
  if (code === 1) return isDay ? '大部晴朗' : '大部晴朗'
  if (code === 2) return isDay ? '多云' : '多云'
  if (code === 3) return '阴'
  if (code === 45 || code === 48) return '雾'
  if (code === 51) return '小毛毛雨'
  if (code === 53) return '中毛毛雨'
  if (code === 55) return '密毛毛雨'
  if (code === 56 || code === 57) return '冻毛毛雨'
  if (code === 61) return '小雨'
  if (code === 63) return '中雨'
  if (code === 65) return '大雨'
  if (code === 66 || code === 67) return '冻雨'
  if (code === 71) return '小雪'
  if (code === 73) return '中雪'
  if (code === 75) return '大雪'
  if (code === 77) return '雪粒'
  if (code === 80) return '小阵雨'
  if (code === 81) return '中阵雨'
  if (code === 82) return '大阵雨'
  if (code === 85) return '小阵雪'
  if (code === 86) return '大阵雪'
  if (code === 95) return '雷暴'
  if (code === 96 || code === 99) return '雷暴伴冰雹'
  return '未知'
}

/** WMO 天气代码 -> 天气 emoji */
export function getWeatherEmoji(code: number, isDay = true): string {
  if (code === 0) return isDay ? '☀️' : '🌙'
  if (code === 1) return isDay ? '🌤️' : '🌙'
  if (code === 2) return '⛅'
  if (code === 3) return '☁️'
  if (code === 45 || code === 48) return '🌫️'
  if (code >= 51 && code <= 57) return '🌦️'
  if (code >= 61 && code <= 67) return '🌧️'
  if (code >= 71 && code <= 77) return '🌨️'
  if (code >= 80 && code <= 82) return '🌧️'
  if (code >= 85 && code <= 86) return '🌨️'
  if (code >= 95) return '⛈️'
  return '🌡️'
}

/** 风向角度 -> 中文风向 */
export function getWindDirection(degree: number): string {
  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']
  const index = Math.round(degree / 45) % 8
  return `${directions[index]}风`
}

/** 风速 (km/h) -> 风力等级（蒲福风级） */
export function getWindScale(speed: number): string {
  if (speed < 1) return '0'
  if (speed < 6) return '1'
  if (speed < 12) return '2'
  if (speed < 20) return '3'
  if (speed < 29) return '4'
  if (speed < 39) return '5'
  if (speed < 50) return '6'
  if (speed < 62) return '7'
  if (speed < 75) return '8'
  if (speed < 89) return '9'
  if (speed < 103) return '10'
  if (speed < 118) return '11'
  return '12'
}

/** 格式化日期为中文显示 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dateOnly = new Date(date)
  dateOnly.setHours(0, 0, 0, 0)

  if (dateOnly.getTime() === today.getTime()) return '今天'
  if (dateOnly.getTime() === tomorrow.getTime()) return '明天'

  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = weekdays[date.getDay()]

  return `${month}月${day}日 ${weekday}`
}

/** 格式化时间为 HH:mm */
export function formatTime(timeStr: string): string {
  if (!timeStr || timeStr.length < 16) return timeStr
  return timeStr.slice(11, 16)
}
