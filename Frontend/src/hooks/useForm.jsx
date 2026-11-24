import { useState } from 'react'

export default function useForm(initial_state) {
    const [formState, setFormState] = useState(initial_state)

    function handleChangeInput(event) {
        const input = event.target
        const field_name = input.name
        const field_value = input.type === 'checkbox' ? input.checked : input.value

        setFormState((prevState) => ({
            ...prevState,
            [field_name]: field_value
        }))
    }

    function setFieldValue(field_name, value) {
        setFormState((prevState) => ({
            ...prevState,
            [field_name]: value
        }))
    }

    function resetForm() {
        setFormState(initial_state)
    }

    return {
        formState,
        handleChangeInput,
        setFieldValue,
        setFormState,
        resetForm
    }
}
