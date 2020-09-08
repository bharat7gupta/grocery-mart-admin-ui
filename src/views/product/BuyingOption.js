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
	const { value, onBuyingOptionChanged, onRemoveBuyingOption, hideRemoveOptionButton, validation } = props;

	const handleWholesaleChange = (event) => {
		onBuyingOptionChanged({ ...value, isWholesale: event.target.checked });
	};

	const handleUnitChange = event => {
		onBuyingOptionChanged({ ...value, unit: event.target.value });
	};

	const handleMRPChange = event => {
		let price;
		const mrp = event.target.value;
		const mrpNum = Number(mrp);
		const offerNum = Number(value.offer);

		if (mrp !== "" && !isNaN(mrp) && !isNaN(value.offer)) {
			const priceCal = mrpNum - ((mrpNum * offerNum) / 100);
			price = +priceCal.toFixed(2);
		} else {
			price = "";
		}

		onBuyingOptionChanged({ ...value, mrp, price });
	};

	const handleOfferChange = event => {
		let price;
		const offer = event.target.value;
		const offerNum = Number(offer);
		const mrpNum = Number(value.mrp);

		if (offer !== "" && value.mrp !== "" && !isNaN(offerNum) && !isNaN(value.mrp)) {
			const priceCal = mrpNum - ((offerNum * mrpNum) / 100);
			price = +priceCal.toFixed(2);
		}
		else if (offer === "") {
			price = value.mrp;
		}
		else {
			price = "";
		}

		onBuyingOptionChanged({ ...value, offer, price });
	};

	const handlePriceChange = event => {
		let offer;
		const price = event.target.value;
		const priceNum = Number(price);
		const mrpNum = Number(value.mrp);

		if (price !== "" && value.mrp !== "" && !isNaN(priceNum) && !isNaN(value.mrp)) {
			const offerCal = ((mrpNum - priceNum) / mrpNum) * 100;
			offer = +offerCal.toFixed(2);
		}
		else {
			offer = "";
		}

		onBuyingOptionChanged({ ...value, offer, price });
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
				onChange={handleUnitChange}
				error={!!validation.unit}
				helperText={validation.unit}
			/>

			<TextField
				name="mrp"
				size="small"
				variant="outlined"
				label="MRP *"
				className={classes.miniInput}
				value={value.mrp}
				onChange={handleMRPChange}
				error={!!validation.mrp}
				helperText={validation.mrp}
			/>

			<TextField
				name="offer"
				size="small"
				variant="outlined"
				label="Offer (%)"
				className={classes.miniInput}
				value={value.offer}
				onChange={handleOfferChange}
				error={!!validation.offer}
				helperText={validation.offer}
			/>

			<TextField
				name="price"
				size="small"
				variant="outlined"
				label="Price *"
				className={classes.miniInput}
				value={value.price}
				onChange={handlePriceChange}
				error={!!validation.price}
				helperText={validation.price}
			/>

			<XCircle
				style={{visibility: hideRemoveOptionButton ? 'hidden' : 'visible' }}
				className={classes.xCircle} 
				onClick={onRemoveBuyingOption}
			/>
		</div>
	)
}
