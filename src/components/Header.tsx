'use client';

import { Disclosure } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { IoReorderThreeOutline } from 'react-icons/io5';
import Logo from '../assets/Images/logo.svg';
import LogoLg from '../assets/Images/AceLogo.png';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, JSX } from 'react';
import { LuMessageSquareMore } from 'react-icons/lu';
import { jwtDecode } from 'jwt-decode';


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type NavigationItem = {
  name: string;
  href: string;
  onClick?: () => void;
};

type DecodedToken = {
  role?: string;
  [key: string]: any;
};

export default function Header(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    router.push('/login');
  };

  const navigation: NavigationItem[] = [
    { name: 'Products', href: '/products' },
    { name: 'Product Enquiry', href: '/ProductEnquire' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'About us', href: '/about' },
    { name: 'Dashboard', href: '/admin' },
    isAuthenticated
      ? { name: 'Logout', href: '#', onClick: handleLogout }
      : { name: 'Login', href: '/login' },
  ];

  return (
    <div className="w-full z-[200] 2xl:px-6 container mx-auto">
      {/* Remove onChange prop from Disclosure */}
      <Disclosure as="nav" className="bg-none lg:bg-white w-full fixed lg:relative z-[200]">
        {({ open, close }) => (
          <>
            <div className="mx-auto sm:px-6 xl:px-0">
              <div className="flex h-16 items-center justify-between">
                <Link href="/">
                  <div className="hidden lg:flex flex-1 md:items-center lg:justify-start gap-1 cursor-pointer">
                    <Image src={LogoLg} width={50} height={48} alt="Company Logo" className="h-10 pl-2 xl:h-10" />
                    <span className="mt-3 flex text-[16px] sm:text-base md:mt-1 font-semibold md:font-normal md:text-lg xl:font-semibold">
                      ACE <span className="ml-2">Software Solutions </span>{' '}
                      <span className="hidden xl:flex ml-2">Pvt. Ltd</span>
                    </span>
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:hidden lg:block">
                  <div className="flex space-x-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={(e) => {
                          if (item.onClick) {
                            e.preventDefault();
                            item.onClick();
                          }
                        }}
                        className={classNames(
                          'hover-effect-1 hover:text-white cursor-pointer',
                          'rounded-md px-2 py-2 text-12 md:text-base font-semibold'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile bottom nav */}
            <div className="lg:hidden -ml-[0.5px] mx-auto lg:px-8 xl:px-0 fixed bottom-0 bg-[#128daf] w-full z-[200] border-l-2 border-white overflow-hidden">
              <div className="flex h-14 items-center justify-between overflow-hidden z-[200]">
                {/* Mobile Menu Button */}
                <div className="flex items-center lg:hidden md:justify-end bg-[#fa650f] h-16 w-14 z-[200]">
                  <Disclosure.Button
                    className="relative inline-flex items-center justify-center ml-2 md:ml-0 md:mr-2 gap-3 text-white hover:text-white"
                    aria-label="Main menu"
                  >
                    {open ? (
                      <XMarkIcon className="block size-6" aria-hidden="true" />
                    ) : (
                      <IoReorderThreeOutline className="block justify-end size-7.5 font-black" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                <Link
                  href="/"
                  className="lg:hidden font-bold text-[16px] px-5 text-white py-2 items-center text-center ml-2 flex gap-1"
                >
                  <Image src={Logo} width={32} height={32} alt="Company Logo" className="h-10 pl-2 xl:h-10" />
                  <span className="mt-0.5"> ACE Software Solutions</span>{' '}
                  <span className="hidden md:block">Pvt. Ltd</span>
                </Link>

                <Link
                  href="/Demo"
                  className="lg:hidden font-bold w-16 justify-center text-center border-l-2 border-white text-white h-16 items-center overflow-hidden"
                >
                  <LuMessageSquareMore className="text-3xl mt-4 ml-4" />
                </Link>
              </div>
            </div>

            <Disclosure.Panel className="lg:hidden fixed bg-white w-3/4 z-[100] bottom-16 rounded-lg shadow-lg">
              <div className="space-y-1 px-4 pt-2 pb-3 flex-col flex items-start">
                {navigation.map((item) => (
                  <div key={item.name} className="w-full">
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        } else {
                          close(); // closes mobile menu on link click
                        }
                      }}
                      className={classNames(
                        'text-gray-700 hover:bg-gray-800 hover:text-white',
                        'block rounded-md px-3 py-2 text-base text-[14px] w-full'
                      )}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
