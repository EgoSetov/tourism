import React from 'react'
import { Card, Button } from 'react-bootstrap'

const CardsRegion = (props) => {
	const { city, urlImage, desc } = props.info

	return (
		<Card style={{ width: '18rem' }}>
			<Card.Img variant="top" src={urlImage} />
			<Card.Body>
				<Card.Title>{city}</Card.Title>
				<Card.Text>
					{desc}
				</Card.Text>
			</Card.Body>
		</Card>
	)
}

export default CardsRegion