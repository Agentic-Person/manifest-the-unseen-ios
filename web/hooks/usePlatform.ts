'use client'

import { usePathname } from 'next/navigation'
import {
  Platform,
  Product,
  ProductRouteConfig,
  getProductFromPath,
  getProductConfigFromPath,
  getPlatformFromPath,
} from '@/types/platform'

export interface UsePlatformReturn {
  /**
   * Current platform: 'ios' for /companion/*, 'web' for /app/*
   */
  platform: Platform | null

  /**
   * Current product: 'companion' or 'app'
   */
  product: Product | null

  /**
   * Full product configuration including features
   */
  config: ProductRouteConfig | null

  /**
   * Whether the current route is an iOS companion route
   */
  isCompanion: boolean

  /**
   * Whether the current route is a full web app route
   */
  isWebApp: boolean
}

/**
 * Hook to get current platform from route.
 *
 * Returns 'ios' for /companion/*, 'web' for /app/*
 *
 * @example
 * ```tsx
 * const { platform, product, isCompanion, isWebApp } = usePlatform()
 *
 * if (isCompanion) {
 *   // Show iOS companion-specific UI
 * }
 *
 * if (isWebApp) {
 *   // Show full web app UI with all features
 * }
 * ```
 */
export function usePlatform(): UsePlatformReturn {
  const pathname = usePathname()

  const product = getProductFromPath(pathname)
  const config = getProductConfigFromPath(pathname)
  const platform = getPlatformFromPath(pathname)

  return {
    platform,
    product,
    config,
    isCompanion: product === 'companion',
    isWebApp: product === 'app',
  }
}
