import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import "../styles/RegisterForm.css"


const validationSchema = Yup.object({
    username: Yup.string().required("El nombre es obligatorio"),
    email: Yup.string().email("Email invalido").required('El email es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria')
})


export default function RegisterForm() {

    const navigate = useNavigate()

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Usuario registrado con éxito")
                resetForm()
                setTimeout(() => navigate('/login'), 2000)
            } else {
                toast.error(data.error || "Hubo un error al registrar el usuario")
            }
        } catch (error) {
            toast.error("Hubo un error con el servidor", error)
        }
    }

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
    )

}