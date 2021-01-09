import React from 'react';
import { makeStyles, TextField, Button, FormControlLabel, Switch, Checkbox } from '@material-ui/core';
import RoutePath from '../../views/delivery/RoutePath';

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
		borderTop: '1px solid #ddd',
		padding: '14px 30px'
	},
}));

const RouteAssign = (props) => {
	const classes = useStyles();

	React.useEffect(() => {
		const currRoute = props.routes && props.routes.find(r => r.id === props.currentRoute);

		if (currRoute) {
			setExpandedRoute(currRoute.id);
		}
	}, [props.routes]);

	const [ expandedRoute, setExpandedRoute ] = React.useState('');

	const handleHeaderClick = (id) => {
		setExpandedRoute(id);
	};

	const handleRouteSelect = (id) => {
		setExpandedRoute(id);
	};

	const handleAssignClick = () => {
		props.onAssign(expandedRoute);
	};

	const handleCancelClick = () => {
		props.onCancel();
	};

	return (
		<div className={classes.content}>
			<div className={classes.header}>Assign Route</div>

			<div className={classes.body}>
				{props.routes.map(route => (
					<RoutePath
						key={route.id}
						viewMode={true}
						expanded={expandedRoute === route.id}
						route={route}
						selectedRoute={expandedRoute}
						onHeaderClick={handleHeaderClick}
						onSelect={handleRouteSelect}
					/>
				))}
			</div>

			<div className={classes.footer}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleAssignClick}
					style={{ margin: '30px 12px 12px', width: 120 }}
				>
					Assign
				</Button>

				<Button
					variant="contained"
					onClick={handleCancelClick}
					style={{ margin: '30px 0 12px' }}
				>
					Cancel
				</Button>
			</div>
		</div>
	);
};

export default RouteAssign;
