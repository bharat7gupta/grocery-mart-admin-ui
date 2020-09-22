import React, { useState, useReducer, useEffect } from 'react';
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
import Toast from '../../../components/common/Toast/Toast';
import { API_ROOT } from '../../../components/common/config';

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
  const [ products, setProducts ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ editing, setEditing ] = useState(false);
  const [ preferences, setPreferences ] = useState([]);
  const [ categories, setCategories ] = useState([]);
  const [ brands, setBrands ] = useState([]);
  const [ productState, dispatch ] = useReducer(productReducer, productInitialState);

  useEffect(() => {
    // load products
    fetchAllProducts();

    fetchConfigs();
  }, []);

  const fetchConfigs = () => {
    fetch(`${API_ROOT}/api/v1/homepageconfig/get`, {
			method: 'POST',
			body: JSON.stringify({ type: 'dates' })
		})
			.then(response => {
				response.json().then(config => {
          setPreferences(config.data.preferences || []);
          setCategories(config.data.categories || []);
          setBrands(config.data.brands || []);
				});
			});
  };

  const fetchAllProducts = () => {
    fetch(`${API_ROOT}/api/v1/product/get`, {
      method: 'POST'
    })
      .then(response => response.json().then(data => {
        const products = data.data;
        setProducts(products);
      }));
  }

  const handleAddProductClick = () => {
    dispatch({ type: ProductActions.RESET });
    setEditing(false);
    setShowModal(true);
  };

  const [ toastInfo, setToastInfo ] = useState({
		showToast: false,
		severity: "",
		message: ""
	});

  const showToast = (severity, message) => {
		setToastInfo({
			showToast: true,
			severity,
			message
		});
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

  const handleSubmit = () => {
    const productToSave = productState;
  
    productToSave.buyingOptions = productState.buyingOptions.map(bo => {
      return { ...bo, price: Number(bo.price) };
    });

    fetch(`${API_ROOT}/api/v1/product/save`, {
      method: "POST",
      body: JSON.stringify(productToSave)
    })
    .then(response => {
      response.json().then(data => {
        if (editing) {
          showToast("success", `Product Saved Successfully!`);
        }
        else {
          showToast("success", `Product Added Successfully with ID: ${data.data.productId}`);
        }

        if (categories.indexOf(productState.category) === -1) {
          setCategories([...categories, productState.category]);
        }

        if (brands.indexOf(productState.brand) === -1) {
          setBrands([...brands, productState.brand]);
        }

        setShowModal(false);
        fetchAllProducts();
      });
    });
  }

  const handleEditProduct = product => {
    dispatch({
      type: ProductActions.EDIT_PRODUCT,
      data: product
    });

    setShowModal(true);
    setEditing(true);
  }

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
                  onEditProduct={() => handleEditProduct(product)}
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
            preferences={preferences}
            categories={categories}
            brands={brands}
            onProductDetailChanged={handleProductDetailChanged}
            onAddBuyingOption={handleAddBuyingOption}
            onRemoveBuyingOption={handleRemoveBuyingOption}
            onSubmit={handleSubmit}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      </Container>

      <Toast {...toastInfo} onClose={() => setToastInfo({ showToast: false })} />
    </Page>
  );
};

export default ProductList;
