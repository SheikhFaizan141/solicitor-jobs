import { dashboard, login, register } from '@/routes';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MainHeader() {
    const { auth } = usePage<SharedData>().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [currentPath]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const navLinkClasses = (path: string) => {
        const isActive = currentPath === path;
        return `relative text-sm font-medium transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-amber-500 after:transition-transform hover:text-white ${
            isActive ? 'text-white after:scale-x-100' : 'text-blue-200'
        }`;
    };

    const mobileNavLinkClasses = (path: string) => {
        const isActive = currentPath === path;
        return `block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            isActive ? 'bg-amber-500 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`;
    };

    return (
        // <header className="sticky top-0 z-50 border-b border-gray-200 bg-blue-900 shadow-sm md:pt-2 md:pb-2">
        <header className="relative z-50 border-b border-gray-200 bg-blue-900 shadow-sm md:pt-2 md:pb-2">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-x-2 md:gap-5">
                    {/* LOGO */}
                    <div className="flex w-full max-w-[150px] items-center md:max-w-[180px]">
                        <Link href="/" className="flex w-full items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="251" height="54" viewBox="0 0 251 54" fill="none">
                                <path
                                    d="M5.34857 30.8507L5.82304 34.5171C6.68572 34.9484 7.85033 35.0778 8.8424 35.0778C10.6971 35.0778 11.8186 34.172 11.8186 32.6623C11.8186 28.694 1.63908 28.6509 1.63908 21.3182C1.63908 17.0048 5.39171 15.2794 10.3952 15.2794C12.4656 15.2794 15.2693 15.7108 16.8221 16.4441L16.2614 22.0083H12.7244L11.8618 17.9106C11.2579 17.6518 10.5246 17.5655 9.92074 17.5655C8.36793 17.5655 7.28959 18.2557 7.28959 19.9379C7.28959 24.51 17.6417 24.5963 17.6417 31.1526C17.6417 35.1209 14.838 37.7089 9.14433 37.7089C5.65051 37.7089 2.76055 36.8031 1.25088 36.113L1.85475 30.8507H5.34857ZM29.3113 37.7089C22.6256 37.7089 18.8299 33.9563 18.8299 26.4942C18.8299 18.9889 22.5825 15.2794 29.3113 15.2794C36.0402 15.2794 39.7497 18.9889 39.7497 26.4942C39.7497 33.9563 35.9539 37.7089 29.3113 37.7089ZM29.3113 17.5655C26.5077 17.5655 25.0411 20.3261 25.0411 26.4942C25.0411 32.6623 26.5077 35.466 29.3113 35.466C32.115 35.466 33.5816 32.6623 33.5816 26.4942C33.5816 20.3261 32.115 17.5655 29.3113 17.5655ZM49.1464 6.22138L48.9307 10.6641V34.9053L51.3894 35.7248V37.2776H40.606V35.7248L43.1077 34.9053V10.0171L40.606 9.15447V7.77419L49.1464 6.22138ZM60.4953 15.2794L60.2796 19.7222V34.9053L62.7814 35.7248V37.2776H51.998V35.7248L54.4566 34.9053V19.0752L51.998 18.2125V16.8323L60.4953 15.2794ZM54.0252 9.93088C54.0252 8.33493 55.2761 6.78212 57.3897 6.78212C59.5032 6.78212 60.711 8.33493 60.711 9.93088C60.711 11.57 59.5032 13.1228 57.3897 13.1228C55.2761 13.1228 54.0252 11.57 54.0252 9.93088ZM74.7722 17.5655C72.3567 17.5655 69.7256 18.9458 69.7256 25.8472C69.7256 31.6271 71.796 34.3877 76.1525 34.3877C78.3091 34.3877 79.8188 33.9132 81.9755 33.0074L82.45 35.2503C80.8972 36.2424 78.3954 37.7089 74.2977 37.7089C68.5178 37.7089 63.5143 34.5171 63.5143 26.4511C63.5143 18.04 68.6903 15.2794 74.7291 15.2794C76.6701 15.2794 79.3444 15.6245 82.148 16.5303L81.7167 22.0083H77.8778L77.1445 17.9106C76.4113 17.6518 75.4623 17.5655 74.7722 17.5655ZM91.7318 15.2794L91.5161 19.7222V34.9053L94.0179 35.7248V37.2776H83.2345V35.7248L85.6931 34.9053V19.0752L83.2345 18.2125V16.8323L91.7318 15.2794ZM85.2618 9.93088C85.2618 8.33493 86.5126 6.78212 88.6262 6.78212C90.7397 6.78212 91.9475 8.33493 91.9475 9.93088C91.9475 11.57 90.7397 13.1228 88.6262 13.1228C86.5126 13.1228 85.2618 11.57 85.2618 9.93088ZM100.185 10.1034H102.428V15.7108H107.992V18.2988H102.428V31.8859C102.428 33.9995 103.506 34.3014 105.102 34.3014C105.706 34.3014 106.827 34.172 107.733 33.6975L108.208 35.9836C106.612 37.1051 104.412 37.7089 102.212 37.7089C98.2005 37.7089 96.6046 35.7248 96.6046 32.3172V18.2988H94.1459V16.5303L96.6046 15.7108L100.185 10.1034ZM119.146 37.7089C112.46 37.7089 108.664 33.9563 108.664 26.4942C108.664 18.9889 112.417 15.2794 119.146 15.2794C125.874 15.2794 129.584 18.9889 129.584 26.4942C129.584 33.9563 125.788 37.7089 119.146 37.7089ZM119.146 17.5655C116.342 17.5655 114.875 20.3261 114.875 26.4942C114.875 32.6623 116.342 35.466 119.146 35.466C121.949 35.466 123.416 32.6623 123.416 26.4942C123.416 20.3261 121.949 17.5655 119.146 17.5655ZM139.024 19.334V34.9053L142.82 35.7248V37.2776H130.742V35.7248L133.201 34.9053V19.0752L130.742 18.2125V16.8323L139.024 15.2794L138.808 18.3419H139.024C141.224 15.6245 144.976 15.2794 147.521 15.2794L147.09 22.0083H143.423L142.69 18.6439C141.655 18.6439 140.145 18.9458 139.024 19.334Z"
                                    fill="white"
                                ></path>
                                <path
                                    d="M162.603 19.334V34.9053L165.105 35.7248V37.2776H154.322V35.7248L156.78 34.9053V19.0752L154.322 18.2125V16.8323L162.603 15.2794L162.387 18.3419H162.603C164.932 16.2715 167.046 15.2794 169.634 15.2794C173.947 15.2794 175.888 17.7812 175.888 21.6632V34.9053L178.347 35.7248V37.2776H167.995V35.7248L170.065 34.9053V22.3965C170.065 20.4555 169.806 18.6439 166.83 18.6439C165.752 18.6439 164.285 18.8164 162.603 19.334ZM198.263 26.4511H185.107C185.237 31.8428 187.307 34.3877 191.534 34.3877C193.691 34.3877 195.2 33.9132 197.357 33.0074L197.832 35.2503C196.279 36.2424 193.777 37.7089 189.679 37.7089C183.899 37.7089 178.896 34.5171 178.896 26.4511C178.896 18.04 184.244 15.2794 189.377 15.2794C195.934 15.2794 198.263 19.2909 198.263 26.4511ZM189.377 17.5655C187.652 17.5655 185.625 18.687 185.193 23.8199H188.601L192.785 23.6042C192.785 20.1967 191.836 17.5655 189.377 17.5655ZM227.679 18.0831L224.918 17.2636V15.7108H232.984V17.2636L230.31 18.0831L224.875 37.4933H219.699L215.213 23.9924H214.955L210.943 37.4933H205.81L200.117 18.0831L197.744 17.2636V15.7108H208.916V17.2636L206.5 18.0831L210.167 31.3252H210.253L214.998 15.4951H219.009L224.142 31.3252H224.228L227.679 18.0831ZM236.554 30.8507L237.029 34.5171C237.891 34.9484 239.056 35.0778 240.048 35.0778C241.903 35.0778 243.024 34.172 243.024 32.6623C243.024 28.694 232.845 28.6509 232.845 21.3182C232.845 17.0048 236.597 15.2794 241.601 15.2794C243.671 15.2794 246.475 15.7108 248.028 16.4441L247.467 22.0083H243.93L243.067 17.9106C242.463 17.6518 241.73 17.5655 241.126 17.5655C239.573 17.5655 238.495 18.2557 238.495 19.9379C238.495 24.51 248.847 24.5963 248.847 31.1526C248.847 35.1209 246.044 37.7089 240.35 37.7089C236.856 37.7089 233.966 36.8031 232.456 36.113L233.06 30.8507H236.554Z"
                                    fill="#ABDBE9"
                                ></path>
                            </svg>
                        </Link>
                    </div>

                    {/* MAIN NAVIGATION */}
                    <nav className="hidden items-center space-x-8 md:flex">
                        <Link href="/" className={navLinkClasses('/')}>
                            Home
                        </Link>

                        <Link href="/jobs" className={navLinkClasses('/jobs')}>
                            Jobs
                        </Link>

                        <Link href="/law-firms" className={navLinkClasses('/law-firms')}>
                            Law Firms
                        </Link>

                        <Link href="/job-alerts" className={navLinkClasses('/job-alerts')}>
                            Job Alerts
                        </Link>
                    </nav>

                    {/* AUTH BUTTONS - DESKTOP */}
                    <div className="hidden items-center space-x-4 md:flex">
                        {auth.user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-200">Welcome, {auth.user.name}</span>
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href={login()}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-amber-600"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-flex items-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none"
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
                            className="inline-flex items-center justify-center rounded-md p-2 text-white transition-colors hover:bg-blue-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-expanded={isMobileMenuOpen}
                            aria-label="Toggle navigation menu"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU BACKDROP & CONTENT */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 top-16 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />

                    {/* Menu Content */}
                    <div className="fixed top-16 right-0 left-0 max-h-[calc(100vh-64px)] overflow-y-auto bg-white shadow-lg md:hidden">
                        <div className="space-y-1 p-4">
                            {/* Navigation Links */}
                            <Link href="/" className={mobileNavLinkClasses('/')} onClick={() => setIsMobileMenuOpen(false)}>
                                Home
                            </Link>

                            <Link href="/jobs" className={mobileNavLinkClasses('/jobs')} onClick={() => setIsMobileMenuOpen(false)}>
                                Jobs
                            </Link>

                            <Link href="/law-firms" className={mobileNavLinkClasses('/law-firms')} onClick={() => setIsMobileMenuOpen(false)}>
                                Law Firms
                            </Link>

                            <Link href="/job-alerts" className={mobileNavLinkClasses('/job-alerts')} onClick={() => setIsMobileMenuOpen(false)}>
                                Job Alerts
                            </Link>

                            {/* Divider */}
                            <div className="my-4 border-t border-gray-200" />

                            {/* Auth Section */}
                            {auth.user ? (
                                <div className="space-y-2">
                                    <div className="px-4 py-2 text-sm font-medium text-gray-700">{auth.user.name}</div>
                                    <Link
                                        href={dashboard()}
                                        className="block w-full rounded-lg bg-amber-600 px-4 py-3 text-center text-sm font-medium text-white transition-all hover:bg-amber-700"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Go to Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        href={login()}
                                        className="block w-full rounded-lg border-2 border-amber-600 px-4 py-3 text-center text-sm font-medium text-amber-600 transition-colors hover:bg-amber-50"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="block w-full rounded-lg bg-amber-600 px-4 py-3 text-center text-sm font-medium text-white transition-all hover:bg-amber-700"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
