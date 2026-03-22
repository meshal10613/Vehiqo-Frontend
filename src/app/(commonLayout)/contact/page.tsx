import { Metadata } from "next";
import Contact from "../../../components/modules/common/Contact";

export const metadata: Metadata = {
    title: "Contact Us | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

export default function ContactPage() {
    return <Contact />;
}
