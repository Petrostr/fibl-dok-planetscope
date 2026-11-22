# Model-choice check (Petros's question, 22 Nov 2026): SVM with the same features, tasks, windows and
# cross-validation as the Random Forest of the revised analysis. Settings fixed in advance, NOT tuned:
# RBF kernel, C=1, gamma='scale' (scikit-learn defaults), standardised features, balanced class weights.
# SVM is deterministic, so one run; 95% CI by group bootstrap (2000); permutation test (199, within replicate-year).
import json, numpy as np, pandas as pd
from sklearn.svm import SVC
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import LeaveOneGroupOut
from sklearn.metrics import balanced_accuracy_score
nb = json.load(open('/home/claude/nb/FIBL_revision_analysis_v02_2026-11-21.ipynb'))
code = [''.join(c['source']) for c in nb['cells'] if c['cell_type'] == 'code']
exec(code[0].replace('QUICK = True', 'QUICK = False')); exec(code[1]); exec(code[4].split('results, confusion')[0])   # function definitions only   # settings, setup, classification functions
def cv_svm(X, y, g):
    pred = np.empty(len(y), dtype=object)
    for tr, te in LeaveOneGroupOut().split(X, y, g):
        m = make_pipeline(StandardScaler(), SVC(kernel='rbf', C=1.0, gamma='scale', class_weight='balanced'))
        pred[te] = m.fit(X[tr], y[tr]).predict(X[te])
    return pred
rows = []
rng = np.random.default_rng(1)
for task in TASKS:
    for crop in WINDOWS:
        F = features(d, crop, TASKS[task]); X = F.values; y = labels(F, task); g = groups(F); G = np.unique(g)
        p = cv_svm(X, y, g); ba = balanced_accuracy_score(y, p)
        boot = []
        for _ in range(2000):
            idx = np.concatenate([np.where(g == k)[0] for k in rng.choice(G, len(G))])
            if len(set(y[idx])) == len(set(y)): boot.append(balanced_accuracy_score(y[idx], p[idx]))
        hits = 0
        for _ in range(199):
            yp = y.copy()
            for k in G:
                ix = np.where(g == k)[0]; yp[ix] = rng.permutation(yp[ix])
            if balanced_accuracy_score(yp, cv_svm(X, yp, g)) >= ba: hits += 1
        rows.append({'task': task, 'crop': crop, 'SVM_BA': round(ba, 2), 'CI_lo': round(np.percentile(boot, 2.5), 2),
                     'CI_hi': round(np.percentile(boot, 97.5), 2), 'p': round((hits + 1) / 200, 3)})
        print(rows[-1], flush=True)
pd.DataFrame(rows).to_csv('svm_results_v01_2026-11-22.csv', index=False)
