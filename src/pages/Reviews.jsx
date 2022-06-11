import React, { useState } from 'react'
import CardReviews from '../components/CardReviews'
import { Form, Button } from 'react-bootstrap'

const Reviews = () => {

	const [IV, setIV] = useState({
		text: '',
		name: ''
	})

	const reviews = [
		{
			id: 1,
			city: 'Сочи',
			hotelName: "Лазурь Курортный",
			personName: "Егор",
			text: 'Все понравилось, спасибо!'
		}
	]

	const leaveReview = async () => { }

	return (
		<>
			<h1>Отзывы</h1>
			<hr />
			{reviews.map(review => (<CardReviews info={review} />))}
			<hr />
			<h5>Написать отзыв</h5>
			<Form>
				<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
					<Form.Label>Введите имя*</Form.Label>
					<Form.Control reqiured onChange={(e) => setIV(e.target.name)} name="name" value={IV.name} type="text" placeholder="Имя:" />
				</Form.Group>
				<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
					<Form.Label>Введите сообщение*</Form.Label>
					<Form.Control reqiured onChange={(e) => setIV(e.target.name)} name="text" value={IV.text} as="textarea" placeholder='Все понравилось!' rows={3} />
				</Form.Group>
				<Button onClick={leaveReview} variant='success'>Заказать звонок</Button>
			</Form>
		</>
	)
}

export default Reviews