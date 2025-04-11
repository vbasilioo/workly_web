import Image from 'next/image'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Workly Logo"
        width={32}
        height={32}
        className="h-8 w-8"
      />
      <span className="font-semibold text-xl text-gray-900">Workly</span>
    </div>
  )
} 