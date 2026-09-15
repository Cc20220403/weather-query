import type { GeoSearchResult } from './api/types'
import { useWeather } from './hooks/useWeather'
import { useFavorites } from './hooks/useFavorites'
import { useWeatherStore } from './store/weatherStore'
import SearchBar from './components/SearchBar'
import CurrentWeather from './components/CurrentWeather'
import WeatherForecast from './components/WeatherForecast'
import FavoriteCities from './components/FavoriteCities'
import LocationButton from './components/LocationButton'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'

function App() {
  const {
    result,
    loading,
    error,
    citySuggestions,
    searchSuggestions,
    searchCity,
    loadByCoords,
  } = useWeather()

  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites()
  const { setCurrentCity } = useWeatherStore()

  /** 处理城市选择（来自搜索） */
  const handleSelectCity = (city: GeoSearchResult) => {
    setCurrentCity({
      id: String(city.id),
      name: city.name,
      adm1: city.admin1 ?? '',
      country: city.country ?? '',
      lat: city.latitude,
      lon: city.longitude,
    })
    searchCity(city)
  }

  /** 处理收藏城市点击 */
  const handleSelectFavorite = (city: { id: string; name: string; adm1: string; country: string; lat: number; lon: number }) => {
    setCurrentCity({
      id: city.id,
      name: city.name,
      adm1: city.adm1,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    })
    // 构造 GeoSearchResult 格式
    searchCity({
      id: Number(city.id),
      name: city.name,
      latitude: city.lat,
      longitude: city.lon,
      country: city.country,
      admin1: city.adm1,
    })
  }

  /** 处理定位 */
  const handleLocate = (lat: number, lon: number) => {
    loadByCoords(lat, lon)
  }

  /** 处理收藏切换 */
  const handleToggleFavorite = () => {
    if (result) {
      toggleFavorite(result.city)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      {/* 顶部标题栏 */}
      <header className="pt-8 pb-4 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          ️ 天气查询
        </h1>
        <p className="text-gray-500 text-sm mt-1">输入城市名称或使用定位功能查询天气</p>
      </header>

      {/* 搜索区域 */}
      <div className="px-4 mb-6">
        <div className="max-w-2xl mx-auto flex items-start gap-3">
          <div className="flex-1">
            <SearchBar
              suggestions={citySuggestions}
              loading={loading}
              onSearch={searchSuggestions}
              onSelectCity={handleSelectCity}
            />
          </div>
          <LocationButton loading={loading} onLocate={handleLocate} />
        </div>
      </div>

      {/* 主内容区域 */}
      <main className="max-w-2xl mx-auto px-4 pb-12 space-y-6">
        {/* 加载状态 */}
        {loading && <LoadingSpinner />}

        {/* 错误状态 */}
        {error && !loading && (
          <ErrorMessage
            error={error}
            onRetry={() => {
              if (result) {
                searchCity({
                  id: Number(result.city.id),
                  name: result.city.name,
                  latitude: result.city.lat,
                  longitude: result.city.lon,
                  country: result.city.country,
                  admin1: result.city.adm1,
                })
              }
            }}
          />
        )}

        {/* 当前天气 */}
        {result && !loading && (
          <CurrentWeather
            city={result.city}
            current={result.current}
            isFavorite={isFavorite(result.city.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* 天气预报 */}
        {result && !loading && result.forecast.length > 0 && (
          <WeatherForecast forecast={result.forecast} />
        )}

        {/* 收藏城市 */}
        <FavoriteCities
          favorites={favorites}
          onSelect={handleSelectFavorite}
          onRemove={removeFavorite}
        />

        {/* 空状态提示 */}
        {!result && !loading && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-gray-400 text-lg">搜索一个城市开始查询天气</p>
            <p className="text-gray-300 text-sm mt-2">或点击定位按钮获取当前位置天气</p>
          </div>
        )}
      </main>

      {/* 底部信息 */}
      <footer className="text-center pb-6 text-xs text-gray-400">
        天气数据由 Open-Meteo 提供 · 完全免费 · 仅供学习使用
      </footer>
    </div>
  )
}

export default App
