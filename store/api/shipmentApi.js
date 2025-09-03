import api from "./index";

const shipmentApi = api.injectEndpoints({
  endpoints: (build) => ({
    trackShipment: build.mutation({
      query: (payload) => ({
        url: "/call/shipment",
        method: "POST",
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useTrackShipmentMutation } = shipmentApi;
