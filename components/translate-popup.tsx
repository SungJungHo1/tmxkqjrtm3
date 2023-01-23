import Image from 'next/image'

const TranslatePopup = (props) => {
  const { onClick, onClose } = props
  return (
    <div className="fixed inset-0 bg-black/30" onClick={() => onClose(false)}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="absolute top-56 left-1/2 ml-[-37.5%] flex w-3/4 flex-row space-x-4 rounded-md bg-white p-5 shadow-lg"
      >
        <button
          className="w-1/2"
          onClick={() => {
            onClick('en')
            onClose(false)
          }}
        >
          <Image src="/america.png" alt="미국 국기" width={50} height={31} />
          <span className="block">English</span>
        </button>
        <button
          className="w-1/2"
          onClick={() => {
            onClick('th')
            onClose(false)
          }}
        >
          <Image src="/thailand.png" alt="태국 국기" width={50} height={31} />
          <span className="block">ภาษาไทย</span>
        </button>
      </div>
    </div>
  )
}
export default TranslatePopup
