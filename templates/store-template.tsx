import React, { ReactElement, ReactNode } from 'react'
import Head from 'next/head'

const StoreTemplate = ({
  title,
  summary,
  signature,
  top10,
  rest,
  children,
  translateTo,
}: {
  title: string
  summary: ReactElement
  signature: ReactElement
  top10: ReactElement
  rest: ReactElement
  children: ReactNode
  translateTo?: 'en' | 'th'
}) => {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
      </Head>
      {/* 요약 */}
      {summary}

      {/* 대표메뉴 */}
      <div className="bg-[#efefef] px-5 py-3 text-xl font-bold">
        {translateTo === 'en'
          ? 'Representative menu'
          : translateTo === 'th'
          ? 'เมนูตัวแทน'
          : '대표메뉴'}
      </div>
      <div className="w-full overflow-auto p-5">{signature}</div>

      {/* top10 */}
      <div className="bg-[#efefef] px-5 py-3 text-xl font-bold">
        {translateTo === 'en' ? 'Popular menu' : translateTo === 'th' ? 'เมนูยอดนิยม' : '인기메뉴'}
      </div>
      {top10}
      {/* rest */}
      {rest}

      {children}
    </div>
  )
}

export default StoreTemplate
