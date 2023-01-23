export const isWindow = () => typeof window !== 'undefined'

export const isGeoAvailable = () => isWindow() && 'geolocation' in navigator
