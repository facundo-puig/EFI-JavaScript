import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import "../styles/RegisterForm.css";

// Esquema de validación del formulario de registro
const validationSchema = Yup.object({
    username: Yup.string().required("El nombre es obligatorio"),
    email: Yup.string().email("Email inválido").required('El email es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria')
});

export default function RegisterForm() {
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await apiFetch('/api/register', {
                method: 'POST',
                body: values
            });

            toast?.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Usuario registrado con éxito',
                life: 3000
            });
            resetForm();
            // Redirige al login después del registro exitoso
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            toast?.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.data?.error || 'Hubo un error al registrar el usuario',
                life: 3000
            });
        }
    };

    return (
        <div className='register-wrapper'>
            <div className="register-container">
                <div className="register-heading">Crear Cuenta</div>
                <Formik
                    initialValues={{ username: '', email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className='register-form'>
                            <div className='form-field'>
                                <Field 
                                    as={InputText} 
                                    id='username' 
                                    name='username'
                                    placeholder="Nombre de usuario"
                                    className="w-full"
                                />
                                <ErrorMessage name='username' component='small' className='error' />
                            </div>
                            <div className='form-field'>
                                <Field 
                                    as={InputText} 
                                    id='email' 
                                    name='email'
                                    type='email'
                                    placeholder="E-mail"
                                    className="w-full"
                                />
                                <ErrorMessage name='email' component='small' className='error' />
                            </div>
                            <div className='form-field'>
                                <Field 
                                    as={Password} 
                                    id='password' 
                                    name='password'
                                    placeholder="Contraseña"
                                    feedback={false}
                                    toggleMask
                                    className="w-full"
                                />
                                <ErrorMessage name='password' component='small' className='error' />
                            </div>
                            <Button 
                                type='submit' 
                                label={isSubmitting ? "Registrando..." : 'Registrarse'}
                                disabled={isSubmitting}
                                className="w-full"
                            />
                        </Form>
                    )}
                </Formik>
                <span className="register-agreement">
                    <Link to="/login">¿Ya tenés cuenta? Inicia sesión</Link>
                </span>
            </div>
        </div>
    );
}