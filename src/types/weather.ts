/** 天气相关业务类型定义 */

/** 城市信息（从 API 搜索结果转换） */
export interface City {
  id: string
  name: string
  adm1: string    // 省/州
  country: string
  lat: number
  lon: number
}

/** 当前天气信息（展示用） */
export interface CurrentWeatherInfo {
  temp: number
  feelsLike: number
  text: string
  weatherCode: number    // WMO 天气代码
  windDir: string
  windScale: string
  windSpeed: number
  humidity: number
  pressure: number
  vis: number
  precip: number
  updateTime: string
  isDay: boolean
}

/** 单日预报信息（展示用） */
export interface ForecastDayInfo {
  date: string
  tempMax: number
  tempMin: number
  textDay: string
  textNight: string
  weatherCodeDay: number
  weatherCodeNight: number
  humidity: number
  windSpeed: number
  uvIndex: number
  sunrise: string
  sunset: string
}

/** 天气查询结果（聚合当前天气 + 预报） */
export interface WeatherResult {
  city: City
  current: CurrentWeatherInfo
  forecast: ForecastDayInfo[]
}

/** 天气查询错误类型 */
export type WeatherErrorType =
  | 'CITY_NOT_FOUND'      // 城市未找到
  | 'NETWORK_ERROR'       // 网络错误
  | 'TIMEOUT'             // 请求超时
  | 'UNKNOWN'             // 未知错误

/** 天气查询错误 */
export class WeatherError extends Error {
  type: WeatherErrorType

  constructor(message: string, type: WeatherErrorType) {
    super(message)
    this.name = 'WeatherError'
    this.type = type
  }
}
