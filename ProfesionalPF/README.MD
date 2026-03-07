<h1 align="center">📊 P&PF | Personal Professional Finance</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
</p>

<p align="center">
  <strong>Una solución robusta para el control financiero, proyecciones de ahorro y gestión de patrimonio en tiempo real.</strong>
</p>

---

## 🎯 Objetivo del Proyecto
**P&PF | Finances** nace de la necesidad de centralizar la salud financiera personal en una única plataforma. A diferencia de otras herramientas, este proyecto se enfoca en la **disponibilidad real de capital**, descontando automáticamente las metas de ahorro del balance neto para evitar el sobregasto.



## 💎 Valor Agregado
* **Autenticación Social (OAuth 2.0):** Implementación de Google Sign-In con registro silencioso para una experiencia de usuario sin fricciones.
* **Conversión de Divisas Automática:** Integración de TRM dinámica para visualizar saldos tanto en **COP** como en **USD**.
* **Reportabilidad PDF:** Generación instantánea de reportes profesionales utilizando `jsPDF` y `autoTable`.
* **Proyecciones Financieras:** Algoritmo basado en la Tasa Efectiva Anual (TEA) para proyectar el crecimiento de ahorros a 1 y 5 años.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnologías |
| :--- | :--- |
| **Frontend** | React 18, Vite, Axios, Recharts, Tailwind/CSS Custom |
| **Backend** | Node.js, Express, Cors, Helmet, Morgan |
| **Base de Datos** | Supabase (PostgreSQL) con esquemas relacionales |
| **Seguridad** | Google OAuth 2.0, Bcrypt para hashing de contraseñas |

---

## 📐 Lógica de Interés Compuesto
El motor de proyecciones utiliza la fórmula matemática de interés compuesto para estimar el valor futuro de las metas de ahorro:

$$A = P \left(1 + \frac{r}{n}\right)^{nt}$$

Donde:
* $A$: Es el monto final acumulado.
* $P$: Es el capital inicial ahorrado.
* $r$: Es la tasa de interés anual (TEA).
* $t$: Es el tiempo en años proyectados.

---

## 📂 Estructura del Repositorio
El proyecto utiliza una arquitectura de monorepo gestionada por carpetas independientes para frontend y backend:

```text
ProfesionalPF/
├── frontend/             # Cliente React (Desplegado en Vercel)
│   ├── src/pages/        # Auth, Home y Profile
│   └── vite.config.js    # Configuración de empaquetado
├── backend/              # Servidor Node.js (Desplegado en Render)
│   ├── src/controllers/  # Lógica de negocio y Supabase
│   └── src/index.js      # Punto de entrada y Middlewares
└── README.md             # Documentación principal