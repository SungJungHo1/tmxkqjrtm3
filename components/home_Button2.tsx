import { HomeIcon } from '@heroicons/react/outline'
import swal from 'sweetalert'
import qs from 'qs'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface Home_Button2 {
  position: { longitude: number; latitude: number },
}

const Home_Button2 = ({ position }: Home_Button2) => {

  const router = useRouter()
  const queryString = qs.stringify({
    latitude: position?.latitude,
    longitude: position?.longitude,
    userId: router.query.userId
  })

  const emptyCart = () => {
    router.replace(`/home?${queryString}`, '/')
  }

  return (
    <button
      className={`fixed bottom-24 right-5 cursor-pointer rounded-full bg-primary p-4 text-white shadow-xl transition-colors`}
      onClick={emptyCart}
    >
      <HomeIcon className="h-8 w-8" />
    </button>
  )
}

export default Home_Button2
