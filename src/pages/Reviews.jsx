import React, { useEffect, useState } from 'react'
import CardReviews from '../components/CardReviews'
import { Form, Button } from 'react-bootstrap'
import { addReview, getReview } from '../api/events'
import { NotificationManager } from 'react-notifications'

const Reviews = () => {

	const [IV, setIV] = useState({
		text: '',
		name: '',
		city: '',
		hotel: ''
	})
	const [reviews, setReviews] = useState([])


	const changeIV = (e) => {
		setIV(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}))
	}

	useEffect(() => {
		(async () => {
			const res = await getReview()
			if (res?.status === 'SUCCESS') {
				setReviews(res.items)
			}
		})()
	}, [])

	const leaveReview = async () => {
		console.log(IV);
		if (!IV.name && !IV.text && !IV.city && !IV.hotel) return NotificationManager.error('Необходимо заполнить все поля со звездочкой')
		const res = await addReview(IV)
		if (res?.status === 'ADDED') {
			NotificationManager.success('Отзыв успешно добавлен!')
			setReviews(prev => ([
				...prev,
				res.item
			]))
			setIV({
				text: '',
				name: '',
				city: '',
				hotel: ''
			})
		}
	}

	return (
		<>
			<h1>Отзывы</h1>
			<hr />
			<div className="reviews">
				{reviews.length ?
					reviews.map(review => (<CardReviews info={review} />))
					: 'Отзывов пока что нет'}
			</div>

			<hr />
			<h5>Написать отзыв</h5>
			<Form>
				<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
					<Form.Label>Введите имя*</Form.Label>
					<Form.Control reqiured onChange={changeIV} name="name" value={IV.name} type="text" placeholder="Имя:" />
				</Form.Group>
				<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
					<Form.Label>Город*</Form.Label>
					<Form.Control reqiured onChange={changeIV} name="city" value={IV.city} type="text" placeholder="Город:" />
				</Form.Group>
				<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
					<Form.Label>Отель*</Form.Label>
					<Form.Control reqiured onChange={changeIV} name="hotel" value={IV.hotel} type="text" placeholder="Отель:" />
				</Form.Group>
				<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
					<Form.Label>Введите сообщение*</Form.Label>
					<Form.Control reqiured onChange={changeIV} name="text" value={IV.text} as="textarea" placeholder='Все понравилось!' rows={3} />
				</Form.Group>
				<Button onClick={leaveReview} variant='success'>Отправить</Button>
			</Form>
		</>
	)
}

export default Reviews