import { k8sCoreV1Api } from "./config.js";

export const createPod = async (sandboxId) => {

    const podManifest = {
        metadata: {
            name: `sandbox-pod-${sandboxId}`,
            labels: {
                app: "sandbox",
                sandboxId: sandboxId
            }
        },
        spec: {
            volumes: [
                {
                    name: "workspace_volume",
                    emptyDir: {}
                }
            ],
            containers: [
                {
                    image: "template",
                    imagePullPolicy: "Always",
                    name: "sandbox-container",
                    ports: [{ containerPort: 5173, name: "http" }],
                    resources: {
                        limits: { cpu: "500m", memory: "1Gi" },
                        requests: { cpu: "250m", memory: "500Mi" }
                    },
                    volumeMounts: [
                        {
                            name: "workspace_volume",
                            mountPath: "/workspace"
                        }
                    ]
                },
                {
                    image: "agent",
                    imagePullPolicy: "Always",
                    name: "agent-container",
                    ports: [{ containerPort: 3000, name: "http" }],
                    resources: {
                        limits: { cpu: "500m", memory: "1Gi" },
                        requests: { cpu: "250m", memory: "500Mi" }
                    },
                    volumeMounts: [
                        {
                            name: "workspace_volume",
                            mountPath: "/workspace"
                        }
                    ]
                }
            ]
        }
    }

    const response = await k8sCoreV1Api.createNamespacedPod({
        namespace: "default",
        body: podManifest
    })

    return response;
} 