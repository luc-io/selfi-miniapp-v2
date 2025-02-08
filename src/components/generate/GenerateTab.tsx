[Previous content of GenerateTab.tsx with updated labels]

          <div className="space-y-2">
            <label className="block text-sm font-medium text-card-foreground">
              Steps <span className="text-muted-foreground ml-1">({params.num_inference_steps})</span>
            </label>
            <Slider 
              value={[params.num_inference_steps]}
              onValueChange={(v: number[]) => updateParam('num_inference_steps', v[0])}
              min={1}
              max={50}
              step={1}
              className="py-2"
            />
          </div>

[Rest of the GenerateTab.tsx content]