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

	return (
		<div className={classes.groupInput}>
			<FormControlLabel
				control={
					<Checkbox
						size="small"
						name="checkedB"
						color="primary"
					/>
				}
				label="Wholesale"
				style={{marginRight: '0'}}
			/>

			<TextField
				size="small"
				variant="outlined"
				label="Unit *"
				className={classes.miniInput}
			/>

			<TextField
				size="small"
				variant="outlined"
				label="MRP *"
				className={classes.miniInput}
			/>

			<TextField
				size="small"
				variant="outlined"
				label="Offer (%)"
				className={classes.miniInput}
			/>

			<TextField
				size="small"
				variant="outlined"
				label="Price *"
				className={classes.miniInput}
			/>

			<XCircle
				style={{visibility: props.hideRemoveOptionButton ? 'hidden' : 'visible' }}
				className={classes.xCircle} 
				onClick={props.onRemoveBuyingOption}
			/>
		</div>
	)
}
