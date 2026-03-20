"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoImg from "../public/LogoImg.png";
import { Search, Settings, House, MessageCircleMore, Bell, UserRound } from "lucide-react";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    document.title = "Illegal Coin";
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  function handleSearch() {
    inputRef.current?.blur();
  }

  const navItems = [
    { href: "/", label: <House />, name: "Home" },
    { href: "/Content/chat", label: <MessageCircleMore />, name: "Chat" },
    { href: "/Content/notifications", label: <Bell />, name: "Notification" },
    { href: "/Content/account", label: <UserRound />, name: "Account" },
    { href: "/Content/setting", label: <Settings />, name: "Settings" },
  ];

  return (
    <div className="all">
      <div className="head">
        <Link href="/" className="Ava-Name">
          <Image src={LogoImg} alt="logo" className="logo" />
          <h1 className="title">Illegal Coin</h1>
        </Link>
        <div className="Search-LS">
          <div className="searchbar">
            <input
              value={search}
              ref={inputRef}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search ( ⌘/Ctrl + K )"
            />
            <Search onClick={() => handleSearch()} className="search-icon" />
          </div>
          <div className="L-S">
            <Link href="/login" className="Login">Login</Link>
            <Link href="/signup" className="Signup">SignUp</Link>
          </div>
        </div>
      </div>

      <div className="body">
        <nav className="sidebar">
          {navItems.map(({ href, label, name }) => (
            <Link
              key={href}
              href={href}
              className={
                pathname === href ? "sidebar-link-active" : "sidebar-link"
              }
            >
              <span className="sidebar-icon">{label}</span>
              <span className="sidebar-name">{name}</span>
            </Link>
          ))}
        </nav>

        <div className="content">{children}</div>
      </div>
    </div>
  );
}
