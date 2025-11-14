import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginForm.css';

// Esquema de validación del formulario
const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required('El email es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria')
});

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (values, { resetForm }) => {
        const success = await login(values.email, values.password);
        
        if (success) {
            resetForm();
            // Navega a posts después de un breve delay para mostrar el toast
            setTimeout(() => navigate('/posts'), 500);
        }
    };

    return (
        <div className='login-wrapper'>
            <div className="login-container">
                <div className="login-heading">Iniciar Sesión</div>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="login-form">
                            <div className="form-field">
                                <Field 
                                    as={InputText} 
                                    id='email'
                                    name='email' 
                                    type='email'
                                    placeholder="E-mail"
                                    className="w-full"
                                />
                                <ErrorMessage name='email' component='small' className='login-error' />
                            </div>

                            <div className="form-field">
                                <Field 
                                    as={Password} 
                                    id='password'
                                    name='password'
                                    placeholder="Contraseña"
                                    feedback={false}
                                    toggleMask
                                    className="w-full"
                                />
                                <ErrorMessage name='password' component='small' className='login-error' />
                            </div>

                            <span className="login-forgot-password">
                                <Link to="/recuperar-password">¿Olvidaste tu contraseña?</Link>
                            </span>

                            <Button
                                type='submit'
                                label={isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
                                disabled={isSubmitting}
                                className="w-full"
                            />
                        </Form>
                    )}
                </Formik>
                <span className="login-agreement">
                    <Link to="/registrarse">¿No tenés cuenta? Registrate</Link>
                </span>
            </div>
        </div>
    );
}