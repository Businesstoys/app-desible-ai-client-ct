"use client";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { useTrackShipmentMutation } from "@/store";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function TrackOrderForm() {
    const [formData, setFormData] = useState({
        toPhone: "",
        dispatcherName: "",
        destination: "",
        origin: "",
        carrierName: "",
        pickupDate: null,
        deliveryDate: null,
    });

    const [trackShipment, { isLoading, isError, isSuccess }] = useTrackShipmentMutation();

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePickupDate = (date) => {
        setFormData((prev) => ({ ...prev, pickupDate: date }));
    };

    const handleDeliveryDate = (date) => {
        setFormData((prev) => ({ ...prev, deliveryDate: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                pickupDate: formData.pickupDate
                    ? format(formData.pickupDate, "yyyy-MM-dd'T'HH:mm:ss")
                    : null,
                deliveryDate: formData.deliveryDate
                    ? format(formData.deliveryDate, "yyyy-MM-dd'T'HH:mm:ss")
                    : null,
            };

            await trackShipment(payload).unwrap();
            showSuccessToast("Shipment tracked successfully ✅");

        } catch (err) {
            console.error(err);
            showErrorToast('Failed to track shipment ❌')
        }
    };


    return (
        <div className="flex flex-col gap-4 min-h-[90vh] bg-gray-50 p-6">
            <h2 className="text-2xl font-bold text-gray-800 ">
                Track Order
            </h2>
            <form
                onSubmit={handleSubmit}
                className="w-full bg-white shadow-sm rounded-2xl p-6 space-y-6"
            >

                <div className="grid grid-cols-2 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            To Phone
                        </label>
                        <input
                            type="tel"
                            name="toPhone"
                            value={formData.toPhone}
                            onChange={handleChange}
                            placeholder="+1234567890"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    {/* Dispatcher Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dispatcher Name
                        </label>
                        <input
                            type="text"
                            name="dispatcherName"
                            value={formData.dispatcherName}
                            onChange={handleChange}
                            placeholder="Enter dispatcher name"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    {/* Destination */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Destination
                        </label>
                        <input
                            type="text"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            placeholder="Enter destination"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    {/* Origin */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Origin
                        </label>
                        <input
                            type="text"
                            name="origin"
                            value={formData.origin}
                            onChange={handleChange}
                            placeholder="Enter origin"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    {/* Carrier Name (full width) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Carrier Name</label>
                        <input
                            type="text"
                            name="carrierName"
                            value={formData.carrierName}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Pickup Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.pickupDate
                                        ? format(formData.pickupDate, "yyyy-MM-dd'T'HH:mm:ss")
                                        : "Select date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.pickupDate}
                                    onSelect={handlePickupDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Delivery Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.deliveryDate
                                        ? format(formData.deliveryDate, "dd MMM yyyy")
                                        : "Select date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.deliveryDate}
                                    onSelect={handleDeliveryDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                </div>

                {/* Submit Button */}
                <div className="flex justify-end ">
                    <button
                        type="submit"
                        className="w-fit bg-primary hover:bg-primary text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
