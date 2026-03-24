"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Tag, ShieldCheck, Zap, Headphones } from "lucide-react";

import img1 from "../../../../public/Why/why-choose-us1.jpg";
import img2 from "../../../../public/why/why-choose-us2.jpg";
import img3 from "../../../../public/why/why-choose-us3.jpg";

const features = [
    {
        icon: Tag,
        title: "Transparent Pricing",
        desc: "No hidden fees or surprise charges.",
    },
    {
        icon: ShieldCheck,
        title: "Premium Insurance",
        desc: "Zero deductibles & 24/7 roadside assistance.",
    },
    {
        icon: Zap,
        title: "Instant Booking",
        desc: "Book in under 2 minutes.",
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        desc: "Always available for help.",
    },
];

export default function WhyChoose() {
    return (
        <section className="w-full bg-[#eef1ec] py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                    {/* LEFT */}
                    <div className="flex-1 w-full space-y-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900">
                                Why Choose RentQ?
                            </h2>
                            <p className="text-zinc-600 mt-3 max-w-md text-sm sm:text-base">
                                Premium vehicles, transparent pricing, and a
                                seamless rental experience.
                            </p>
                        </div>

                        {/* FEATURES */}
                        <div className="divide-y divide-zinc-300">
                            {features.map(({ icon: Icon, title, desc }) => (
                                <div
                                    key={title}
                                    className="flex gap-4 py-4 sm:py-5"
                                >
                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-700 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-zinc-900 text-sm sm:text-base">
                                            {title}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                                            {desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* STATS */}
                        <div className="flex gap-10 sm:gap-16 pt-4">
                            <div>
                                <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900">
                                    1K+
                                </p>
                                <p className="text-xs sm:text-sm text-zinc-600">
                                    Vehicles in Fleet
                                </p>
                            </div>

                            <div>
                                <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900">
                                    99%
                                </p>
                                <p className="text-xs sm:text-sm text-zinc-600">
                                    Customer Satisfaction
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex-1 w-full relative">
                        {/* MOBILE (< md) */}
                        <div className="flex flex-col gap-4 md:hidden">
                            <Image
                                src={img1}
                                alt=""
                                className="rounded-xl h-45 object-cover"
                            />
                            <Image
                                src={img2}
                                alt=""
                                className="rounded-xl h-55 object-cover"
                            />
                            <Image
                                src={img3}
                                alt=""
                                className="rounded-xl h-45 object-cover"
                            />
                        </div>

                        {/* TABLET (md → lg) */}
                        <div className="hidden md:flex lg:hidden relative h-105">
                            {/* left */}
                            <div className="absolute left-0 top-6 w-[48%]">
                                <div className="rounded-xl overflow-hidden border-[5px] border-white shadow-lg">
                                    <Image src={img1} alt="" />
                                </div>
                            </div>

                            {/* right */}
                            <div className="absolute right-0 top-0 w-[52%]">
                                <div className="rounded-xl overflow-hidden border-[5px] border-white shadow-lg">
                                    <Image src={img3} alt="" />
                                </div>
                            </div>

                            {/* bottom center */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%]">
                                <div className="rounded-xl overflow-hidden border-[5px] border-white shadow-xl">
                                    <Image src={img2} alt="" />
                                </div>
                            </div>
                        </div>

                        {/* DESKTOP (lg+) */}
                        <div className="hidden lg:block relative h-130 xl:h-150">
                            {/* top left */}
                            <motion.div
                                initial={{ opacity: 0, y: -40, rotate: -6 }}
                                whileInView={{ opacity: 1, y: 0, rotate: -6 }}
                                className="absolute top-0 left-10 w-[38%] z-10"
                            >
                                <div className="rounded-xl overflow-hidden border-[6px] border-white shadow-xl">
                                    <Image src={img1} alt="" />
                                </div>
                            </motion.div>

                            {/* top right */}
                            <motion.div
                                initial={{ opacity: 0, y: -40, rotate: 6 }}
                                whileInView={{ opacity: 1, y: 0, rotate: 6 }}
                                className="absolute top-0 right-0 w-[42%] z-20"
                            >
                                <div className="rounded-xl overflow-hidden border-[6px] border-white shadow-xl">
                                    <Image src={img3} alt="" />
                                </div>
                            </motion.div>

                            {/* bottom */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] z-30"
                            >
                                <div className="rounded-xl overflow-hidden border-[6px] border-white shadow-2xl">
                                    <Image src={img2} alt="" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
