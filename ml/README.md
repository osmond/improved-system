# Model Comparison

This folder contains `model_comparison.py`, a small experiment that trains and compares
three sequence labeling approaches (HMM, CRF and a simple LSTM) on the same subset of
the NLTK Treebank dataset.

Run the script with:

```bash
python3 ml/model_comparison.py
```

The script prints a JSON summary with accuracy and inference latency for each model.
On a reference run the results were:

- HMM – accuracy ~0.19, latency ~0.33s
- CRF – accuracy ~0.78, latency ~0.006s
- LSTM – accuracy ~0.14, latency ~0.06s

The CRF offered the best balance of accuracy and responsiveness and was selected for
integration into the pipeline.
