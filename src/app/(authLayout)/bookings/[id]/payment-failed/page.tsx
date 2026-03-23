import { Metadata } from "next";
import PaymentFailed from "../../../../../components/modules/payment/PaymentFailed";

export const metadata: Metadata = {
    title: "Payment Failed | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

export default function PaymentFailedPage() {
    return <PaymentFailed />;
}
