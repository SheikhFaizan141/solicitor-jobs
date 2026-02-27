import MainFooter from '@/components/main-footer';
import MainHeader from '@/components/main-header';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* HEADER */}
            <MainHeader />

            {/* MAIN CONTENT */}
            <main className="min-h-[calc(100vh-8rem)]">{children}</main>

            {/* FOOTER */}
            <MainFooter />
        </>
    );
}
