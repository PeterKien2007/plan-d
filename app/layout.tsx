"use client";


import React, { useEffect , useState, useRef } from 'react';
import Image from 'next/image';
import './globals.css';
import LogoImg from '../public/LogoImg.png';


import { usePathname } from 'next/navigation';
import { Search  } from 'lucide-react';



export default function DashboardLayout({
children}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    document.title='Illegal Coin'
    const handleKeyDown = (event: KeyboardEvent) => {
     
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault(); 
        inputRef.current?.focus();
        
      
        inputRef.current?.select();
      }
    };


    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [])

 
  const pathname = usePathname();
 const inputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState<string>('')
    const handleKeyDown = (event: { key: string; }) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };        

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
      <head>
        <link rel='icon'  href='bitcoin.png'/>
      </head>
      <body>
        <div className='all'>
      <div className="head">
        <a
           href={"/"}
           className='Ava-Name'>
        <Image 
           src={LogoImg}
           alt="logo" 
           className="logo" />
        <h1 className="title">Illegal Coin</h1>
        </a>
        <div className='Search-LS'>
        <div className='searchbar'>
        <input
            value={search}
            ref={inputRef}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown} 
            placeholder='What do u want? ( ⌘ + K )' />
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
        <nav  className="sidebar">
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
          {children}
        </div>
      </div>
    </div>
        
      </body>
    </html>
  );
}