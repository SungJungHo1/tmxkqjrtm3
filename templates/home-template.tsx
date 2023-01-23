import React from 'react'

const HomeTemplate = ({ profile, search, categories, popularMenu }) => {
  return (
    <div>
      <div className="space-y-6 p-5">
        {/* 프로필 */}
        <div>{profile}</div>
        {/* 검색 */}
        <div>{search}</div>
        {/*  카테고리 */}
        <div>{categories}</div>
      </div>
      {/* 구분선 */}
      <div className="h-2 w-full bg-gray-100" />

      {/* 인기메뉴 */}
      <div>{popularMenu}</div>
    </div>
  )
}

export default HomeTemplate
