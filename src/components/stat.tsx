"use client";
import React, { useEffect, useRef, useState, memo } from "react";
import { animate, useInView } from "framer-motion";
import { QueueApi } from "@/apis/queue";
import { SwalTop } from "@/utils/sweetAlerttop";

interface Queue {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
}

type StatProps = {
    num: number;
    suffix?: string;
    decimals?: number;
    subheading: string;
};

const Stat = memo(function Stat({ num, suffix = "", decimals = 0, subheading }: StatProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const numberRef = useRef<HTMLSpanElement | null>(null);
    const isInView = useInView(containerRef, { once: true });

    const previous = useRef(0);

    useEffect(() => {
        if (!isInView || !numberRef.current) return;

        const from = previous.current ?? 0;
        const to = num;

        const controls = animate(from, to, {
            duration: 0.8,
            onUpdate(value) {
                if (numberRef.current) numberRef.current.textContent = value.toFixed(decimals);
            },
        });

        controls.then(() => {
            previous.current = to;
        });

        return () => controls.stop();
    }, [num, decimals, isInView]);

    return (
        <div ref={containerRef} className="flex w-72 flex-col items-center py-8 sm:py-0">
            <p className="mb-2 text-center text-7xl font-semibold sm:text-6xl">
                <span ref={numberRef} className="text-pink-600" />
                {suffix}
            </p>
            <p className="max-w-48 text-center text-neutral-600">{subheading}</p>
        </div>
    );
});

export const CountUpStats = () => {
    const [notidata, setNotidata] = useState<Queue | null>(null);
    const [sladata, setSladata] = useState<Queue | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const [notifyRes, slaRes] = await Promise.all([
                    QueueApi.find("notification-queue"),
                    QueueApi.find("sla-queue"),
                ]);
                if (cancelled) return;

                setNotidata(notifyRes.data.data as Queue);
                setSladata(slaRes.data.data as Queue);
            } catch {
                if (!cancelled) SwalTop("error", "เกิดข้อผิดพลาดในการดึงข้อมูล");
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="mx-auto max-w-5xl px-4 py-20 md:py-24">
            <h2 className="mb-8 text-center text-base text-pink-900 sm:text-lg md:mb-10">
                Ticket Notify Job
            </h2>
            <div className="flex flex-col items-center justify-center sm:flex-row">
                <Stat num={notidata?.waiting ?? 0} subheading="waiting" />
                <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
                <Stat num={notidata?.active ?? 0} subheading="active" />
                <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
                <Stat num={notidata?.completed ?? 0} subheading="completed" />
                <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
                <Stat num={notidata?.failed ?? 0} subheading="failed" />
                <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
                <Stat num={notidata?.delayed ?? 0} subheading="delayed" />
            </div>

            <h2 className="mt-16 mb-8 text-center text-base text-pink-900 sm:text-lg md:mb-10">
                Ticket SLA Job
            </h2>
            <div className="flex flex-col items-center justify-center sm:flex-row">
                <Stat num={sladata?.waiting ?? 0} subheading="waiting" />
                <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
                <Stat num={sladata?.active ?? 0} subheading="active" />
                <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
                <Stat num={sladata?.completed ?? 0} subheading="completed" />
                <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
                <Stat num={sladata?.failed ?? 0} subheading="failed" />
                <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
                <Stat num={sladata?.delayed ?? 0} subheading="delayed" />
            </div>
        </div>
    );
};
