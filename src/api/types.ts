/** Open-Meteo API 响应类型定义 */

/** 城市搜索（Geocoding API）响应项 */
export interface GeoSearchResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string      // 省/州
  admin2?: string      // 市
  /** 位置类型，如 "city", "administrative" */
  feature_code?: string
  /** 人口 */
  population?: number
  /** 时区 */
  timezone?: string
}

/** 城市搜索 API 响应 */
export interface GeoSearchResponse {
  results?: GeoSearchResult[]
}

/** Open-Meteo 当前天气数据 */
export interface OpenMeteoCurrent {
  time: string                    // 观测时间 ISO 8601
  temperature_2m: number          // 温度 
  relative_humidity_2m: number    // 相对湿度 %
  apparent_temperature: number    // 体感温度 ℃
  weather_code: number            // WMO 天气代码
  wind_speed_10m: number          // 风速 km/h
  wind_direction_10m: number      // 风向角度
  surface_pressure: number        // 大气压强 hPa
  visibility?: number             // 能见度 m（部分区域支持）
  precipitation: number           // 降水量 mm
  is_day?: number                 // 是否白天 1=是 0=否
}

/** Open-Meteo 每日预报数据 */
export interface OpenMeteoDaily {
  time: string[]                  // 日期数组 YYYY-MM-DD
  weather_code: number[]          // WMO 天气代码数组
  temperature_2m_max: number[]    // 最高温度数组
  temperature_2m_min: number[]    // 最低温度数组
  precipitation_sum: number[]     // 降水量数组
  wind_speed_10m_max: number[]    // 最大风速数组
  uv_index_max: number[]          // 最大紫外线指数数组
  sunrise?: string[]              // 日出时间
  sunset?: string[]               // 日落时间
}

/** Open-Meteo 预报 API 完整响应 */
export interface OpenMeteoForecastResponse {
  latitude: number
  longitude: number
  timezone: string
  current: OpenMeteoCurrent
  daily: OpenMeteoDaily
}
