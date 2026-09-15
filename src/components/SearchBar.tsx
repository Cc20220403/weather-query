/**
 * 城市搜索栏组件
 * 支持输入搜索 + 候选城市下拉选择
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import type { GeoSearchResult } from '../api/types'

interface SearchBarProps {
  suggestions: GeoSearchResult[]
  loading: boolean
  onSearch: (query: string) => void
  onSelectCity: (city: GeoSearchResult) => void
}

export default function SearchBar({ suggestions, loading, onSearch, onSelectCity }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // 输入防抖
  const handleChange = useCallback((value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!value.trim()) {
      setShowDropdown(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      onSearch(value)
      setShowDropdown(true)
    }, 300)
  }, [onSearch])

  // 选择城市
  const handleSelect = (city: GeoSearchResult) => {
    setQuery(city.name)
    setShowDropdown(false)
    onSelectCity(city)
  }

  // 提交搜索（回车）
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (suggestions.length > 0) {
      handleSelect(suggestions[0])
    }
  }

  // 点击外部关闭下拉
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setShowDropdown(true) }}
            placeholder="输入城市名称，如：北京、Shanghai"
            className="w-full px-4 py-3 pl-10 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          />
          {/* 搜索图标 */}
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          搜索
        </button>
      </div>

      {/* 候选城市下拉列表 */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden"
        >
          {suggestions.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => handleSelect(city)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-medium text-gray-800">{city.name}</span>
                <span className="ml-2 text-sm text-gray-400">
                  {city.admin1 && `${city.admin1}, `}{city.country}
                </span>
              </div>
              {city.population && (
                <span className="text-xs text-gray-300 bg-gray-100 px-2 py-0.5 rounded">
                  {city.population.toLocaleString()} 人
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
