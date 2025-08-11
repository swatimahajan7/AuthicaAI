import { forwardRef, useImperativeHandle } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomTextField from './CustomTextField';
import { Box, Button, Typography } from '@mui/material';
import { useAuthContext } from '../context/globalAuthContext';
import './SigninForm.css'
import { useNavigate } from 'react-router';

export interface SigninFormHandle {
    validate: () => Promise<boolean>;
    getValues: () => { username: string; password: string };
}

interface SigninFormProps {
    onVerified?: () => void;
}

const SigninForm = forwardRef<SigninFormHandle, SigninFormProps>(({ onVerified }, ref) => {
    const { values, updateValues, users, setCurrentUser } = useAuthContext();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: values.username,
            password: values.password,
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: () => { },
    });

    useImperativeHandle(ref, () => ({
        async validate() {
            const errors = await formik.validateForm();
            if (Object.keys(errors).length === 0) {
                const matchedUser = users.find(
                    (u) =>
                        u.username === formik.values.username &&
                        u.password === formik.values.password
                );

                console.log('Checking credentials:', formik.values);
                console.log('Mock users:', users);

                if (!matchedUser) {
                    alert('Invalid username or password');
                    return false;
                }

                setCurrentUser(matchedUser);
                updateValues(matchedUser);
                return true;
            }

            formik.setTouched({ username: true, password: true });
            return false;
        },

        getValues() {
            return formik.values;
        },
    }));

    const handleSignIn = async () => {
        const errors = await formik.validateForm();
        formik.setTouched({ username: true, password: true });
        const isValid = Object.keys(errors).length === 0;

        if (isValid) {
            const matchedUser = users.find(
                (u) =>
                    u.username === formik.values.username &&
                    u.password === formik.values.password
            );

            if (!matchedUser) {
                alert('Invalid username or password');
                return;
            }

            setCurrentUser(matchedUser);
            updateValues(matchedUser);
            onVerified?.();
        }
    };


    return (
        <Box display="flex" flexDirection="column" gap={2} justifyContent='center' width={'70%'} alignItems='stretch' mt={3}>
            <Typography variant="h6" className="signin-form-title">
                Enter your credentials
            </Typography>
            <CustomTextField
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
            />
            <CustomTextField
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
            />

            <Button variant="contained" onClick={handleSignIn}>Sign In</Button>

            <Typography variant="body1" className='reroute-text'>
                Don't have an account yet?
            </Typography>
            <Button variant='outlined' onClick={() => navigate('/signup')}>Sign up</Button>
        </Box>
    );
});

export default SigninForm;
