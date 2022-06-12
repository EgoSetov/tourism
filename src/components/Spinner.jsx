import { Spinner as SpinnerBoot } from 'react-bootstrap'

const Spinner = () => (
	<SpinnerBoot animation="border" role="status">
		<span className="visually-hidden">Loading...</span>
	</SpinnerBoot>
)
 
export default Spinner