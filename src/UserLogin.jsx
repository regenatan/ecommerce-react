
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation } from 'wouter';
import { useFlashMessage } from './FlashMessageStore';
import { useJwt } from './UserStore';

function UserLogin() {

    const [location, setLocation] = useLocation();
    const {setJwt} = useJwt();

    const {showMessage} = useFlashMessage();

    const initialValues = {
        'email': '',
        'password': ''
    }

    const validationSchema = Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().required()
    })

    const handleSubmit = async(values, formikHelpers)=>{
        try {
            const response = await axios.post(import.meta.env.VITE_API_URL  + '/api/users/login', values);
            console.log(response.data);
            setLocation("/");
            showMessage("You have logged in successfully!", "success");
            // todo: Store the JWT
            const token = response.data.token;
            setJwt(token);
        } catch (e) {
            showMessage("Error logging in!");
            console.error(e);
        } finally {
            formikHelpers.setSubmitting(false);
        }
    }

    return (
        <div className="container mt-2 mb-2">
            <h2>Login</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {
                    function(formik){
                        return (
                            <Form>
                                <div className='mb3'>
                                    <label>Email</label>
                                    <Field type="email" id="email" name="email" className="form-control"/>
                                    <ErrorMessage name="email" component="div" className="text-danger"/>
                                </div>
                                <div className="mb3">
                                    <label>Password</label>
                                    <Field type="password" id="password" name="password" className="form-control"/>
                                    <ErrorMessage name="password" component="div" className="text-danger"/>
                                </div>
                                <button type="submit" className="btn btn-primary mt-2" disabled={formik.isSubmitting}>
                                    Log In
                                </button>
                            </Form>
                        )
                    }
                }
            </Formik>

        </div>
    );
}

export default UserLogin;
