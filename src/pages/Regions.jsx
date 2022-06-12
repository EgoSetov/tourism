import React, { useEffect, useState } from 'react'
import { getCitys } from '../api/events'
import CardsRegion from '../components/CardsRegion'
import Spinner from '../components/Spinner'

const Regions = () => {

	const [citys, setCitys] = useState([])
	const [loading, setloading] = useState(false)

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

	return (
		<>
			<h1>Доступные регионы</h1>
			<hr />
			{citys.length ?
				<div className="regions">
					{citys.map(region => (
						<CardsRegion key={region.id} info={region} />
					))}
				</div>
				:
				''
		}
			{loading ? <Spinner /> : ''}
		</>
	)
}

export default Regions