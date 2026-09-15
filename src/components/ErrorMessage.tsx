/** 错误提示组件 */

import type { WeatherError } from '../types/weather'

interface ErrorMessageProps {
  error: WeatherError
  onRetry?: () => void
}

/** 根据错误类型返回图标 */
function getErrorIcon(type: WeatherError['type']): string {
  switch (type) {
    case 'CITY_NOT_FOUND': return '🔍'
    case 'NETWORK_ERROR': return '📡'
    case 'TIMEOUT': return '⏱️'
    case 'UNKNOWN': return '️'
  }
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-5xl mb-4">
        {getErrorIcon(error.type)}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        查询失败
      </h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">
        {error.message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
        >
          重试
        </button>
      )}
    </div>
  )
}
