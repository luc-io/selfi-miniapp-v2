                <label className="block text-sm font-medium text-gray-700">Style Training</label>
                <p className="text-sm text-gray-500">Train for style instead of subject</p>
              </div>
              <Switch
                checked={state.isStyle}
                onCheckedChange={checked => setState(prev => ({ 
                  ...prev, 
                  isStyle: checked,
                  createMasks: checked ? false : prev.createMasks,
                  triggerWord: checked ? '' : prev.triggerWord
                }))}
              />
            </div>
          </div>

          {/* Progress Bar */}
          {progressData && progressData.status !== 'COMPLETED' && progressData.status !== 'FAILED' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Training Progress</span>
                <span>{progressData.status === 'TRAINING' ? 'In Progress' : 'Starting...'}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ 
                    width: progressData.status === 'TRAINING' ? '50%' : '10%'
                  }}
                />
              </div>
              {progressData.message && (
                <p className="text-sm text-gray-600">{progressData.message}</p>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            disabled={isLoading || state.images.length === 0}
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
}