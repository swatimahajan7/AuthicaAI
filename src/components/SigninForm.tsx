import { forwardRef, useImperativeHandle } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomTextField from './CustomTextField';
import { Box } from '@mui/material';
import { useSigninContext } from '../context/signinContext';

export interface SigninFormHandle {
    validate: () => Promise<boolean>;
}

const SigninForm = forwardRef<SigninFormHandle>((_, ref) => {
    const { signinValues, setSigninValues } = useSigninContext();

    const formik = useFormik({
        initialValues: signinValues,
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: () => { }
    });

    useImperativeHandle(ref, () => ({
        async validate() {
            const valid = await formik.validateForm();
            if (Object.keys(valid).length === 0) {
                setSigninValues(formik.values);
                return true;
            }
            formik.setTouched({
                username: true,
                password: true,
            });
            return false;
        }
    }));

    return (
        <Box display="flex" flexDirection="column" gap={2} maxWidth={400} mx="auto" mt={3}>
            <CustomTextField
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
            />
            <CustomTextField
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
            />
        </Box>
    );
});

export default SigninForm;
