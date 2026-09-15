/**
 * Open-Meteo API 请求模块
 * 文档：https://open-meteo.com/en/docs
 * 完全免费，无需 API Key
 */

import type {
  GeoSearchResponse,
  OpenMeteoForecastResponse,
} from './types'
import { WeatherError } from '../types/weather'

const GEO_BASE_URL = 'https://geocoding-api.open-meteo.com'
const WEATHER_BASE_URL = 'https://api.open-meteo.com'
const REQUEST_TIMEOUT = 10000 // 10 秒超时

/** 通用请求函数 */
async function request<T>(url: string): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new WeatherError(
        '网络连接失败，请检查网络后重试',
        'NETWORK_ERROR',
      )
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    if (error instanceof WeatherError) {
      throw error
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new WeatherError('请求超时，请稍后重试', 'TIMEOUT')
    }
    throw new WeatherError('网络连接失败，请检查网络后重试', 'NETWORK_ERROR')
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * 城市搜索（Geocoding API）
 * @param cityName 城市名称（支持中文、英文）
 * @param count 返回结果数量
 */
export async function searchCity(
  cityName: string,
  count = 5,
): Promise<GeoSearchResponse> {
  const encodedName = encodeURIComponent(cityName)
  return request<GeoSearchResponse>(
    `${GEO_BASE_URL}/v1/search?name=${encodedName}&count=${count}&language=zh&format=json`,
  )
}

/**
 * 查询天气（当前 + 预报）
 * Open-Meteo 将当前天气和预报合并在一个接口中
 * @param lat 纬度
 * @param lon 经度
 * @param forecastDays 预报天数
 */
export async function fetchWeather(
  lat: number,
  lon: number,
  forecastDays = 3,
): Promise<OpenMeteoForecastResponse> {
  // 当前天气变量
  const currentVars = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'weather_code',
    'wind_speed_10m',
    'wind_direction_10m',
    'surface_pressure',
    'precipitation',
    'is_day',
  ].join(',')

  // 每日预报变量
  const dailyVars = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_sum',
    'wind_speed_10m_max',
    'uv_index_max',
    'sunrise',
    'sunset',
  ].join(',')

  const url = `${WEATHER_BASE_URL}/v1/forecast` +
    `?latitude=${lat}` +
    `&longitude=${lon}` +
    `&current=${currentVars}` +
    `&daily=${dailyVars}` +
    `&timezone=auto` +
    `&forecast_days=${forecastDays}`

  return request<OpenMeteoForecastResponse>(url)
}
