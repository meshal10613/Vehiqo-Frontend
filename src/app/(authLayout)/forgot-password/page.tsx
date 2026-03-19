import type { Metadata } from "next";
import ForgotPasswordForm from "../../../components/modules/auth/ForgotPasswordForm";

export const metadata: Metadata = {
    title: "Forgot Password | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

interface ForgotPasswordParams {
    searchParams: Promise<{ redirect?: string }>;
}

export default async function ForgotPasswordPage({
    searchParams,
}: ForgotPasswordParams) {
    const params = await searchParams;
    const redirectPath = params.redirect;

    return (
        <ForgotPasswordForm redirectPath={redirectPath} />
    );
}
