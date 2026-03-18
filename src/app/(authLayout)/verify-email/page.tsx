import VerifyEmailForm from "../../../components/modules/auth/VerifyEmail";

interface VerifyEmailParams {
    searchParams: Promise<{ redirect?: string; email?: string }>;
}

export default async function VerifyEmailPage({
    searchParams,
}: VerifyEmailParams) {
    const params = await searchParams;
    const redirectPath = params.redirect;
    const email = params.email;

    return <VerifyEmailForm email={email} redirectPath={redirectPath} />;
}
