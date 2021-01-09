import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  Button
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, customers, routes, onConfirmAccount, onBlockAccount, onRouteAssignInit, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [page, setPage] = useState(0);

  const getRouteName = (customerRouteId) => {
    const currRoute = routes && routes.find(r => r.id === customerRouteId);

    return currRoute && currRoute.name;
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === customers.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < customers.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                <TableCell>Name</TableCell>
                <TableCell>Customer Type</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>License</TableCell>
                <TableCell>Landmark</TableCell>
                <TableCell>Account Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  hover
                  key={customer.id}
                  selected={selectedCustomerIds.indexOf(customer.id) !== -1}
                >
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(customer.id) !== -1}
                      onChange={(event) => handleSelectOne(event, customer.id)}
                      value="true"
                    />
                  </TableCell> */}
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      {/* <Avatar
                        className={classes.avatar}
                        src={customer.avatarUrl}
                      >
                        {getInitials(customer.name)}
                      </Avatar> */}
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {customer.username}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                        style={{ textTransform: 'uppercase' }}
                      >
                        {customer.userType}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    {customer.mobile}{customer.mobile &&<br/>}{customer.altPhoneNumber}
                  </TableCell>
                  <TableCell>{customer.licenseNumber}</TableCell>
                  <TableCell>{customer.landmark}</TableCell>
                  <TableCell>{customer.accountStatus}</TableCell>
                  <TableCell>
                    {moment(customer.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {getRouteName(customer.route)}
                    <a href='javascript:void(0)' onClick={() => onRouteAssignInit(customer.id)}>
                      {customer.route ? ' Change' : 'Assign'}
                    </a>
                  </TableCell>
                  <TableCell>
                    {(customer.accountStatus === 'UNCONFIRMED' || customer.accountStatus === 'BLOCKED') && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onConfirmAccount(customer.id)}
                        disabled={!customer.route}
                      >
                        Confirm
                      </Button>
                    )}
                    {customer.accountStatus === 'CONFIRMED' && (
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{ backgroundColor: '#e91e63' }}
                        onClick={() => onBlockAccount(customer.id)}
                      >
                        Block
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      {/* <TablePagination
        component="div"
        count={customers.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      /> */}
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

export default Results;
