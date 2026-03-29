export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import About from "../../../components/modules/common/About";

export const metadata: Metadata = {
    title: "About Us | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

export default function AboutUsPage() {
    return <About />;
}
