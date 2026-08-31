'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type MenuKey = "messenger" | "help" | null;

function TitleBarIconButton({
  children,
  onClick,
  ariaLabel,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  variant?: "default" | "close";
}) {
  const base =
    "flex h-[18px] w-[20px] items-center justify-center border shadow-win-sm text-[11px] font-bold leading-none active:shadow-win-inset";
  const styles =
    variant === "close"
      ? "bg-win-red-btn-bg border-win-red-btn-border text-white hover:bg-win-red-btn-hover active:bg-win-red-btn-active"
      : "bg-win-btn-bg border-win-btn-border text-win-text-color hover:bg-win-btn-hover active:bg-win-btn-active";

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`${base} ${styles}`}
    >
      {children}
    </button>
  );
}

function WinCheckbox({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(!!defaultChecked);
  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-win-text-color select-none">
      <span
        onClick={() => setChecked((c) => !c)}
        className={`flex h-[13px] w-[13px] shrink-0 items-center justify-center border border-win-input-border bg-white shadow-win-inset`}
      >
        {checked && (
          <svg
            viewBox="0 0 12 12"
            className="h-[10px] w-[10px] text-win-title-from"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 6.5L4.8 9.5L10 3" />
          </svg>
        )}
      </span>
      <span onClick={() => setChecked((c) => !c)}>{label}</span>
    </label>
  );
}

export default function YahooMessengerLogin() {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [signingIn, setSigningIn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close dropdown when clicking outside the menu bar
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      dir="ltr"
      className="winxp-theme w-[305px] select-none rounded-[6px] border border-win-border shadow-win-hard"
    >
      {/* ---------- Title bar ---------- */}
      <div className="flex h-[28px] items-center justify-between rounded-t-[5px] border-b border-win-title-border bg-gradient-to-b from-win-title-from to-win-title-to px-1">
        <div className="flex items-center gap-1.5 pl-1">
          <img
            src="/online-user.png"
            alt=""
            className="h-[15px] w-[15px] object-contain"
          />
          <span className="text-[12px] font-bold text-white">
            Yahoo! Messenger
          </span>
        </div>
        <div className="flex items-center gap-[3px] pr-0.5">
          <TitleBarIconButton ariaLabel="Invite">
            <svg viewBox="0 0 10 10" className="h-[9px] w-[9px]" fill="currentColor">
              <rect x="0" y="0" width="4" height="4" />
              <rect x="6" y="0" width="4" height="4" />
              <rect x="0" y="6" width="4" height="4" />
              <rect x="6" y="6" width="4" height="4" />
            </svg>
          </TitleBarIconButton>
          {/* <TitleBarIconButton ariaLabel="Status">
            <svg viewBox="0 0 10 10" className="h-[9px] w-[9px]" fill="currentColor">
              <path d="M1 0h6l2 2v8H1z" opacity="0.85" />
            </svg>
          </TitleBarIconButton> */}
          <TitleBarIconButton ariaLabel="Minimize">
            <span className="translate-y-[-5.5px]">_</span>
          </TitleBarIconButton>
          <TitleBarIconButton ariaLabel="Maximize">
            <span className="text-[14px]">▢</span>
          </TitleBarIconButton>
          <TitleBarIconButton ariaLabel="Close" variant="close">
            ✕
          </TitleBarIconButton>
        </div>
      </div>

      {/* ---------- Menu bar ---------- */}
      <div
        ref={menuRef}
        className="relative flex h-[22px] items-center gap-4 border-b border-win-btn-border bg-win-bg px-2 text-[11px] text-win-text-color"
      >
        <button
          type="button"
          onClick={() => setOpenMenu((m) => (m === "messenger" ? null : "messenger"))}
          className={`px-1 ${openMenu === "messenger" ? "border border-win-input-border bg-white" : ""}`}
        >
          <span className="underline">M</span>essenger
        </button>
        <button
          type="button"
          onClick={() => setOpenMenu((m) => (m === "help" ? null : "help"))}
          className={`px-1 ${openMenu === "help" ? "border border-win-input-border bg-white" : ""}`}
        >
          <span className="underline">H</span>elp
        </button>

        {openMenu === "messenger" && (
          <div className="absolute left-1 top-[22px] z-10 w-[130px] border border-win-btn-border bg-white py-0.5 shadow-win-hard">
            <Link
              href="/radar"
              onClick={() => setOpenMenu(null)}
              className="block px-3 py-1 text-[11px] text-win-text-color hover:bg-win-title-to hover:text-white"
            >
              Radar
            </Link>
            <Link
              href="/prompts"
              onClick={() => setOpenMenu(null)}
              className="block px-3 py-1 text-[11px] text-win-text-color hover:bg-win-title-to hover:text-white"
            >
              Prompts
            </Link>
          </div>
        )}

        {openMenu === "help" && (
          <div className="absolute left-[68px] top-[22px] z-10 w-[190px] border border-win-btn-border bg-white py-0.5 shadow-win-hard">
            <button
              type="button"
              onClick={() => setOpenMenu(null)}
              className="block w-full px-3 py-1 text-left text-[11px] text-win-text-color hover:bg-win-title-to hover:text-white"
            >
              Yahoo! Messenger Help
            </button>
            <button
              type="button"
              onClick={() => setOpenMenu(null)}
              className="block w-full px-3 py-1 text-left text-[11px] text-win-text-color hover:bg-win-title-to hover:text-white"
            >
              Check for Updates...
            </button>
            <div className="my-0.5 border-t border-win-btn-border" />
            <button
              type="button"
              onClick={() => setOpenMenu(null)}
              className="block w-full px-3 py-1 text-left text-[11px] text-win-text-color hover:bg-win-title-to hover:text-white"
            >
              About Yahoo! Messenger
            </button>
          </div>
        )}
      </div>

      {/* ---------- Body ---------- */}
      <div className="flex flex-col items-center gap-3 bg-win-bg px-6 pb-4 pt-5 rounded-b-[5px]">
        <img
          src={signingIn ? "/yahoo-logo-online.gif" : "/yahoo-logo-offline.png"}
          alt="Yahoo!"
          className="h-[78px] w-[130px] object-contain"
        />

        <form
          className="flex w-full flex-col items-center gap-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            setSigningIn(true);
          }}
        >
          <div className="w-full max-w-[210px]">
            <label className="mb-0.5 block text-[11px] font-bold text-win-text-color">
              Yahoo! ID:
            </label>
            <input
              type="text"
              // defaultValue="Yahoo! ID"              
              placeholder="Yahoo! ID"
              className="h-[20px] w-full border border-win-input-border bg-white px-1 text-[11px] text-win-text-color shadow-win-inset outline-none focus:border-win-input-focus"
            />
          </div>

          <div className="w-full max-w-[210px]">
            <label className="mb-0.5 block text-[11px] font-bold text-win-text-color">
              Password:
            </label>
            <input
              type="password"
              placeholder="Password"
              className="h-[20px] w-full border border-win-input-border bg-white px-1 text-[11px] text-win-text-color shadow-win-inset outline-none focus:border-win-input-focus"
            />
          </div>

          <a
            href="https://login.yahoo.com/account/create"
            target="_blank"
            className="self-start pl-0.5 text-[11px] text-win-link-color underline"
          >
            Get a new Yahoo! ID...
          </a>

          <div className="mt-1 flex w-full max-w-[210px] flex-col gap-1 self-start">
            <WinCheckbox label="Remember my ID &amp; password" defaultChecked />
            <WinCheckbox label="Sign in automatically" />
            <WinCheckbox label="Sign in as invisible to everyone" defaultChecked />
          </div>

          <button
            type="submit"
            className="mt-2 border border-win-btn-border bg-win-btn-bg px-8 py-[3px] text-[11px] font-bold text-win-text-color shadow-win-sm hover:bg-win-btn-hover active:bg-win-btn-active active:shadow-win-inset"
          >
            {signingIn ? "Signing..." : "Sign In"}
          </button>

          <a href="https://login.yahoo.com/forgot?" target="_blank" className="text-[11px] text-win-link-color underline">
            Forgot your password?
          </a>
        </form>

        <div className="mt-1 flex w-full justify-start">
          <span className="text-[10px] italic text-win-text-color/60">
            Version 11.5.0.228
          </span>
        </div>
      </div>
    </div>
  );
}
