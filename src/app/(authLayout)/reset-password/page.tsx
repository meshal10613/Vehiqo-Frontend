import { Metadata } from "next";
import ResetPasswordForm from "../../../components/modules/auth/ResetPasswordForm";

export const metadata: Metadata = {
    title: "Reset Password | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

interface ResetPasswordParams {
    searchParams: Promise<{ redirect?: string; email: string }>;
}

export default async function ResetPasswordPage({
    searchParams,
}: ResetPasswordParams) {
    const params = await searchParams;
    const redirectPath = params.redirect;
    const email = params.email;

    return (
        <ResetPasswordForm email={email} redirectPath={redirectPath} />
    );
}
