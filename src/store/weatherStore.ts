/**
 * Zustand 全局状态管理
 * 管理当前城市、天气数据、收藏列表的共享状态
 */

import { create } from 'zustand'
import type { City } from '../types/weather'

interface WeatherState {
  /** 当前查询的城市 */
  currentCity: City | null
  /** 设置当前城市 */
  setCurrentCity: (city: City) => void
  /** 清除当前城市 */
  clearCurrentCity: () => void
}

export const useWeatherStore = create<WeatherState>((set) => ({
  currentCity: null,

  setCurrentCity: (city) => set({ currentCity: city }),

  clearCurrentCity: () => set({ currentCity: null }),
}))
