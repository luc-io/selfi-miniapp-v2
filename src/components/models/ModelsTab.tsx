  const handleDelete = async (model: Model) => {
    if (!model?.databaseId) {
      console.error('No model ID provided for deletion');
      window.Telegram?.WebApp?.showPopup({
        message: 'Invalid model data. Please try again.'
      });
      return;
    }

    try {
      await deleteModel(model.databaseId);
      setModelToDelete(null);
      
      // Wait for mutation success confirmation
      await queryClient.invalidateQueries({ queryKey: ['models', 'user'] });
      
      // Only show success after mutation is complete
      window.Telegram?.WebApp?.showPopup({
        message: `Model ${model.name} deleted successfully`
      });
    } catch (error) {
      console.error('Error deleting model:', error);
      window.Telegram?.WebApp?.showPopup({
        message: error instanceof Error 
          ? error.message || 'Failed to delete model'
          : 'Failed to delete model. Please try again.'
      });
      // Keep dialog open on error
      setModelToDelete(model);
    }
  };