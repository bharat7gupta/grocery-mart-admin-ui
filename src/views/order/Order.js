import React from 'react';
import { TableRow, TableCell, Button } from '@material-ui/core';

const Order = (props) => {

	const getProductNames = () => {
		const productNames = props.order.products.map(p => p.productName).join(', ');
		return productNames.length > 100 ? productNames.substr(0, 100) + '...' : productNames;
	};

	const getRouteName = (routeId) => {
		if (!routeId || !props.routes) {
			return null;
		}

		const route = props.routes.find(r => r.id === routeId);
		return route.name;
	};

	const getOrderDate = (timestamp) => {
		var now     = new Date(timestamp);
        var year    = now.getFullYear();
        var month   = now.getMonth()+1; 
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
		var ampm = hour >= 12 ? 'PM' : 'AM';
		hour = hour % 12;

        if(month.toString().length == 1) {
             month = '0'+month;
        }
        if(day.toString().length == 1) {
             day = '0'+day;
        }   
        if(hour.toString().length == 1) {
             hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
             minute = '0'+minute;
		}

        var dateTime = day+'/'+month+'/'+year+' '+hour+':'+minute + ' ' + ampm;   
		return dateTime;
	};

	const getDriverName = (driverId) => {
		if (!driverId || !props.drivers) {
			return null;
		}

		const driver = props.drivers.find(d => d.id === driverId);
		return driver && driver.username;
	};

	const onConfirmOrder = () => {
		props.onConfirmOrder(props.order);
	};

	const onRejectOrder = () => {
		props.onRejectOrder(props.order);
	};

	const userType = props.order.user.userType === 'DEFAULT' ? 'RETAILER' : props.order.user.userType;

	return (
		<TableRow
			hover
			key={props.order.id}
	  	>
			<TableCell>{getOrderDate(props.order.createdAt)}</TableCell>
			<TableCell>{props.order.user.username}</TableCell>
			<TableCell>{userType}</TableCell>
			<TableCell>{props.order.user.mobile || props.order.user.email}</TableCell>
			{/* <TableCell>{props.order.id}</TableCell> */}
			<TableCell>
				{getProductNames()}&nbsp;
				<a href="javascript:void(0)" onClick={props.onProductDetailClick}>
					Details
				</a>
			</TableCell>
			<TableCell>{getRouteName(props.order.user.route)}</TableCell>
			<TableCell>{props.order.priceSummary.payableAmount}</TableCell>
			<TableCell>{props.order.status}</TableCell>
			<TableCell>
				{props.order.driverId && <span>{getDriverName(props.order.driverId)}<br/></span>}
				<a href="javascript:void(0)" onClick={props.onDriverAssignInitClick}>
					{props.order.driverId ? 'Change Driver' : 'Assign Driver'}
				</a>
			</TableCell>
			<TableCell>
				{(props.order.status === 'SUCCESS' || props.order.status === 'REJECTED') && (
					<Button
                        variant="contained"
                        color="primary"
                        onClick={() => onConfirmOrder(props.order)}
                        // disabled={!customer.route}
					>
                        Confirm
					</Button>
				)}
				{props.order.status === 'SUCCESS' && <div style={{marginTop: 4}} />}
				{(props.order.status === 'SUCCESS' || props.order.status === 'CONFIRMED') && (
					<Button
						variant="contained"
						color="secondary"
						style={{ backgroundColor: '#e91e63' }}
						onClick={() => onRejectOrder(props.order)}
					>
						Reject
					</Button>
				)}
			</TableCell>
		</TableRow>
	)
};

export default Order;
