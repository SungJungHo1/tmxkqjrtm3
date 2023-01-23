import { GetServerSideProps, NextPage } from 'next'
import { ClockIcon, SearchIcon } from '@heroicons/react/outline'
import { CATEGORIES } from '@/libs/constants'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { StarIcon } from '@heroicons/react/solid'
import { insertCommas } from '@/libs/utils'
import HomeTemplate from '@/templates/home-template'
import { uniqBy } from 'lodash'
import https from 'https'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import type { Liff } from "@line/liff";
import dayjs from 'dayjs'
import swal from 'sweetalert2'
import Swal from 'sweetalert2'
import CustomSelect from '@/components/CustomSelect'



const Home: NextPage<{
  position: { longitude: number; latitude: number } | null
  popularMenu: any
  profile: any
  liff: Liff | null
  liffError: string | null
}> = ({ position, popularMenu, liff, liffError }) => {
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [User_Point, setUser_Point] = useState(0);
  const [position_Local, setPosition_Local] = useState({latitude: 0,
    longitude: 0,});
  const [popularMenu_Local,setpopularMenu_Local] = useState({restaurants:null});
  const [serveis_money, setServeis_money] = useState(3000);
  const [serveis_opened, setServeis_opened] = useState("true");
  const [serveis_ment, setServeis_ment] = useState("");
  const [On_User, setOn_User] = useState("On");
  const [UserAdd,setUserAdd] = useState([]);
  const router = useRouter()
  
  // useEffect(() => {
  //   if (On_User === 'Off'){
  //     swal.fire('ลูกค้าที่สั่งครั้งแรกค่าบริการฟรีค่ะ!')
  //   }
  // }, [On_User]);

  useEffect(() => {
    setUserId(sessionStorage.getItem('userId'))
    setDisplayName(sessionStorage.getItem('userName'))
    setPictureUrl(sessionStorage.getItem('PictureUrl'))
    setUser_Point(Number(sessionStorage.getItem('User_Point')))
    setOn_User(sessionStorage.getItem('On_User'))
    check_User_Data(sessionStorage.getItem('userId'),sessionStorage.getItem('userName'))
  }, [sessionStorage.getItem('userId')]);
  
  useEffect(() => {
    async function fetchAndSetUser() {
      // alert("Home");
      await axios
      
      // .get(`http://localhost/service`, {
        .get(`https://www.fastfood.p-e.kr/service`, {//http://127.0.0.1/service
        }).then((res) => {
          setServeis_money(res.data.Money);
          setServeis_opened(res.data.opened);
          setServeis_ment(res.data.ment);
          if (!res.data.opened){
            swal.fire(res.data.ment)
          }
        })
    }
    
    sessionStorage.removeItem('add1')
    sessionStorage.removeItem('add2')
    fetchAndSetUser();
  }, []);
  useEffect(()=>{
    if(liff !== null){
      if (displayName ==="wit"){
        liff.closeWindow()
      }
    }
  },[displayName])
  const Pushalret = () =>{
    Swal.fire({
      text:'\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px\n100px',
      color:"rgba(0,0,0,0)",
      background: '#fff url(pang4.jpg) 100%/100%',
      width:700,
      padding: '5.5em',
      
    })
  }
  const check_User_Data = (User,UserName) => {
    console.log("sdsdsd")
    if (encodeURIComponent(User) ==="null"){
      Pushalret();
      return
    }
    axios
      // .get(`https://www.fastfood.p-e.kr/find_User_Data?User_ID=${encodeURIComponent(User)}`, {//http://127.0.0.1/service
      .get(`https://www.fastfood.p-e.kr/find_User_Data2?User_ID=${encodeURIComponent(User)}`, {//
      // .get(`https://www.fastfood.p-e.kr/find_User_Data2?User_ID=${'U812329a68632f4237dea561c6ba1d413'}`, {
      }).then((res) => {
        if (res.data){
          if (res.data.UserName !== UserName){
            axios.get(`https://www.fastfood.p-e.kr/UUName?UserName=${encodeURIComponent(UserName)}&UserId=${encodeURIComponent(User)}`, {})
          }
          
          if (typeof res.data.AddLists !== "undefined"){
            setUserAdd(res.data.AddLists)
            Swal.fire({
              imageUrl: '/images/kpp.png',
              imageWidth: 400,
              imageHeight: 500,
              imageAlt: 'Custom image',
            })
          }else{
            Pushalret();
          }
          setUser_Point(Number(res.data.Point))
          sessionStorage.setItem('User_Point',String(res.data.Point))
        }else{
          Pushalret();
          axios.get(`https://www.fastfood.p-e.kr/insert_User?UserName=${encodeURIComponent(UserName)}&UserId=${encodeURIComponent(User)}`, {}).then(()=>{
            axios.get(`https://www.fastfood.p-e.kr/find_User_Data2?User_ID=${encodeURIComponent(User)}`, {}).then((res) => {
              if (res.data.UserName !== UserName){
                axios.get(`https://www.fastfood.p-e.kr/UUName?UserName=${encodeURIComponent(UserName)}&UserId=${encodeURIComponent(User)}`, {})
              }
              
              if (typeof res.data.AddLists !== "undefined"){
                setUserAdd(res.data.AddLists)
              }else{
                Pushalret();
              }
              setUser_Point(Number(res.data.Point))
              sessionStorage.setItem('User_Point',String(res.data.Point))
            })
          })
          
        }
        }
      );
  }


  const handleChange = (e) => {
    if (e.target.value !== 12121){
      UserAdd?.map(async (i)=>{if(i.주소이름 === e.target.value){
        swal.fire(`ตั้งค่าที่อยู่ได้แล้วค่ะ\nกรุณาเลือกเมนู\nที่ต้องการได้เลยค่ะ`)
        sessionStorage.setItem('add1',`${i.주소1}`)
        sessionStorage.setItem('add2',`${i.주소2}`)
        setPosition_Local({latitude: i.좌표1,
          longitude: i.좌표2})
        const popularMenuRes = await axios.get(
          `https://www.fastfood.p-e.kr/popularMenu?latitude=${i.좌표1}&longitude=${i.좌표2}`,
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
        setpopularMenu_Local(popularMenuRes.data)
        console.log(popularMenuRes.data)
        return
    }})
    }
	};

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
  
  const seter =(datas)=>{
    setpopularMenu_Local(datas)
  }
  useEffect(() => {
    
    sessionStorage.setItem("Service_Money", `${serveis_money}`)
    sessionStorage.setItem("Serveis_Opened", `${serveis_opened}`)
    sessionStorage.setItem("Serveis_Ment", `${serveis_ment}`)
  }, [userId, displayName, serveis_money, User_Point,serveis_opened,serveis_ment,On_User])
  return (
    <HomeTemplate
      profile={
        <>
        <button
          className={`fixed bottom-8 right-1 z-10`}
          onClick={()=>{router.push("https://lin.ee/Zn7EZ6T")}}
        >
          <img className="h-14 w-18" src={"/images/Line-Logo-700x394.png"} alt="" />
        </button>
        <div className="flex h-24 w-full flex-row items-center rounded-md bg-primary p-4" style={{ fontFamily: "Sriracha-Regular" }}>
          <img className="h-14 w-14 rounded-full bg-white" src={pictureUrl !== "" ? pictureUrl : null} alt="" />
          <div className="ml-4 text-lg text-white">
            <div className="font-bold">{displayName}</div>
            <div>
              {User_Point.toLocaleString('ko-KR')} point <span className="ml-5">{"NORMAL"}</span>
            </div>
          </div>
        </div>
        {/* <CustomSelect UserAdd={UserAdd} localPos={seter}/> */}
        <select className='w-full rounded-md bg-primary' style={{ fontFamily: "Sriracha-Regular" ,borderBlockColor:"white",color:"white"}} onChange={handleChange}>
          <option
            value='{주소이름}'
          >
            กรุณาเลือกที่อยู่ที่จะรับอาหารค่ะ
          </option>
            {UserAdd.length <=0 ? <option
                value={"12121"}
              >
                ไม่มีที่อยู่ที่บันทึกไว้ค่ะ
              </option> :
            UserAdd.map((option) => (
              <option
                value={option.주소이름}
              >
                <div>
                  <div style={{ fontSize:"1px"}}>
                    {option.주소1}  
                  </div>
                    {option.주소2}
                </div>
              </option>
            ))}
		      </select>
        </>
      }
      search={
        
        <button className="h-10 w-full rounded-md" style={{ fontFamily: "Sriracha-Regular" ,backgroundColor:"#E0E0E0"}} onClick={()=>{
            router.push(`/testpage?UserId=${userId}&Ordered=${false}`,'/OrderPage')
            }} >
              <p>รายละเอียดการสั่งซื้อ</p>
        </button>
          
          
      }
      categories={
        <div className="-mx-1 flex flex-row flex-wrap" style={{ fontFamily: "Sriracha-Regular" }}>
          
          {CATEGORIES.map((category) => (
            <Link
              key={category.key}
              href={{
                pathname: '/stores',
                query: {
                  category: category.key,
                  latitude: position_Local.latitude === 0 ? position?.latitude : position_Local.latitude,
                  longitude: position_Local.longitude === 0? position?.longitude : position_Local.longitude,
                },
              }}
              as="/stores"
            >
              <div className="mb-3 w-1/4">
                <div className="relative m-auto h-16 w-[90%]">
                  {category.key === "전체" ?
                    <div className=' animate-pulse'>
                      <div className="relative m-auto h-16 w-[90%] rounded-full bg-gradient-to-b from-yellow-200 to-blue-200 blur-sm"></div>
                    </div>
                    : null}
                  <Image
                    src={category.imgUrl}
                    alt={category.label}
                    layout="fill"
                    objectFit="contain"
                    unoptimized
                  />
                </div>
                <div className="text-center text-sm">{category.label}</div>
              </div>
            </Link>
          ))}
        </div>
      }
      popularMenu={
        <>
          <div className="p-5" style={{ fontFamily: "Sriracha-Regular" }}>
            <div className="text-2xl font-bold">
              {/* 오늘의 추천 가게 */}
              ร้านแนะนำวันนี้
            </div>
          </div>
          <div aria-label="popular-menu" className="flex flex-col gap-y-10 px-5 pb-5" style={{ fontFamily: "Sriracha-Regular", fontSize: "13px" }}>
            {uniqBy<{
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
            }>(popularMenu_Local.restaurants === null? popularMenu?.restaurants : popularMenu_Local.restaurants, 'id').map((restaurant) => {
              return (
                restaurant.open ? <Link
                  key={restaurant.id}
                  href={{
                    pathname: `/stores/[name]`,
                    query: {
                      name: restaurant.name,
                      id: restaurant.id,
                      thumbnail_url: restaurant.thumbnail_url,
                      logo_url: restaurant.logo_url,
                      review_avg: restaurant.review_avg,
                      review_count: restaurant.review_count,
                      distance: restaurant.distance,
                      min_order_amount: restaurant.min_order_amount,
                      estimated_delivery_time: restaurant.estimated_delivery_time,
                      adjusted_delivery_fee: restaurant.adjusted_delivery_fee,
                    },
                  }}
                  as={`/stores/${restaurant.name}`}
                >
                  <div className=" flex flex-col">
                    <div className="relative h-56 w-full overflow-hidden rounded-md">
                      <Image
                        src={restaurant.thumbnail_url}
                        layout="fill"
                        objectFit="cover"
                        unoptimized
                        alt="thumbnail"
                      />
                    </div>
                    <div aria-label="Popular menu description" className="flex justify-between">
                      <div className="flex flex-col">
                        <h2 className="mt-2 text-lg font-bold">{restaurant.name}</h2>
                        <div className="flex items-center gap-0.5">
                          <StarIcon className="inline-block h-5 w-5 text-[#f5da55]" />
                          <span>{restaurant.review_avg}</span>
                          <span>({restaurant.review_count})</span>
                          <span className="mx-2 text-[#7c7c7c]">ค่าจัดส่ง</span>
                          <span className="text-[#c71719]">
                            ₩ {insertCommas(restaurant.adjusted_delivery_fee)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <ClockIcon className="mr-1 inline-block h-5 w-5 align-text-top text-[#7c7c7c]" />
                        {restaurant.estimated_delivery_time.split('분')[0]} นาที
                      </div>
                    </div>
                  </div>
                </Link> :
                  <a>
                    <div className=" flex flex-col">
                      <div className="relative h-56 w-full overflow-hidden rounded-md">
                        {!restaurant.open ? (
                          <div className="absolute z-10 flex h-full w-full flex-col justify-center bg-black/70 px-2 text-center text-xs text-white">
                            {!getStoreHour(restaurant.begin, restaurant.end).start
                              ? `วันนี้เปิดบริการ ${restaurant.begin.substr(0, 5)} OPEN`
                              : 'วันนี้ปิดทำการแล้วค่ะ'}
                          </div>
                        ) : null}
                        <Image
                          src={restaurant.thumbnail_url}
                          unoptimized
                          layout="fill"
                          objectFit="cover"
                          alt="thumbnail"
                        />
                      </div>
                      <div aria-label="Popular menu description" className="flex justify-between">
                        <div className="flex flex-col">
                          <h2 className="mt-2 text-lg font-bold">{restaurant.name}</h2>
                          <div className="flex items-center gap-0.5">
                            <StarIcon className="inline-block h-5 w-5 text-[#f5da55]" />
                            <span>{restaurant.review_avg}</span>
                            <span>({restaurant.review_count})</span>
                            <span className="mx-2 text-[#7c7c7c]">ค่าจัดส่ง</span>
                            <span className="text-[#c71719]">
                              ₩ {insertCommas(restaurant.adjusted_delivery_fee)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <ClockIcon className="mr-1 inline-block h-5 w-5 align-text-top text-[#7c7c7c]" />
                          {restaurant.estimated_delivery_time.split('분')[0]} นาที
                        </div>
                      </div>
                    </div>
                  </a>
              )
            })}
          </div>
        </>
      }
    ></HomeTemplate>
  )
}
export default Home

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    
    const popularMenuRes = await axios.get(
      `${process.env.API_HOST}/popularMenu?latitude=${query.latitude}&longitude=${query.longitude}`,
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
        popularMenu: popularMenuRes.data,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: {},
    }
  }
}
