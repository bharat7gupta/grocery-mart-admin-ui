import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  TextField,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { API_ROOT } from '../../components/common/config';
import apiCall from '../../ApiHelper';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            onSubmit={(values, actions) => {
              actions.setSubmitting(true);

              const { email, password } = values;
              let requestObject = { password, isAdmin: true };

              if (email && email.indexOf('@') > -1) {
                requestObject.email = email;
              } else {
                requestObject.mobile = email;
              }

              apiCall(`${API_ROOT}/api/v1/account/login`, 'POST', requestObject)
                .then(data => {
                  if (data.code === 'success') {
                    localStorage.setItem('username', data.data.username);
                    localStorage.setItem('token', data.data.token);
                    navigate('/app/home/retail', { replace: true });
                  }
                  else {
                    alert('Invalid login details');
                    actions.setSubmitting(false);
                  }
                });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              touched,
              isSubmitting,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address or Mobile"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Sign in now
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
