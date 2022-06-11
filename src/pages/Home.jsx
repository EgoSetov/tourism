import React from 'react'
import CardsTour from '../components/CardsTour'
import InputSearch from '../components/InputSearch'

const Home = () => {

	const tourse = [
		{
			id: 1,
			city: 'Карелия',
			hotels: [
				{
					id: 1,
					name: 'Калевала',
					rating: 3,
					desc: `
						Калевала (Kalevala) находится в деревне Косалма. Отель состоит из главного здания и 4 коттеджей, располагает 31 номером. Отель открыт в 2006 году, ежегодно проводится косметический ремонт. 

						Услуги и развлечения:
						Магазин сувениров, Банкетный зал, Бар, Ресторан, Парковка, Балкон, Душ, Сейф (платно), Телевизор, Телефон, Холодильник, Отопление, Ванна, Ксерокс, Факс, Конференц-зал, Шезлонги и зонтики на пляже, Частный пляж, Песчаный пляж, Детская площадка, Настольный теннис, Рыбная ловля, Аренда спортинвентаря, Сануа, Шахматы, Бильярд (платно).

						Размещение:
						До аэропорта - 28 км., До пляжа - 150 м., До центра города - 1.1 км.

						Для 2-х человек, перелет включен.
					`,
					urlImage: 'https://www.kurortbest.ru/assets/images/1/7/otel-kalevala-kareliya.jpg',
					price: 35000
				}
			]
		}
	]

	return (
		<>
			<InputSearch />
			<hr />
			<h1>Вам может понравится</h1>
			{tourse.map(tour => (
				<>
					<h3>{tour.city}</h3>
					<br />
					{
						tour.hotels.map(hotel => (
							<CardsTour key={hotel.id} info={hotel} />
						))
					}
				</>
			))}
		</>
	)
}

export default Home