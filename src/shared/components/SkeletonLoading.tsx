import React from 'react'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface SkeletonProps {
    type?: "profile-page" | "card" | "table";
}

const SkeletonLoading: React.FC<SkeletonProps> = ({ type = "list" }) => {
    switch (type) {
        case "profile-page":
            return (
                <div className="skeleton-profile">
                    <div className="skeleton-profile-left">
                        <Skeleton circle width={250} height={250} />
                        <Skeleton height={20} width="80%" className="bg-gray-300 rounded" />
                        <Skeleton height={15} width="60%" className="bg-gray-300 rounded" />
                        <Skeleton height={15} width="90%" className="bg-gray-300 rounded" />
                        <Skeleton height={20} width="80%" className="bg-gray-300 rounded" />
                        <Skeleton height={15} width="60%" className="bg-gray-300 rounded" />
                        <Skeleton height={15} width="90%" className="bg-gray-300 rounded" />
                    </div>
                    <div className="">
                        <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow-sm">
                            <Skeleton height={20} width="80%" className="bg-gray-300 rounded" />
                            <Skeleton height={15} width="60%" className="bg-gray-300 rounded" />
                            <Skeleton height={15} width="90%" className="bg-gray-300 rounded" />
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                            <Skeleton height={20} width="80%" className="bg-gray-300 rounded" />
                        </div>
                    </div>
                </div>

            );
        case "table":
            return (
                <div>
                    <Skeleton height={30} width="100%" />
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} height={20} width="100%" style={{ marginTop: 5 }} />
                    ))}
                </div>
            );

        default:
            return (
                <div>
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} height={20} width="100%" style={{ marginBottom: 10 }} />
                    ))}
                </div>
            );
    }
}

export default SkeletonLoading
