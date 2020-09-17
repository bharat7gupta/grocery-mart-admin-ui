import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  makeStyles,
  Button
} from '@material-ui/core';
import BuyingOptionView from './BuyingOptionView';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  statsItem: {
    alignItems: 'center',
    display: 'flex'
  },
  statsIcon: {
    marginRight: theme.spacing(1)
  }
}));

const ProductCard = ({ className, product, onEditProduct, ...rest }) => {
  if (!product) {
    return null;
  }

  const classes = useStyles();
  const productImageDimStyles = { width: '256px', height: '256px' };
  const productInactiveStyles = product.isActive ? {} : { filter: 'grayscale(1)', opacity: '0.6' };
  const productStyles = { ...productImageDimStyles, ...productInactiveStyles };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="center"
          mb={3}
        >
          <Avatar
            alt="Product"
            src={product.productImage}
            style={productStyles}
            variant="square"
          />
        </Box>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"
        >
          {product.productName} {`(${product.productId})`}
        </Typography>

        <BuyingOptionView values={product.buyingOptions} />
      </CardContent>
      <Box flexGrow={1} />
      <Divider />
      {onEditProduct && (
        <Box p={2}>
          <Grid
            container
            justify="center"
            spacing={2}
          >
            <Button
              color="primary"
              onClick={onEditProduct}
            >
              Edit product
            </Button>
          </Grid>
        </Box>
      )}
    </Card>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired
};

export default ProductCard;
