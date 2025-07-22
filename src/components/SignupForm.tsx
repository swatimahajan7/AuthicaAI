import { Box, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { forwardRef, useImperativeHandle } from 'react';
import CustomTextField from './CustomTextField';
import './SignupForm.css'
import { useSignupContext } from '../context/signupContext';

const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone must be 10 digits').required('Phone is required'),
});

export type SignupFormHandle = {
    validate: () => Promise<boolean>;
    getValues: () => typeof validationSchema.__outputType;
};

const SignupForm = forwardRef<SignupFormHandle>((props, ref) => {
    const { formValues, updateFormValues } = useSignupContext();
    return (
        <Formik
            initialValues={formValues}
            enableReinitialize
            validationSchema={validationSchema}
            validateOnMount
            onSubmit={() => { }}
        >
            {(formik) => {
                useImperativeHandle(ref, () => ({
                    validate: async () => {
                        const errors = await formik.validateForm();
                        formik.setTouched({
                            username: true,
                            password: true,
                            email: true,
                            phone: true,
                        });
                        const isValid = Object.keys(errors).length === 0;
                        if (isValid) {
                            console.log(formik.values)
                            updateFormValues(formik.values);
                        }
                        return isValid;
                    },
                    getValues: () => formik.values,
                }));

                return (
                    <Form className='signup-form'>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            marginTop: 3
                        }}>
                            <Typography variant="h6" className='signup-form-title'>Create your account</Typography>

                            <Box sx={{
                                width: "50%",
                                alignSelf: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <CustomTextField
                                    label="Username"
                                    name="username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username}
                                />

                                <CustomTextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />

                                <CustomTextField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />

                                <CustomTextField
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                />
                            </Box>
                        </Box>
                    </Form>
                );
            }}
        </Formik>
    );
});

export default SignupForm;
