import { GetServerSideProps, NextPage } from 'next'
import { StarIcon } from '@heroicons/react/solid'
import { ClockIcon, TruckIcon } from '@heroicons/react/outline'
import FloatingButton from '@/components/floating-button'
import Link from 'next/link'
import { CATES } from '@/libs/cates'
import { useRouter } from 'next/router'
import { CATEGORIES } from '@/libs/constants'
import { uniqBy } from 'lodash'
import { insertCommas } from '@/libs/utils'
import Image from 'next/image'
import swal from 'sweetalert';
import { useEffect, useState } from 'react'
import axios from 'axios'
import React, { useRef } from 'react'
import https from 'https'
import dayjs from 'dayjs'
import Head from 'next/head'

const Stores: NextPage<{
  position: { longitude: number; latitude: number } | null
  data: any
}> = ({data }) => {
  const router = useRouter()
  const category = router.query.category || ''
  const ref = useRef()
  

  const isActive = (cateKey) => cateKey === category

  const getStoreHour = (begin, end) => {
    const today = new Date()
    const initStartTime = dayjs().startOf('date')
    const initEndTime = dayjs().endOf('date')

    const splitStartTime = begin.split(':')
    const splitEndTime = end.split(':')

    const startTime = dayjs()
      .set('hour', splitStartTime[0])
      .set('minute', splitStartTime[1])
      .set('second', splitStartTime[2])

    const endTime = dayjs()
      .set('hour', splitEndTime[0])
      .set('minute', splitEndTime[1])
      .set('second', splitEndTime[2])

    const closeTime =
      splitEndTime[0] < 10
        ? +initStartTime <= +today && +today <= +endTime
        : +startTime <= +today && +today <= +endTime
    const openTime = +startTime <= +today && +today <= +initEndTime

    return { start: openTime, end: closeTime }
  }

  const handleClickStore = (open, query, begin, end) => {
    if (open) {
      router.push({ pathname: `/stores/[name]`, query }, `/stores/${query.name}`)
    } else if (!open) {
      if (!getStoreHour(begin, end).start) {
        swal('ยังไม่พร้อมให้บริการ')
      } else {
        swal('ร้านปิดแล้ว')
      }
    }
  }

  return (
    <div>
      <Head>
        <title style={{ fontFamily: "Sriracha-Regular" }}>Fastfood</title>
      </Head>
      <div className="h-fit w-full overflow-auto bg-primary" style={{ fontFamily: "Sriracha-Regular" }}>
        <div className="flex w-fit flex-row items-center text-white" ref={ref}>
          {CATEGORIES.map((category) => (
            <Link
              key={category.key}
              href={{
                pathname: '/stores',
                query: {
                  category: category.key,
                  latitude: parseFloat(`${router.query.latitude}`),
                  longitude: parseFloat(`${router.query.longitude}`)
                },
              }}
              as="/stores"
            >
              <div
                key={category.key}
                className={`w-max p-4 text-center ${isActive(category.key) ? 'box-border font-bold underline underline-offset-8' : ''
                  }`}
              >
                {category.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {data?.restaurants ?  data?.restaurants.length > 0 ? (
        uniqBy<{
          id: number
          name: string
          logo_url: string
          review_avg: number
          review_count: number
          distance: number
          min_order_amount: number
          estimated_delivery_time: string
          thumbnail_url: string
          adjusted_delivery_fee: number
          begin: string
          end: string
          open: boolean
          phone:string
        }>(data.restaurants, 'id').map((restaurant) => (
          <button style={{ fontFamily: "Sriracha-Regular" }}
            key={restaurant.id}
            onClick={() =>
              handleClickStore(
                restaurant.open,
                {
                  id: restaurant.id,
                  name: restaurant.name,
                  thumbnail_url: restaurant.thumbnail_url,
                  logo_url: restaurant.logo_url,
                  review_avg: restaurant.review_avg,
                  review_count: restaurant.review_count,
                  distance: restaurant.distance,
                  min_order_amount: restaurant.min_order_amount,
                  estimated_delivery_time: restaurant.estimated_delivery_time,
                  adjusted_delivery_fee: restaurant.adjusted_delivery_fee,
                  phone:restaurant.phone
                },
                restaurant.begin,
                restaurant.end,
              )
            }
          >
            <div>
              <div className="flex flex-row items-center border border-x-0 border-gray-100 p-4">
                <div className="relative h-24 w-24 flex-[0_0_6rem] overflow-hidden rounded-md bg-slate-300">
                  {!restaurant.open ? (
                    <div className="absolute z-10 flex h-full w-full flex-col justify-center bg-black/70 px-2 text-center text-xs text-white">
                      {!getStoreHour(restaurant.begin, restaurant.end).start
                        ? `วันนี้เปิดบริการ ${restaurant.begin.substr(0, 5)} OPEN`
                        : 'วันนี้ปิดทำการแล้วค่ะ'}
                    </div>
                  ) : null}
                  <Image src={restaurant.logo_url} width={100} height={100} alt="logo" unoptimized/>
                </div>
                <div className="ml-4 space-y-1 text-left">
                  <div className="text-lg font-bold">{restaurant.name}</div>
                  <div>
                    <span>
                      <StarIcon className="inline-block h-5 w-5 align-text-top text-[#f5da55]" />{' '}
                      {restaurant.review_avg}
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span>
                      <span className="text-[#7c7c7c]">
                        {/*리뷰*/}
                        รีวิว
                      </span>{' '}
                      {restaurant.review_count}
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span>{restaurant.distance?.toFixed(2)} km</span>
                  </div>
                  <div>
                    <span>
                      <ClockIcon className="inline-block h-5 w-5 align-text-top text-[#7c7c7c]" />{' '}
                      {restaurant.estimated_delivery_time?
                      restaurant.estimated_delivery_time.split('분')[0]:`00~00`} นาที
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span>
                      <span className="mr-2 text-[#7c7c7c]">
                        {/*최소주문*/}
                        สั่งขั้นต่ำ
                      </span>
                      <span className="text-[#c71719]">
                        {insertCommas(restaurant.min_order_amount)}
                      </span>
                      {/*원*/}
                      วอน
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7c7c7c]">
                      <TruckIcon className="inline-block h-5 w-5 align-text-top" />
                      {/*배송비용*/}
                      ค่าส่ง
                    </span>
                    <span className="ml-2 text-[#c71719]">
                      {restaurant.adjusted_delivery_fee} วอน
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))
      ): (
        <div style={{ fontFamily: "Sriracha-Regular" }}>
          {/*조회 결과가 없습니다.*/}
          ไม่มีผลการค้นหา
        </div>
      ): (
        <div style={{ fontFamily: "Sriracha-Regular" }}>
          {/*조회 결과가 없습니다.*/}
          ไม่มีผลการค้นหา
        </div>
      )}

      <FloatingButton url="/cart" />
    </div>
  )
}

export default Stores

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    let res
    if (!CATES.includes(query.category as string)){
      res = await axios.get(
        `${process.env.API_HOST}/search?keyword=${encodeURI(query.category as string)}&page=0&latitude=${query.latitude}&longitude=${query.longitude}`,
        {
          headers: {
            'x-apikey': 'iphoneap',
            'x-apisecret': 'fe5183cc3dea12bd0ce299cf110a75a2',
          },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      )
    }
    else{
      res = await axios.get(
        `${process.env.API_HOST}/getStores?category=${encodeURI(query.category as string)}&latitude=${query.latitude
        }&longitude=${query.longitude}`,
        {
          headers: {
            'x-apikey': 'iphoneap',
            'x-apisecret': 'fe5183cc3dea12bd0ce299cf110a75a2',
          },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      )
    }
    
    return {
      props: {
        data: res.data,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: {},
    }
  }
}
