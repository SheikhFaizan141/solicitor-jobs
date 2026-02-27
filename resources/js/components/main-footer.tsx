export default function MainFooter() {
    return (
        <footer className="border-t border-[#19140035] bg-amber-500 py-5">
            <div className="mx-auto max-w-7xl px-5">
                <p className="text-center text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                    &copy; {new Date().getFullYear()} Solicitor. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
