import { db, City, Application, Review } from "./db";
import firebase from 'firebase/compat/app';
import { v4 as uuidv4 } from 'uuid';


// Citys

//get
export const getCitys = async () => {
	try {
		const citys = await City.get()
		return {
			status: 'SUCCESS',
			items: citys.docs.map(doc => doc.data())
		}
	} catch (error) {
		console.log(error);
	}
}

//add
export const addCity = async (data) => {
	try {
		const id = uuidv4()

		const res = await City.doc(id).set({
			id,
			...data
		})

		return {
			status: 'ADDED',
			item: { id, ...data }
		}

	} catch (error) {
		console.log(error);
	}
}

//add hotel
export const addHotel = async (city_id, data) => {
	try {
		const id = uuidv4()

		const res = await City.doc(city_id).update({
			hotels: firebase.firestore.FieldValue.arrayUnion({id, ...data})
		})

		return {
			status: 'ADDED',
			item: { id, ...data }
		}

	} catch (error) {
		console.log(error);
	}
}

// Applications

// add
export const addApplications = async (data) => {
	try {
		const id = uuidv4()
		const res = await Application.doc(id).set({
			id,
			...data
		})
		return {
			status: 'ADDED'
		}


	} catch (error) {
		console.log(error);
	}
}

//Review

//get
export const getReview = async () => {
	try {
		const reviews = await Review.get()
		return {
			status: 'SUCCESS',
			items: reviews.docs.map(doc => doc.data())
		}
	} catch (error) {
		console.log(error);
	}
}

//add
export const addReview = async (data) => {
	try {
		const id = uuidv4()
		const res = await Review.doc(id).set({
			id,
			...data
		})
		return {
			status: 'ADDED',
			item: {
				id,
				...data
			}
		}


	} catch (error) {
		console.log(error);
	}
}