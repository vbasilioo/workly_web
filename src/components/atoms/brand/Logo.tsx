'use client'

import Image from 'next/image'

interface LogoProps {
  className?: string
}

function LogoIcon({ className }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/svg/people.svg"
        alt="Workly Logo"
        width={32}
        height={32}
        className="h-8 w-8"
      />
    </div>
  )
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/svg/people.svg"
        alt="Workly Logo"
        width={32}
        height={32}
        className="h-8 w-8"
      />
      <span className="font-semibold text-xl text-white">Workly</span>
    </div>
  )
}

Logo.Icon = LogoIcon 