import { dataBase } from "./index.js";
import { v4 as uuidv4 } from "uuid";

export const ModelHotels = dataBase.collection("Hotels");

export const Hotel = {
  async getHotels(cityId) {
    try {
      const model = await ModelHotels.where("city", "==", cityId).get();

      const hotels = model.docs.map((doc) => doc.data());

      return hotels;
    } catch (error) {
      console.log(error);
      return {
        news: [],
        count: 0,
      };
    }
  },

  async getHotelById(hotelId) {
    try {
      const model = await ModelHotels.where("id", "==", hotelId).get();
      const hotels = model.docs.map((doc) => doc.data());
      return hotels[0];
    } catch (error) {
      console.log(error);
    }
  },

  async createHotel(data) {
    try {
      const id = uuidv4();

      const newHotel = {
        id,
        ...data,
      };

      await ModelHotels.doc(id).set(newHotel);

      return newHotel;
    } catch (error) {
      console.log(error);
    }
  },

  async updateHotel(hotelId, data) {
    try {
      const hotel = ModelHotels.doc(hotelId);

      await hotel.update(data);

      return hotel;
    } catch (error) {
      console.log(error);
    }
  },

  async deleteHotel(hotelId) {
    try {
      await ModelHotels.doc(hotelId).delete();
    } catch (error) {
      console.log(error);
    }
  },
};
