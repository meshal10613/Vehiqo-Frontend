import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

import LoginForm from "../../../components/modules/auth/LoginForm";

interface LoginParams {
    searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
    const params = await searchParams;
    const redirectPath = params.redirect;
    return <LoginForm redirectPath={redirectPath} />;
};

export default LoginPage;
