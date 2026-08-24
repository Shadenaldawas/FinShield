<p className="text-sm text-slate-300 bg-slate-950/50 p-4 rounded-lg border border-slate-800/80">{result.summary}</p>

<div className="space-y-2">
<h3 className="text-sm font-semibold text-slate-200">Recommendations:</h3>
<ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
{result.recommendations.map((rec, i) => (
<li key={i}>{rec}</li>
))}
</ul>
</div>

<button 
onClick={() => setResult(null)} 
className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded text-xs font-medium"
>
← Back to Assessment
</button>
</div>
)}

</div>
</div>
)
}
