import React, { useEffect, useState } from 'react'
import {getCitys } from '../api/events'
import CardsTour from '../components/CardsTour'
import InputSearch from '../components/InputSearch'
import Spinner from '../components/Spinner'

const Home = () => {

	// Состояния
	const [IV, setIV] = useState('')
	const [citys, setCitys] = useState([])
	const [loading, setloading] = useState(false)

	// Фильтрация массива по значению в IV
	const searchFilter = citys.filter(city => city.city.toLowerCase().includes(IV.toLowerCase()))

	// Получение всех регионов из БД при готовности приложения рендерица
	useEffect(() => {
		(async () => {
			setloading(true)
			const res = await getCitys()
			if (res?.status === 'SUCCESS') {
				setCitys(res.items)
			}
			setloading(false)
		})()
	}, [])

	// Разметка
	return (
		<>
			<div className="titleImage"></div>
			<InputSearch IV={IV} setIV={setIV} />
			<hr />
			<h1>Вам может понравится</h1>
			{(searchFilter.length && !loading) ?
				searchFilter.map(tour => (
					<>
						<h3>{tour.city}</h3>
						<br />
						<div className="popular">
							{
								tour.hotels.map(hotel => (
									<CardsTour key={hotel.id} info={hotel} />
								))
							}
							<hr />
						</div>
					</>
				))
				:
				''
			}
			{loading ? <Spinner /> : ''}

		</>
	)
}

export default Home