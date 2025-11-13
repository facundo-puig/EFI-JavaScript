import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/LoginForm.css'

const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required('El email es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria')
})

export default function LoginForm() {

    const navigate = useNavigate()

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('token', data.access_token)
                toast.success("Inicio de sesión exitoso")
                resetForm()
                setTimeout(() => navigate('/posts'), 2000)
            } else {
                toast.error(data.error || "Error al iniciar sesión")
            }
        } catch (error) {
            toast.error("Hubo un error con el servidor", error)
        }
    }

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
    )

}