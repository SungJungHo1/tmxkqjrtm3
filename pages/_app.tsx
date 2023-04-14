import { DefaultLayout } from '@/components/layout'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { SWRConfig } from 'swr'
import { useGeolocation } from '@/hooks/use-geolocation'
import '../styles/globals.css'
import { Router, useRouter } from 'next/router'
import Loading from '@/components/loading'
import { wrapper } from '@/app/state'
import "../public/static/fonts/style.css";
import type { Liff } from "@line/liff";
import axios from 'axios'
import { isMobile } from 'react-device-detect'

type UnPromise<T> = T extends Promise<infer X> ? X : T;

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter()
  const [position] = useGeolocation()
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   FlareLane.initialize({
  //     //projectId: '7b720341-b251-492b-bbc6-abbeb7442fb4',//fastfood
  //     projectId: '9b68457f-139b-4e0d-b2da-73261054c2cd',//test
  //     // 사용중인 별도 이름의 ServiceWorker가 있는 경우 해당 경로
  //     // serviceWorkerPath: '/otherServiceWorker.js'
  //   });
    
  // }, []);
  
  

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // alert("app");
    let liff_ID = "1657404178-vbEl737y"
    // to avoid `window is not defined` error
    async function liffLogin() {
      const liff = (await import('@line/liff')).default;
      try {
        await liff.init({ liffId: liff_ID }).then(() => {
          // console.log("LIFF init succeeded.");
          setLiffObject(liff);
        })
      } catch (err) {
        // alert(err.message);
      }
    }
    if (liffObject === null){
      liffLogin();  
    }
    

  }, []);

  useEffect(() => {
    if (liffObject !== null) {
      if (!liffObject.isLoggedIn()){
        liffObject.login()
        // sessionStorage.setItem("User_Point", `0`)
        // sessionStorage.setItem("On_User", 'On')
        // sessionStorage.setItem("userId", '비회원')
        // sessionStorage.setItem("userName", '비회원')
        return
      }
      liffObject.ready.then(async () => {
        const liffprofile: UnPromise<ReturnType<typeof liffObject.getProfile>> = await liffObject.getProfile();
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
  }, [liffObject])

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init('5334420470014114') // facebookPixelId
        ReactPixel.pageView()

        router.events.on('routeChangeComplete', () => {
          ReactPixel.pageView()
        })
      })
  }, [])

  // useEffect(() => {
  //   if (liffObject !== null) {
  //     if (!liffObject.isInClient() || !isMobile) {
  //       router.replace(`https://www.google.com`)
  //     }
  //   }
  // }, [liffObject])

  useEffect(() => {
    
    const start = () => {
      if (!liffObject) {
        setLoading(true)
      }
    }
    const end = () => {
      if (!liffObject) {
        setLoading(false)
      }
    }
    Router.events.on('routeChangeStart', start)
    Router.events.on('routeChangeComplete', end)
    Router.events.on('routeChangeError', end)
    return () => {
      Router.events.off('routeChangeStart', start)
      Router.events.off('routeChangeComplete', end)
      Router.events.off('routeChangeError', end)
    }
  }, [])
  pageProps.liff = liffObject;
  pageProps.liffError = liffError;


  return getLayout(
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="facebook-domain-verification" content="uclmxvv2e6sqx37umofn52fg9x2fog" />
        <title>Fastfood</title>
      </Head>
      <SWRConfig
        value={{
          refreshInterval: 20 * 1000,
          // fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
        }}
      >
        {loading && <Loading />}
        <Component {...pageProps} position={position} />
      </SWRConfig>
    </>,
  )
}

export default wrapper.withRedux(App)
