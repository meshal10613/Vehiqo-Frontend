import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

import RegisterForm from "../../../components/modules/auth/RegisterForm";

interface RegisterParams {
    searchParams: Promise<{ redirect?: string }>;
}

export default async function SignUpPage({ searchParams }: RegisterParams) {
    const params = await searchParams;
    const redirectPath = params.redirect;
    return <RegisterForm redirectPath={redirectPath} />;
}
