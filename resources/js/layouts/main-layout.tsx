import MainFooter from '@/components/main-footer';
import MainHeader from '@/components/main-header';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* HEADER */}
            <MainHeader />

            {/* MAIN CONTENT */}
            <main>{children}</main>

            {/* FOOTER */}
            <MainFooter />
        </>
    );
}
