import Banner from "../../components/modules/home/Banner";
import { IVehicleCategory } from "../../types/vehicleCategory.type";
import VehicleCategory from "../../components/modules/common/VehicleCategory";
import { IPublicStats } from "../../types/stats.type";
import Stats from "../../components/modules/common/Stats";
import Faq from "../../components/modules/common/Faq";
import Reviews from "../../components/modules/home/Reviews";
import { getPublicStats } from "../../services/stats.services";
import { getAllVehicleCategory } from "../../services/vehicleCategory.services";
import { IReview } from "../../types/review.type";

export default async function Home() {
    const [stats, category] = await Promise.all([
        getPublicStats(),
        getAllVehicleCategory(),
    ]);
    const stat: IPublicStats = stats.data ?? {
        vehicleType: 0,
        vehicleCategory: 0,
        vehicle: 0,
        review: 0,
    };
    const vehicleCategory: IVehicleCategory[] | [] = category.data ?? [];
    const reviews: IReview[] = [];
    return (
        <div>
            <Banner/>
            <VehicleCategory vehicleCategory={vehicleCategory} />
            <Stats stat={stat} />
            <Faq/>
            <Reviews reviews={reviews}/>
        </div>
    );
}
