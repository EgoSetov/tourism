import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { NotificationManager } from 'react-notifications'
import { addApplications } from '../api/events'

const FormFeedback = (props) => {

	const [IV, setIV] = useState({
		name: '',
		email: '',
		msg: ''
	})

	const changeIV = (e) => {
		setIV(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}))
	}

	const orderCall = async () => {
		if (!IV.name && !IV.email) return NotificationManager.error('Необходимо заполнить все поля со звездочкой')

		const res = await addApplications(IV)
		if (res?.status === 'ADDED') {
			NotificationManager.success('Заявка успешно отправлена!')
			setIV({
				name: '',
				email: '',
				msg: ''
			})
		}
	}

	return (
		<Form>
			<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
				<Form.Label>Введите имя*</Form.Label>
				<Form.Control reqiured="true" onChange={changeIV} name="name" value={IV.name} type="text" placeholder="Имя:" />
			</Form.Group>
			<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
				<Form.Label>Введите email*</Form.Label>
				<Form.Control reqiured="true" onChange={changeIV} name="email" value={IV.email} type="email" placeholder="Email:" />
			</Form.Group>
			<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
				<Form.Label>Введите сообщение</Form.Label>
				<Form.Control onChange={changeIV} name="msg" value={IV.msg} as="textarea" placeholder='Как заказать поездку?' rows={3} />
			</Form.Group>
			<Button onClick={orderCall} variant='success'>Отправить</Button>
		</Form>
	)
}

export default FormFeedback