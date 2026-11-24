import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import AuthMiddleware from './Middlewares/AuthMiddleware'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import LoginScreen from './screens/LoginScreen/LoginScreen'
import RegisterScreen from './screens/RegisterScreen/RegisterScreen'
import VerifyEmailScreen from './screens/VerifyEmailScreen/VerifyEmailScreen'
import ResendVerificationScreen from './screens/ResendVerificationScreen/ResendVerificationScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen/ForgotPasswordScreen'
import ResetPasswordScreen from './screens/ResetPasswordScreen/ResetPasswordScreen'
import ProjectsScreen from './screens/ProjectsScreen/ProjectsScreen'
import ProjectDetailScreen from './screens/ProjectDetailScreen/ProjectDetailScreen'
import TasksScreen from './screens/TasksScreen/TasksScreen'
import TaskDetailScreen from './screens/TaskDetailScreen/TaskDetailScreen'

export default function App() {
  return (
    <Routes>
      {/* Rutas Públicas de Autenticación */}
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/verify-email" element={<VerifyEmailScreen />} />
      <Route path="/resend-verification" element={<ResendVerificationScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/reset-password" element={<ResetPasswordScreen />} />

      {/* Rutas Protegidas por JWT (AuthMiddleware) */}
      <Route element={<AuthMiddleware />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        
        {/* CRUD Entidad Relacionada: Proyectos */}
        <Route path="/projects" element={<ProjectsScreen />} />
        <Route path="/projects/:project_id" element={<ProjectDetailScreen />} />

        {/* CRUD Entidad Principal: Tareas */}
        <Route path="/tasks" element={<TasksScreen />} />
        <Route path="/tasks/:task_id" element={<TaskDetailScreen />} />
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
