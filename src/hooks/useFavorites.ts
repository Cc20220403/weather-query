/**
 * 城市收藏 Hook
 * 管理收藏列表，持久化到 LocalStorage
 */

import { useState, useCallback } from 'react'
import { getItem, setItem } from '../utils/storage'
import type { City } from '../types/weather'

const FAVORITES_KEY = 'favorites'

/** 收藏的城市（简化存储，只存必要字段） */
interface FavoriteCity {
  id: string
  name: string
  adm1: string
  country: string
  lat: number
  lon: number
}

function loadFavorites(): FavoriteCity[] {
  return getItem<FavoriteCity[]>(FAVORITES_KEY, [])
}

function saveFavorites(favorites: FavoriteCity[]) {
  setItem(FAVORITES_KEY, favorites)
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(loadFavorites)

  const isFavorite = useCallback(
    (cityId: string) => favorites.some((f) => f.id === cityId),
    [favorites],
  )

  const addFavorite = useCallback((city: City) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === city.id)) return prev
      const next = [
        { id: city.id, name: city.name, adm1: city.adm1, country: city.country, lat: city.lat, lon: city.lon },
        ...prev,
      ]
      saveFavorites(next)
      return next
    })
  }, [])

  const removeFavorite = useCallback((cityId: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== cityId)
      saveFavorites(next)
      return next
    })
  }, [])

  const toggleFavorite = useCallback(
    (city: City) => {
      if (isFavorite(city.id)) {
        removeFavorite(city.id)
      } else {
        addFavorite(city)
      }
    },
    [isFavorite, addFavorite, removeFavorite],
  )

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite }
}
