import React, { useState, useReducer } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import { Modal } from '@material-ui/core';
import Page from 'src/components/Page';
import ProductCard from './ProductCard';
import Toolbar from './Toolbar';
import ProductAddEdit from '../ProductAddEdit';
import productReducer, { productInitialState, ProductActions } from '../../../reducers/productReducer';
import data from './data';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  }
}));

const ProductList = () => {
  const classes = useStyles();
  const [products] = useState(data);
  const [ showModal, setShowModal ] = useState(false);
  const [ editing, setEditing ] = useState(false);
  const [ productState, dispatch ] = useReducer(productReducer, productInitialState);

  const handleAddProductClick = () => {
    dispatch({ type: ProductActions.RESET });
    setEditing(false);
    setShowModal(true);
  };

  const searchProduct = () => {

  };

  const handleProductDetailChanged = (changes) => {
    dispatch({
      type: ProductActions.PRODUCT_DETAIL_CHANGE,
      data: changes
    });
  };

  const handleAddBuyingOption = () => {
    dispatch({ type: ProductActions.ADD_BUYING_OPTION });
  };

  const handleRemoveBuyingOption = (index) => {
    dispatch({ type: ProductActions.REMOVE_BUYING_OPTION, index });
  };

  return (
    <Page
      className={classes.root}
      title="Products"
    >
      <Container maxWidth={false}>
        <Toolbar onAddProduct={handleAddProductClick} onSearch={searchProduct} />
        <Box mt={3}>
          <Grid
            container
            spacing={3}
          >
            {products.map((product) => (
              <Grid
                item
                key={product.id}
                lg={3}
                md={6}
                xs={12}
              >
                <ProductCard
                  className={classes.productCard}
                  product={product}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Modal
          open={showModal}
          onClose={() => {}}
          disableEnforceFocus
          disableAutoFocus
        >
          <ProductAddEdit
            isEditing={editing}
            product={productState}
            onProductDetailChanged={handleProductDetailChanged}
            onAddBuyingOption={handleAddBuyingOption}
            onRemoveBuyingOption={handleRemoveBuyingOption}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      </Container>
    </Page>
  );
};

export default ProductList;
