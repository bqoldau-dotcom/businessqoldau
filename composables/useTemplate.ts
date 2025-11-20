export const useTemplate = () => {
  const config = useRuntimeConfig();
  const { fetchWithAuth } = useAuth();

  const activeTemplate = ref<any>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Get active template
  const getActiveTemplate = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchWithAuth(`${config.public.apiUrl}/templates/active`);

      activeTemplate.value = response;
      return response;
    } catch (err: any) {
      console.error('Get active template error:', err);
      error.value = err.data?.error || 'Failed to get template';
      activeTemplate.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Download template
  const downloadTemplate = (template: any) => {
    if (!template || !template.filePath) return;

    const fileName = template.filePath.split('/').pop();
    const downloadUrl = `${config.public.apiUrl.replace('/api', '')}/uploads/templates/${fileName}`;

    window.open(downloadUrl, '_blank');
  };

  // Admin: Upload template
  const uploadTemplate = async (file: File, name: string) => {
    loading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);

      const response = await fetchWithAuth(`${config.public.apiUrl}/templates/upload`, {
        method: 'POST',
        body: formData
      });

      return response;
    } catch (err: any) {
      console.error('Upload template error:', err);
      error.value = err.data?.error || 'Failed to upload template';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Admin: Get all templates
  const getAllTemplates = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchWithAuth(`${config.public.apiUrl}/templates/all`);

      return response;
    } catch (err: any) {
      console.error('Get all templates error:', err);
      error.value = err.data?.error || 'Failed to get templates';
      return { templates: [] };
    } finally {
      loading.value = false;
    }
  };

  // Admin: Delete template
  const deleteTemplate = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchWithAuth(`${config.public.apiUrl}/templates/${id}`, {
        method: 'DELETE'
      });

      return response;
    } catch (err: any) {
      console.error('Delete template error:', err);
      error.value = err.data?.error || 'Failed to delete template';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    activeTemplate,
    loading,
    error,
    getActiveTemplate,
    downloadTemplate,
    uploadTemplate,
    getAllTemplates,
    deleteTemplate
  };
};
