import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Cloud, 
  Info, 
  AlertTriangle, 
  CheckCircle2,
  Search,
  Zap,
  Copy,
  FileCode,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { cn } from '../../lib/utils';

const TEMPLATES = {
  deployment: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: nginx:latest
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "250m"
            memory: "256Mi"`,
  service: `apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer`,
  ingress: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-service
            port:
              number: 80`
};

export const K8sTool: React.FC = () => {
  const [yaml, setYaml] = useState('');
  const [explanation, setExplanation] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const applyTemplate = (key: keyof typeof TEMPLATES) => {
    setYaml(TEMPLATES[key]);
  };

  const analyze = () => {
    const newExplanation: string[] = [];
    const newErrors: string[] = [];
    const newRecommendations: string[] = [];

    if (!yaml.trim()) return;

    // Resource Detection
    if (yaml.includes('kind: Deployment')) {
      newExplanation.push("🚀 Deployment: Manages replicated Pods with rolling updates.");
    }
    if (yaml.includes('kind: Service')) {
      newExplanation.push("🌐 Service: Provides a stable network endpoint for Pods.");
    }
    if (yaml.includes('kind: Ingress')) {
      newExplanation.push("🛣️ Ingress: Manages external access to services (HTTP/HTTPS).");
    }
    if (yaml.includes('kind: ConfigMap')) {
      newExplanation.push("⚙️ ConfigMap: Stores non-confidential configuration data.");
    }

    // Security Analysis
    if (yaml.includes('privileged: true')) {
      newErrors.push("CRITICAL: Privileged container detected. This allows access to host resources.");
    }
    if (!yaml.includes('runAsNonRoot: true')) {
      newRecommendations.push("Security: Consider adding 'runAsNonRoot: true' to the securityContext.");
    }
    if (!yaml.includes('readOnlyRootFilesystem: true')) {
      newRecommendations.push("Security: Consider using a read-only root filesystem.");
    }

    // Resource Management
    if (!yaml.includes('resources:')) {
      newErrors.push("Missing Resource Definitions: No CPU/Memory limits or requests defined.");
    } else {
      if (!yaml.includes('limits:')) newRecommendations.push("Performance: Define resource limits to prevent noisy neighbor issues.");
      if (!yaml.includes('requests:')) newRecommendations.push("Scheduling: Define resource requests to help the scheduler place Pods.");
    }

    // Probes
    if (yaml.includes('kind: Deployment') || yaml.includes('kind: StatefulSet')) {
      if (!yaml.includes('livenessProbe:')) newRecommendations.push("Reliability: Add a livenessProbe to restart unhealthy containers.");
      if (!yaml.includes('readinessProbe:')) newRecommendations.push("Reliability: Add a readinessProbe to ensure traffic only hits ready Pods.");
    }

    // Basic Validation
    if (!yaml.includes('apiVersion:')) newErrors.push("Schema: Missing 'apiVersion'.");
    if (!yaml.includes('kind:')) newErrors.push("Schema: Missing 'kind'.");
    if (!yaml.includes('metadata:')) newErrors.push("Schema: Missing 'metadata'.");

    setExplanation(newExplanation);
    setErrors(newErrors);
    setRecommendations(newRecommendations);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
      <div className="flex-1 flex divide-x divide-zinc-800">
        {/* Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">K8s Manifest</span>
              <div className="flex gap-1">
                {Object.keys(TEMPLATES).map((key) => (
                  <button
                    key={key}
                    onClick={() => applyTemplate(key as keyof typeof TEMPLATES)}
                    className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[9px] font-bold rounded border border-zinc-700 transition-all uppercase"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={analyze}
              className="flex items-center gap-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded transition-all shadow-lg shadow-indigo-500/20"
            >
              <Zap size={12} />
              Analyze
            </button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language="yaml"
              theme="vs-dark"
              value={yaml}
              onChange={(val) => setYaml(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'JetBrains Mono',
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>

        {/* Analysis */}
        <div className="w-1/2 flex flex-col bg-zinc-900/10 overflow-y-auto">
          <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Intelligent Insights</span>
          </div>
          
          <div className="p-6 space-y-8">
            {explanation.length > 0 || errors.length > 0 || recommendations.length > 0 ? (
              <>
                {errors.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                      <ShieldAlert size={14} />
                      Security & Schema Issues
                    </h3>
                    <div className="space-y-2">
                      {errors.map((err, i) => (
                        <div key={i} className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-xs text-red-300 font-medium">
                          {err}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {recommendations.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                      <Activity size={14} />
                      Best Practices
                    </h3>
                    <div className="space-y-2">
                      {recommendations.map((rec, i) => (
                        <div key={i} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-xs text-amber-300">
                          {rec}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="space-y-3">
                  <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={14} />
                    Resource Summary
                  </h3>
                  <div className="space-y-2">
                    {explanation.map((exp, i) => (
                      <div key={i} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-300">
                        {exp}
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-800 text-center">
                <Cloud size={64} className="mb-4 opacity-10" />
                <p className="text-sm font-medium text-zinc-600">Load a template or enter YAML</p>
                <p className="text-xs text-zinc-700 mt-2">I'll perform a deep security and reliability audit.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
