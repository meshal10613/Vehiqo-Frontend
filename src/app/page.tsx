import Link from "next/link";
import { Button } from "../components/ui/button";

// async function sleep(ms: number) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
// }

export default async function Home() {
    // await sleep(10000);
    return (
        <div>
            <Button variant={`outline`} className={`text-primary cursor-pointer`}>
                <Link href={`/login`}>Login</Link>{" "}
            </Button>
        </div>
    );
}
