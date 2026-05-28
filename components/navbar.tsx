'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, User, LogOut, History, Bell, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavbarActions } from '@/components/navbar-actions'
import { useTranslation } from 'react-i18next'

export function Navbar() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const { user, isLoggedIn, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: t('Dashboard') },
    { href: '/screening', label: t('Skrining') },
  ]

  const authLinks = [
    { href: '/history', label: t('Riwayat'), icon: History },
    { href: '/reminder', label: t('Reminder'), icon: Bell },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-7 w-7 text-primary" />
            <span className="font-mono text-xl font-bold text-primary">DiabeSense</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 font-mono text-sm font-medium transition-colors rounded-md',
                  pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {isLoggedIn && authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 font-mono text-sm font-medium transition-colors rounded-md',
                  pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="font-mono gap-2">
                    <User className="h-4 w-4" />
                    {user?.name.split(' ')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="font-mono cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {t('Profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/history" className="font-mono cursor-pointer">
                      <History className="mr-2 h-4 w-4" />
                      {t('Riwayat')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reminder" className="font-mono cursor-pointer">
                      <Bell className="mr-2 h-4 w-4" />
                      {t('Reminder')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="font-mono cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('Logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="font-mono">{t('Login')}</Button>
              </Link>
            )}
            <NavbarActions />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-2 font-mono text-sm font-medium rounded-md transition-colors',
                  pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {isLoggedIn && (
              <>
                {authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 font-mono text-sm font-medium rounded-md transition-colors',
                      pathname === link.href
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 font-mono text-sm font-medium rounded-md transition-colors',
                    pathname === '/profile'
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <User className="h-4 w-4" />
                  {t('Profile')}
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 font-mono text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  {t('Logout')}
                </button>
              </>
            )}
            
            {!isLoggedIn && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4"
              >
                <Button className="w-full font-mono">{t('Login')}</Button>
              </Link>
            )}
            <div className="px-4 py-2 flex justify-start">
              <NavbarActions />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
