import Navbar from "../../components/modules/home/Navbar";
import { getUserInfo } from "../../services/auth.services";

export default async function CommonLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const userInfo = await getUserInfo();

    return (
        <>
            <Navbar user={userInfo} />
            {children}
        </>
    );
}
