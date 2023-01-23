import { GetServerSideProps, NextPage } from 'next'
import { StarIcon } from '@heroicons/react/solid'
import FloatingButton from '@/components/floating-button'
import axios from 'axios'
import Image from 'next/image'
import { isEmpty } from 'lodash'
import https from 'https'
import { useRouter } from 'next/router'
import Head from 'next/head'
import React from 'react'

const Review: NextPage = ({ data }: { data: any }) => {
  const router = useRouter()
  const { name } = router.query
  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <div className="bg-primary py-4 text-center text-white">
        {/* 이 메뉴를 주문하신 분의 후기입니다. */}
        นี่คือรีวิวของคนที่สั่งเมนูนี้
      </div>
      {data.map((review) => (
        <div key={review.id} className="my-5 px-5">
          <div className="border-b border-gray-200">
            <div className="flex flex-row items-center justify-between ">
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

            <div className="py-5 text-lg font-bold">{review.comment}</div>
          </div>
        </div>
      ))}
      <FloatingButton url="/cart" />
    </div>
  )
}

export default Review

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const res = await axios.get(
      `${process.env.API_HOST}/getItemReviews?id=${query.id}&count=${query.reviewCount}&menu_id=${query.menuId}`,
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
