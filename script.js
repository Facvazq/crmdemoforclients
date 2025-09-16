// Sistema CRM Restaurante
class RestaurantCRM {
    constructor() {
        this.data = {
            tables: [],
            menuItems: [],
            orders: [],
            invoices: [],
            settings: {
                restaurantName: 'Mi Restaurante',
                invoicePrefix: 'FAC-001',
                currency: 'ARS',
                taxRate: 21.0,
                openingTime: '09:00',
                closingTime: '22:00'
            },
            activities: []
        };
        
        this.currentPage = 'dashboard';
        this.selectedTable = null;
        this.currentOrder = [];
        this.invoiceCounter = 1;
        this.configPassword = '1234';
        this.isConfigUnlocked = false;
        this.manualInvoiceItems = [];
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderDashboard();
        this.updateStats();
    }

    // Gestión de Datos
    loadData() {
        const savedData = localStorage.getItem('restaurantCRM');
        if (savedData) {
            this.data = { ...this.data, ...JSON.parse(savedData) };
            this.invoiceCounter = this.data.invoices.length + 1;
        } else {
            this.initializeDefaultData();
        }
    }

    saveData() {
        localStorage.setItem('restaurantCRM', JSON.stringify(this.data));
    }

    initializeDefaultData() {
        // Items del menú por defecto
        this.data.menuItems = [
            { id: 1, name: 'Ensalada César', category: 'entradas', price: 2500, description: 'Lechuga fresca con aderezo césar', available: true },
            { id: 2, name: 'Salmón a la Plancha', category: 'platos', price: 4500, description: 'Salmón del Atlántico con salsa de mantequilla y limón', available: true },
            { id: 3, name: 'Pollo a la Parmesana', category: 'platos', price: 3800, description: 'Pollo empanizado con salsa marinara y mozzarella', available: true },
            { id: 4, name: 'Torta de Chocolate', category: 'postres', price: 1800, description: 'Torta rica de chocolate con helado de vainilla', available: true },
            { id: 5, name: 'Coca Cola', category: 'bebidas', price: 800, description: 'Bebida cola clásica', available: true },
            { id: 6, name: 'Café', category: 'bebidas', price: 600, description: 'Café recién preparado', available: true }
        ];

        // Mesas por defecto
        this.data.tables = [
            { id: 1, number: '1', capacity: 4, location: 'Comedor Principal', status: 'free' },
            { id: 2, number: '2', capacity: 2, location: 'Comedor Principal', status: 'free' },
            { id: 3, number: '3', capacity: 6, location: 'Comedor Principal', status: 'free' },
            { id: 4, number: '4', capacity: 4, location: 'Patio', status: 'free' },
            { id: 5, number: '5', capacity: 8, location: 'Comedor Principal', status: 'free' }
        ];

        this.saveData();
    }

    // Event Listeners
    setupEventListeners() {
        // Navegación
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Actualizar dashboard
        document.getElementById('refreshData').addEventListener('click', () => {
            this.updateStats();
            this.renderDashboard();
        });

        // Modal agregar mesa
        document.getElementById('addTableBtn').addEventListener('click', () => {
            this.showModal('addTableModal');
        });

        document.getElementById('addTableForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTable();
        });

        // Modal agregar item del menú
        document.getElementById('addMenuItemBtn').addEventListener('click', () => {
            this.showModal('addMenuItemModal');
        });

        document.getElementById('addMenuItemForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMenuItem();
        });

        // Formulario de configuración
        document.getElementById('restaurantSettings').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });

        // Formulario de contraseña
        document.getElementById('passwordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.checkPassword();
        });

        // Formulario de item manual
        document.getElementById('manualItemForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addManualItem();
        });

        // Botones de facturación manual
        document.getElementById('generateManualInvoiceBtn').addEventListener('click', () => {
            this.generateManualInvoice();
        });

        document.getElementById('clearManualItemsBtn').addEventListener('click', () => {
            this.clearManualItems();
        });

        // Botón de facturación completa de mesa
        document.getElementById('confirmFullInvoiceBtn').addEventListener('click', () => {
            this.confirmFullTableInvoice();
        });

        // Reportes
        document.getElementById('reportPeriod').addEventListener('change', () => {
            this.renderReports();
        });

        document.getElementById('exportReportBtn').addEventListener('click', () => {
            this.exportReport();
        });

        // Botones cerrar modal
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.hideModal(e.target.closest('.modal'));
            });
        });

        // Cerrar modal al hacer clic en el fondo
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal);
                }
            });
        });

        // Eventos del modal de pedidos
        document.getElementById('placeOrderBtn').addEventListener('click', () => {
            this.placeOrder();
        });

        document.getElementById('clearOrderBtn').addEventListener('click', () => {
            this.currentOrder = [];
            this.updateOrderDisplay();
        });
    }

    // Navegación
    navigateToPage(page) {
        // Verificar si se está intentando acceder a configuración
        if (page === 'settings' && !this.isConfigUnlocked) {
            this.showPasswordModal();
            return;
        }

        // Actualizar item de navegación activo
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Mostrar página
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(page).classList.add('active');

        this.currentPage = page;

        // Renderizar contenido de la página
        switch (page) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'tables':
                this.renderTables();
                break;
            case 'menu':
                this.renderMenu();
                break;
            case 'orders':
                this.renderOrders();
                break;
            case 'reports':
                this.renderReports();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
    }

    // Dashboard
    renderDashboard() {
        this.renderTablesOverview();
        this.renderRecentActivity();
    }

    renderTablesOverview() {
        const container = document.getElementById('tablesOverview');
        container.innerHTML = '';

        this.data.tables.forEach(table => {
            const tableElement = document.createElement('div');
            tableElement.className = `table-status ${table.status}`;
            tableElement.innerHTML = `
                <div class="table-number">Mesa ${table.number}</div>
                <div class="table-capacity">${table.capacity} asientos</div>
            `;
            tableElement.addEventListener('click', () => {
                this.navigateToPage('tables');
            });
            container.appendChild(tableElement);
        });
    }

    renderRecentActivity() {
        const container = document.getElementById('recentActivity');
        container.innerHTML = '';

        if (this.data.activities.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">Sin actividad reciente</p>';
            return;
        }

        this.data.activities.slice(-5).reverse().forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item';
            activityElement.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${this.formatTime(activity.timestamp)}</div>
                </div>
            `;
            container.appendChild(activityElement);
        });
    }

    updateStats() {
        const today = new Date().toDateString();
        const todayOrders = this.data.orders.filter(order => 
            new Date(order.timestamp).toDateString() === today
        );

        // Ventas totales de hoy
        const totalSales = todayOrders.reduce((sum, order) => sum + order.total, 0);
        document.getElementById('totalSales').textContent = this.formatCurrency(totalSales);

        // Mesas activas
        const activeTables = this.data.tables.filter(table => 
            table.status !== 'free'
        ).length;
        document.getElementById('activeTables').textContent = activeTables;

        // Plato más popular
        const itemCounts = {};
        todayOrders.forEach(order => {
            order.items.forEach(item => {
                itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
            });
        });
        const popularDish = Object.keys(itemCounts).reduce((a, b) => 
            itemCounts[a] > itemCounts[b] ? a : b, 'N/A'
        );
        document.getElementById('popularDish').textContent = popularDish;

        // Tiempo promedio de pedido (datos simulados)
        document.getElementById('avgOrderTime').textContent = '25 min';
    }

    // Gestión de Mesas
    renderTables() {
        const container = document.getElementById('tablesGrid');
        container.innerHTML = '';

        this.data.tables.forEach(table => {
            const tableElement = document.createElement('div');
            tableElement.className = `table-card ${table.status}`;
            tableElement.innerHTML = `
                <div class="table-card-header">
                    <div class="table-number">Mesa ${table.number}</div>
                    <div class="table-status-indicator"></div>
                </div>
                <div class="table-info">
                    <div>Capacidad: ${table.capacity} asientos</div>
                    <div>Ubicación: ${table.location}</div>
                    <div>Estado: ${this.getStatusText(table.status)}</div>
                </div>
                <div class="table-actions">
                    <button class="btn btn-sm btn-primary" onclick="crm.openOrderModal(${table.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Pedido
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="crm.toggleTableStatus(${table.id})">
                        <i class="fas fa-edit"></i>
                        Cambiar Estado
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="crm.deleteTable(${table.id})">
                        <i class="fas fa-trash"></i>
                        Eliminar
                    </button>
                </div>
            `;
            container.appendChild(tableElement);
        });
    }

    getStatusText(status) {
        const statusMap = {
            'free': 'Libre',
            'occupied': 'Ocupada',
            'ordering': 'Pidiendo',
            'payment': 'Esperando Pago'
        };
        return statusMap[status] || status;
    }

    addTable() {
        const number = document.getElementById('tableNumber').value;
        const capacity = parseInt(document.getElementById('tableCapacity').value);
        const location = document.getElementById('tableLocation').value;

        const newTable = {
            id: Date.now(),
            number,
            capacity,
            location: location || 'Comedor Principal',
            status: 'free'
        };

        this.data.tables.push(newTable);
        this.saveData();
        this.hideModal(document.getElementById('addTableModal'));
        this.renderTables();
        this.addActivity('Mesa agregada', 'fas fa-plus', `Mesa ${number} agregada`);
        
        // Resetear formulario
        document.getElementById('addTableForm').reset();
    }

    deleteTable(tableId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta mesa?')) {
            const table = this.data.tables.find(t => t.id === tableId);
            this.data.tables = this.data.tables.filter(t => t.id !== tableId);
            this.saveData();
            this.renderTables();
            this.addActivity('Mesa eliminada', 'fas fa-trash', `Mesa ${table.number} eliminada`);
        }
    }

    toggleTableStatus(tableId) {
        const table = this.data.tables.find(t => t.id === tableId);
        if (table) {
            this.showStatusChangeModal(table);
        }
    }

    showStatusChangeModal(table) {
        const container = document.createElement('div');
        container.className = 'status-change-container';
        container.innerHTML = `
            <div class="status-change-modal">
                <h2>Cambiar Estado - Mesa ${table.number}</h2>
                <p>Estado actual: <strong>${this.getStatusText(table.status)}</strong></p>
                <div class="status-options">
                    <div class="status-option free ${table.status === 'free' ? 'selected' : ''}" data-status="free">
                        <div class="status-icon">🟢</div>
                        <div class="status-text">Libre</div>
                        <div class="status-description">Mesa disponible</div>
                    </div>
                    <div class="status-option occupied ${table.status === 'occupied' ? 'selected' : ''}" data-status="occupied">
                        <div class="status-icon">🔴</div>
                        <div class="status-text">Ocupada</div>
                        <div class="status-description">Clientes comiendo</div>
                    </div>
                    <div class="status-option ordering ${table.status === 'ordering' ? 'selected' : ''}" data-status="ordering">
                        <div class="status-icon">🟡</div>
                        <div class="status-text">Pidiendo</div>
                        <div class="status-description">Tomando pedido</div>
                    </div>
                    <div class="status-option payment ${table.status === 'payment' ? 'selected' : ''}" data-status="payment">
                        <div class="status-icon">🔵</div>
                        <div class="status-text">Esperando Pago</div>
                        <div class="status-description">Listo para facturar</div>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                    <button class="btn btn-secondary" onclick="crm.hideStatusChangeModal()">Cancelar</button>
                    <button class="btn btn-primary" onclick="crm.confirmStatusChange(${table.id})">Confirmar</button>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Agregar event listeners a las opciones
        container.querySelectorAll('.status-option').forEach(option => {
            option.addEventListener('click', () => {
                container.querySelectorAll('.status-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        this.statusChangeContainer = container;
    }

    hideStatusChangeModal() {
        if (this.statusChangeContainer) {
            document.body.removeChild(this.statusChangeContainer);
            this.statusChangeContainer = null;
        }
    }

    confirmStatusChange(tableId) {
        const selectedOption = this.statusChangeContainer.querySelector('.status-option.selected');
        if (selectedOption) {
            const newStatus = selectedOption.dataset.status;
            const table = this.data.tables.find(t => t.id === tableId);
            
            if (table && table.status !== newStatus) {
                table.status = newStatus;
                this.saveData();
                this.renderTables();
                this.addActivity('Estado de mesa cambiado', 'fas fa-edit', `Mesa ${table.number}: ${this.getStatusText(table.status)}`);
            }
        }
        this.hideStatusChangeModal();
    }

    // Gestión de Menú
    renderMenu() {
        this.renderCategoryTabs();
        this.renderMenuItems();
    }

    renderCategoryTabs() {
        const container = document.getElementById('categoryTabs');
        const categories = [...new Set(this.data.menuItems.map(item => item.category))];
        
        container.innerHTML = '';
        categories.forEach(category => {
            const tab = document.createElement('div');
            tab.className = 'category-tab';
            tab.textContent = this.getCategoryText(category);
            tab.addEventListener('click', () => {
                document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.renderMenuItems(category);
            });
            container.appendChild(tab);
        });

        // Establecer primera pestaña como activa
        if (categories.length > 0) {
            container.firstChild.classList.add('active');
            this.renderMenuItems(categories[0]);
        }
    }

    getCategoryText(category) {
        const categoryMap = {
            'entradas': 'Entradas',
            'platos': 'Platos Principales',
            'postres': 'Postres',
            'bebidas': 'Bebidas'
        };
        return categoryMap[category] || category;
    }

    renderMenuItems(category = null) {
        const container = document.getElementById('menuItems');
        container.innerHTML = '';

        const items = category ? 
            this.data.menuItems.filter(item => item.category === category) :
            this.data.menuItems;

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item';
            itemElement.innerHTML = `
                <div class="menu-item-header">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-price">${this.formatCurrency(item.price)}</div>
                </div>
                <div class="menu-item-description">${item.description}</div>
                <div class="menu-item-actions">
                    <button class="btn btn-sm btn-secondary" onclick="crm.editMenuItem(${item.id})">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="crm.deleteMenuItem(${item.id})">
                        <i class="fas fa-trash"></i>
                        Eliminar
                    </button>
                </div>
            `;
            container.appendChild(itemElement);
        });
    }

    addMenuItem() {
        const name = document.getElementById('itemName').value;
        const category = document.getElementById('itemCategory').value;
        const price = parseFloat(document.getElementById('itemPrice').value);
        const description = document.getElementById('itemDescription').value;
        const available = document.getElementById('itemAvailable').checked;

        const newItem = {
            id: Date.now(),
            name,
            category,
            price,
            description,
            available
        };

        this.data.menuItems.push(newItem);
        this.saveData();
        this.hideModal(document.getElementById('addMenuItemModal'));
        this.renderMenu();
        this.addActivity('Item del menú agregado', 'fas fa-plus', `${name} agregado al menú`);
        
        // Resetear formulario
        document.getElementById('addMenuItemForm').reset();
    }

    editMenuItem(itemId) {
        const item = this.data.menuItems.find(i => i.id === itemId);
        if (item) {
            // Por ahora, solo cambiar disponibilidad
            item.available = !item.available;
            this.saveData();
            this.renderMenu();
            this.addActivity('Item del menú actualizado', 'fas fa-edit', `${item.name} disponibilidad cambiada`);
        }
    }

    deleteMenuItem(itemId) {
        if (confirm('¿Estás seguro de que quieres eliminar este item del menú?')) {
            const item = this.data.menuItems.find(i => i.id === itemId);
            this.data.menuItems = this.data.menuItems.filter(i => i.id !== itemId);
            this.saveData();
            this.renderMenu();
            this.addActivity('Item del menú eliminado', 'fas fa-trash', `${item.name} removido del menú`);
        }
    }

    // Gestión de Pedidos
    renderOrders() {
        this.renderOrdersTablesList();
    }

    renderOrdersTablesList() {
        const container = document.getElementById('ordersTablesList');
        container.innerHTML = '';

        this.data.tables.forEach(table => {
            const tableElement = document.createElement('div');
            tableElement.className = `table-selector-item ${this.selectedTable === table.id ? 'active' : ''}`;
            tableElement.innerHTML = `
                <div>
                    <div>Mesa ${table.number}</div>
                    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">${this.getStatusText(table.status)}</div>
                </div>
                <div class="table-status-indicator"></div>
            `;
            tableElement.addEventListener('click', () => {
                this.selectTable(table.id);
            });
            container.appendChild(tableElement);
        });
    }

    selectTable(tableId) {
        this.selectedTable = tableId;
        this.renderOrdersTablesList();
        this.renderOrderDetails();
    }

    renderOrderDetails() {
        const container = document.getElementById('orderDetails');
        
        if (!this.selectedTable) {
            container.innerHTML = `
                <div class="no-selection">
                    <i class="fas fa-table"></i>
                    <p>Selecciona una mesa para ver pedidos</p>
                </div>
            `;
            return;
        }

        const table = this.data.tables.find(t => t.id === this.selectedTable);
        const tableOrders = this.data.orders.filter(order => order.tableId === this.selectedTable);

        container.innerHTML = `
            <div class="order-details-header">
                <h3>Pedidos Mesa ${table.number}</h3>
                <div class="header-buttons">
                    <button class="btn btn-primary" onclick="crm.showFullTableInvoiceModal(${this.selectedTable})">
                        <i class="fas fa-receipt"></i>
                        Facturar Mesa Completa
                    </button>
                    <button class="btn btn-secondary" onclick="crm.openOrderModal(${this.selectedTable})">
                        <i class="fas fa-plus"></i>
                        Nuevo Pedido
                    </button>
                </div>
            </div>
            <div class="orders-list">
                ${tableOrders.length === 0 ? 
                    '<p style="text-align: center; color: rgba(255,255,255,0.6); margin-top: 2rem;">No hay pedidos para esta mesa</p>' :
                    tableOrders.map(order => this.renderOrderItem(order)).join('')
                }
            </div>
        `;
    }

    renderOrderItem(order) {
        return `
            <div class="order-item">
                <div class="order-info">
                    <div class="order-time">${this.formatTime(order.timestamp)}</div>
                    <div class="order-total">${this.formatCurrency(order.total)}</div>
                </div>
                <div class="order-items-preview">
                    ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                </div>
                <div class="order-actions">
                    <button class="btn btn-sm btn-primary" onclick="crm.generateInvoice(${order.id})">
                        <i class="fas fa-file-invoice"></i>
                        Facturar
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="crm.viewOrderDetails(${order.id})">
                        <i class="fas fa-eye"></i>
                        Ver
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="crm.deleteOrder(${order.id})">
                        <i class="fas fa-trash"></i>
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    }

    openOrderModal(tableId) {
        this.currentOrder = [];
        this.selectedTable = tableId;
        this.showModal('orderModal');
        this.renderOrderModal();
    }

    renderOrderModal() {
        const menuContainer = document.getElementById('orderMenuItems');
        const orderContainer = document.getElementById('currentOrderItems');
        
        // Renderizar items del menú
        menuContainer.innerHTML = '';
        this.data.menuItems.filter(item => item.available).forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item-order';
            itemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${this.formatCurrency(item.price)}</div>
                </div>
                <button class="add-item-btn" onclick="crm.addToOrder(${item.id})">
                    <i class="fas fa-plus"></i>
                </button>
            `;
            menuContainer.appendChild(itemElement);
        });

        this.updateOrderDisplay();
    }

    addToOrder(itemId) {
        const item = this.data.menuItems.find(i => i.id === itemId);
        const existingItem = this.currentOrder.find(i => i.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.currentOrder.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1
            });
        }
        
        this.updateOrderDisplay();
    }

    removeFromOrder(itemId) {
        this.currentOrder = this.currentOrder.filter(item => item.id !== itemId);
        this.updateOrderDisplay();
    }

    updateOrderQuantity(itemId, quantity) {
        if (quantity <= 0) {
            this.removeFromOrder(itemId);
        } else {
            const item = this.currentOrder.find(i => i.id === itemId);
            if (item) {
                item.quantity = quantity;
            }
        }
        this.updateOrderDisplay();
    }

    updateOrderDisplay() {
        const container = document.getElementById('currentOrderItems');
        container.innerHTML = '';

        if (this.currentOrder.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">No hay items en el pedido</p>';
            this.updateOrderTotal();
            return;
        }

        this.currentOrder.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">${this.formatCurrency(item.price)} cada uno</div>
                </div>
                <div class="order-item-controls">
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="crm.updateOrderQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" onchange="crm.updateOrderQuantity(${item.id}, parseInt(this.value))">
                        <button class="qty-btn" onclick="crm.updateOrderQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="crm.removeFromOrder(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(itemElement);
        });

        this.updateOrderTotal();
    }

    updateOrderTotal() {
        const subtotal = this.currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * (this.data.settings.taxRate / 100);
        const total = subtotal + tax;

        document.getElementById('orderSubtotal').textContent = this.formatCurrency(subtotal);
        document.getElementById('orderTax').textContent = this.formatCurrency(tax);
        document.getElementById('orderTotal').textContent = this.formatCurrency(total);
    }

    placeOrder() {
        if (this.currentOrder.length === 0) {
            alert('Por favor agrega items al pedido');
            return;
        }

        const subtotal = this.currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * (this.data.settings.taxRate / 100);
        const total = subtotal + tax;

        const order = {
            id: Date.now(),
            tableId: this.selectedTable,
            items: [...this.currentOrder],
            subtotal,
            tax,
            total,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        this.data.orders.push(order);
        
        // Actualizar estado de la mesa
        const table = this.data.tables.find(t => t.id === this.selectedTable);
        if (table) {
            table.status = 'occupied';
        }

        this.saveData();
        this.hideModal(document.getElementById('orderModal'));
        this.addActivity('Pedido realizado', 'fas fa-shopping-cart', `Pedido realizado para Mesa ${table.number}`);
        
        // Actualizar displays
        this.renderTables();
        this.renderOrders();
        this.updateStats();
    }

    // Sistema de Facturas
    generateInvoice(orderId) {
        const order = this.data.orders.find(o => o.id === orderId);
        if (!order) return;

        const table = this.data.tables.find(t => t.id === order.tableId);
        const invoiceNumber = `${this.data.settings.invoicePrefix}-${String(this.invoiceCounter).padStart(3, '0')}`;
        
        const invoice = {
            id: Date.now(),
            invoiceNumber,
            orderId: order.id,
            tableNumber: table.number,
            items: order.items,
            subtotal: order.subtotal,
            tax: order.tax,
            total: order.total,
            timestamp: new Date().toISOString(),
            status: 'paid'
        };

        this.data.invoices.push(invoice);
        this.invoiceCounter++;
        
        // Actualizar estado de la mesa a libre
        if (table) {
            table.status = 'free';
        }

        this.saveData();
        this.addActivity('Factura generada', 'fas fa-file-invoice', `Factura ${invoiceNumber} generada`);
        
        // Mostrar factura
        this.showInvoice(invoice);
        
        // Actualizar displays
        this.renderTables();
        this.renderOrders();
        this.updateStats();
    }

    showInvoice(invoice) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(this.generateInvoiceHTML(invoice));
        printWindow.document.close();
        printWindow.print();
    }

    generateInvoiceHTML(invoice) {
        const currentDate = new Date().toLocaleDateString('es-AR');
        const currentTime = new Date().toLocaleTimeString('es-AR');
        
        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Factura ${invoice.invoiceNumber}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: white;
                        color: #333;
                    }
                    .invoice-header {
                        text-align: center;
                        border-bottom: 2px solid #00d4ff;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .invoice-title {
                        font-size: 28px;
                        font-weight: bold;
                        color: #00d4ff;
                        margin-bottom: 10px;
                    }
                    .invoice-info {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                    }
                    .invoice-details {
                        flex: 1;
                    }
                    .invoice-details h3 {
                        margin: 0 0 10px 0;
                        color: #333;
                    }
                    .invoice-details p {
                        margin: 5px 0;
                        color: #666;
                    }
                    .items-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }
                    .items-table th,
                    .items-table td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: left;
                    }
                    .items-table th {
                        background-color: #f8f9fa;
                        font-weight: bold;
                    }
                    .items-table .text-right {
                        text-align: right;
                    }
                    .items-table .text-center {
                        text-align: center;
                    }
                    .totals {
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 20px;
                    }
                    .totals-table {
                        width: 300px;
                    }
                    .totals-table td {
                        padding: 8px 12px;
                        border: none;
                    }
                    .totals-table .total-row {
                        font-weight: bold;
                        font-size: 18px;
                        border-top: 2px solid #00d4ff;
                        color: #00d4ff;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="invoice-header">
                    <div class="invoice-title">${this.data.settings.restaurantName}</div>
                    <div>Factura ${invoice.invoiceNumber}</div>
                </div>
                
                <div class="invoice-info">
                    <div class="invoice-details">
                        <h3>Información de la Factura</h3>
                        <p><strong>Número:</strong> ${invoice.invoiceNumber}</p>
                        <p><strong>Fecha:</strong> ${currentDate}</p>
                        <p><strong>Hora:</strong> ${currentTime}</p>
                        <p><strong>Mesa:</strong> ${invoice.tableNumber}</p>
                        ${invoice.isManual ? '<p><strong>Tipo:</strong> Facturación Manual</p>' : ''}
                        ${invoice.isFullTable ? '<p><strong>Tipo:</strong> Facturación Completa de Mesa</p>' : ''}
                    </div>
                </div>
                
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th class="text-center">Cantidad</th>
                            <th class="text-right">Precio Unit.</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td class="text-center">${item.quantity}</td>
                                <td class="text-right">${this.formatCurrency(item.price)}</td>
                                <td class="text-right">${this.formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="totals">
                    <table class="totals-table">
                        <tr>
                            <td>Subtotal:</td>
                            <td class="text-right">${this.formatCurrency(invoice.subtotal)}</td>
                        </tr>
                        <tr>
                            <td>Impuesto (${this.data.settings.taxRate}%):</td>
                            <td class="text-right">${this.formatCurrency(invoice.tax)}</td>
                        </tr>
                        <tr class="total-row">
                            <td>TOTAL:</td>
                            <td class="text-right">${this.formatCurrency(invoice.total)}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="footer">
                    <p>¡Gracias por su visita!</p>
                    <p>${this.data.settings.restaurantName}</p>
                </div>
            </body>
            </html>
        `;
    }

    // Reportes
    renderReports() {
        this.renderSalesSummary();
        this.renderTopItems();
        this.renderCategoryBreakdown();
    }

    renderSalesSummary() {
        const period = document.getElementById('reportPeriod').value;
        const orders = this.getOrdersForPeriod(period);
        
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

        document.getElementById('salesSummary').innerHTML = `
            <div class="summary-item">
                <div class="summary-value">${this.formatCurrency(totalSales)}</div>
                <div class="summary-label">Ventas Totales</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">${totalOrders}</div>
                <div class="summary-label">Total Pedidos</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">${this.formatCurrency(avgOrderValue)}</div>
                <div class="summary-label">Valor Promedio</div>
            </div>
        `;
    }

    renderTopItems() {
        const period = document.getElementById('reportPeriod').value;
        const orders = this.getOrdersForPeriod(period);
        
        const itemCounts = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
            });
        });

        const topItems = Object.entries(itemCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        document.getElementById('topItems').innerHTML = topItems.length === 0 ? 
            '<p style="text-align: center; color: rgba(255,255,255,0.6);">No hay datos disponibles</p>' :
            topItems.map(([name, count]) => `
                <div class="top-item">
                    <div class="item-name">${name}</div>
                    <div class="item-sales">${count} vendidos</div>
                </div>
            `).join('');
    }

    renderCategoryBreakdown() {
        const period = document.getElementById('reportPeriod').value;
        const orders = this.getOrdersForPeriod(period);
        
        const categoryTotals = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const menuItem = this.data.menuItems.find(mi => mi.name === item.name);
                if (menuItem) {
                    const category = menuItem.category;
                    categoryTotals[category] = (categoryTotals[category] || 0) + (item.price * item.quantity);
                }
            });
        });

        document.getElementById('categoryBreakdown').innerHTML = Object.keys(categoryTotals).length === 0 ? 
            '<p style="text-align: center; color: rgba(255,255,255,0.6);">No hay datos disponibles</p>' :
            Object.entries(categoryTotals)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount]) => `
                    <div class="category-item">
                        <div class="category-name">${this.getCategoryText(category)}</div>
                        <div class="category-amount">${this.formatCurrency(amount)}</div>
                    </div>
                `).join('');
    }

    getOrdersForPeriod(period) {
        const now = new Date();
        const orders = this.data.orders;

        switch (period) {
            case 'today':
                return orders.filter(order => 
                    new Date(order.timestamp).toDateString() === now.toDateString()
                );
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return orders.filter(order => new Date(order.timestamp) >= weekAgo);
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return orders.filter(order => new Date(order.timestamp) >= monthAgo);
            default:
                return orders;
        }
    }

    exportReport() {
        // Exportación simple de PDF usando funcionalidad de impresión del navegador
        const printWindow = window.open('', '_blank');
        const period = document.getElementById('reportPeriod').value;
        const orders = this.getOrdersForPeriod(period);
        
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Reporte del Restaurante - ${period}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .summary { display: flex; justify-content: space-around; margin-bottom: 30px; }
                        .summary-item { text-align: center; }
                        .summary-value { font-size: 24px; font-weight: bold; color: #00d4ff; }
                        .summary-label { color: #666; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${this.data.settings.restaurantName}</h1>
                        <h2>Reporte de Ventas - ${this.getPeriodText(period)}</h2>
                        <p>Generado el ${new Date().toLocaleDateString('es-AR')}</p>
                    </div>
                    <div class="summary">
                        <div class="summary-item">
                            <div class="summary-value">${this.formatCurrency(totalSales)}</div>
                            <div class="summary-label">Ventas Totales</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value">${totalOrders}</div>
                            <div class="summary-label">Total Pedidos</div>
                        </div>
                    </div>
                    <h3>Pedidos Recientes</h3>
                    <table>
                        <tr>
                            <th>Mesa</th>
                            <th>Hora</th>
                            <th>Items</th>
                            <th>Total</th>
                        </tr>
                        ${orders.slice(-10).map(order => {
                            const table = this.data.tables.find(t => t.id === order.tableId);
                            return `
                                <tr>
                                    <td>${table ? table.number : 'N/A'}</td>
                                    <td>${new Date(order.timestamp).toLocaleString('es-AR')}</td>
                                    <td>${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}</td>
                                    <td>${this.formatCurrency(order.total)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    getPeriodText(period) {
        const periodMap = {
            'today': 'Hoy',
            'week': 'Esta Semana',
            'month': 'Este Mes'
        };
        return periodMap[period] || period;
    }

    // Configuración
    renderSettings() {
        document.getElementById('restaurantName').value = this.data.settings.restaurantName;
        document.getElementById('invoicePrefix').value = this.data.settings.invoicePrefix;
        document.getElementById('currency').value = this.data.settings.currency;
        document.getElementById('taxRate').value = this.data.settings.taxRate;
        document.getElementById('openingTime').value = this.data.settings.openingTime;
        document.getElementById('closingTime').value = this.data.settings.closingTime;
    }

    saveSettings() {
        this.data.settings.restaurantName = document.getElementById('restaurantName').value;
        this.data.settings.invoicePrefix = document.getElementById('invoicePrefix').value;
        this.data.settings.currency = document.getElementById('currency').value;
        this.data.settings.taxRate = parseFloat(document.getElementById('taxRate').value);
        this.data.settings.openingTime = document.getElementById('openingTime').value;
        this.data.settings.closingTime = document.getElementById('closingTime').value;
        
        // Cambiar contraseña si se proporcionó una nueva
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword) {
            if (newPassword !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }
            if (newPassword.length < 4) {
                alert('La contraseña debe tener al menos 4 caracteres');
                return;
            }
            this.configPassword = newPassword;
            this.addActivity('Contraseña actualizada', 'fas fa-key', 'Contraseña de configuración cambiada');
        }
        
        this.saveData();
        this.addActivity('Configuración actualizada', 'fas fa-cog', 'Configuración del restaurante guardada');
        alert('¡Configuración guardada exitosamente!');
        
        // Limpiar campos de contraseña
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }

    // Funciones de Utilidad
    formatCurrency(amount) {
        const currencySymbols = {
            'ARS': '$',
            'USD': 'USD $',
            'EUR': '€'
        };
        const symbol = currencySymbols[this.data.settings.currency] || '$';
        return `${symbol}${amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleString('es-AR');
    }

    addActivity(title, icon, description) {
        this.data.activities.push({
            title,
            icon,
            description,
            timestamp: new Date().toISOString()
        });
        
        // Mantener solo las últimas 50 actividades
        if (this.data.activities.length > 50) {
            this.data.activities = this.data.activities.slice(-50);
        }
        
        this.saveData();
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModal(modal) {
        modal.classList.remove('active');
    }

    // Funciones de gestión de pedidos
    viewOrderDetails(orderId) {
        const order = this.data.orders.find(o => o.id === orderId);
        if (order) {
            alert(`Detalles del Pedido:\n\nItems: ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}\nSubtotal: ${this.formatCurrency(order.subtotal)}\nImpuesto: ${this.formatCurrency(order.tax)}\nTotal: ${this.formatCurrency(order.total)}`);
        }
    }

    deleteOrder(orderId) {
        if (confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
            this.data.orders = this.data.orders.filter(o => o.id !== orderId);
            this.saveData();
            this.renderOrderDetails();
            this.updateStats();
            this.addActivity('Pedido eliminado', 'fas fa-trash', 'Pedido removido');
        }
    }

    // Sistema de Contraseña para Configuración
    showPasswordModal() {
        this.showModal('passwordModal');
        // Limpiar el campo de contraseña y ocultar error
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordError').style.display = 'none';
        // Enfocar el campo de contraseña
        setTimeout(() => {
            document.getElementById('passwordInput').focus();
        }, 100);
    }

    checkPassword() {
        const enteredPassword = document.getElementById('passwordInput').value;
        const errorElement = document.getElementById('passwordError');

        if (enteredPassword === this.configPassword) {
            // Contraseña correcta
            this.isConfigUnlocked = true;
            this.hideModal(document.getElementById('passwordModal'));
            this.navigateToPage('settings');
            this.addActivity('Acceso a configuración', 'fas fa-unlock', 'Configuración desbloqueada');
        } else {
            // Contraseña incorrecta
            errorElement.style.display = 'flex';
            document.getElementById('passwordInput').value = '';
            document.getElementById('passwordInput').focus();
            
            // Agregar efecto de vibración al input
            document.getElementById('passwordInput').style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                document.getElementById('passwordInput').style.animation = '';
            }, 500);
        }
    }

    // Función para cerrar sesión de configuración (opcional)
    lockConfiguration() {
        this.isConfigUnlocked = false;
        if (this.currentPage === 'settings') {
            this.navigateToPage('dashboard');
        }
        this.addActivity('Configuración bloqueada', 'fas fa-lock', 'Sesión de configuración cerrada');
    }

    // Sistema de Facturación Manual
    openManualInvoiceModal() {
        this.manualInvoiceItems = [];
        this.showModal('manualInvoiceModal');
        this.updateManualInvoiceDisplay();
    }

    showManualItems() {
        document.getElementById('manualItemsSection').style.display = 'block';
        document.getElementById('existingItemsSection').style.display = 'none';
    }

    showExistingItems() {
        document.getElementById('existingItemsSection').style.display = 'block';
        document.getElementById('manualItemsSection').style.display = 'none';
        this.renderExistingItems();
    }

    renderExistingItems() {
        const container = document.getElementById('existingItemsList');
        container.innerHTML = '';

        this.data.menuItems.filter(item => item.available).forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'existing-item';
            itemElement.innerHTML = `
                <div class="existing-item-name">${item.name}</div>
                <div class="existing-item-price">${this.formatCurrency(item.price)}</div>
            `;
            itemElement.addEventListener('click', () => {
                this.addExistingItemToManualInvoice(item);
            });
            container.appendChild(itemElement);
        });
    }

    addExistingItemToManualInvoice(item) {
        const existingItem = this.manualInvoiceItems.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.manualInvoiceItems.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
                isManual: false
            });
        }
        
        this.updateManualInvoiceDisplay();
    }

    addManualItem() {
        const name = document.getElementById('manualItemName').value;
        const price = parseFloat(document.getElementById('manualItemPrice').value);
        const quantity = parseInt(document.getElementById('manualItemQuantity').value);

        const newItem = {
            id: Date.now(),
            name,
            price,
            quantity,
            isManual: true
        };

        this.manualInvoiceItems.push(newItem);
        this.updateManualInvoiceDisplay();
        
        // Limpiar formulario
        document.getElementById('manualItemForm').reset();
        document.getElementById('manualItemQuantity').value = 1;
    }

    updateManualInvoiceDisplay() {
        const container = document.getElementById('manualItemsList');
        container.innerHTML = '';

        if (this.manualInvoiceItems.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">No hay items agregados</p>';
            document.getElementById('generateManualInvoiceBtn').disabled = true;
            this.updateManualTotals();
            return;
        }

        this.manualInvoiceItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'manual-item';
            itemElement.innerHTML = `
                <div class="manual-item-info">
                    <div class="manual-item-name">${item.name}</div>
                    <div class="manual-item-details">
                        ${this.formatCurrency(item.price)} x ${item.quantity} = ${this.formatCurrency(item.price * item.quantity)}
                    </div>
                </div>
                <div class="manual-item-controls">
                    <button class="qty-btn" onclick="crm.updateManualItemQuantity(${index}, ${item.quantity - 1})">-</button>
                    <input type="number" class="qty-input" value="${item.quantity}" min="1" onchange="crm.updateManualItemQuantity(${index}, parseInt(this.value))">
                    <button class="qty-btn" onclick="crm.updateManualItemQuantity(${index}, ${item.quantity + 1})">+</button>
                    <button class="remove-item-btn" onclick="crm.removeManualItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(itemElement);
        });

        document.getElementById('generateManualInvoiceBtn').disabled = false;
        this.updateManualTotals();
    }

    updateManualItemQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeManualItem(index);
        } else {
            this.manualInvoiceItems[index].quantity = quantity;
            this.updateManualInvoiceDisplay();
        }
    }

    removeManualItem(index) {
        this.manualInvoiceItems.splice(index, 1);
        this.updateManualInvoiceDisplay();
    }

    updateManualTotals() {
        const subtotal = this.manualInvoiceItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * (this.data.settings.taxRate / 100);
        const total = subtotal + tax;

        document.getElementById('manualSubtotal').textContent = this.formatCurrency(subtotal);
        document.getElementById('manualTax').textContent = this.formatCurrency(tax);
        document.getElementById('manualTotal').textContent = this.formatCurrency(total);
    }

    clearManualItems() {
        this.manualInvoiceItems = [];
        this.updateManualInvoiceDisplay();
    }

    generateManualInvoice() {
        if (this.manualInvoiceItems.length === 0) {
            alert('Por favor agrega items a la factura');
            return;
        }

        const subtotal = this.manualInvoiceItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * (this.data.settings.taxRate / 100);
        const total = subtotal + tax;

        const invoiceNumber = `${this.data.settings.invoicePrefix}-${String(this.invoiceCounter).padStart(3, '0')}`;
        
        const invoice = {
            id: Date.now(),
            invoiceNumber,
            orderId: null,
            tableNumber: 'Manual',
            items: [...this.manualInvoiceItems],
            subtotal,
            tax,
            total,
            timestamp: new Date().toISOString(),
            status: 'paid',
            isManual: true
        };

        this.data.invoices.push(invoice);
        this.invoiceCounter++;
        
        this.saveData();
        this.hideModal(document.getElementById('manualInvoiceModal'));
        this.addActivity('Factura manual generada', 'fas fa-file-invoice', `Factura ${invoiceNumber} generada manualmente`);
        
        // Mostrar factura
        this.showInvoice(invoice);
        
        // Limpiar items
        this.clearManualItems();
    }

    // Facturación Completa de Mesa
    showFullTableInvoiceModal(tableId) {
        const table = this.data.tables.find(t => t.id === tableId);
        const tableOrders = this.data.orders.filter(order => order.tableId === tableId && order.status === 'pending');
        
        if (tableOrders.length === 0) {
            alert('No hay pedidos pendientes para esta mesa');
            return;
        }

        document.getElementById('fullInvoiceTableNumber').textContent = table.number;
        
        // Calcular totales
        const allItems = [];
        let totalSubtotal = 0;
        
        tableOrders.forEach(order => {
            order.items.forEach(item => {
                allItems.push({
                    ...item,
                    orderId: order.id
                });
            });
            totalSubtotal += order.subtotal;
        });
        
        const totalTax = totalSubtotal * (this.data.settings.taxRate / 100);
        const totalAmount = totalSubtotal + totalTax;

        // Mostrar resumen
        const summaryContainer = document.getElementById('fullInvoiceSummary');
        summaryContainer.innerHTML = `
            <div class="summary-item">
                <span>Pedidos a facturar:</span>
                <span>${tableOrders.length}</span>
            </div>
            <div class="summary-item">
                <span>Items totales:</span>
                <span>${allItems.length}</span>
            </div>
            <div class="summary-item">
                <span>Subtotal:</span>
                <span>${this.formatCurrency(totalSubtotal)}</span>
            </div>
            <div class="summary-item">
                <span>Impuesto:</span>
                <span>${this.formatCurrency(totalTax)}</span>
            </div>
            <div class="summary-item">
                <span>TOTAL:</span>
                <span>${this.formatCurrency(totalAmount)}</span>
            </div>
        `;

        this.showModal('fullTableInvoiceModal');
        this.fullTableInvoiceData = {
            tableId,
            tableOrders,
            allItems,
            totalSubtotal,
            totalTax,
            totalAmount
        };
    }

    confirmFullTableInvoice() {
        if (!this.fullTableInvoiceData) return;

        const { tableId, tableOrders, allItems, totalSubtotal, totalTax, totalAmount } = this.fullTableInvoiceData;
        const table = this.data.tables.find(t => t.id === tableId);
        
        const invoiceNumber = `${this.data.settings.invoicePrefix}-${String(this.invoiceCounter).padStart(3, '0')}`;
        
        const invoice = {
            id: Date.now(),
            invoiceNumber,
            orderId: null,
            tableNumber: table.number,
            items: allItems,
            subtotal: totalSubtotal,
            tax: totalTax,
            total: totalAmount,
            timestamp: new Date().toISOString(),
            status: 'paid',
            isFullTable: true
        };

        this.data.invoices.push(invoice);
        this.invoiceCounter++;
        
        // Marcar pedidos como facturados
        tableOrders.forEach(order => {
            order.status = 'invoiced';
        });
        
        // Liberar mesa
        table.status = 'free';
        
        this.saveData();
        this.hideModal(document.getElementById('fullTableInvoiceModal'));
        this.addActivity('Factura completa generada', 'fas fa-receipt', `Factura ${invoiceNumber} para Mesa ${table.number}`);
        
        // Mostrar factura
        this.showInvoice(invoice);
        
        // Actualizar displays
        this.renderTables();
        this.renderOrders();
        this.updateStats();
    }
}

// Inicializar el sistema CRM
const crm = new RestaurantCRM();