import { Box, Typography, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { forwardRef, useImperativeHandle } from 'react';
import CustomTextField from './CustomTextField';
import './SignupForm.css';
import { useAuthContext } from '../context/globalAuthContext';
import { useNavigate } from 'react-router';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});

export type SignupFormHandle = {
    validate: () => Promise<boolean>;
    getValues: () => typeof validationSchema.__outputType;
};

interface SignupFormProps {
    onVerified?: () => void;
}

const SignupForm = forwardRef<SignupFormHandle, SignupFormProps>(({ onVerified }, ref) => {
    const { values, updateValues } = useAuthContext();
    const navigate = useNavigate()

    return (
        <Formik
            initialValues={values}
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
                            name: true,
                            username: true,
                            password: true,
                            confirmPassword: true,
                        });
                        const isValid = Object.keys(errors).length === 0;
                        if (isValid) updateValues(formik.values);
                        return isValid;
                    },
                    getValues: () => formik.values,
                }));

                const handleSignup = async () => {
                    const errors = await formik.validateForm();
                    formik.setTouched({
                        name: true,
                        username: true,
                        password: true,
                        confirmPassword: true,
                    });
                    const isValid = Object.keys(errors).length === 0;
                    if (isValid) {
                        updateValues(formik.values);
                        onVerified?.();
                    }
                };

                return (
                    <Form className="signup-form">
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                            <Typography variant="h6" className="signup-form-title">
                                Create your account
                            </Typography>

                            <Box
                                sx={{
                                    width: '70%',
                                    alignSelf: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                <CustomTextField {...formik.getFieldProps('name')} label="Name" error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} />
                                <CustomTextField {...formik.getFieldProps('username')} label="Username" error={formik.touched.username && Boolean(formik.errors.username)} helperText={formik.touched.username && formik.errors.username} />
                                <CustomTextField {...formik.getFieldProps('password')} label="Password" type="password" error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
                                <CustomTextField {...formik.getFieldProps('confirmPassword')} label="Confirm Password" type="password" error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)} helperText={formik.touched.confirmPassword && formik.errors.confirmPassword} />
                            </Box>

                            <Button variant="contained" onClick={handleSignup} sx={{ width: '70%', alignSelf: 'center' }}>
                                Sign Up
                            </Button>

                            <Typography variant="body1" className='reroute-text'>
                                Already have an account?
                            </Typography>
                            <Button variant='outlined' sx={{ width: '70%', alignSelf: 'center' }} onClick={() => navigate('/signin')}>Sign in</Button>
                        </Box>
                    </Form>
                );
            }}
        </Formik>
    );
});

export default SignupForm;
