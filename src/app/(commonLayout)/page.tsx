export const dynamic = 'force-dynamic';

import Banner from "../../components/modules/home/Banner";
import { IVehicleCategory } from "../../types/vehicleCategory.type";
import VehicleCategory from "../../components/modules/common/VehicleCategory";
import { IPublicStats } from "../../types/stats.type";
import Stats from "../../components/modules/common/Stats";
import Faq from "../../components/modules/common/Faq";
import { getPublicStats } from "../../services/stats.services";
import { getAllVehicleCategory } from "../../services/vehicleCategory.services";
import { IReview } from "../../types/review.type";
import { getAllReviews } from "../../services/review.services";
import Reviews from "../../components/modules/home/Reviews";

export default async function Home() {
    const [stats, category, review] = await Promise.all([
        getPublicStats(),
        getAllVehicleCategory(),
        getAllReviews()
    ]);
    const stat: IPublicStats = stats.data ?? {
        vehicleType: 0,
        vehicleCategory: 0,
        vehicle: 0,
        review: 0,
        rating: 0
    };
    const vehicleCategory: IVehicleCategory[] | [] = category.data ?? [];
    const reviews: IReview[] = review.data ?? [];

    return (
        <div>
            <Banner stat={stat}/>
            <VehicleCategory vehicleCategory={vehicleCategory} />
            <Stats stat={stat} />
            <Faq/>
            <Reviews reviews={reviews}/>
        </div>
    );
}
