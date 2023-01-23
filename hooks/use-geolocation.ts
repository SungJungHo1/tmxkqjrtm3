// todo: geolocation currentposition 조회 구현

import { useEffect, useState } from 'react'
import { isGeoAvailable } from '@/libs/sensor'

export const useGeolocation = () => {
  const [position, setPosition] = useState(null)

  useEffect(() => {
    if (isGeoAvailable) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition({ latitude: position.coords.latitude, longitude: position.coords.longitude })
      })
    }
  }, [])

  return [position, setPosition]
}
