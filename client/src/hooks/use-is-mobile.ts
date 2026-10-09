import { useMediaQuery } from '@/hooks/use-media-query'
import { SIDEBAR_MOBILE_MEDIA_QUERY } from '@/constants/sidebar'

export const useIsMobile = (): boolean => useMediaQuery(SIDEBAR_MOBILE_MEDIA_QUERY)
