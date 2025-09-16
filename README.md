# Sistema CRM Restaurante

Un sistema moderno de gestión de restaurantes basado en web diseñado para funcionar como una terminal/kiosco para propietarios y gerentes de restaurantes. Cuenta con una hermosa interfaz de glassmorphism con tema oscuro y diseño responsivo.

## Características

### 🏠 Panel Principal
- **Estadísticas en Tiempo Real**: Ventas del día, mesas activas, plato más popular, tiempo promedio de pedido
- **Vista General de Mesas**: Cuadrícula visual que muestra todas las mesas con indicadores de estado codificados por colores
- **Actividad Reciente**: Línea de tiempo de pedidos recientes y actividades del sistema
- **Acciones Rápidas**: Navegación fácil a todas las funciones principales

### 🪑 Gestión de Mesas
- **Cuadrícula Visual de Mesas**: Ver todas las mesas de un vistazo con indicadores de estado
- **Colores de Estado**:
  - 🟢 Verde: Libre
  - 🟡 Amarillo: Pidiendo
  - 🔴 Rojo: Ocupada
  - 🔵 Azul: Esperando Pago
- **Agregar/Editar/Eliminar Mesas**: Gestionar capacidad, ubicación y detalles de las mesas
- **Cambio Rápido de Estado**: Interfaz mejorada para cambiar el estado de las mesas con un clic
- **Eliminación de Mesas**: Funcionalidad completa para eliminar mesas no deseadas

### 📋 Gestión de Menú
- **Organización por Categorías**: Entradas, Platos Principales, Postres, Bebidas
- **Gestión de Items**: Agregar, editar y eliminar items del menú
- **Control de Precios**: Establecer precios y disponibilidad
- **Descripciones Detalladas**: Descripciones detalladas de items para mejor experiencia del cliente

### 🛒 Gestión de Pedidos
- **Pedidos por Mesa**: Seleccionar mesa y realizar pedidos
- **Pedidos Interactivos**: Agregar/remover items, ajustar cantidades
- **Cálculos en Tiempo Real**: Cálculo automático de subtotal, impuestos y total
- **Historial de Pedidos**: Ver pedidos anteriores para cada mesa
- **Seguimiento de Estado**: Monitorear el progreso de los pedidos

### 🧾 Sistema de Facturas Avanzado
- **Facturación Individual**: Facturar pedidos individuales por mesa
- **Facturación Completa de Mesa**: Facturar todos los pedidos pendientes de una mesa
- **Facturación Manual**: Crear facturas sin mesa ni productos específicos
- **Productos Manuales**: Agregar productos personalizados con precio y descripción
- **Productos Existentes**: Seleccionar productos del menú para facturación manual
- **Numeración Automática**: Sistema de numeración con prefijo personalizable
- **Información del Negocio**: Nombre del restaurante y datos en cada factura
- **Impresión Directa**: Funcionalidad de impresión integrada
- **Formato Profesional**: Diseño limpio y profesional para facturas

### 📊 Reportes y Análisis
- **Reportes de Ventas**: Resúmenes de ventas diarios, semanales y mensuales
- **Items Más Vendidos**: Rastrear los items del menú más populares
- **Desglose por Categoría**: Análisis de ventas por categoría de comida
- **Exportación PDF**: Generar reportes imprimibles
- **Períodos Flexibles**: Elegir períodos de reporte

### ⚙️ Configuración Avanzada
- **Acceso Protegido**: Contraseña requerida para acceder a la configuración (1234)
- **Cambio de Contraseña**: Modificar la contraseña de acceso desde la configuración
- **Información del Restaurante**: Nombre, prefijo de factura, moneda, tasas de impuestos
- **Horarios de Funcionamiento**: Establecer horarios de apertura y cierre
- **Configuración del Sistema**: Personalizar el sistema según sus necesidades
- **Cerrar Sesión**: Botón para bloquear nuevamente el acceso a configuración

## Características de Diseño

### 🎨 Interfaz Moderna
- **Diseño Glassmorphism**: Hermosos efectos de vidrio esmerilado
- **Dark Mode Mejorado**: Tema oscuro más profundo y elegante
- **Animaciones Suaves**: Transiciones y efectos hover fluidos
- **Diseño Responsivo**: Funciona en escritorio, tablet y dispositivos móviles
- **Contraste Optimizado**: Mejor legibilidad en pantallas de kiosco

### 🎯 Experiencia de Usuario
- **Navegación Intuitiva**: Navegación lateral fácil de usar
- **Estado Codificado por Colores**: Identificación visual rápida
- **Táctil Amigable**: Optimizado para pantallas táctiles y kioscos
- **Sin Login Requerido**: Acceso directo para operaciones rápidas

## Moneda y Localización

- **Pesos Argentinos**: Moneda por defecto configurada para Argentina
- **Formato de Números**: Formato argentino para números y monedas
- **Interfaz en Español**: Completamente traducida al español
- **Configuración Regional**: Fechas y horas en formato argentino

## Empezar

1. **Abrir el Sistema**: Simplemente abra `index.html` en cualquier navegador web moderno
2. **Sin Instalación Requerida**: El sistema funciona completamente en el navegador
3. **Persistencia de Datos**: Todos los datos se guardan localmente en el almacenamiento de su navegador
4. **Comenzar a Usar**: El sistema viene con datos de muestra para comenzar

## Guía de Uso

### Agregar Mesas
1. Vaya a la sección **Mesas**
2. Haga clic en **Agregar Mesa**
3. Ingrese número de mesa, capacidad y ubicación
4. Guarde para agregar la mesa

### Gestionar Items del Menú
1. Navegue a la sección **Menú**
2. Seleccione una pestaña de categoría
3. Haga clic en **Agregar Item** para crear nuevos items del menú
4. Edite o elimine items existentes según sea necesario

### Realizar Pedidos
1. Vaya a la sección **Pedidos**
2. Seleccione una mesa de la lista
3. Haga clic en **Nuevo Pedido** para abrir la interfaz de pedidos
4. Agregue items al pedido y ajuste cantidades
5. Realice el pedido cuando esté listo

### Generar Facturas

#### Facturación Individual
1. En la sección **Pedidos**, seleccione una mesa con pedidos
2. Haga clic en **Facturar** para generar una factura individual
3. La factura se abrirá en una nueva ventana para impresión

#### Facturación Completa de Mesa
1. En la sección **Pedidos**, seleccione una mesa con pedidos
2. Haga clic en **Facturar Mesa Completa**
3. Revise el resumen y confirme la facturación
4. Todos los pedidos pendientes se facturarán juntos
5. La mesa se marcará como libre automáticamente

#### Facturación Manual
1. En la sección **Pedidos**, haga clic en **Facturación Manual**
2. Elija entre **Producto Manual** o **Productos Existentes**
3. Para productos manuales: ingrese descripción, precio y cantidad
4. Para productos existentes: seleccione del menú disponible
5. Agregue todos los items necesarios
6. Haga clic en **Generar Factura** para crear la factura

### Ver Reportes
1. Navegue a la sección **Reportes**
2. Seleccione período de tiempo (Hoy, Esta Semana, Este Mes)
3. Vea resúmenes de ventas y análisis
4. Haga clic en **Exportar PDF** para generar reportes imprimibles

### Configurar Ajustes
1. Vaya a la sección **Configuración**
2. Ingrese la contraseña: **1234**
3. Actualice información del restaurante
4. Establezca tasas de impuestos y horarios de funcionamiento
5. Configure prefijo de factura y moneda
6. **Cambiar Contraseña**: Ingrese nueva contraseña y confírmela
7. Guarde cambios
8. Use "Cerrar Sesión" para bloquear el acceso nuevamente

## Detalles Técnicos

- **Frontend**: HTML5 puro, CSS3 y JavaScript (ES6+)
- **Almacenamiento**: Almacenamiento Local del Navegador para persistencia de datos
- **Responsivo**: Diseño mobile-first con breakpoints
- **Compatibilidad de Navegadores**: Navegadores modernos (Chrome, Firefox, Safari, Edge)
- **Sin Dependencias**: No se requieren librerías externas

## Gestión de Datos

El sistema guarda automáticamente todos los datos en el almacenamiento local de su navegador. Esto significa:
- ✅ Los datos persisten entre sesiones del navegador
- ✅ No se requiere servidor
- ✅ Funciona sin conexión
- ⚠️ Los datos están vinculados al navegador/dispositivo específico

## Personalización

El sistema está diseñado para ser fácilmente personalizable:
- **Colores**: Modificar variables CSS para diferentes esquemas de color
- **Diseño**: Ajustar diseños de cuadrícula y espaciado
- **Características**: Agregar o modificar funcionalidad en el código JavaScript
- **Estilos**: Actualizar efectos glassmorphism y animaciones

## Compatibilidad de Navegadores

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Características Especiales

### Sistema de Facturas
- **Sin APIs Externas**: Generación de facturas completamente local
- **Numeración Automática**: Sistema de numeración secuencial con prefijo personalizable
- **Diseño Profesional**: Facturas con formato limpio y profesional
- **Información Completa**: Incluye todos los detalles del pedido y del restaurante

### Gestión Mejorada de Mesas
- **Interfaz Visual**: Cambio de estado con interfaz gráfica intuitiva
- **Eliminación Segura**: Confirmación antes de eliminar mesas
- **Estados Claros**: Indicadores visuales claros para cada estado de mesa

## Soporte

Este es un sistema autocontenido que no requiere servicios o servidores externos. Toda la funcionalidad está construida en los tres archivos principales:
- `index.html` - Estructura y diseño
- `styles.css` - Estilos y diseño responsivo
- `script.js` - Funcionalidad y gestión de datos

¡Disfrute gestionando su restaurante con este sistema CRM moderno y eficiente! 🍽️