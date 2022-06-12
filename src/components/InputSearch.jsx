import React, { useState } from 'react'
import { InputGroup, DropdownButton, Dropdown, Form, Button } from 'react-bootstrap'

function InputSearch(props) {

	const [IV, setIV] = useState('')

	const changeIV = (e) => {
		setIV(e.target.value)
		props.setIV(e.target.value)
	}

	const pasteToInput = (text) => { setIV(text); props.setIV(text) }

	const search = async () => {}

	const popularPlaces = [
		{ text: 'Карелия' },
		{ text: 'Домбай' },
		{ text: 'Сочи' },
		{ text: 'Туапсе' },
	]

	return (
		<InputGroup className="mb-3">
			<DropdownButton
				variant="outline-secondary"
				title="Часто ищут"
				id="input-group-dropdown-1"
			>
				{popularPlaces.map(place => (
					<Dropdown.Item onClick={() => pasteToInput(place.text)}>{place.text}</Dropdown.Item>
				))}
			</DropdownButton>
			<Form.Control value={IV} onChange={changeIV} placeholder='Можете попробовать найти' aria-label="Text input with dropdown button" />
		</InputGroup>
	)
}

export default InputSearch