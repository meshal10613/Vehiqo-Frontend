import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Profile | Vehiqo",
    description: "Manage your vehicle rental system from the admin dashboard.",
};

export default function MyProfilePage() {
	return(
		<div>
			<h1>This is My-profile Page</h1>
		</div>
	)
}