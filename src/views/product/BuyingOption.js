import React from 'react';
import { makeStyles, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import { XCircle } from 'react-feather';

const useStyles = makeStyles(() => ({
	inputField: {
    display: 'block',
    padding: '16px 0'
	},
	groupInput: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '16px 0'
	},
	miniInput: {
		width: '110px'
	},
	xCircle: {
		color: '#bbb',
		cursor: 'pointer'
	}
}));
export default function BuyingOption(props) {
	const classes = useStyles();
	const { value, onBuyingOptionChanged, onRemoveBuyingOption, hideRemoveOptionButton } = props;

	const handleWholesaleChange = (event) => {
		onBuyingOptionChanged({
			...value,
			isWholesale: event.target.checked
		});
	};

	const handleInputChange = event => {
		let changes;
		const valueNum = Number(event.target.value);

		if (event.target.name === 'offer') { // if offer is changed, bring price in sync
			changes = { offer: event.target.value };

			if (!isNaN(value.mrp) && !isNaN(valueNum)) {
				const price = value.mrp - ((valueNum * value.mrp) / 100);
				changes.price = +price.toFixed(2);
			}
		}
		else if (event.target.name === 'price') { // if price is changed, bring offer in sync
			changes = { price: event.target.value };

			if (!isNaN(value.mrp) && !isNaN(valueNum)) {
				const offer = ((value.mrp - valueNum) / value.mrp) * 100;
				changes.offer = +offer.toFixed(2);
			}
		}
		else { // for any other changes like unit or mrp
			changes = {
				[event.target.name]: event.target.value
			}
		}

		onBuyingOptionChanged({
			...value,
			...changes
		});
	};

	return (
		<div className={classes.groupInput}>
			<FormControlLabel
				control={
					<Checkbox
						name="isWholesale"
						size="small"
						color="primary"
						checked={value.isWholesale}
						onChange={handleWholesaleChange}
					/>
				}
				label="Wholesale"
				style={{marginRight: '0'}}
			/>

			<TextField
				name="unit"
				size="small"
				variant="outlined"
				label="Unit *"
				className={classes.miniInput}
				value={value.unit}
				onChange={handleInputChange}
			/>

			<TextField
				name="mrp"
				size="small"
				variant="outlined"
				label="MRP *"
				className={classes.miniInput}
				value={value.mrp}
				onChange={handleInputChange}
			/>

			<TextField
				name="offer"
				size="small"
				variant="outlined"
				label="Offer (%)"
				className={classes.miniInput}
				value={value.offer}
				onChange={handleInputChange}
			/>

			<TextField
				name="price"
				size="small"
				variant="outlined"
				label="Price *"
				className={classes.miniInput}
				value={value.price}
				onChange={handleInputChange}
			/>

			<XCircle
				style={{visibility: hideRemoveOptionButton ? 'hidden' : 'visible' }}
				className={classes.xCircle} 
				onClick={onRemoveBuyingOption}
			/>
		</div>
	)
}
