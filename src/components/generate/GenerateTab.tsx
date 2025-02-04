              max={4}
              step={1}
              className="py-2"
            />
          </div>

          {/* Output Format */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Output Format</label>
            <Select 
              value={params.output_format}
              onValueChange={v => updateParam('output_format', v as 'jpeg' | 'png')}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Additional Options</h2>
          
          {/* Safety Checker */}
          <div className="flex items-center justify-between py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Safety Checker</label>
              <p className="text-sm text-gray-500">Filter inappropriate content</p>
            </div>
            <Switch 
              checked={params.enable_safety_checker}
              onCheckedChange={(v: boolean) => updateParam('enable_safety_checker', v)}
            />
          </div>

          {/* Sync Mode */}
          <div className="flex items-center justify-between py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sync Mode</label>
              <p className="text-sm text-gray-500">Wait for generation to complete</p>
            </div>
            <Switch 
              checked={params.sync_mode}
              onCheckedChange={(v: boolean) => updateParam('sync_mode', v)}
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          className="w-full py-3 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          disabled={generate.isPending || isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Saving...' : 'Save Parameters'}
        </button>
      </div>
    </Card>
  );
}