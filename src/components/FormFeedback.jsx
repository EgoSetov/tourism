import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

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

	}

  return (
	  <Form>
		  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
			  <Form.Label>Введите имя*</Form.Label>
			  <Form.Control reqiured onChange={changeIV} name="name" value={IV.name} type="text" placeholder="Имя:" />
		  </Form.Group>
		  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
			  <Form.Label>Введите email*</Form.Label>
			  <Form.Control reqiured onChange={changeIV} name="email" value={IV.email} type="email" placeholder="Email:" />
		  </Form.Group>
		  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
			  <Form.Label>Введите сообщение</Form.Label>
			  <Form.Control onChange={changeIV} name="msg" value={IV.msg} as="textarea" placeholder='Как заказать поездку?' rows={3} />
		  </Form.Group>
		  <Button onClick={orderCall} variant='success'>Заказать звонок</Button>
	  </Form>
  )
}

export default FormFeedback