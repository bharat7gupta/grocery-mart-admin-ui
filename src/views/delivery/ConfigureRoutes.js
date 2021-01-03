import React from 'react';
import { Box, Card, CardContent, Button, Modal } from '@material-ui/core';
import RoutePath from './RoutePath';
import apiCall from '../../ApiHelper';
import { API_ROOT } from '../../components/common/config';

const NEW_ROUTE = 'new-route';

const ConfigureRoutes = () => {
	const [ currentRoute, setCurrentRoute ] = React.useState('');
	const [ routes, setRoutes ] = React.useState([]);

	React.useEffect(() => {
		apiCall(`${API_ROOT}/api/v1/delivery-route/get`, 'POST')
			.then((deliveryRoutes) => {
				setRoutes(deliveryRoutes.data);
			});
	}, []);

	const onAddRoute = () => {
		if (currentRoute === NEW_ROUTE) return;

		setCurrentRoute(NEW_ROUTE);

		setRoutes([
			{ name: '', points: [] },
			...routes,
		]);
	};

	const handleSaveRoute = (route) => {
		if (!route.name || route.name.trim().length === 0) {
			alert('Please provide route name');
			return;
		}

		if (!route.points || route.points.length === 0) {
			alert('Please add a few route points');
			return;
		}

		apiCall(`${API_ROOT}/api/v1/delivery-route/save`, 'POST', route)
			.then((json) => {
				if (json.code === 'success') {
					alert('Changes saved successfully');
					window.location.reload();
				} else {
					alert(json.message);
				}
			})
	};

	const handleCancelRouteChange = (route) => {
		if (route.id) { // existing route
			const index = routes.findIndex(r => r.id === route.id);
			
			setRoutes([
				...routes.slice(0, index),
				{
					id: routes[index].id,
					name: routes[index].name,
					points: [ ...routes[index].points ],
				},
				...routes.slice(index + 1)
			]);
		} else { // new route
			setRoutes(routes.slice(1));
			setCurrentRoute('');
		}
	};

	const handleRouteExpand = (currentRouteId) => {
		if (currentRoute === NEW_ROUTE) return;

		if (!currentRouteId) {
			setCurrentRoute(NEW_ROUTE);
		} else {
			setCurrentRoute(currentRoute !== currentRouteId ? currentRouteId : '');
		}
	};

	return (
		<Box mt={3} style={{ margin: '20px' }}>
        	<Card>
				<CardContent>
					<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Button
							color="primary"
							variant="contained"
							onClick={onAddRoute}
							style={{ alignSelf: 'right'}}
							disabled={currentRoute === NEW_ROUTE}
						>
							Add Route
						</Button>
					</div>
					<br/>
					{routes.map(route => (
						<RoutePath
							key={route.id}
							route={route}
							expanded={(!route.id && currentRoute === NEW_ROUTE) || (currentRoute === route.id)}
							onHeaderClick={handleRouteExpand}
							onSave={handleSaveRoute}
							cancelAddRoute={handleCancelRouteChange}
						/>
					))}
				</CardContent>
			</Card>
		</Box>
	);
}

export default ConfigureRoutes;
