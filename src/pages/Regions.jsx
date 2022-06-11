import React from 'react'
import CardsRegion from '../components/CardsRegion'

const Regions = () => {

	const regions = [
		{
			id: 1,
			name: "Карелия",
			desc: 'бла бла бла',
			urlImage: 'https://traveltimes.ru/wp-content/uploads/2021/07/full_____________________________________________.jpg'
		}
	]

	return (
		<>
			<h1>Доступные регионы</h1>
			<hr />
			<div className="regions">
				{regions.map(region => (
					<CardsRegion key={region.id} info={region} />
				))}
			</div>

		</>
	)
}

export default Regions