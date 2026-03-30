export interface IPublicStats {
    vehicleType: number;
    vehicleCategory: number;
    vehicle: number;
    review: number;
}

export interface ICustomerStats {
    booking: {
        total: number;
        status: {
            pending: number;
            advancePaid: number;
            pickedUp: number;
            returned: number;
            cancelled: number;
            completed: number;
        };
    };
    payment: {
        total: number;
        status: {
            unpaid: number;
            pending: number;
            paid: number;
            failed: number;
            refunded: number;
        };
        type: {
            advance: number;
            final: number;
            full: number;
            refund: number;
        };
        method: {
            cash: number;
            stripe: number;
            sslcommerz: number;
            bkash: number;
            nogod: number;
        };
        totalSpent: number;
    };
    review: {
        total: number;
    };
}

export interface IAdminStats {
    fuelPrice: {
        fuelType: string;
        pricePerUnit: number;
        unit: string;
    }[];
    user: {
        user: number;
        admin: number;
        customer: number;
    };
    review: number;
    vehicleCategory: number;
    vehicleType: number;
    vehicle: {
        total: number;
        transmission: {
            manual: number;
            automatic: number;
            semi_automatic: number;
            none: number;
        };
        status: {
            available: number;
            booked: number;
            maintenance: number;
            rented: number;
            retired: number;
        };
        fuel: {
            petrol: number;
            octane: number;
            diesel: number;
            hybrid: number;
            cng: number;
            electric: number;
        };
    };
    booking: {
        total: number;
        status: {
            pending: number;
            advancePaid: number;
            pickedUp: number;
            returned: number;
            cancelled: number;
            completed: number;
        };
    };
    payment: {
        total: number;
        totalRevenue: number;
        status: {
            unpaid: number;
            pending: number;
            paid: number;
            failed: number;
            refunded: number;
        };
        type: {
            advance: number;
            final: number;
            full: number;
            refund: number;
        };
        method: {
            cash: number;
            stripe: number;
            sslcommerz: number;
            bkash: number;
            nogod: number;
        };
    };
}
