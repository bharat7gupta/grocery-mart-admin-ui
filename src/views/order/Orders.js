import React from 'react';
import { Box, Card, CardContent, Button, Modal, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';
import Order from './Order';
import apiCall from '../../ApiHelper';
import { API_ROOT } from '../../components/common/config';
import OrderProducts from './OrderProducts';
import DriverAssign from './DriverAssign';

const Orders = (props) => {
	const [ orders, setOrders ] = React.useState([]);
	const [ drivers, setDrivers ] = React.useState([]);
	const [ routes, setRoutes ] = React.useState([]);

	const [ showProductsModal, setShowProductsModal ] = React.useState(false);
	const [ showDriverAssignModal, setShowDriverAssignModal ] = React.useState(false);
	const [ currentOrder, setCurrentOrder ] = React.useState({});

	React.useEffect(() => {
		apiCall(`${API_ROOT}/api/v1/orders/get-received-orders`, 'POST')
    		.then((json) => {
        		setOrders(json.data);
			  });
 
		apiCall(`${API_ROOT}/api/v1/drivers/get`, 'POST')
			.then((json) => {
				setDrivers(json.data);
			});

		apiCall(`${API_ROOT}/api/v1/delivery-route/get`, 'POST')
			.then((deliveryRoutes) => {
				setRoutes(deliveryRoutes.data);
			});
	}, []);

	const handleProductDetailsClick = (order) => {
		setShowProductsModal(true);
		setCurrentOrder(order);
	};

	const handleAssignDriverInitClick = (order) => {
		setShowDriverAssignModal(true);
		setCurrentOrder(order);
	};

	const handleDriverAssign = (driver) => {
		if (!driver) {
			alert('Please select a driver...');
			return;
		}

		const orderIndex = orders.findIndex(o => o.id === currentOrder.id);

		setOrders([
			...orders.slice(0, orderIndex),
			{
				...orders[orderIndex],
				driverId: driver.id,
			},
			...orders.slice(orderIndex + 1)
		]);

		setShowDriverAssignModal(false);
	};

	const handleConfirmOrder = (order) => {
		if (!order) return;

		if (!order.driverId) { alert('Please assign a driver'); return; }

		apiCall(`${API_ROOT}/api/v1/orders/update-status`, 'POST', {
			id: order.id,
			status: 'CONFIRMED',
			driverId: order.driverId
		}).then(json => {
			if (json.code === 'success') {
				alert('Order confirmed successfully!');
				window.location.reload();
			}
		});
	};

	const handleRejectOrder = (order) => {
		if (!order) return;

		apiCall(`${API_ROOT}/api/v1/orders/update-status`, 'POST', {
			id: order.id,
			status: 'REJECTED',
			driverId: order.driverId
		}).then(json => {
			if (json.code === 'success') {
				alert('Order rejected!');
				window.location.reload();
			}
		});
	}

	return (
		<Box mt={3} style={{ margin: '20px' }}>
			<Card>
				<CardContent>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Order Datetime</TableCell>
								<TableCell>Customer</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>Contact</TableCell>
								{/* <TableCell>Order Id</TableCell> */}
								<TableCell>Products</TableCell>
								<TableCell>Route</TableCell>
								<TableCell>Order Value</TableCell>
								<TableCell>Order Status</TableCell>
								<TableCell>Driver</TableCell>
								<TableCell>Action</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{orders.map(order => (
								<Order
									order={order}
									routes={routes}
									drivers={drivers}
									onProductDetailClick={() => handleProductDetailsClick(order)}
									onDriverAssignInitClick={() => handleAssignDriverInitClick(order)}
									onConfirmOrder={() => handleConfirmOrder(order)}
									onRejectOrder={() => handleRejectOrder(order)}
								/>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Modal
				open={showProductsModal}
				onClose={() => setShowProductsModal(false)}
				disableEnforceFocus
				disableAutoFocus
        	>
				<OrderProducts
					order={currentOrder}
					onCloseClick={() => setShowProductsModal(false)}
				/>
			</Modal>

			<Modal
				open={showDriverAssignModal}
				onClose={() => setShowDriverAssignModal(false)}
				disableEnforceFocus
				disableAutoFocus
        	>
				<DriverAssign
					order={currentOrder}
					drivers={drivers}
					onDriverAssign={handleDriverAssign}
					onCloseClick={() => setShowDriverAssignModal(false)}
				/>
			</Modal>
		</Box>
	)
};

export default Orders;
