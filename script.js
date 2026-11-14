// Configuración de Supabase
const SUPABASE_URL = 'https://blqtsgbkysfkpqrfyfpt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJscXRzZ2JreXNma3BxcmZ5ZnB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2MTMzMDAsImV4cCI6MjExMDE4OTMwMH0.nArGREZ4goxv7WHQXPE-ahzD_5DoDGbzGdfiQpK2cK0';

let supabase;
let apps = [];
let isSelectMode = false;
let selectedApps = new Set();
let currentEditingApp = null;

// Inicialización
function init() {
    console.log('Iniciando aplicación...');
    initializeSupabase();
    loadTheme();
    startClock();
    loadApps();
    setupEventListeners();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function initializeSupabase() {
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (error) {
        console.error('Error al inicializar Supabase:', error);
        showError('Error de conexión con Supabase. Verifica la configuración.');
    }
}

// Reloj en tiempo real
function startClock() {
    console.log('Iniciando reloj...');
    const clock = document.getElementById('clock');
    if (!clock) {
        console.error('Elemento clock no encontrado');
        return;
    }

    const updateClock = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        clock.textContent = timeString;
        console.log('Hora actualizada:', timeString);
    };

    updateClock();
    setInterval(updateClock, 1000);
}

// Modo oscuro/claro
function loadTheme() {
    console.log('Cargando tema...');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('light-mode', savedTheme === 'light');
    updateThemeIcon();
}

function toggleTheme() {
    console.log('Cambiando tema...');
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector('#themeToggle .icon');
    if (icon) {
        icon.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
        console.log('Icono actualizado:', icon.textContent);
    }
}

// Cargar apps desde Supabase
async function loadApps() {
    const grid = document.getElementById('appsGrid');
    grid.innerHTML = '<div class="loading">Cargando apps...</div>';

    try {
        if (!supabase) {
            // Modo demo sin Supabase
            apps = [];
            grid.innerHTML = '<div class="loading">Configura Supabase para ver las apps</div>';
            return;
        }

        const { data, error } = await supabase
            .from('apps')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        apps = data || [];
        renderApps();
    } catch (error) {
        console.error('Error al cargar apps:', error);
        grid.innerHTML = '<div class="loading">Error al cargar las apps</div>';
    }
}

// Renderizar apps
function renderApps() {
    const grid = document.getElementById('appsGrid');
    
    if (apps.length === 0) {
        grid.innerHTML = '<div class="loading">No hay apps. ¡Sube la primera!</div>';
        return;
    }

    grid.innerHTML = apps.map(app => `
        <div class="app-card ${selectedApps.has(app.id) ? 'selected' : ''}" 
             data-id="${app.id}" 
             onclick="handleCardClick(event, '${app.id}', '${app.link}')">
            ${app.image_url ? `<img src="${app.image_url}" alt="${app.name}" class="app-card-image">` : ''}
            <div class="app-card-content">
                <h3 class="app-card-title">${escapeHtml(app.name)}</h3>
                <p class="app-card-description">${escapeHtml(app.description)}</p>
            </div>
            <div class="app-card-link">🔗 Descargar</div>
        </div>
    `).join('');
}

function handleCardClick(event, appId, link) {
    if (isSelectMode) {
        event.preventDefault();
        toggleAppSelection(appId);
    } else {
        window.open(link, '_blank');
    }
}

function toggleAppSelection(appId) {
    const card = document.querySelector(`[data-id="${appId}"]`);
    
    if (selectedApps.has(appId)) {
        selectedApps.delete(appId);
        card.classList.remove('selected');
    } else {
        selectedApps.add(appId);
        card.classList.add('selected');
    }

    updateDeleteButton();
}

function updateDeleteButton() {
    const deleteBtn = document.getElementById('deleteSelectedBtn');
    if (selectedApps.size > 0) {
        deleteBtn.classList.remove('hidden');
    } else {
        deleteBtn.classList.add('hidden');
    }
}

// Modo selección
function toggleSelectMode() {
    isSelectMode = !isSelectMode;
    const btn = document.getElementById('selectModeBtn');
    const deleteBtn = document.getElementById('deleteSelectedBtn');

    if (isSelectMode) {
        btn.style.background = 'var(--accent-blue)';
        btn.style.color = 'white';
    } else {
        btn.style.background = '';
        btn.style.color = '';
        selectedApps.clear();
        deleteBtn.classList.add('hidden');
        renderApps();
    }
}

// Eliminar apps seleccionadas
async function deleteSelectedApps() {
    if (selectedApps.size === 0) return;

    if (!confirm(`¿Estás seguro de eliminar ${selectedApps.size} app(s)?`)) return;

    try {
        if (!supabase) {
            alert('Configura Supabase para eliminar apps');
            return;
        }

        const { error } = await supabase
            .from('apps')
            .delete()
            .in('id', Array.from(selectedApps));

        if (error) throw error;

        selectedApps.clear();
        updateDeleteButton();
        toggleSelectMode();
        await loadApps();
        alert('Apps eliminadas correctamente');
    } catch (error) {
        console.error('Error al eliminar apps:', error);
        alert('Error al eliminar las apps');
    }
}

// Modal para subir app
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Subir App';
    document.getElementById('appId').value = '';
    document.getElementById('appForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    currentEditingApp = null;
    document.getElementById('appModal').classList.add('active');
}

// Modal para editar app
function openEditSelectModal() {
    if (apps.length === 0) {
        alert('No hay apps para editar');
        return;
    }

    const list = document.getElementById('editAppsList');
    list.innerHTML = apps.map(app => `
        <div class="app-list-item" onclick="openEditModal('${app.id}')">
            ${app.image_url ? `<img src="${app.image_url}" alt="${app.name}">` : '<div style="width:50px;height:50px;background:var(--bg-secondary);border-radius:8px;"></div>'}
            <div class="app-list-item-content">
                <div class="app-list-item-title">${escapeHtml(app.name)}</div>
                <div class="app-list-item-desc">${escapeHtml(app.description.substring(0, 50))}...</div>
            </div>
        </div>
    `).join('');

    document.getElementById('editSelectModal').classList.add('active');
}

function openEditModal(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;

    document.getElementById('editSelectModal').classList.remove('active');
    document.getElementById('modalTitle').textContent = 'Editar App';
    document.getElementById('appId').value = app.id;
    document.getElementById('appName').value = app.name;
    document.getElementById('appDescription').value = app.description;
    document.getElementById('appLink').value = app.link;

    const preview = document.getElementById('imagePreview');
    if (app.image_url) {
        preview.innerHTML = `<img src="${app.image_url}" alt="Preview">`;
    } else {
        preview.innerHTML = '';
    }

    currentEditingApp = app;
    document.getElementById('appModal').classList.add('active');
}

function closeModals() {
    document.getElementById('appModal').classList.remove('active');
    document.getElementById('editSelectModal').classList.remove('active');
    document.getElementById('appForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    currentEditingApp = null;
}

// Vista previa de imagen
document.getElementById('appImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
});

// Guardar app (crear o editar)
async function saveApp(e) {
    e.preventDefault();

    const appId = document.getElementById('appId').value;
    const name = document.getElementById('appName').value.trim();
    const description = document.getElementById('appDescription').value.trim();
    const link = document.getElementById('appLink').value.trim();
    const imageFile = document.getElementById('appImage').files[0];

    if (!name || !description || !link) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }

    try {
        if (!supabase) {
            alert('Configura Supabase para guardar apps');
            return;
        }

        let imageUrl = currentEditingApp?.image_url || null;

        // Subir imagen si se proporcionó
        if (imageFile) {
            const fileName = `${Date.now()}_${imageFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('app-images')
                .upload(fileName, imageFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('app-images')
                .getPublicUrl(fileName);

            imageUrl = publicUrl;
        }

        const appData = {
            name,
            description,
            link,
            image_url: imageUrl
        };

        if (appId) {
            // Editar app existente
            const { error } = await supabase
                .from('apps')
                .update(appData)
                .eq('id', appId);

            if (error) throw error;
        } else {
            // Crear nueva app
            const { error } = await supabase
                .from('apps')
                .insert([appData]);

            if (error) throw error;
        }

        closeModals();
        await loadApps();
        alert(appId ? 'App actualizada correctamente' : 'App subida correctamente');
    } catch (error) {
        console.error('Error al guardar app:', error);
        alert('Error al guardar la app: ' + error.message);
    }
}

// Event listeners
function setupEventListeners() {
    console.log('Configurando event listeners...');

    const closeModal = document.getElementById('closeModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const appForm = document.getElementById('appForm');
    const appModal = document.getElementById('appModal');
    const editSelectModal = document.getElementById('editSelectModal');

    if (closeModal) closeModal.addEventListener('click', closeModals);
    if (closeEditModal) closeEditModal.addEventListener('click', () => {
        if (editSelectModal) editSelectModal.classList.remove('active');
    });
    if (cancelBtn) cancelBtn.addEventListener('click', closeModals);
    if (appForm) appForm.addEventListener('submit', saveApp);

    // Cerrar modales al hacer clic fuera
    if (appModal) {
        appModal.addEventListener('click', (e) => {
            if (e.target.id === 'appModal') closeModals();
        });
    }

    if (editSelectModal) {
        editSelectModal.addEventListener('click', (e) => {
            if (e.target.id === 'editSelectModal') {
                editSelectModal.classList.remove('active');
            }
        });
    }

    console.log('Event listeners configurados');
}

// Utilidades
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    console.error(message);
    const grid = document.getElementById('appsGrid');
    if (grid) {
        grid.innerHTML = `<div class="loading" style="color: var(--accent-red);">${message}</div>`;
    }
}
