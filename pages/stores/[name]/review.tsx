import { NextPage } from 'next'
import { StarIcon } from '@heroicons/react/solid'
import FloatingButton from '@/components/floating-button'
import axios from 'axios'
import produce from 'immer'
import { isEmpty } from 'lodash'
import Image from 'next/image'
import { insertCommas } from '@/libs/utils'
import { useRouter } from 'next/router'
import Link from 'next/link'
import https from 'https'
import { useAppSelector } from '@/hooks/use-reducer-hooks'
import { menusSelector } from '@/app/menusSlice'
import useSWR from 'swr'
import Loading from '@/components/loading'
import Head from 'next/head'
import React from 'react'

const getMenuInfo = (data, menuId) => {
  return data
    .filter((menus) => menus.items.some((item) => item.id === menuId))?.[0]
    ?.items?.find((item) => item.id === menuId)
}
const reviewFetcher = (url) =>
  axios
    .get(url, {
      headers: {
        'x-apikey': 'iphoneap',
        'x-apisecret': 'fe5183cc3dea12bd0ce299cf110a75a2',
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })
    .then((r) => r.data)

const Review: NextPage = () => {
  const menus = useAppSelector(menusSelector)
  const router = useRouter()

  const { review_avg, reviewCount, name, id } = router.query
  const { data: reviews } = useSWR(
    id ? `${process.env.NEXT_PUBLIC_API_HOST}/getReviews?id=${id}&count=${reviewCount}` : null,
    reviewFetcher,
  )

  const data: any = reviews
    ? produce(reviews, (draft) => {
      draft.forEach((review) => {
        review.menu_items?.forEach((menuItem) => {
          const menuInfo = getMenuInfo(menus, menuItem.id)
          if (menuInfo) {
            menuItem.image = menuInfo.image || null
            menuItem.price = menuInfo.price || null
            menuItem.description = menuInfo.description || null
            menuItem.original_image = menuInfo.image || null
            menuItem.subchoices = JSON.stringify(menuInfo.subchoices)
            menuItem.review_count = menuInfo.review_count
          }
        })
      })
    })
    : []

  const deliveryRating = (type) => {
    const total = data?.length
    const rating = data?.reduce((acc, curr) => {
      if (type === 'rating_delivery') {
        acc += curr.rating_delivery
      } else if (type === 'rating_taste') {
        acc += curr.rating_taste
      } else if (type === 'rating_quantity') {
        acc += curr.rating_quantity
      }
      return acc
    }, 0)
    return (Math.floor((rating / total) * 10) / 10).toFixed(1)
  }

  return (
    <div>
      <Head>
        <title style={{ fontFamily: "Sriracha-Regular" }}>{name}</title>
      </Head>
      {!data && <Loading />}
      <div className="flex flex-row items-center border-b border-gray-200 py-6" style={{ fontFamily: "Sriracha-Regular" }}>
        <div className="w-1/2 text-center text-4xl font-bold">
          <StarIcon className="inline-block h-12 w-12 align-text-top text-[#f5da55]" />
          {` ${Number(review_avg).toFixed(1)}`}
        </div>
        <div className="w-1/2">
          <div>
            <span className="mr-3 text-[#7c7c7c]">
              {/* 맛 */}
              รสชาติ
            </span>
            <StarIcon className="inline-block h-5 w-5 align-text-top text-[#f5da55]" />
            {` ${deliveryRating('rating_taste')}`}
          </div>
          <div>
            <span className="mr-3 text-[#7c7c7c]">
              {/* 식량 */}
              ปริมาณอาหาร
            </span>
            <StarIcon className="inline-block h-5 w-5 align-text-top text-[#f5da55]" />
            {` ${deliveryRating('rating_quantity')}`}
          </div>
          <div>
            <span className="mr-3 text-[#7c7c7c]">
              {/* 배달 */}
              การจัดส่ง
            </span>
            <StarIcon className="inline-block h-5 w-5 align-text-top text-[#f5da55]" />
            {` ${deliveryRating('rating_delivery')}`}
          </div>
        </div>
      </div>
      {data?.map((review, index) => (
        <div style={{ fontFamily: "Sriracha-Regular" }} key={`${review.id}_${index}`} className="my-5 px-5">
          <div className="border-b border-gray-200">
            <div className="flex flex-row items-center justify-between">
              <div className="text-lg">
                <StarIcon className="inline-block h-6 w-6 align-text-top text-[#f5da55]" />
                {`${Number(review.rating).toFixed(1)}`}
              </div>
              <div>
                <span className="mr-2 text-[#7c7c7c]">{review.nickname}</span>
                {review.time}
              </div>
            </div>
            {!isEmpty(review.review_images) ? (
              <div className="relative mt-2 h-60 w-full overflow-hidden rounded-md">
                <Image
                  src={review.review_images[0].full}
                  alt="review image"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : null}

            <div className="mt-2 w-full overflow-auto">
              <div className="flex w-fit flex-row space-x-2 ">
                {review.menu_items?.map((menu, mi) => {
                  return menu.image && menu.price ? (
                    <Link
                      href={{
                        pathname: `/stores/${name}/${menu.id}`,
                        query: {
                          id,
                          description: menu.description,
                          original_image: menu.original_image,
                          price: menu.price,
                          menu_name: menu.name,
                          subchoices: menu.subchoices,
                          review_count: menu.review_count,
                          to: '/review',
                          previousQuery: JSON.stringify(router.query),
                        },
                      }}
                      as={`/stores/${name}/${menu.id}`}
                      key={`${menu.id}_${mi}`}
                    >
                      <div className="flex w-56 flex-row items-center  rounded-md border border-gray-200 p-2">
                        <div className="relative mr-2 h-14 w-20 flex-[0_0_5rem] overflow-hidden rounded-md">
                          <Image
                            src={menu.image}
                            alt="review image"
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="flex w-full flex-col overflow-hidden">
                          <span className="truncate text-[#4d72dd]">{menu.name}</span>
                          <span className="text-[#e5483f]">
                            ₩ {insertCommas(Number(menu.price))}원
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : null
                })}
              </div>
            </div>
            <div className="py-5 text-lg font-bold">{review.comment}</div>
          </div>
        </div>
      ))}
      <FloatingButton url="/cart" />
    </div>
  )
}

export default Review
