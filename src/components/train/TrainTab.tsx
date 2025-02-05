{
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<TrainingState>(DEFAULT_STATE);
  const [dragActive, setDragActive] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  const totalSize = state.images.reduce((acc, img) => acc + img.file.size, 0);
  const maxSize = 50 * 1024 * 1024; // 50MB

  // Query for training progress
  const { data: progressData = null } = useQuery({
    queryKey: ['training-progress', requestId],
    queryFn: () => getTrainingProgress(requestId),
    enabled: !!requestId && !isLoading,
    refetchInterval: (_, query) => {
      const data = query.state.data;
      if (!data || data.status === 'completed' || data.status === 'failed') {
        return false;
      }
      return 1000; // Poll every second while training
    },
  });

  // Reset request ID when training completes or fails
  useEffect(() => {
    if (progressData?.status === 'completed' || progressData?.status === 'failed') {
      setRequestId(null);
      setIsLoading(false);
      
      // Show completion message
      window.Telegram?.WebApp?.showPopup({
        message: progressData.status === 'completed' 
          ? 'Training completed successfully!' 
          : 'Training failed. Please try again.'
      });
    }
  }, [progressData?.status]);
}