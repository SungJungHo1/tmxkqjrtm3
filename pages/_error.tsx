// custom error example
// https://nextjs.org/docs/tag/v9.2.2/advanced-features/custom-error-page
import { NextPage } from 'next'
import axios from 'axios'

interface Props {
  statusCode?: number
}

const Error: NextPage<Props> = ({ statusCode }) => {
  if (statusCode === 404) return <div>Page not found!</div>
  return (
    <p>
      {statusCode ? `An error ${statusCode} occurred on server` : 'การเชื่อมต่อล่าช้าเนื่องจากคำสั่งซื้อจำนวนมาก กรุณาลบเพื่อนไลน์แล้วเข้าใหม่อีกครั้ง เราขออภัยในความไม่สะดวกและจำรีบดำเนินการแก้ไขโดยเร็ว🙏🙏🙏 หากคุณพบปัญหานี้ โปรดติดต่อเรา 1:1'}
    </p>
  )
}
Error.getInitialProps = async ({ res, err }) => {
  let statusCode: number | undefined
  if (res) {
    statusCode = res.statusCode
  } else {
    statusCode = err ? err.statusCode : 404
    // alert(err)
    await axios
      .postForm(`https://www.fastfood.p-e.kr/LogErr`, {
        Errors: JSON.stringify(err),
      })
  }
  return { statusCode }
}

export default Error
