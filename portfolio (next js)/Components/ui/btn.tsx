import React from 'react'

const ButtonLight = () => {
  return (
    <button className="p-[3px] relative">
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
  <div className="px-8 py-2  bg-black rounded-[20px]  relative group transition duration-200 text-white hover:bg-transparent">
    Show My Work
  </div>
</button>
  )
}

export default ButtonLight