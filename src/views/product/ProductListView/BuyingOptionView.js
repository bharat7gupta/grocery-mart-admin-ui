import React, { useState } from 'react';
import { Select, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
		justifyContent: 'space-between'
  },
  mrp: {
		marginRight: '12px',
		fontSize: '12px',
    color: 'grey'
  },
  offer: {
    fontSize: '14px',
		color: 'green'
	},
	price: {
		marginRight: '12px',
		fontSize: '18px',
		fontWeight: 'bold',
		color: 'black'
	}
}));

export default function BuyingOptionView(props) {
	const classes = useStyles();
	const [ currentOption, setCurrentOption ] = useState(props.values[0]);

	const handleUnitChange = (event) => {
		setCurrentOption(
			props.values.find(o => o.unit === event.target.value)
		)
	};

	return (
		<div className={classes.root}>
			<Select
				native
				value={currentOption && currentOption.unit}
				onChange={handleUnitChange}
			>
				{props.values.map(value => (
					<option>{value.unit}</option>
				))}
			</Select>

			{currentOption && (
				<div style={{ marginTop: '8px' }}>
					<span className={classes.price}>{currentOption.price}</span>
					<span className={classes.mrp}>{currentOption.mrp}</span>
					<span className={classes.offer}>{currentOption.offer}% off</span>
				</div>
			)}
		</div>
	);
}
