import { dashboard, login, register } from '@/routes';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <header className="mx-auto mb-6 flex w-full max-w-7xl items-center justify-between bg-red-300 px-5 pt-3 pb-5">
                {/* LOGO */}
                <Link href="/" className="text-2xl font-semibold dark:text-white">
                    Solicitor
                </Link>

                {/* NAVIGATION */}
                <nav className="flex items-center justify-end gap-4">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Log in
                            </Link>
                            <Link
                                href={register()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            {/* MAIN CONTENT */}
            <main>{children}</main>

            {/* FOOTER */}
            <footer className="bg-amber-500 border-t border-[#19140035] py-5">
                <div className="mx-auto max-w-7xl px-5">
                    <p className="text-center text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                        &copy; {new Date().getFullYear()} Solicitor. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
}
