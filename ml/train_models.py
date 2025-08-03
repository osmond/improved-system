import json, time, os, numpy as np, pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from hmmlearn.hmm import GaussianHMM
import sklearn_crfsuite
from tensorflow import keras
from tensorflowjs.converters import save_keras_model

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'focus_sequences.csv')
RESULTS_PATH = os.path.join(os.path.dirname(__file__), 'model_metrics.json')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'models', 'best_model')

# Load dataset
df = pd.read_csv(DATA_PATH)
X = df[[f'x{i}' for i in range(1,6)]].values
y = df['label'].values
seq_len = 5
X = X.reshape(len(X), seq_len, 1)

trainX, testX, trainy, testy = train_test_split(X, y, test_size=0.2, random_state=42)

metrics = {}

# HMM model
start = time.perf_counter()
hmm_models = {}
for label in [0,1]:
    data = trainX[trainy==label].reshape(-1, 1)
    lengths = [seq_len]*len(trainX[trainy==label])
    model = GaussianHMM(n_components=2, covariance_type="diag", n_iter=100)
    model.fit(data, lengths)
    hmm_models[label] = model
metrics['HMM'] = {'train_time': time.perf_counter()-start}
start = time.perf_counter()
preds=[]
for seq in testX:
    scores={label:model.score(seq.reshape(-1,1)) for label,model in hmm_models.items()}
    preds.append(max(scores, key=scores.get))
metrics['HMM']['latency']= (time.perf_counter()-start)/len(testX)
metrics['HMM']['accuracy']= float(accuracy_score(testy, preds))

# CRF model
def to_features(seq):
    return [{'x': int(x)} for x in seq.reshape(-1)]
crf = sklearn_crfsuite.CRF()
start = time.perf_counter()
crf.fit([to_features(s) for s in trainX], [[str(l)]*seq_len for l in trainy])
metrics['CRF'] = {'train_time': time.perf_counter()-start}
start = time.perf_counter()
preds=[]
for seq in testX:
    seq_pred = crf.predict_single(to_features(seq))
    label = max(set(seq_pred), key=seq_pred.count)
    preds.append(int(label))
metrics['CRF']['latency']= (time.perf_counter()-start)/len(testX)
metrics['CRF']['accuracy']= float(accuracy_score(testy, preds))

# LSTM model
model = keras.Sequential([
    keras.layers.Input(shape=(seq_len,1)),
    keras.layers.LSTM(8),
    keras.layers.Dense(1, activation='sigmoid')
])
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
start = time.perf_counter()
model.fit(trainX, trainy, epochs=20, verbose=0)
metrics['LSTM']={'train_time': time.perf_counter()-start}
start = time.perf_counter()
preds = (model.predict(testX) > 0.5).astype(int).flatten()
metrics['LSTM']['latency']= (time.perf_counter()-start)/len(testX)
metrics['LSTM']['accuracy']= float(accuracy_score(testy, preds))

# choose best model
best = sorted(metrics.items(), key=lambda kv:(kv[1]['accuracy'], -kv[1]['latency']), reverse=True)[0][0]
metrics['best_model'] = best

with open(RESULTS_PATH,'w') as f:
    json.dump(metrics,f,indent=2)

if best=='LSTM':
    save_keras_model(model, MODEL_DIR)
