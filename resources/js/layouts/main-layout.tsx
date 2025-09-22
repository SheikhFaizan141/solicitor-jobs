import { dashboard, login, register } from '@/routes';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* HEADER */}
            <MainHeader />

            {/* MAIN CONTENT */}
            <main>{children}</main>

            {/* FOOTER */}
            <footer className="border-t border-[#19140035] bg-amber-500 py-5">
                <div className="mx-auto max-w-7xl px-5">
                    <p className="text-center text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                        &copy; {new Date().getFullYear()} Solicitor. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
}

function MainHeader() {
    const { auth } = usePage<SharedData>().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* LOGO */}
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-amber-600 hover:text-amber-700 transition-colors">
                            Solicitor
                        </Link>
                    </div>

                    {/* MAIN NAVIGATION */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link 
                            href="/" 
                            className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                                currentPath === '/' ? 'text-amber-600' : 'text-gray-700'
                            }`}
                        >
                            Home
                        </Link>
                        <Link 
                            href="/jobs" 
                            className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                                currentPath === '/jobs' ? 'text-amber-600' : 'text-gray-700'
                            }`}
                        >
                            Jobs
                        </Link>
                    </nav>

                    {/* AUTH BUTTONS */}
                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700">
                                    Welcome, {auth.user.name}
                                </span>
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href={login()}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
