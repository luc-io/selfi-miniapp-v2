[Previous content until the save button section]

        {/* Save Button */}
        <button
          className="w-full py-3 px-4 bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
          disabled={isPending || isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Saving...' : 'Save Parameters'}
        </button>

[Rest of the previous content]