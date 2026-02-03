"use client";


import React, { useEffect , useState } from 'react';
import Image from 'next/image';
import './globals.css';
import LogoImg from '../public/LogoImg.png';

import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    document.title = "Illegal Coin";
  });
  const pathname = usePathname();
    const [search, setSearch] = useState('')


   function handleSearch () {
      setSearch('')
   }

    const navItems = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
    { href: "/notifications", label: "Notifications" },
    { href: "/account", label: "Account" },
  ];
  
  return (
    <html lang="en">
      <body>
        <div className='all'>
      <div className="head">
        <div className='Ava-Name'>
        <Image src={LogoImg} alt="Logo" className="logo" />
        <h1 className="title">Illegal Coin</h1>
        </div>
        <div className='Search-LS'>
        <div className='searchbar'>
        <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}  
            placeholder='What do u want?' />
        <Search
          onClick={() => handleSearch()}  
           className="search-icon" />
        </div>
        <div className="L-S">
          <nav className="Login">Login</nav>
          
          <nav className="Signup">SignUp</nav>
        </div>
      </div>
      </div>

      <div className="body">
        <nav className="sidebar">
          {navItems.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={
                pathname === href ? "sidebar-link-active" : "sidebar-link"
              }
            >
              {label}
            </a>
          ))}
        </nav>
          
        <div className="content">

        </div>
      </div>
    </div>
        
      </body>
    </html>
  );
}