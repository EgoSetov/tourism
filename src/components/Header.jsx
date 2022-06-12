import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Header = () => {

	const links = [
		{
			to: '/regions',
			title: 'Регионы'
		},
		{
			to: '/payment',
			title: 'Оплата'
		},
		{
			to: '/contacts',
			title: 'Контакты'
		},
		{
			to: '/reviews',
			title: 'Отзывы'
		}
	]

	return (
		<Navbar bg="dark" variant="dark">
			<Container>
				<Navbar.Brand><Link to="/" style={{ color: "white", textDecoration: "none" }}>Многодневные туры</Link></Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						{links.map(link => (
							<Nav.Link key={link.to}>
								<Link style={{ color: "grey", textDecoration: "none" }} to={link.to}>
									{link.title}
								</Link>
							</Nav.Link>
						))}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>

	)
}

export default Header