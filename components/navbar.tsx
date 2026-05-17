/** @format */

"use client";

import {
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "@/components/buttons/ThemeToggle";
import GlobalSearchModal from "@/components/global-search-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut } from "@/lib/auth-client";
import { getNameInitials } from "@/lib/utils";

export function NavMenu({
  userName,
  userImage,
}: {
  userName?: string;
  userImage?: string;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isLoggedIn = Boolean(userName);
  const initials = getNameInitials(userName ?? "") ?? "U";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Go to homepage"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            B
          </span>
          <span className="truncate text-base font-semibold tracking-tight">
            Blog
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/contact#about-me">About</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/contact">Contact</Link>
          </Button>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
          >
            <Search />
          </Button>
          <ThemeToggle />

          {isLoggedIn ? (
            <UserMenu
              userName={userName}
              userImage={userImage}
              initials={initials}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
          >
            <Search />
          </Button>
          <ThemeToggle />
          <MobileMenu
            isLoggedIn={isLoggedIn}
            userName={userName}
            userImage={userImage}
            initials={initials}
          />
        </div>
      </div>

      <GlobalSearchModal isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
    </header>
  );
}

function UserMenu({
  userName,
  userImage,
  initials,
}: {
  userName?: string;
  userImage?: string;
  initials: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 gap-2 px-2">
          <Avatar userName={userName} userImage={userImage} initials={initials} />
          <span className="max-w-36 truncate">{userName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserRound />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut()}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu({
  isLoggedIn,
  userName,
  userImage,
  initials,
}: {
  isLoggedIn: boolean;
  userName?: string;
  userImage?: string;
  initials: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs">
        <SheetHeader className="border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-2 px-4">
          <SheetClose asChild>
            <Link
              href="/contact#about-me"
              className="rounded-md px-2 py-2 text-sm font-medium hover:bg-accent"
            >
              About
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/contact"
              className="rounded-md px-2 py-2 text-sm font-medium hover:bg-accent"
            >
              Contact
            </Link>
          </SheetClose>
        </div>

        <div className="mt-auto border-t p-4">
          {isLoggedIn ? (
            <div className="flex flex-col gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar
                  userName={userName}
                  userImage={userImage}
                  initials={initials}
                />
                <span className="truncate text-sm font-medium">{userName}</span>
              </div>
              <SheetClose asChild>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/profile">
                    <UserRound />
                    Profile
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    Dashboard
                  </Link>
                </Button>
              </SheetClose>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => signOut()}
              >
                <LogOut />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="grid gap-2">
              <SheetClose asChild>
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Log in</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild>
                  <Link href="/auth/register">Sign up</Link>
                </Button>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Avatar({
  userName,
  userImage,
  initials,
}: {
  userName?: string;
  userImage?: string;
  initials: string;
}) {
  return (
    <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
      {userImage ? (
        <Image
          src={userImage}
          alt={userName ?? "User"}
          fill
          className="object-cover"
          sizes="32px"
        />
      ) : (
        initials
      )}
    </span>
  );
}
