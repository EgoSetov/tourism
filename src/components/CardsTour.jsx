import React, { useState } from 'react'
import { Card, Nav } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

function CardsTour(props) {
	const { name, rating, desc, urlImage, price } = props.info

	const [choice, setChoice] = useState('desc') // image | desc

	return (
		<Card>
			<Card.Header>
				<Nav variant="tabs" defaultActiveKey="#first">
					<Nav.Item>
						<Nav.Link onClick={() => setChoice('desc')} className={choice === 'desc' ? 'active' : ''}>Описание</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link onClick={() => setChoice('image')} className={choice === 'image' ? 'active' : ''}>Картинка</Nav.Link>
					</Nav.Item>
				</Nav>
			</Card.Header>
			{choice === 'image' ?
				<Card.Body>
					<Image style={{ maxHeight: "500px" }} rounded fluid src={urlImage} />
				</Card.Body>
				:
				<Card.Body>
					<Card.Title>{name}  {(new Array(rating).fill(1)).map(el => '⭐')}</Card.Title>
					<Card.Text>
						{desc}
					</Card.Text>
				</Card.Body>
			}
			<Card.Footer>
				<Card.Text>
					ОТ {price} РУБ.
				</Card.Text>
			</Card.Footer>
		</Card>
	)
}

export default CardsTour