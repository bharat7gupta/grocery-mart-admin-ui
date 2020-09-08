import React from 'react';
import { makeStyles, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
	  minWidth: '330px',
	  height: '363px',
	  backgroundColor: '#E4EBF1',
		margin: '0 12px',
		position: 'relative',

	  '&:first-child': {
			marginLeft: 0,
		},
		'&:last-child': {
			marginRight: 0,
		},
		'&:hover > button': {
			display: 'block'
		}
	},
	addProduct: {
		display: 'none',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)'
	}
}));

export default function ProductPlaceholder(props) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Button
				color="primary"
				onClick={props.onAddProduct}
				className={classes.addProduct}
			>
				Add Product Here
			</Button>
		</div>
	)
}