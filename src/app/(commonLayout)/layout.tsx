import { redirect } from "next/navigation";
import Navbar from "../../components/modules/home/Navbar";
import { getUserInfo, logoutUser } from "../../services/auth.services";
import Footer from "../../components/modules/home/Footer";

export default async function CommonLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const userInfo = await getUserInfo();

    return (
        <>
            <Navbar user={userInfo} />
            <div className="min-h-[calc(100vh-657px)]">{children}</div>
            <Footer />
        </>
    );
}
