import Image from "next/image"

const NavBar = () => {
  return (
    <div className='flex items-center justify-between pt-7 px-6 pb-4'>
      <div className='flex items-center justify-center gap-[0.6rem]'>
        <Image
          src="/logo-icon.svg"
          alt="logo"
          width={32}
          height={32}
          priority
        />
        <span className="text-[1.35rem] font-bold">Weather App</span>
      </div>
    </div>
  )
}

export default NavBar
