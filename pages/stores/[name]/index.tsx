import { NextPage } from 'next'
import { StarIcon } from '@heroicons/react/solid'
import { ClockIcon } from '@heroicons/react/outline'
import FloatingButton from '@/components/floating-button'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import TranslatePopup from '@/components/translate-popup'
import { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'
import { insertCommas } from '@/libs/utils'
import StoreTemplate from '@/templates/store-template'
import produce from 'immer'
import Loading from '@/components/loading'
import https from 'https'
import { translates } from '@/libs/translates-helper'
import { useAppDispatch, useAppSelector } from '@/hooks/use-reducer-hooks'
import { foodStoreLangSelector, setFoodStore, updateFoodStoreLang } from '@/app/appSlice'
import useSWR from 'swr'
import swal from 'sweetalert'
import {
  menusSelector,
  restMenusSelector,
  setMenus,
  setRestItem,
  signatureMenusSelector,
  top10MenusSelector,
} from '@/app/menusSlice'
import Head from 'next/head'

export const menusFetcher = (url) =>
  axios
    .get(url, {
      headers: {
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })
    .then((r) => r.data)

const Menus: NextPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const {
    id,
    thumbnail_url,
    logo_url,
    name,
    review_avg,
    review_count,
    min_order_amount,
    estimated_delivery_time,
    adjusted_delivery_fee,
    phone
  } = router.query
  const [alertVisible, setAlertVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  // 
  const { data } = useSWR(
    id ? `${process.env.NEXT_PUBLIC_API_HOST}/getMenus?id=${id}` : null,
    menusFetcher,
  )
  console.log(estimated_delivery_time)
  const lang = useAppSelector(foodStoreLangSelector)
  const allMenus = useAppSelector(menusSelector)
  const signatureMenu = useAppSelector(signatureMenusSelector)
  const top10Menu = useAppSelector(top10MenusSelector)
  const restMenu = useAppSelector(restMenusSelector)
  useEffect(()=>{
    typeof logo_url === 'string' && (
      sessionStorage.setItem("thumbnail_url",logo_url)
    )
  },[])
  const handleTranslate = async (to) => {
    try {
      const signatureNames = data[0].items.map((signature) => signature.name)
      const top10Names = data[1].items.map((top10) => top10.name)
      const restNames = data.slice(2).map((rest) => rest.name)
      const [
        signatureTranslated,
        top10NamesTranslated,
        restNamesTranslated,
      ] = await Promise.all([
        translates(signatureNames, to),
        translates(top10Names, to),
        translates(restNames, to),
      ])
      // item.description
      // ????????? ???????????? ????????? ??? ?????? ????????? ????????? ?????? ???????????? ??????
      data.slice(2).forEach((rest, i) =>
        rest.items.forEach((item, k) => {
          translates([item.name + '|' + ""], to).then(([t]) => {
            dispatch(
              setRestItem({
                i,
                k,
                t,
              }),
            )
          })
        }),
      )

      const newSignatureMenu = produce(signatureMenu, (draft) => {
        draft.items.forEach((item, i) => {
          item.translatedName = signatureTranslated[i]
        })
      })
      const newTop10Menu = produce(top10Menu, (draft) => {
        draft.items.forEach((item, i) => {
          item.translatedName = top10NamesTranslated[i]
        })
      })

      const newRestMenu = produce(restMenu, (draft) => {
        draft.forEach((rest, i) => {
          rest.translatedName = restNamesTranslated[i]
        })
      })

      dispatch(setMenus([newSignatureMenu, newTop10Menu, ...newRestMenu]))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
    //
    dispatch(updateFoodStoreLang(to))
  }

  useEffect(() => {
    dispatch(
      setFoodStore({
        ...router.query,
        lang,
      }),
    )
  }, [dispatch, router.query])

  useEffect(() => {

    if (data) {
      if (allMenus.length > 0) {
        if (allMenus[0]['items'][0]['id'] !== data[0]['items'][0]['id'])
          dispatch(setMenus(data))
        return
      }
      dispatch(setMenus(data))
    }
  }, [data, dispatch])

  return (
    <>
      {(loading || !data) && <Loading />}
      <Head>
        <title style={{ fontFamily: "Sriracha-Regular" }}>{name}</title>
      </Head>
      <StoreTemplate
        title={name as string}
        translateTo={lang}
        summary={
          <>
            <div className="relative h-56 w-full bg-slate-300" style={{ fontFamily: "Sriracha-Regular" }}>
              {typeof thumbnail_url === 'string' && (
                <Image src={thumbnail_url} alt={name as string} layout="fill" objectFit="cover" unoptimized/>
              )}
            </div>

            <div className="p-5" style={{ fontFamily: "Sriracha-Regular" }}>
              <div className="text-2xl font-bold">{name}</div>
              <div className="my-2">
                <span>
                  <StarIcon className="inline-block h-5 w-5 align-text-top text-[#f5da55]" />{' '}
                  {review_avg}
                </span>

                {/* ?????? */}
                <span className="ml-2 text-[#7c7c7c]">??????????????? {review_count} &gt;</span>
              </div>

              <div className="flex flex-row items-center justify-between ">
                <div className="space-y-1">
                  <div>
                    {/* ???????????? */}
                    <span className="text-[#7c7c7c]">?????????????????????????????????</span>
                    <span className="ml-2">
                      {insertCommas(parseInt(min_order_amount as string, 10))}
                      {/* ??? */}
                      <span className="text-[#7c7c7c]">?????????</span>
                    </span>
                  </div>
                  <div>
                    {/* ????????? */}
                    <span className="text-[#7c7c7c]">???????????????????????????</span>
                    <span className="ml-2">
                      {insertCommas(parseInt(adjusted_delivery_fee as string, 10))}
                      {/* ??? */}
                      <span className="text-[#7c7c7c]">?????????</span>
                    </span>
                  </div>
                  <div>
                    {/* ???????????? */}
                    <span className="text-[#7c7c7c]">??????????????????????????????</span>
                    <span className="ml-2">
                      <ClockIcon className="mr-1 inline-block h-5 w-5 align-text-top" />
                      {(estimated_delivery_time as string)?.split('???')[0]}
                      <span className="text-[#7c7c7c]"> ????????????</span>
                    </span>
                  </div>
                </div>
                <button
                  className="rounded-md bg-primary px-8 py-6 text-lg text-white"
                  onClick={() => {
                    setAlertVisible(true)
                  }}
                >
                  {/* ?????? */}
                  ??????????????????
                </button>
              </div>
              <Link
                href={{
                  pathname: `/stores/${name}/review`,
                  query: { id, reviewCount: parseInt(review_count as string, 10), review_avg },
                }}
                as={`/stores/${name}/review`}
              >
                <button className="mt-4 w-full rounded-md border border-gray-300 py-3">
                  {/* ?????? */}
                  ??????????????? {insertCommas(parseInt(review_count as string, 10))}
                </button>
              </Link>
            </div>
          </>
        }
        signature={
          <div className="flex w-fit flex-row space-x-2" style={{ fontFamily: "Sriracha-Regular" }}>
            {signatureMenu?.items.map((menu) => (
              menu.soldout ? <a onClick={() => { swal("???????????????????????????.") }}>
                <div className="w-36 overflow-hidden rounded-md border border-gray-200" style={{ fontFamily: "Sriracha-Regular" }}>
                  <div className="relative h-24 w-full">
                    {menu.image ? (
                      <Image src={menu.image} alt={menu.name} layout="fill" objectFit="cover" unoptimized/>
                    ) : null}
                  </div>
                  <div className="w-full bg-black/60 p-2 text-white">
                    <div className="truncate">{menu.translatedName || menu.name}</div>
                    <div>??? {insertCommas(menu.price)}</div>
                  </div>
                </div>
              </a> :
                <Link
                  key={menu.id}
                  href={{
                    pathname: `/stores/${name}/${menu.id}`,
                    query: {
                      id,
                      name,
                      description: menu.description,
                      original_image: menu.original_image,
                      price: menu.price,
                      menu_name: menu.name,
                      menuTranslatedName: menu.translatedName || '',
                      subchoices: JSON.stringify(menu.subchoices),
                      review_count: menu.review_count,
                      previousQuery: JSON.stringify(router.query),
                      phone:phone
                    },
                  }}
                  as={`/stores/${name}/${menu.id}`}
                >
                  <div className="w-36 overflow-hidden rounded-md border border-gray-200" style={{ fontFamily: "Sriracha-Regular" }}>
                    <div className="relative h-24 w-full">
                      {menu.image ? (
                        <Image src={menu.image} alt={menu.name} layout="fill" objectFit="cover" unoptimized />
                      ) : null}
                    </div>
                    <div className="w-full bg-black/60 p-2 text-white">
                      <div className="truncate">{menu.translatedName || menu.name}</div>
                      <div>??? {insertCommas(menu.price)}</div>
                    </div>
                  </div>
                </Link>
            ))}
          </div>
        }
        top10={
          <>
            {top10Menu?.items.map((menu) => (
              menu.soldout
                ? <a onClick={() => { swal("???????????????????????????.") }}>
                  <a className="flex flex-row items-center border-b border-gray-200 p-5" style={{ fontFamily: "Sriracha-Regular" }}>
                    <div className="mr-2 flex-1" style={{ fontFamily: "Sriracha-Regular" }}>
                      <div className="text-lg">{menu.translatedName || menu.name}</div>
                      {/* <div className="text-xs text-[#999]">
                        {menu.translatedDescription || menu.description}
                      </div> */}
                      {menu.review_count !== 0 ? (
                        // ??????
                        <div className="text-[#5956d9]">??????????????? ({menu.review_count})</div>
                      ) : null}

                      <div className="text-[#c71719]">??? {insertCommas(menu.price)}</div>
                    </div>
                    <div className="relative h-24 w-32 flex-[0_0_8rem] overflow-hidden rounded-md">
                      {menu.image ? (
                        <Image src={menu.image} alt={menu.name} layout="fill" objectFit="cover" unoptimized/>
                      ) : null}
                    </div>
                  </a>
                </a>
                : <Link
                  key={menu.id}
                  href={{
                    pathname: `/stores/${name}/${menu.id}`,
                    query: {
                      id,
                      name,
                      description: menu.description,
                      original_image: menu.original_image,
                      price: menu.price,
                      menu_name: menu.name,
                      menuTranslatedName: menu.translatedName || '',
                      subchoices: JSON.stringify(menu.subchoices),
                      review_count: menu.review_count,
                      previousQuery: JSON.stringify(router.query),
                    },
                  }}
                  as={`/stores/${name}/${menu.id}`}
                >
                  <a className="flex flex-row items-center border-b border-gray-200 p-5" style={{ fontFamily: "Sriracha-Regular" }}>
                    <div className="mr-2 flex-1">
                      <div className="text-lg">{menu.translatedName || menu.name}</div>
                      {/* <div className="text-xs text-[#999]">
                        {menu.translatedDescription || menu.description}
                      </div> */}
                      {menu.review_count !== 0 ? (
                        // ??????
                        <div className="text-[#5956d9]">??????????????? ({menu.review_count})</div>
                      ) : null}

                      <div className="text-[#c71719]">??? {insertCommas(menu.price)}</div>
                    </div>
                    <div className="relative h-24 w-32 flex-[0_0_8rem] overflow-hidden rounded-md">
                      {menu.image ? (
                        <Image src={menu.image} alt={menu.name} layout="fill" objectFit="cover" unoptimized/>
                      ) : null}
                    </div>
                  </a>
                </Link>
            ))}
          </>
        }
        rest={
          <>
            {restMenu?.map((item) => (
              <div key={item.slug} style={{ fontFamily: "Sriracha-Regular" }}>
                <div className="bg-[#efefef] px-5 py-3 text-xl font-bold">
                  {item.translatedName || item.name}
                </div>
                {item.items.map((menu) => (
                  menu.soldout
                    ? <a onClick={() => { swal("???????????????????????????.") }}>
                      <a className="flex flex-row items-center border-b border-gray-200 p-5">
                        <div className="mr-2 flex-1">
                          <div className="text-lg">{menu.translatedName || menu.name}</div>
                          {/* <div className="text-xs text-[#999]">
                            {menu.translatedDescription || menu.description}
                          </div> */}
                          {menu.review_count !== 0 ? (
                            //  ??????
                            <div className="text-[#5956d9]">??????????????? ({menu.review_count})</div>
                          ) : null}
                          <div className="text-[#c71719]">??? {insertCommas(menu.price)}</div>
                        </div>
                        <div className="relative h-24 w-32 flex-[0_0_8rem] overflow-hidden rounded-md">
                          {menu.image ? (
                            <Image src={menu.image} alt={menu.name} layout="fill" objectFit="cover" unoptimized/>
                          ) : null}
                        </div>
                      </a>
                    </a>
                    : <Link
                      key={menu.id}
                      href={{
                        pathname: `/stores/${name}/${menu.id}`,
                        query: {
                          id,
                          name,
                          description: menu.description,
                          original_image: menu.original_image,
                          price: menu.price,
                          menu_name: menu.name,
                          menuTranslatedName: menu.translatedName || '',
                          subchoices: JSON.stringify(menu.subchoices),
                          review_count: menu.review_count,
                          previousQuery: JSON.stringify(router.query),
                        },
                      }}
                      as={`/stores/${name}/${menu.id}`}
                    >
                      <a className="flex flex-row items-center border-b border-gray-200 p-5">
                        <div className="mr-2 flex-1">
                          <div className="text-lg">{menu.translatedName || menu.name}</div>
                          {/* <div className="text-xs text-[#999]">
                            {menu.translatedDescription || menu.description}
                          </div> */}
                          {menu.review_count !== 0 ? (
                            //  ??????
                            <div className="text-[#5956d9]">??????????????? ({menu.review_count})</div>
                          ) : null}
                          <div className="text-[#c71719]">??? {insertCommas(menu.price)}</div>
                        </div>
                        <div className="relative h-24 w-32 flex-[0_0_8rem] overflow-hidden rounded-md">
                          {menu.image ? (
                            <Image src={menu.image} alt={menu.name} layout="fill" objectFit="cover" unoptimized />
                          ) : null}
                        </div>
                      </a>
                    </Link>
                ))}
              </div>
            ))}
          </>
        }
      >
        <FloatingButton url="/cart" />

        {alertVisible ? (
          <TranslatePopup
            onClose={(closed) => setAlertVisible(closed)}
            onClick={(to) => {
              setLoading(true)
              handleTranslate(to)
            }}
          />
        ) : null}
      </StoreTemplate>
    </>
  )
}

export default Menus
