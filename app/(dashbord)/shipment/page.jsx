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

  const [errors, setErrors] = useState({});
  const [trackShipment, { isLoading }] = useTrackShipmentMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const handlePickupDate = (date) => {
    setFormData((prev) => ({ ...prev, pickupDate: date }));
    if (errors.pickupDate) setErrors((prev) => ({ ...prev, pickupDate: undefined }));
  };

  const handleDeliveryDate = (date) => {
    setFormData((prev) => ({ ...prev, deliveryDate: date }));
    if (errors.deliveryDate) setErrors((prev) => ({ ...prev, deliveryDate: undefined }));
  };

  const isValidUSNumber = (value) => /^\+1\d{10}$/.test((value || "").trim());

  const validate = () => {
    const e = {};
    if (!formData.toPhone?.trim()) e.toPhone = "Phone is required.";
    else if (!isValidUSNumber(formData.toPhone))
      e.toPhone = "Use U.S. format: +1XXXXXXXXXX";

    if (!formData.dispatcherName?.trim())
      e.dispatcherName = "Dispatcher name is required.";
    if (!formData.destination?.trim())
      e.destination = "Destination is required.";
    if (!formData.origin?.trim()) e.origin = "Origin is required.";
    if (!formData.carrierName?.trim())
      e.carrierName = "Carrier name is required.";
    if (!formData.pickupDate) e.pickupDate = "Pickup date is required.";
    if (!formData.deliveryDate) e.deliveryDate = "Delivery date is required.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const isFormValid = () => {
    return (
      formData.toPhone.trim() &&
      isValidUSNumber(formData.toPhone) &&
      formData.dispatcherName.trim() &&
      formData.destination.trim() &&
      formData.origin.trim() &&
      formData.carrierName.trim() &&
      !!formData.pickupDate &&
      !!formData.deliveryDate
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showErrorToast("Please fix the errors and try again.", {
        description: "All fields are required.",
      });
      return;
    }

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
      showErrorToast("Failed to track shipment ❌");
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-[90vh] bg-gray-50 p-6">
      {/* <h2 className="text-2xl font-bold text-gray-800 ">Test Ground</h2> */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white shadow-sm rounded-2xl p-6 space-y-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Phone
            </label>
            <input
              type="tel"
              name="toPhone"
              value={formData.toPhone}
              onChange={handleChange}
              placeholder="+11234567890"
              className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.toPhone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {/* Always visible hint */}
            <p className="text-xs text-red-500 mt-1">
              Must be U.S. format: +1 followed by 10 digits (e.g. +11234567890)
            </p>
            {/* Error message */}
            {errors.toPhone && (
              <p className="text-xs text-red-600 mt-1">{errors.toPhone}</p>
            )}
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
              className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.dispatcherName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dispatcherName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.dispatcherName}
              </p>
            )}
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
              className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.destination ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.destination && (
              <p className="text-xs text-red-600 mt-1">{errors.destination}</p>
            )}
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
              className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.origin ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.origin && (
              <p className="text-xs text-red-600 mt-1">{errors.origin}</p>
            )}
          </div>

          {/* Carrier Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Carrier Name
            </label>
            <input
              type="text"
              name="carrierName"
              value={formData.carrierName}
              onChange={handleChange}
              className={`w-full rounded-md border p-2 ${
                errors.carrierName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.carrierName && (
              <p className="text-xs text-red-600 mt-1">{errors.carrierName}</p>
            )}
          </div>

          {/* Pickup Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Pickup Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    errors.pickupDate ? "border-red-500" : ""
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.pickupDate
                    ? format(formData.pickupDate, "dd MMM yyyy")
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
            {errors.pickupDate && (
              <p className="text-xs text-red-600 mt-1">{errors.pickupDate}</p>
            )}
          </div>

          {/* Delivery Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Delivery Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    errors.deliveryDate ? "border-red-500" : ""
                  }`}
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
            {errors.deliveryDate && (
              <p className="text-xs text-red-600 mt-1">{errors.deliveryDate}</p>
            )}
          </div>
        </div>

        {/* Submit Button — always visible but disabled until valid */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-fit bg-primary hover:bg-primary text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? "Submitting…" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}