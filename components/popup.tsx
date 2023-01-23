const Popup = (props) => {
  const { onOk, onClose, message, okText = 'การยืนยัน', closeText = 'ยกเลิก' } = props
  return (
    <div className="fixed inset-0 z-20 bg-black/30">
      <div className="absolute top-56 left-1/2 ml-[-37.5%] w-3/4 rounded-md bg-white shadow-lg">
        <div className="border-b border-gray-200 px-5 py-6 text-center">{message}</div>

        {onOk && onClose ? (
          <div className="w-full">
            <button className="w-1/2 border-r border-gray-200 py-4" onClick={onClose}>
              {closeText}
            </button>
            <button className="w-1/2 py-4 text-primary" onClick={onOk}>
              {okText}
            </button>
          </div>
        ) : (
          <button className="w-full py-4" onClick={onClose}>
            {closeText}
          </button>
        )}
      </div>
    </div>
  )
}
export default Popup
