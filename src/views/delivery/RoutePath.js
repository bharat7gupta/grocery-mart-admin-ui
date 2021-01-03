import React from 'react';
import {
	Button,
	TextField,
	makeStyles,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/EditOutlined';
import RoutePathEdit from './RoutePathEdit';

const useStyles = makeStyles((theme) => ({
	root: {
	  width: '100%',
	},
	heading: {
	  fontSize: theme.typography.pxToRem(15),
	  flexBasis: '33.33%',
	  flexShrink: 0,
	},
	secondaryHeading: {
	  fontSize: theme.typography.pxToRem(15),
	  color: theme.palette.text.secondary,
	},
	editRouteName: {
		width: '390px',
	},
}));

const RoutePath = (props) => {
	const classes = useStyles();
	const [ route, setRoute ] = React.useState({});
	const [ editingRouteName, setEditingRouteName ] = React.useState(false);
	const [ routeName, setRouteName ] = React.useState('');

	React.useEffect(() => {
		setRoute(props.route);
		setRouteName(props.route.name);

		setEditingRouteName(!props.route.id);
	}, [props.route]);

	const handleRouteNameEditClick = (event, routeId) => {
		event.preventDefault();
		event.stopPropagation();

		setEditingRouteName(true);
		props.onHeaderClick(routeId);
	};

	const handleRouteNameChange = (event) => {
		setRouteName(event.target.value);
	};

	const hasChanges = (newPoints) => {
		if (routeName !== props.route.name || newPoints.length !== props.route.points.length) {
			return true;
		}

		for (let i=0; i<newPoints.length; i++) {
			const found = props.route.points.find(p => p === newPoints[i]);
			if (!found) {
				return true;
			}
		}

		return false;
	};

	const onSave = (newPoints) => {
		if (hasChanges(newPoints)) {
			props.onSave({
				id: props.route.id,
				name: routeName,
				points: newPoints
			});
		}
	};

	const onCancel = () => {
		props.cancelAddRoute(route);
	};

	return (
		<Accordion expanded={props.expanded}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1bh-content"
				id="panel1bh-header"
				onClick={() => props.onHeaderClick(props.route.id)}
			>
				<Typography className={classes.heading}>
					{!editingRouteName && (
						<>
							<b>{route.name}</b>
							<EditIcon
								style={{ fontSize: 20, marginBottom: '-4px', marginLeft: '4px' }}
								onClick={(e) => handleRouteNameEditClick(e, route.id)}
							/>
						</>
					)}

					{editingRouteName && (
						<TextField
							className={classes.editRouteName}
							id="standard-basic"
							label="Route Name"
							value={routeName}
							onChange={handleRouteNameChange}
							onClick={(event) => event.stopPropagation()}
							onFocus={(event) => event.stopPropagation()}
						/>
					)}
				</Typography>
			</AccordionSummary>

			<AccordionDetails style={{ display: 'block' }}>
				<RoutePathEdit
					points={route.points || []}
					onSave={onSave}
					onCancel={onCancel}
				/>
			</AccordionDetails>
		</Accordion>
	);
}

export default RoutePath;
