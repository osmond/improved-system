# Model Comparison

Models were trained on a small binary sequence dataset and evaluated on accuracy and inference latency. Results:

| Model | Accuracy | Latency (s/sample) |
|-------|----------|--------------------|
| HMM   | 1.00     | 2.42e-4            |
| CRF   | 1.00     | 1.14e-5            |
| LSTM  | 0.78     | 6.39e-3            |

The CRF achieved perfect accuracy with the lowest latency, making it the most suitable for real-time detection. The HMM matched accuracy but had higher latency, while the LSTM was slower and less accurate due to training overhead on a small dataset.

## Trade-offs for Real-Time Use
- **CRF**: Fast and accurate; lightweight for deployment.
- **HMM**: Accurate but slightly slower; may be acceptable if generative modeling is needed.
- **LSTM**: Highest latency and lower accuracy; better for complex patterns but not ideal for constrained environments.

The CRF model is integrated into the detection pipeline for runtime focus classification.
