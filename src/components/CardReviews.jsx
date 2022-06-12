import React from 'react'
import { Card } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

const CardReviews = (props) => {
	const { name, city, hotel, text } = props.info

	return (
		<Card style={{ width: '100%' }}>
			<Card.Header>
				<Card.Text>{name}</Card.Text>
			</Card.Header>
			<Card.Body>
				<Card.Title>{city}</Card.Title>
				<Card.Subtitle className="mb-2 text-muted">{hotel}</Card.Subtitle>
				<Card.Text>{text}</Card.Text>
			</Card.Body>
		</Card>
	)
}

export default CardReviews