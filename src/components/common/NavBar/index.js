import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Drawer,
  Hidden,
  List,
  makeStyles
} from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
  Home as HomeIcon,
  Activity as ActivityIcon
} from 'react-feather';
import InputIcon from '@material-ui/icons/Input';
import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtl';
import NavItem from './NavItem';

const items = [
  {
    href: '/app/home/retail',
    icon: HomeIcon,
    title: 'Home Page - Retail'
  },
  {
    href: '/app/home/wholesaler',
    icon: HomeIcon,
    title: 'Home Page - Wholesaler'
  },
  {
    href: '/app/home/dates',
    icon: HomeIcon,
    title: 'Home Page - Dates'
  },
  {
    href: '/app/home/restaurant',
    icon: HomeIcon,
    title: 'Home Page - Restaurant'
  },
  {
    href: '/app/products',
    icon: ShoppingBagIcon,
    title: 'Products'
  },
  {
    href: '/app/customers',
    icon: UsersIcon,
    title: 'Customers'
  },
  {
    href: '/app/drivers',
    icon: UsersIcon,
    title: 'Drivers'
  },
  {
    href: '/app/configure-routes',
    icon: ActivityIcon,
    title: 'Configure Routes'
  },
  {
    href: '/app/orders',
    icon: FormatListNumberedRtlIcon,
    title: 'Orders'
  },
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    localStorage.setItem('token', '');
    window.location.href = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/login';
  };

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}

          <NavItem
            href='/login'
            onClick={handleLogoutClick}
            title='Logout'
            icon={InputIcon}
          />
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
