import React, { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Modal,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import RouteAssign from '../../../components/common/RouteAssign';
import apiCall from '../../../ApiHelper';
import { API_ROOT } from '../../../components/common/config';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerListView = () => {
  const classes = useStyles();
  const [ customers, setCustomers ] = useState([]);
  const [ showRouteAssignModal, setShowRouteAssignModal ] = useState(false);
  const [ currRouteAssignCustomerId, setCurrRouteAssignCustomerId ] = useState(false);
  const [ routes, setRoutes ] = useState([]);
  const [ value, setValue ] = React.useState(0);

  React.useEffect(() => {
    apiCall(`${API_ROOT}/api/v1/customers/get`, 'POST')
      .then((json) => {
        setCustomers(json.data);
      });

    apiCall(`${API_ROOT}/api/v1/delivery-route/get`, 'POST')
      .then((json) => {
        setRoutes(json.data);
      });
  }, []);


  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const onConfirmAccount = (customerId) => {
    const customerRoute = customers.find(c => c.id === customerId);
    const requestBody = { id: customerId, accountStatus: 'CONFIRMED', route: customerRoute && customerRoute.route };

    apiCall(`${API_ROOT}/api/v1/customers/update-status`, 'POST', requestBody)
      .then((json) => {
        if (json.code === 'success') {
          alert('Status updated successfully');
          window.location.reload();
        } else {
          alert(json.message);
        }
      });
  };

  const onBlockAccount = (customerId) => {
    const customerRoute = customers.find(c => c.id === customerId);
    const requestBody = { id: customerId, accountStatus: 'BLOCKED', route: customerRoute && customerRoute.route };

    apiCall(`${API_ROOT}/api/v1/customers/update-status`, 'POST', requestBody)
      .then((json) => {
        if (json.code === 'success') {
          alert('Status updated successfully');
          window.location.reload();
        } else {
          alert(json.message);
        }
      });
  };

  const onRouteAssignInit = (customerId) => {
    setShowRouteAssignModal(true);
    setCurrRouteAssignCustomerId(customerId);
  };

  const getCurrentRoute = () => {
    const customer = customers.find(c => c.id === currRouteAssignCustomerId);
    return customer && customer.route;
  };

  const handleAssignRoute = (routeId) => {
    const index = customers.findIndex(c => c.id === currRouteAssignCustomerId);

    setCustomers([
      ...customers.slice(0, index),
      {
        ...customers[index],
        route: routeId,
      },
      ...customers.slice(index + 1),
    ]);

    setShowRouteAssignModal(false);
  };

  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Box mt={3} style={{ backgroundColor: 'white' }}>
          {/* <Tabs
            value={value}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            scrollButtons="auto"
          >
            <Tab label="Item One" />
            <Tab label="Item Two" />
            <Tab label="Item Three" />
          </Tabs> */}

          <Results
            customers={customers}
            routes={routes}
            onConfirmAccount={onConfirmAccount}
            onBlockAccount={onBlockAccount}
            onRouteAssignInit={onRouteAssignInit}
          />
        </Box>

        <Modal
          open={showRouteAssignModal}
          onClose={() => setShowRouteAssignModal(false)}
          disableEnforceFocus
          disableAutoFocus
        >
          <RouteAssign
            currentRoute={getCurrentRoute()}
            routes={routes}
            onAssign={handleAssignRoute}
            onCancel={() => setShowRouteAssignModal(false)}
          />
        </Modal>
      </Container>
    </Page>
  );
};

export default CustomerListView;
