import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import './Form.css'

export default function TextField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    autoComplete,
    disabled = false
}) {
    const isPassword = type === 'password'
    const [showPassword, setShowPassword] = useState(false)

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
        <div className="form-group">
            {label && (
                <label className="form-label" htmlFor={name}>
                    {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
                </label>
            )}
            <div className="form-input-wrapper">
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    className={`form-input ${isPassword ? 'form-input-password' : ''}`}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    autoComplete={autoComplete}
                    disabled={disabled}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(prev => !prev)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                        title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                )}
            </div>
        </div>
    )
}
