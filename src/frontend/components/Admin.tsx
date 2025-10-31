import { useState, useEffect } from 'react';
import { supabase, type Project } from '../../backend/database/supabase';
import { Plus, Edit2, Trash2, Save, X, Loader2, Settings, Lock, Package } from 'lucide-react';

interface SiteConfig {
  site_name: string;
  site_icon: string;
  site_logo_url: string;
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  social_whatsapp: string;
  social_email: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

const ADMIN_PASSWORD = '12345678';

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'config' | 'categories'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'madera',
    order_index: 0,
  });
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    site_name: 'LaserArt',
    site_icon: '⚡',
    site_logo_url: '',
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    social_whatsapp: '',
    social_email: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    display_order: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
      loadSiteConfig();
      loadCategories();
    }
  }, [isAuthenticated]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Contraseña incorrecta');
      setPassword('');
    }
  }

  async function loadProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('projects').select('*').order('order_index', { ascending: true });
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadSiteConfig() {
    try {
      const { data, error } = await supabase.from('site_config').select('*');
      if (error) throw error;
      const config: SiteConfig = {
        site_name: 'LaserArt', site_icon: '⚡', site_logo_url: '', social_facebook: '', social_instagram: '',
        social_twitter: '', social_whatsapp: '', social_email: '',
      };
      data?.forEach((item) => {
        if (item.key in config) {
          config[item.key as keyof SiteConfig] = item.value;
        }
      });
      setSiteConfig(config);
    } catch (error) {
      console.error('Error loading config:', error);
    }
  }

  async function loadCategories() {
    try {
      const { data, error } = await supabase.from('project_categories').select('*').order('display_order', { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async function handleSaveConfig() {
    try {
      const updates = Object.entries(siteConfig).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
      for (const update of updates) {
        const { error } = await supabase.from('site_config').update({ value: update.value, updated_at: update.updated_at }).eq('key', update.key);
        if (error) { console.error('Error updating config key:', update.key, error); throw error; }
      }
      alert('✅ Configuración guardada exitosamente');
      window.dispatchEvent(new CustomEvent('siteConfigUpdated', { detail: siteConfig }));
    } catch (error: any) {
      console.error('Error saving config:', error);
      alert(`❌ Error al guardar configuración: ${error?.message || 'Error desconocido'}`);
    }
  }

  async function handleSaveProject() {
    try {
      if (!formData.title || !formData.image_url) {
        alert('⚠️ Por favor completa título e imagen');
        return;
      }
      if (editingId) {
        const { error } = await supabase.from('projects').update({ ...formData, updated_at: new Date().toISOString() }).eq('id', editingId);
        if (error) throw error;
        alert('✅ Proyecto actualizado exitosamente');
      } else {
        const { error } = await supabase.from('projects').insert([formData]);
        if (error) throw error;
        alert('✅ Proyecto creado exitosamente');
      }
      setFormData({ title: '', description: '', image_url: '', category: 'madera', order_index: 0 });
      setEditingId(null);
      setIsAdding(false);
      loadProjects();
    } catch (error: any) {
      console.error('Error saving project:', error);
      alert(`❌ Error al guardar proyecto: ${error?.message || 'Error desconocido'}`);
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm('🗑️ ¿Estás seguro de eliminar este proyecto?')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      alert('✅ Proyecto eliminado exitosamente');
      loadProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      alert(`❌ Error al eliminar proyecto: ${error?.message || 'Error desconocido'}`);
    }
  }

  async function handleSaveCategory() {
    try {
      if (!categoryFormData.name || !categoryFormData.slug) {
        alert('⚠️ Por favor completa nombre y slug');
        return;
      }
      if (editingCategoryId) {
        const { error } = await supabase.from('project_categories').update(categoryFormData).eq('id', editingCategoryId);
        if (error) throw error;
        alert('✅ Categoría actualizada exitosamente');
      } else {
        const { error } = await supabase.from('project_categories').insert([categoryFormData]);
        if (error) throw error;
        alert('✅ Categoría creada exitosamente');
      }
      setCategoryFormData({ name: '', slug: '', display_order: 0 });
      setEditingCategoryId(null);
      setIsAddingCategory(false);
      loadCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      alert(`❌ Error al guardar categoría: ${error?.message || 'Error desconocido'}`);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('🗑️ ¿Estás seguro de eliminar esta categoría?')) return;
    try {
      const { error } = await supabase.from('project_categories').delete().eq('id', id);
      if (error) throw error;
      alert('✅ Categoría eliminada exitosamente');
      loadCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert(`❌ Error al eliminar categoría: ${error?.message || 'Error desconocido'}`);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center mb-6">
            <Lock className="w-16 h-16 text-orange-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Panel Admin</h1>
            <p className="text-gray-600 mt-2">Ingresa la contraseña para acceder</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent" placeholder="Ingresa tu contraseña" autoFocus />
            </div>
            <button type="submit" className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-all">Cerrar Sesión</button>
          </div>
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-2 px-4 py-2 font-semibold transition-all ${activeTab === 'projects' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:text-gray-900'}`}><Package className="w-5 h-5" />Proyectos</button>
            <button onClick={() => setActiveTab('config')} className={`flex items-center gap-2 px-4 py-2 font-semibold transition-all ${activeTab === 'config' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:text-gray-900'}`}><Settings className="w-5 h-5" />Configuración</button>
            <button onClick={() => setActiveTab('categories')} className={`flex items-center gap-2 px-4 py-2 font-semibold transition-all ${activeTab === 'categories' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:text-gray-900'}`}><Plus className="w-5 h-5" />Categorías</button>
          </div>
          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Proyectos</h2>
                <button onClick={() => { setFormData({ title: '', description: '', image_url: '', category: 'madera', order_index: 0 }); setEditingId(null); setIsAdding(true); }} className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all"><Plus className="w-5 h-5" />Nuevo Proyecto</button>
              </div>
              {(isAdding || editingId) && (
                <div className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Título</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent" placeholder="Ej: Caja de madera personalizada" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent">{categories.map(cat => (<option key={cat.id} value={cat.slug}>{cat.name}</option>))}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">URL de Imagen</label><input type="text" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent" placeholder="https://ejemplo.com/imagen.jpg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Orden</label><input type="number" value={formData.order_index} onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent" /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent" rows={3} placeholder="Descripción del proyecto..." /></div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleSaveProject} className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all"><Save className="w-4 h-4" />Guardar</button>
                    <button onClick={() => { setFormData({ title: '', description: '', image_url: '', category: 'madera', order_index: 0 }); setEditingId(null); setIsAdding(false); }} className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"><X className="w-4 h-4" />Cancelar</button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {loading ? (<div className="flex justify-center items-center py-12"><Loader2 className="w-10 h-10 text-orange-600 animate-spin" /></div>) : projects.length === 0 ? (<div className="text-center py-12 text-gray-500">No hay proyectos. Agrega el primero.</div>) : (
                  <div className="grid grid-cols-1 gap-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                        <img src={project.image_url} alt={project.title} className="w-24 h-24 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                          <p className="text-gray-600 text-sm">{project.description}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">{project.category}</span>
                            <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">Orden: {project.order_index}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setFormData({ title: project.title, description: project.description, image_url: project.image_url, category: project.category, order_index: project.order_index }); setEditingId(project.id); setIsAdding(false); }} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteProject(project.id)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'config' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración del Sitio</h2>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Identidad del Sitio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Sitio</label><input type="text" value={siteConfig.site_name} onChange={(e) => setSiteConfig({ ...siteConfig, site_name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent" placeholder="LaserArt" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Icono/Emoji</label><input type="text" value={siteConfig.site_icon} onChange={(e) => setSiteConfig({ ...siteConfig, site_icon: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent" placeholder="⚡" maxLength={2} /></div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL (Imagen o Emoji)</label>
                    <input type="text" value={siteConfig.site_logo_url} onChange={(e) => setSiteConfig({ ...siteConfig, site_logo_url: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent" placeholder="https://ejemplo.com/logo.png o ⚡" />
                    <p className="text-xs text-gray-500 mt-1">Puedes usar una URL de imagen o un emoji. Si está vacío, se usará el icono.</p>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Redes Sociales</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label><input type="text" value={siteConfig.social_facebook} onChange={(e) => setSiteConfig({ ...siteConfig, social_facebook: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="https://facebook.com/tupagina" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label><input type="text" value={siteConfig.social_instagram} onChange={(e) => setSiteConfig({ ...siteConfig, social_instagram: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="https://instagram.com/tuperfil" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Twitter/X</label><input type="text" value={siteConfig.social_twitter} onChange={(e) => setSiteConfig({ ...siteConfig, social_twitter: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="https://twitter.com/tuperfil" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label><input type="text" value={siteConfig.social_whatsapp} onChange={(e) => setSiteConfig({ ...siteConfig, social_whatsapp: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="+1234567890" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" value={siteConfig.social_email} onChange={(e) => setSiteConfig({ ...siteConfig, social_email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="contacto@tuempresa.com" /></div>
                  </div>
                </div>
                <button onClick={handleSaveConfig} className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all"><Save className="w-5 h-5" />Guardar Configuración</button>
              </div>
            </div>
          )}
          {activeTab === 'categories' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h2>
                <button onClick={() => { setCategoryFormData({ name: '', slug: '', display_order: 0 }); setEditingCategoryId(null); setIsAddingCategory(true); }} className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all"><Plus className="w-5 h-5" />Nueva Categoría</button>
              </div>
              {(isAddingCategory || editingCategoryId) && (
                <div className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{editingCategoryId ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label><input type="text" value={categoryFormData.name} onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent" placeholder="Ej: Madera" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Slug</label><input type="text" value={categoryFormData.slug} onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value.toLowerCase() })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent" placeholder="madera" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Orden</label><input type="number" value={categoryFormData.display_order} onChange={(e) => setCategoryFormData({ ...categoryFormData, display_order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent" /></div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleSaveCategory} className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all"><Save className="w-4 h-4" />Guardar</button>
                    <button onClick={() => { setCategoryFormData({ name: '', slug: '', display_order: 0 }); setEditingCategoryId(null); setIsAddingCategory(false); }} className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"><X className="w-4 h-4" />Cancelar</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">Slug: {category.slug} | Orden: {category.display_order}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setCategoryFormData({ name: category.name, slug: category.slug, display_order: category.display_order }); setEditingCategoryId(category.id); setIsAddingCategory(false); }} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteCategory(category.id)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}