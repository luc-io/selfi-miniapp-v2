{...previous content...
  const { data: userModels = [], isLoading: isLoadingModels } = useQuery<LoraModel[]>({
    queryKey: ['models', 'user'],
    queryFn: getUserModels,
  });
...}