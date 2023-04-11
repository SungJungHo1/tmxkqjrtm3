import type { NextPage } from 'next'
import Loading from '@/components/loading'
import { useRouter } from 'next/router'
import qs from 'qs'
import { useEffect } from 'react'
import type { Liff } from "@line/liff";

const Index: NextPage<{ position: { longitude: number; latitude: number } | null; data: any; liff: Liff | null }> = ({
  position, liff
}) => {
  const router = useRouter()
  const queryString = qs.stringify({
    latitude: position?.latitude,
    longitude: position?.longitude
  })
  
  useEffect(() => {
    // alert("index");
    // if (position) {
      if (liff !== null) {
        // if (liff.isInClient() && liff.isLoggedIn()) {
          router.replace(`/home?${queryString}`, '/')
        // }
      }
    // }
  }, [queryString, router,liff])
  if (!liff) return <Loading message="กรุณาอนุญาตให้ใช้ตำแหน่ง gps" />
}
export default Index
