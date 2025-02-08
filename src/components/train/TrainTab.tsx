    className="w-full py-3 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            disabled={isLoading || state.images.length === 0 || !state.triggerWord.trim()}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Training Model...
              </div>
            ) : (
              'Start Training'
            )}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default TrainTab;