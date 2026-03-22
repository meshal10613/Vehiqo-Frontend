import Faq from "../../components/modules/common/Faq";
import Stats from "../../components/modules/common/Stats";
import VehicleCategory from "../../components/modules/common/VehicleCategory";
import { getPublicStats } from "../../services/stats.services";
import { getAllVehicleCategory } from "../../services/vehicleCategory.services";
import { IPublicStats } from "../../types/stats.type";
import { IVehicleCategory } from "../../types/vehicleCategory.type";

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

    return (
        <div>
            {/* <Banner/> */}
            <VehicleCategory vehicleCategory={vehicleCategory} />
            <Stats stat={stat} />
            <Faq/>
            {/* Review */}
        </div>
    );
}
