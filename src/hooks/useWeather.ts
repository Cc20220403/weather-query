/**
 * 天气数据获取 Hook
 * 管理 loading / error / data 状态，处理竞态条件
 */

import { useState, useCallback, useRef } from 'react'
import { searchCity, fetchWeather } from '../api/weather'
import type { GeoSearchResult } from '../api/types'
import type { WeatherResult, CurrentWeatherInfo, ForecastDayInfo, City } from '../types/weather'
import { WeatherError } from '../types/weather'
import { getWeatherText, getWindDirection, getWindScale } from '../utils/weather'

interface UseWeatherState {
  result: WeatherResult | null
  loading: boolean
  error: WeatherError | null
  citySuggestions: GeoSearchResult[]
}

/** 将 GeoSearchResult 转换为 City */
function toCity(item: GeoSearchResult): City {
  return {
    id: String(item.id),
    name: item.name,
    adm1: item.admin1 ?? '',
    country: item.country ?? '',
    lat: item.latitude,
    lon: item.longitude,
  }
}

export function useWeather() {
  const [state, setState] = useState<UseWeatherState>({
    result: null,
    loading: false,
    error: null,
    citySuggestions: [],
  })

  // 用于取消上一次请求，避免竞态条件
  const abortRef = useRef(0)

  /** 搜索城市建议 */
  const searchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState((prev) => ({ ...prev, citySuggestions: [] }))
      return
    }

    try {
      const res = await searchCity(query.trim())
      setState((prev) => ({ ...prev, citySuggestions: res.results ?? [] }))
    } catch {
      setState((prev) => ({ ...prev, citySuggestions: [] }))
    }
  }, [])

  /** 根据城市查询完整天气（当前 + 预报） */
  const searchCity_weather = useCallback(async (cityItem: GeoSearchResult) => {
    const requestId = ++abortRef.current

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      citySuggestions: [],
    }))

    try {
      const city = toCity(cityItem)

      const weatherRes = await fetchWeather(city.lat, city.lon, 3)

      // 检查是否已被新请求取消
      if (requestId !== abortRef.current) return

      const current: CurrentWeatherInfo = {
        temp: weatherRes.current.temperature_2m,
        feelsLike: weatherRes.current.apparent_temperature,
        text: getWeatherText(weatherRes.current.weather_code, weatherRes.current.is_day === 1),
        weatherCode: weatherRes.current.weather_code,
        windDir: getWindDirection(weatherRes.current.wind_direction_10m),
        windScale: getWindScale(weatherRes.current.wind_speed_10m),
        windSpeed: weatherRes.current.wind_speed_10m,
        humidity: weatherRes.current.relative_humidity_2m,
        pressure: weatherRes.current.surface_pressure,
        vis: weatherRes.current.visibility ? weatherRes.current.visibility / 1000 : 0,
        precip: weatherRes.current.precipitation,
        updateTime: weatherRes.current.time,
        isDay: weatherRes.current.is_day === 1,
      }

      const forecast: ForecastDayInfo[] = weatherRes.daily.time.map((date, i) => ({
        date,
        tempMax: weatherRes.daily.temperature_2m_max[i],
        tempMin: weatherRes.daily.temperature_2m_min[i],
        textDay: getWeatherText(weatherRes.daily.weather_code[i], true),
        textNight: getWeatherText(weatherRes.daily.weather_code[i], false),
        weatherCodeDay: weatherRes.daily.weather_code[i],
        weatherCodeNight: weatherRes.daily.weather_code[i],
        humidity: 0, // Open-Meteo 预报不含逐日湿度
        windSpeed: weatherRes.daily.wind_speed_10m_max[i],
        uvIndex: weatherRes.daily.uv_index_max[i],
        sunrise: weatherRes.daily.sunrise?.[i] ?? '',
        sunset: weatherRes.daily.sunset?.[i] ?? '',
      }))

      const result: WeatherResult = { city, current, forecast }

      setState({
        result,
        loading: false,
        error: null,
        citySuggestions: [],
      })
    } catch (error) {
      if (requestId !== abortRef.current) return

      const weatherError = error instanceof WeatherError
        ? error
        : new WeatherError('未知错误', 'UNKNOWN')

      setState({
        result: null,
        loading: false,
        error: weatherError,
        citySuggestions: [],
      })
    }
  }, [])

  /** 根据经纬度查询天气（用于自动定位） */
  const loadByCoords = useCallback(async (lat: number, lon: number) => {
    const requestId = ++abortRef.current

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      citySuggestions: [],
    }))

    try {
      const weatherRes = await fetchWeather(lat, lon, 3)

      if (requestId !== abortRef.current) return

      // 通过反向地理编码获取城市名
      const geoRes = await searchCity(`${lat.toFixed(2)},${lon.toFixed(2)}`)
      const location = geoRes.results?.[0]

      const city: City = location
        ? toCity(location)
        : { id: 'loc', name: '当前位置', adm1: '', country: '', lat, lon }

      const current: CurrentWeatherInfo = {
        temp: weatherRes.current.temperature_2m,
        feelsLike: weatherRes.current.apparent_temperature,
        text: getWeatherText(weatherRes.current.weather_code, weatherRes.current.is_day === 1),
        weatherCode: weatherRes.current.weather_code,
        windDir: getWindDirection(weatherRes.current.wind_direction_10m),
        windScale: getWindScale(weatherRes.current.wind_speed_10m),
        windSpeed: weatherRes.current.wind_speed_10m,
        humidity: weatherRes.current.relative_humidity_2m,
        pressure: weatherRes.current.surface_pressure,
        vis: weatherRes.current.visibility ? weatherRes.current.visibility / 1000 : 0,
        precip: weatherRes.current.precipitation,
        updateTime: weatherRes.current.time,
        isDay: weatherRes.current.is_day === 1,
      }

      const forecast: ForecastDayInfo[] = weatherRes.daily.time.map((date, i) => ({
        date,
        tempMax: weatherRes.daily.temperature_2m_max[i],
        tempMin: weatherRes.daily.temperature_2m_min[i],
        textDay: getWeatherText(weatherRes.daily.weather_code[i], true),
        textNight: getWeatherText(weatherRes.daily.weather_code[i], false),
        weatherCodeDay: weatherRes.daily.weather_code[i],
        weatherCodeNight: weatherRes.daily.weather_code[i],
        humidity: 0,
        windSpeed: weatherRes.daily.wind_speed_10m_max[i],
        uvIndex: weatherRes.daily.uv_index_max[i],
        sunrise: weatherRes.daily.sunrise?.[i] ?? '',
        sunset: weatherRes.daily.sunset?.[i] ?? '',
      }))

      const result: WeatherResult = { city, current, forecast }

      setState({
        result,
        loading: false,
        error: null,
        citySuggestions: [],
      })
    } catch (error) {
      if (requestId !== abortRef.current) return

      const weatherError = error instanceof WeatherError
        ? error
        : new WeatherError('定位失败，请手动搜索城市', 'UNKNOWN')

      setState({
        result: null,
        loading: false,
        error: weatherError,
        citySuggestions: [],
      })
    }
  }, [])

  /** 清除当前天气数据 */
  const clearWeather = useCallback(() => {
    ++abortRef.current
    setState({
      result: null,
      loading: false,
      error: null,
      citySuggestions: [],
    })
  }, [])

  return {
    ...state,
    searchSuggestions,
    searchCity: searchCity_weather,
    loadByCoords,
    clearWeather,
  }
}
