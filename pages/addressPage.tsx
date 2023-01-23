import { NextPage } from 'next'
import Head from 'next/head'
import { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Toast from '@/components/toast'
import axios from 'axios'
import type { Liff } from "@line/liff";
import { UploadIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import Image from 'next/image'
import imageCompression from 'browser-image-compression';
import swal from 'sweetalert2'
import ments from '@/components/Ments'

type UnPromise<T> = T extends Promise<infer X> ? X : T;

const Order: NextPage = () => {
  const [ColorState, setColorState] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [OnHidden, setOnHidden] = useState(true)
  const [SummitClicked, setSummitClicked] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [userId, setuserId] = useState<string>('')
  const [userName, setuserName] = useState<string>('')

  const [liffObject, setLiffObject] = useState<Liff | null>(null);

  useEffect(() => {
    let liff_ID = "1657404178-4jZ8QNQk"
    // to avoid `window is not defined` error
    async function liffLogin() {
      const liff = (await import('@line/liff')).default;
      try {
        await liff.init({ liffId: liff_ID }).then(() => {
          // console.log("LIFF init succeeded.");
          setLiffObject(liff);
        })
      } catch (err) {
        console.error('liff init error', err.message);
      }
    }
    liffLogin();

  }, []);

  const handleFileOnChange = async (files) => {
    let file = files;

    const options = { 
      maxSizeMB: 2, 
    }
    
    try {
      const compressedFile = await imageCompression(file, options);
      // console.log(compressedFile)
      return compressedFile
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (liffObject !== null) {
      liffObject.ready.then(async () => {
        const liffprofile: UnPromise<ReturnType<typeof liffObject.getProfile>> = await liffObject.getProfile();
        setuserId(liffprofile.userId)
        setuserName(liffprofile.displayName)
        await axios
        .get(`https://www.fastfood.p-e.kr/find_User_Data2?User_ID=${encodeURIComponent(liffprofile.userId)}`, {//
        
        }).then((res)=>{

          if (res.data){
            return
          }else{
            axios.get(`https://www.fastfood.p-e.kr/insert_User?UserName=${encodeURIComponent(liffprofile.displayName)}&UserId=${encodeURIComponent(liffprofile.userId)}`, {}) 
          }
        })
      })
    }
  }, [liffObject])

  useEffect(() => {
    if (liffObject !== null) {
    }
  }, [liffObject])

  const { register, handleSubmit } = useForm()
  const router = useRouter()
  const formRef = useRef()

  const onSubmit = async (data) => {
    let curr = new Date();
    let utc =
      curr.getTime() +
      (curr.getTimezoneOffset() * 60 * 1000);
    let KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    let kr_curr = new Date(utc + (KR_TIME_DIFF));
    let Kr_Time = parseInt(kr_curr.getHours().toString())

    if (Kr_Time >= 0 && Kr_Time < 11) {
      // if (Kr_Time <= 0) {
        // swal("ร้านปิดแล้วค่ะ\nFASTFOOD\nเปิดทำการ 11:00-00:00.")
        swal.fire({
          title: "ร้านปิดแล้วค่ะ\nFASTFOOD\nเปิดทำการ 11:00-00:00.",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Ok',
          showLoaderOnConfirm: true,
          preConfirm: async (login) => {
            if (login === "fastfood1144"){
              if (SummitClicked) {
                return
              }
              setSummitClicked(true)
              console.log(data)
              if (!(data.add1 || data.addressPhoto.length)) {
                setErrorMessage('กรุณาป้อนข้อมูลทั้งหมดค่ะ')
                setSummitClicked(false)
                setToastVisible(true)
                setColorState("")
                return
              }
          
              setOnHidden(!OnHidden)
              setErrorMessage("คำขอคืนเงินเสร็จสมบูรณ์ค่ะ.")
              setToastVisible(true)
              setColorState("success")
              
              const urls = `https://www.fastfood.p-e.kr/Add_Address?add1=${encodeURIComponent(data.add1)}&add2=${encodeURIComponent(data.add2)}&phone=${encodeURIComponent(data.phone)}&add_Name=${encodeURIComponent(data.add_Name)}&UserName=${encodeURIComponent(userId)}&UserId=${encodeURIComponent(userName)}&password=${encodeURIComponent(data.password)}&ImageIn=${data.addressPhoto[0] !== undefined ? 'yes' : 'no'}&friend=${false}`
              const File_Dates = await handleFileOnChange(data.addressPhoto[0])
              await axios //"U812329a68632f4237dea561c6ba1d413"
                .postForm(urls, {
                  image: data.addressPhoto[0] ? File_Dates : null,
                })
                .then((res) => {
                  // liffObject.closeWindow()
                  // swal.fire({
                  //   title: '주소 등록신청이 완료되었습니다. 확인버튼을 누르시면 상담창으로 전환됩니다.',
                  //   confirmButtonText: 'Ok',
                  // }).then((result) => {
                  //   /* Read more about isConfirmed, isDenied below */
                  //   if (result.isConfirmed) {
                  //     liffObject.closeWindow()
                  //   }
                  // })
                })
                const ment = ments(userName)
                await liffObject
                    .sendMessages([
                      ment
                    ])
                    .then(() => {
                      liffObject.closeWindow()
                        // router.push(`/testpage?UserId=${userId}&Ordered=${true}`)
                      })
                      .catch((err) => {
                        liffObject.closeWindow()
                        // router.push(`/testpage?UserId=${userId}&Ordered=${true}`)
                      });
            }
          },
          allowOutsideClick: () => !swal.isLoading()
        })
        return
    }

    // 둘 다 입력이 안되어있을 때 에러
    if (SummitClicked) {
      return
    }
    setSummitClicked(true)
    console.log(data)
    if (!(data.add1 || data.addressPhoto.length)) {
      setErrorMessage('กรุณาป้อนข้อมูลทั้งหมดค่ะ')
      setSummitClicked(false)
      setToastVisible(true)
      setColorState("")
      return
    }

    setOnHidden(!OnHidden)
    setErrorMessage("คำขอคืนเงินเสร็จสมบูรณ์ค่ะ.")
    setToastVisible(true)
    setColorState("success")
    
    const urls = `https://www.fastfood.p-e.kr/Add_Address?add1=${encodeURIComponent(data.add1)}&add2=${encodeURIComponent(data.add2)}&phone=${encodeURIComponent(data.phone)}&add_Name=${encodeURIComponent(data.add_Name)}&UserName=${encodeURIComponent(userId)}&UserId=${encodeURIComponent(userName)}&password=${encodeURIComponent(data.password)}&ImageIn=${data.addressPhoto[0] !== undefined ? 'yes' : 'no'}&friend=${false}`
    const File_Dates = await handleFileOnChange(data.addressPhoto[0])
    await axios //"U812329a68632f4237dea561c6ba1d413"
      .postForm(urls, {
        image: data.addressPhoto[0] ? File_Dates : null,
      })
      .then((res) => {
        // swal.fire({
        //   title: '주소 등록신청이 완료되었습니다. 확인버튼을 누르시면 상담창으로 전환됩니다.',
        //   confirmButtonText: 'Ok',
        // }).then((result) => {
        //   /* Read more about isConfirmed, isDenied below */
        //   if (result.isConfirmed) {
        //     liffObject.closeWindow()
        //   }
        // })
      })
      const ment = ments(userName)
      await liffObject
          .sendMessages([
            ment
          ])
          .then(() => {
            liffObject.closeWindow()
              // router.push(`/testpage?UserId=${userId}&Ordered=${true}`)
            })
            .catch((err) => {
              liffObject.closeWindow()
              // router.push(`/testpage?UserId=${userId}&Ordered=${true}`)
            });
      
  }

  const isOpened = (opened) => {
    if (!opened) {
      setToastVisible(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <Head>
        <title>ที่อยู่ลงทะเบียน</title>
      </Head>
      <Toast message={errorMessage} open={toastVisible} onOpen={isOpened} delay={3000} color={ColorState} />

      <div className="flex h-screen flex-col">
        {!OnHidden ? <div className="absolute z-10 flex h-full w-full flex-col justify-center bg-black/70 px-2 text-center text-xs text-white">
          <p style={{ fontSize: '30px', lineHeight: '150%', fontFamily: "Sriracha-Regular" }}>{'กำลังยืนยันคำสั่งซื้อ โปรดรอสักครู่เนื่องจากคำสั่งซื้อจะถูกย้ายไปที่หน้าต่างบรรทัดหลังจากการยืนยัน'}</p>
          <Image src="/images/Inter.svg" alt="home" width={300} height={300} unoptimized/>
        </div> : null}
        <div className="flex-1 space-y-5 overflow-auto p-5">
          
          <div className="text-lg font-bold" style={{ fontFamily: "Sriracha-Regular" }}>
            {/*주소등록*/}
            ที่อยู่ลงทะเบียน
          </div>

          <img className="h-100 w-100 bg-white" src={'/images/kpp2.png'} alt="" />

          {/* <label className="block">
            <input
              // 주소이름
              {...register('add_Name')}
              placeholder="นามแฝงที่อยู่이름"
              className="h-14 w-full rounded-md border border-gray-300 p-4"
            />
          </label> */}

          <label className="block">
            <input
              {...register('add1')}
              // 주소
              placeholder="กรุณากรอกที่อยู่"
              // defaultValue={Add["add1"]}/
              className="h-14 w-full rounded-md border border-gray-300 p-4"
            />
          </label>
          <label className="block">
            <input
              {...register('add2')}
              // 상세주소
              placeholder="เลขที่ห้อง"
              className="h-14 w-full rounded-md border border-gray-300 p-4"
            />
          </label>

          <label className="block">
            <input
              {...register('password')}
              // 상세주소
              placeholder="รหัสเข้าประตูชั้นที่1"
              className="h-14 w-full rounded-md border border-gray-300 p-4"
            />
          </label>
          
          <label className="block h-16 w-full bg-primary text-center text-lg leading-[4rem] text-white" style={{ fontFamily: "Sriracha-Regular" }}>
            <UploadIcon className="mr-1 inline-block h-5 w-5 align-sub " />
            {/*주소 사진 업로드*/}
            อัพโหลดที่อยู่ ภาพถ่าย
            <input {...register('addressPhoto')} type="file" accept="image/*" className="hidden" />
          </label>
          <p className="text-lg font-bold" style={{ fontFamily: "Sriracha-Regular" }}>ข้อมูลผู้สั่งชื้อ</p>
          <label className="block">
            <input
              {...register('phone')}
              // 전화번호
              placeholder="เบอร์โทร"
              className="h-14 w-full rounded-md border border-gray-300 p-4"
            />
          </label>
          <div className="mt-3 rounded-md border-2 border-black p-3 text-[#333]  text-center " style={{ fontSize: '18px', lineHeight: '150%', fontFamily: "Sriracha-Regular" }}>
            โปรดระบุหมายเลขโทรศัพท์มือถือของคุณเพื่อการ สื่อสารที่ราบรื่นกับเรา<br/>
            ไม่สำคัญว่าคุณไม่รู้ภาษาเกาหลี<br/>(มีคนสื่อสารภาษา ไทย)
          </div>
        </div>

        <button className="h-20 w-full bg-primary text-2xl font-bold text-white" type="submit" style={{ fontFamily: "Sriracha-Regular" }}>
          {/*주소등록하기*/}
          ที่อยู่ลงทะเบียน
        </button>
      </div>
    </form >
  )
}
export default Order
