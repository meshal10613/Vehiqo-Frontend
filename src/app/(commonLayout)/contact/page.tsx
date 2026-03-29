export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Contact from "../../../components/modules/common/Contact";

export const metadata: Metadata = {
    title: "Contact | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

export default function ContactPage() {
    return <Contact />;
}
