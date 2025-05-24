# Secure React Practices - Frontend

Esta aplicación implementa prácticas seguras de desarrollo en React, siguiendo estándares internacionales de seguridad.

## Características de Seguridad

### Implementación de Contraseña Segura y Cifrado

- Validación robusta de contraseñas según ISO/IEC 27001/27002
- Indicador de fortaleza de contraseña en tiempo real
- Transmisión segura de credenciales

### Autenticación Multifactor (MFA)

- Soporte para autenticación de dos factores por correo electrónico
- Envío de código de verificación al email del usuario
- Flujo seguro de verificación MFA

## Tecnologías

- React 19 con TypeScript
- Vite como bundler
- React Router para navegación
- TanStack Query para gestión de datos
- **Bootstrap 5** para estilos modernos, elegantes y responsivos
- Axios para comunicación con API

## Instalación

1. Clona el repositorio
2. Ejecuta `npm install` para instalar dependencias
3. Configura variables de entorno en el archivo `.env`
4. Ejecuta `npm run dev` para iniciar en modo desarrollo

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```
VITE_API_URL=http://localhost:3001/api
```

## Estructura del Proyecto

- `/src/api` - Cliente API y funciones de comunicación con backend
- `/src/components` - Componentes reutilizables 
- `/src/context` - Proveedores de contexto (autenticación)
- `/src/pages` - Páginas principales de la aplicación
- `/src/types` - Definiciones de tipos TypeScript

## Estándares de Seguridad

Esta aplicación cumple con los siguientes estándares:

1. **ISO/IEC 27001** - Gestión de la Seguridad de la Información
2. **ISO/IEC 27002 (A.9.2.4)** - Gestión de contraseñas
3. **NIST SP 800-63B** - Guía para autenticación digital
4. **RFC 6238** - Algoritmo TOTP para autenticación multifactor
