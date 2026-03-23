import { Metadata } from "next";
import PaymentSuccess from "../../../../../components/modules/payment/PaymentSuccess";

export const metadata: Metadata = {
    title: "Payment Success | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

export default function PaymentSuccessPage() {
    return <PaymentSuccess />;
}
