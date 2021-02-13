import React from 'react';
import { makeStyles, TextField, Button, Table, TableHead, TableRow, TableBody, TableCell, Radio } from '@material-ui/core';

const useStyles = makeStyles(() => ({
	content: {
		position: 'absolute',
		width: '840px',
		maxHeight: '95vh',
		overflow: 'scroll',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		background: 'white',
		borderRadius: '4px'
	},
	header: {
		padding: '20px 30px',
		borderBottom: '1px solid #ddd',
		fontWeight: 'bold',
		fontSize: '20px'
	},
	body: {
		padding: '20px 30px'
	},
	footer: {
		display: 'flex',
		justifyContent: 'flex-end',
		padding: '14px 30px'
	},
	textRight: {
		textAlign: 'right',
	}
}));

const DriverAssign = (props) => {
	const classes = useStyles();

	const [ currentDriver, setCurrentDriver ] = React.useState(props.drivers.find(d => d.id === props.order.driverId));

	const handleDriverSelectionChange = (driver) => {
		setCurrentDriver(driver);
	};

	return (
		<div className={classes.content}>
			<div className={classes.header}>
				{props.order.user.username}'s order ({props.order.id})
			</div>

			<div className={classes.body}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell style={{width: 40}}></TableCell>
							<TableCell>Driver Name</TableCell>
							<TableCell>Contact</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{props.drivers.map((driver) => (
							<TableRow key={driver.id}>
								<TableCell>
									<Radio
										checked={driver.id && currentDriver && currentDriver.id === driver.id}
										onChange={() => handleDriverSelectionChange(driver)}
										value={driver.id}
										name="assignDriverRadio"
									/>
								</TableCell>
								<TableCell>{driver.username}</TableCell>
								<TableCell>{driver.mobile || driver.email}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				
			</div>

			<div className={classes.footer}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => props.onDriverAssign(currentDriver)}
					style={{ margin: '30px 20px 12px' }}
				>
					Assign Driver
				</Button>

				<Button
					variant="contained"
					onClick={props.onCloseClick}
					style={{ margin: '30px 0 12px' }}
				>
					Close
				</Button>
			</div>
		</div>
	);
};

export default DriverAssign;
