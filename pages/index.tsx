import type { NextPage } from 'next'
import Loading from '@/components/loading'
import { useRouter } from 'next/router'
import qs from 'qs'
import { useEffect } from 'react'
import type { Liff } from "@line/liff";
import axios from 'axios'

type UnPromise<T> = T extends Promise<infer X> ? X : T;

const Index: NextPage<{ position: { longitude: number; latitude: number } | null; data: any; liff: Liff | null }> = ({
  position, liff
}) => {
  const router = useRouter()
  const queryString = qs.stringify({
    latitude: position?.latitude,
    longitude: position?.longitude
  })
  
  const getLiff = (Login) => {
    if (!Login){
      liff.login()
    }
    
    liff.ready.then(async () => {
      const liffprofile: UnPromise<ReturnType<typeof liff.getProfile>> = await liff.getProfile();
      sessionStorage.setItem("userId", liffprofile.userId)
      sessionStorage.setItem("userName", liffprofile.displayName)
      // FlareLane.setUserId(liffprofile.userId);
      // FlareLane.setTags({platform:"line",UserName:liffprofile.displayName})

      liffprofile.pictureUrl ? sessionStorage.setItem("PictureUrl", liffprofile.pictureUrl) : sessionStorage.setItem("PictureUrl", "")
      await axios
        .get(`https://www.fastfood.p-e.kr/find_User_Data?User_ID=${encodeURIComponent(liffprofile.userId)}`, {//http://127.0.0.1/service
        }).then((res) => {
          if (res.data >= 0){
            sessionStorage.setItem("User_Point", `${res.data}`)
            sessionStorage.setItem("On_User", 'On')
            sessionStorage.setItem("ReCount", 'Y')

          }
          else {
            sessionStorage.setItem("User_Point", `0`)
            sessionStorage.setItem("On_User", 'Off')
          }
        })
    })
  }

  useEffect(() => {
    // alert("index");
    // if (position) {
      if (liff !== null) {
        
        if (liff.isInClient() && liff.isLoggedIn()) {
          router.replace(`/home?${queryString}`, '/')
        }
        else if (!liff.isLoggedIn()){
          getLiff(liff.login())
        }
      }
    // }
  }, [router,liff])
  if (!liff) return <Loading message="กรุณาอนุญาตให้ใช้ตำแหน่ง gps" />
}
export default Index
