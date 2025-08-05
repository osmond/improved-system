import time
import json
import nltk
from nltk.corpus import treebank
from nltk.tag import hmm
import sklearn_crfsuite
from sklearn_crfsuite import metrics
import autograd.numpy as np
from autograd import grad

# Ensure dataset
nltk.download('treebank', quiet=True)

def load_data(n_train=200, n_test=50):
    tagged = list(treebank.tagged_sents())
    train = tagged[:n_train]
    test = tagged[n_train:n_train+n_test]
    return train, test

def train_hmm(train, test):
    trainer = hmm.HiddenMarkovModelTrainer()
    model = trainer.train(train)
    start = time.perf_counter()
    for sent in test:
        model.tag([w for w,_ in sent])
    latency = time.perf_counter() - start
    acc = model.evaluate(test)
    return acc, latency

def word2features(sent, i):
    word = sent[i][0]
    features = {
        'bias': 1.0,
        'word.lower()': word.lower(),
        'word.isupper()': word.isupper(),
        'word.istitle()': word.istitle(),
        'word.isdigit()': word.isdigit(),
    }
    if i > 0:
        word1 = sent[i-1][0]
        features.update({
            '-1:word.lower()': word1.lower(),
        })
    else:
        features['BOS'] = True
    if i < len(sent)-1:
        word1 = sent[i+1][0]
        features.update({
            '+1:word.lower()': word1.lower(),
        })
    else:
        features['EOS'] = True
    return features

def sent2features(sent):
    return [word2features(sent, i) for i in range(len(sent))]

def sent2labels(sent):
    return [label for (_, label) in sent]

def train_crf(train, test):
    X_train = [sent2features(s) for s in train]
    y_train = [sent2labels(s) for s in train]
    X_test = [sent2features(s) for s in test]
    y_test = [sent2labels(s) for s in test]
    crf = sklearn_crfsuite.CRF(max_iterations=50)
    crf.fit(X_train, y_train)
    start = time.perf_counter()
    y_pred = crf.predict(X_test)
    latency = time.perf_counter() - start
    acc = metrics.flat_accuracy_score(y_test, y_pred)
    return acc, latency

# LSTM utilities

def prepare_sequences(train, test):
    words = {w for s in train for (w, _) in s}
    tags = {t for s in train for (_, t) in s}
    word_to_ix = {w: i for i, w in enumerate(words)}
    tag_to_ix = {t: i for i, t in enumerate(tags)}
    train_ix = [([word_to_ix[w] for (w, _ ) in s], [tag_to_ix[t] for (_, t) in s]) for s in train]
    test_ix = [([word_to_ix.get(w, 0) for (w, _ ) in s], [tag_to_ix.get(t, 0) for (_, t) in s]) for s in test]
    return train_ix, test_ix, word_to_ix, tag_to_ix

def one_hot(idx, size):
    v = np.zeros(size)
    v[idx] = 1.0
    return v

def sigmoid(x):
    return 1/(1+np.exp(-x))

def logsumexp(a):
    m = np.max(a)
    return m + np.log(np.sum(np.exp(a-m)))

def lstm_forward(params, sentence, vocab_size, hidden_dim):
    Wx, Wh, b, Wy, by = params
    h = np.zeros(hidden_dim)
    c = np.zeros(hidden_dim)
    outputs = []
    for idx in sentence:
        x = one_hot(idx, vocab_size)
        gates = np.dot(x, Wx) + np.dot(h, Wh) + b
        i = sigmoid(gates[:hidden_dim])
        f = sigmoid(gates[hidden_dim:2*hidden_dim])
        o = sigmoid(gates[2*hidden_dim:3*hidden_dim])
        g = np.tanh(gates[3*hidden_dim:])
        c = f*c + i*g
        h = o*np.tanh(c)
        y = np.dot(h, Wy) + by
        outputs.append(y)
    return outputs

def sentence_loss(params, sentence, tags, vocab_size, hidden_dim):
    outputs = lstm_forward(params, sentence, vocab_size, hidden_dim)
    loss = 0.0
    for y, tag in zip(outputs, tags):
        log_probs = y - logsumexp(y)
        loss -= log_probs[tag]
    return loss/len(sentence)

loss_grad = grad(sentence_loss)

def train_lstm(train, test, vocab_size, tag_size, hidden_dim=16, epochs=2, lr=0.1):
    rng = np.random.default_rng(0)
    Wx = rng.normal(scale=0.1, size=(vocab_size, 4*hidden_dim))
    Wh = rng.normal(scale=0.1, size=(hidden_dim, 4*hidden_dim))
    b = np.zeros(4*hidden_dim)
    Wy = rng.normal(scale=0.1, size=(hidden_dim, tag_size))
    by = np.zeros(tag_size)
    params = (Wx, Wh, b, Wy, by)
    for _ in range(epochs):
        for sentence, tags in train:
            grads = loss_grad(params, sentence, tags, vocab_size, hidden_dim)
            params = tuple(p - lr*g for p, g in zip(params, grads))
    # evaluate
    start = time.perf_counter()
    preds = []
    for sentence, tags in test:
        outputs = lstm_forward(params, sentence, vocab_size, hidden_dim)
        preds.append([int(np.argmax(o)) for o in outputs])
    latency = time.perf_counter() - start
    correct = total = 0
    for (sentence, tags), pred in zip(test, preds):
        for p, t in zip(pred, tags):
            if p == t:
                correct += 1
            total += 1
    acc = correct/total
    return acc, latency

def main():
    train, test = load_data()
    hmm_acc, hmm_latency = train_hmm(train, test)
    crf_acc, crf_latency = train_crf(train, test)
    train_seq, test_seq, w2i, t2i = prepare_sequences(train, test)
    lstm_acc, lstm_latency = train_lstm(train_seq, test_seq, len(w2i), len(t2i))
    results = {
        'HMM': {'accuracy': hmm_acc, 'latency': hmm_latency},
        'CRF': {'accuracy': crf_acc, 'latency': crf_latency},
        'LSTM': {'accuracy': float(lstm_acc), 'latency': lstm_latency},
    }
    best = max(results.items(), key=lambda kv: kv[1]['accuracy'])[0]
    results['best_model'] = best
    print(json.dumps(results, indent=2))

if __name__ == '__main__':
    main()
