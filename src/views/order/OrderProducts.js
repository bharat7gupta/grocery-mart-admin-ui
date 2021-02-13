import React from 'react';
import { makeStyles, TextField, Button, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';

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

const OrderProducts = (props) => {
	const classes = useStyles();

	return (
		<div className={classes.content}>
			<div className={classes.header}>
				{props.order.user.username}'s order ({props.order.id})
			</div>

			<div className={classes.body}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Product Name</TableCell>
							<TableCell className={classes.textRight}>Quantity</TableCell>
							<TableCell className={classes.textRight}>MRP</TableCell>
							<TableCell className={classes.textRight}>Price</TableCell>
							<TableCell className={classes.textRight}>Total</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{props.order.products.map((product) => (
							<TableRow>
								<TableCell>{`${product.productName} - ${product.buyingOption.unit}`}</TableCell>
								<TableCell className={classes.textRight}>{product.quantity}</TableCell>
								<TableCell className={classes.textRight}>{product.buyingOption.mrp}</TableCell>
								<TableCell className={classes.textRight}>{product.buyingOption.price}</TableCell>
								<TableCell className={classes.textRight}>{product.quantity * product.buyingOption.price}</TableCell>
							</TableRow>
						))}

						<br/>
						<TableRow style={{ borderWidth: 0 }}>
							<TableCell><b style={{ fontSize: '18px' }}>Grand Total</b></TableCell>
							<TableCell></TableCell>
							<TableCell></TableCell>
							<TableCell></TableCell>
							<TableCell className={classes.textRight}><b style={{ fontSize: '18px' }}>{props.order.priceSummary.payableAmount}</b></TableCell>
						</TableRow>
					</TableBody>
				</Table>
				
			</div>

			<div className={classes.footer}>
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

export default OrderProducts;
