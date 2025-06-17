'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import logo from "../../../public/AceLogo.png"
import Image from 'next/image';

const keywordRedirectMap: Record<string, string> = {
  calibration: '/products/v1/ace-calibration-management-system-on-cloud',
  'production-management-system': '/products/v1/ace-production-management-system',
  payroll: '/products/v1/ace-profit-stand-alone-payroll',
  ppap: '/products/v1/ace-profit-ppap',
  'fixed-asset-management': '/products/v1/ace-fixed-asset-management-on-cloud',
  hrms: '/products/v1/ace-profit-stand-alone-hrms',
  erp: '/products/v1/ace-profit-erp',

}

export default function NotFoundRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const normalized = pathname.toLowerCase()

    const match = Object.entries(keywordRedirectMap).find(([keyword]) =>
      normalized.includes(keyword)
    )

    router.replace(match?.[1] || '/') 
  }, [pathname, router])

  return (
   <div className="flex  flex-col items-center justify-center h-screen bg-white animate-pulse">
      <Image src={logo} alt="logo" className='mx-auto'></Image>
      <div className="text-gray-800  text-center mx-auto pl-5">ACE Software Solutions Pvt Ltd</div>
    </div>
  )
}
